'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require('express');
var connectDB = require('../config/db.js');
var mongoose = require('mongoose');
var http = require('http');
var app = express();
var server = http.createServer(app);
var socket = require('socket.io');
var io = socket(server);
var cookieParser = require('cookie-parser');
var path = require('path');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var passport = require('passport');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var cors = require('cors');
var sharedsession = require('express-socket.io-session');
var User = require('../models/User');
var passportSocketIo = require('passport.socketio');

require('dotenv').config({
	path: './config/config.env'
});
require('../config/passport')(passport);

connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(cors({
	origin: 'http://localhost:3000',
	credentials: true
}));

// Sessions
var sessionStore = new MongoStore({
	mongooseConnection: mongoose.connection
});
var expressSession = session({
	secret: 'keyboard puppy',
	resave: true,
	saveUninitialized: true,
	store: sessionStore
});

// Passport middleware
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', require('../routes/auth'));

var rooms = [];
var users = [];

io.use(sharedsession(expressSession, {
	autoSave: true
}));

function onAuthorizeSuccess(data, accept) {
	console.log('successful connection to socket.io');
	accept();
}

function onAuthorizeFail(data, message, error, accept) {
	console.log('could not authorize');
	if (error) accept(new Error(message));
}

io.use(passportSocketIo.authorize({
	key: 'connect.sid',
	secret: 'keyboard puppy',
	store: sessionStore,
	passport: passport,
	cookieParser: cookieParser,
	success: onAuthorizeSuccess,
	fail: onAuthorizeFail
}));

io.on('connection', function (socket) {
	socket.use(function () {
		var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(packet, next) {
			return regeneratorRuntime.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							console.log('user is authenticated: ' + socket.request.isAuthenticated());

							if (!socket.request.isAuthenticated()) {
								_context.next = 5;
								break;
							}

							console.log('user has access level: ' + socket.request.user.authLevel);
							socket.emit('accessLevel', {
								authLevel: socket.request.user.authLevel,
								socketId: socket.id
							});
							return _context.abrupt('return', next());

						case 5:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, undefined);
		}));

		return function (_x, _x2) {
			return _ref.apply(this, arguments);
		};
	}());

	socket.emit('yourId', socket.id);

	socket.emit('newUser', users);
	socket.broadcast.emit('newUser', users);

	socket.on('createRoom', function (data) {
		if (socket.request.user.authLevel === 'admin') {
			if (!users.find(function (x) {
				return x.userId === data.userID;
			})) {
				users = [].concat(_toConsumableArray(users), [{
					id: data.socketId,
					userId: data.userID,
					userName: data.creator,
					authLevel: data.authLevel
				}]);
			}
			rooms.push(data);
			socket.emit('users', users);
			socket.broadcast.emit('users', users);
		}
	});

	socket.on('getUsers', function (_data, callback) {
		console.log('received call');
		callback(undefined, users);
	});

	socket.on('offer', function (data) {
		console.log('offer from: ' + data.from);
		io.to(data.target).emit('incomingCall', {
			from: data.from,
			signal: data.signal
		});
	});

	socket.on('close', function () {
		users = users.filter(function (user) {
			return user.id !== socket.id;
		});
		socket.emit('users', users);
	});

	socket.on('endCall', function (data) {
		var room = void 0;
		if (data.caller) {
			room = io.sockets.adapter.rooms[data.caller];
		} else {
			room = io.sockets.adapter.rooms[data.userId];
		}
		socket.leave(room);
	});

	socket.on('disconnect', function () {
		users = users.filter(function (user) {
			return user.id !== socket.id;
		});
		socket.broadcast.emit('users', users);
	});

	socket.on('answer', function (data) {
		var room = io.sockets.adapter.rooms[data.target];
		console.log('answer to join: ' + data.target);
		socket.join(data.target);
		io.to(data.target).emit('acceptedCall', { signal: data.signal });
	});
});

app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

module.exports = { app: app, server: server, expressSession: expressSession };
//# sourceMappingURL=app.js.map