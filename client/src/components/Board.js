import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import MediaCard from './MediaCard';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ContextUser } from './context/UserContext';
import AppFooter from './landing/modules/views/AppFooter';
import Loader from 'react-loader-spinner';

const useStyles = makeStyles(theme => ({
	gridContainer: {
		paddingLeft: '40px',
		paddingRight: '40px',
		paddingTop: '50px',
		paddingBottom: '100px',
	},
	Header: {
		backgroundColor: '#ff3366',
		paddingTop: '20px',
		paddingBottom: '20px',
    textAlign: 'center',
    color: '#FFF',
	},
	footer: {
		backgroundColor: '#fff5f8',
		paddingBottom: '0px',
  },
}));

export default function Board({ socket, isLoading }) {
	const [users, setUsers] = useState([]);
	const classes = useStyles();
	const { user } = useContext(ContextUser);

	useEffect(() => {
		let shouldUpdate = true;
		if (socket) {
			socket.emit('getUsers', 'trigger', (error, users) => {
				setUsers(users);
			});

			socket.on('users', userData => {
				console.log(userData);
				if (shouldUpdate) setUsers(userData);
			});
		}
		return () => {
			shouldUpdate = false;
		};
	}, []);

  return (
     <div>
    <div>
    <div className={classes.Header}>
        <h1>WELCOME, {user.firstName.toUpperCase()}</h1>
    </div>
		{user.length > 0 && <h3>Choose the nursing home you would like to talk to.</h3>}
        <Grid container spacing={3} className={classes.gridContainer}>

            {users && users.length > 0 ?
        		users.map(user => (
        <Grid key={user.id} item xs={12} sm={6} md={3}>
							<MediaCard key={user.id} user={user.id} info={user.hospitalInfo}/>
        </Grid>
						)) : <h1>No users available at the moment</h1>}
        </Grid>
    </div>
      </div>
  )}
