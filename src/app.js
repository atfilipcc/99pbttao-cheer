const express = require('express');
const connectDB = require('../config/db.js');
const mongoose = require('mongoose');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socket = require('socket.io');
const io = socket(server);
const cookieParser = require('cookie-parser');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
const sharedsession = require('express-socket.io-session');
const passportSocketIo = require('passport.socketio');
const { onAuthorizeSuccess, onAuthorizeFail } = require('./utils/')
require("regenerator-runtime/runtime");

require('dotenv').config({
	path: './config/config.env',
});
require('../config/passport')(passport);

connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	})
);

const sessionStore = new MongoStore({
	mongooseConnection: mongoose.connection,
});
const expressSession = session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
	store: sessionStore,
});

app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', require('../routes/auth'));
app.use('/api/user', require('../routes/user'));

io.use(
	sharedsession(expressSession, {
		autoSave: true,
	})
);

io.use(
	passportSocketIo.authorize({
		key: 'connect.sid',
		secret: process.env.SESSION_SECRET,
		store: sessionStore,
		passport: passport,
		cookieParser: cookieParser,
		success: onAuthorizeSuccess,
		fail: onAuthorizeFail,
	})
);

let rooms = [];
let users = [];

io.on('connection', socket => {
	socket.use(async (packet, next) => {
		if (socket.request.isAuthenticated()) {
			socket.emit('accessLevel', {
				authLevel: socket.request.user.authLevel,
				socketId: socket.id,
			});
			return next();
		}
	});

  socket.emit('yourId', socket.id);

	socket.broadcast.emit('newUser', users);

	socket.on('createRoom', data => {
		// if (socket.request.user.authLevel === 'admin') {
			if (!users.find(x => x.userId === data.userID)) {
				users = [
					...users,
					{
						id: data.socketId,
						userId: data.userID,
						userName: data.creator,
            authLevel: data.authLevel,
            hospitalInfo: data.hospitalInfo
					},
				];
			}
			rooms.push(data);
			socket.emit('users', users);
			socket.broadcast.emit('users', users);
		// }
	});

	socket.on('getUsers', (_data, callback) => {
		callback(undefined, users);
	});

	socket.on('offer', data => {
		console.log('offer from: ' + data.from);
		io.to(data.target).emit('incomingCall', {
			from: data.from,
			signal: data.signal,
		});
	});

	socket.on('close', () => {
		users = users.filter(user => user.id !== socket.id);
		socket.emit('users', users);
	});

	socket.on('endCall', data => {
    let room;
		if (data.caller) {
			room = io.sockets.adapter.rooms[data.caller];
		} else {
			room = io.sockets.adapter.rooms[data.userId];
		}
		socket.leave(room);
	});

	socket.on('disconnect', () => {
    console.log('disconnect')
		users = users.filter(user => user.id !== socket.id);
		socket.broadcast.emit('users', users);
  });

  socket.on('leaveRoom', () => {
    users = users.filter(user => user.id !== socket.id);
		socket.broadcast.emit('users', users);
  })

	socket.on('answer', data => {
		const room = io.sockets.adapter.rooms[data.target];
		console.log(room)
		console.log('answer to join: ' + data.target);
		socket.join(data.target);
		io.to(data.target).emit('acceptedCall', { signal: data.signal });
	});

	socket.on('turnOffCamera', (id) => {
		socket.to(id).emit('turnOffCameraAnswer')
	})


});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

module.exports = { app, server, expressSession };
