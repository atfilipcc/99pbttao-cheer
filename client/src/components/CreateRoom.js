import React, { useRef, useContext }from 'react';
import { ContextUser } from './context/UserContext';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const CreateRoom = (props) => {
  const { user } = useContext(ContextUser);
  const inputRef = useRef();
  const socket = useRef();

  const create = (e) => {
    e.preventDefault();
    socket.current = io.connect('/');
    const roomName = inputRef.current.value;
    socket.current.on('yourId', socketId => {
      socket.current.emit('createRoom', {
        roomName: roomName,
        socketId: socketId,
        userID: user._id,
        creator: user.firstName,
        roomId: uuidv4(),
      })
      props.history.push(`/room/${roomName}`)
    })
  }
  return (
    <form onSubmit={e => create(e)} action="" className="">
    <input ref={inputRef} type="text"></input>
    <button type="submit">Create Room</button>
    </form>
  )
}

export default CreateRoom;
