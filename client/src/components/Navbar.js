import React, { useContext } from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link, useHistory } from 'react-router-dom';
import { ContextUser } from './context/UserContext';
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},
	title: {
    flexGrow: 1,
    color: '#FFF',
	},
}));

export default function Navbar({ handleLogOut, socket, socketId }) {
	const classes = useStyles();
	const { user } = useContext(ContextUser);
	const history = useHistory();

	const handleCreateRoom = () => {
		socket.emit('createRoom', {
			socketId: socketId,
			userID: user._id,
			creator: user.firstName,
			roomId: uuidv4(),
			hospitalInfo: user.hospitalInfo
		});
		history.push(`/rooms/${socketId}/`);
	};

	const navTemplate = loggedIn => {
		const template = loggedIn ? (
			<>
      {user.authLevel === 'admin' ? (<Button onClick={handleCreateRoom} color='inherit'>
					Create Room
				</Button>) : ''}
				<Button component={Link} to='/rooms' color='inherit'>
					Rooms
				</Button>
				<Button onClick={() => handleLogOut()} color='inherit'>
					Logout
				</Button>
			</>
		) : (
			<Button href='/auth/google' color='inherit'>
				Login
			</Button>
		);
		return template;
	};
	return (
		<div className={classes.root}>
			<AppBar position='static'>
				<Toolbar>
				<Typography variant='h6' className={classes.title}>
Cheer-App
					</Typography>
					<Button component={Link} to='/about' color='inherit'>
						About
					</Button>
					{navTemplate(socket && user.firstName.length > 0)}
				</Toolbar>
			</AppBar>
		</div>
	);
}
