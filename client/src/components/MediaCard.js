import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CreateRoom from './CreateRoom';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

export default function MediaCard({ user, info }) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={info.photo}
          title="Nursing home 1"
        />
        <CardContent>
          <Typography color="inherit" gutterBottom variant="h5" component="h2">
            {info.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {info.address}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button component={Link} to={`/rooms/${user}`} color="inherit">
            Call
          </Button>
      </CardActions>
    </Card>
  );
}

























// import React, { useEffect, useRef, useState } from 'react';
// // import image from '../images/caller2.jpg';
// import io from 'socket.io-client';

// export default function Board() {
//   const [users, setUsers] = useState();

//   const socket = useRef();
//   useEffect(() => {
//     socket.current = io.connect('/');
//     socket.current.on('users', users => {
//       setUsers(users);
//     });
//   }, []);
//   console.log(users);

//   return (
//     <div>
//     <h1>Welcome to 99opaycco" app</h1>
//     {/* <img src={image} alt="caller" />
//     {console.log(image)} */}
//       {/* <h1>Hello, guys and puppy!</h1>
//       {users && users.map(user => <li key={user.id}>{user.user.firstName}</li>)} */}
//     </div>

//   );
// }
