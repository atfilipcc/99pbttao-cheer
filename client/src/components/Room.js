import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import Peer from 'simple-peer';
import './styles/Room.css';
import { useParams, useHistory } from 'react-router-dom';

const Room = ({ socket, socketId }) => {
  const [stream, setStream] = useState('');
  const [caller, setCaller] = useState('');
  const [callAccepted, setCallAccepted] = useState(false);
  const [callerSignal, setCallerSignal] = useState('');
  const initiatorPeer = useRef();
  const receivingPeer = useRef();
  const userVideo = useRef();
  const partnerVideo = useRef();
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    let shouldUpdate = true;
    let currentStreams = '';
    if (socket) {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then(stream => {
          setStream(stream);
          currentStreams = stream;
          if (userVideo.current) {
            userVideo.current.srcObject = stream;
          }
        });

      socket.on('incomingCall', data => {
        setCaller(data.from);
        setCallerSignal(data.signal);
      });

      socket.on('newUser', data => {
        if (!data.find(x => x.id === id)) {
          history.push('/rooms');
        }
      });
      socket.on('turnOffCameraAnswer', () => {
        partnerVideo.current.srcObject.getTracks().map(x => {
          if(x.kind ==='video') {
            x.stop()
          }
           return x
        })
      })
    }

    return () => {
      shouldUpdate = false;
      if (socket) {
        socket.emit('leaveRoom');
      }
      if (currentStreams) currentStreams.getTracks().map(x => x.stop());
      if (initiatorPeer.current) {
        initiatorPeer.current.destroy();
        initiatorPeer.current = new Peer({
          initiator: true,
          trickle: false,
        });
      } else if (receivingPeer.current) {
        receivingPeer.current.destroy();
      }
    };
  }, [socket, history, id, socketId]);

  const handleAnswer = () => {
    const otherPeer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    receivingPeer.current = otherPeer;
    otherPeer.on('signal', data => {
      socket.emit('answer', { signal: data, target: caller });
    });
    otherPeer.on('stream', stream => {
      setCallAccepted(true)
      partnerVideo.current.srcObject = stream;
    });
    otherPeer.on('close', () => {
      receivingPeer.current = new Peer({
        trickle: false,
        stream: stream,
      });
      partnerVideo.current.srcObject = undefined;
      setCaller('');
      setCallerSignal('');
      setCallAccepted(false)
    });
    otherPeer.signal(callerSignal);
  };

  const handleSubmit = (e, id) => {
    e.preventDefault();
    let counter = 1
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
      iceServers: [
        {
          url: 'turn:192.158.29.39:3478?transport=udp',
          credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
          username: '28224511:1379330808',
        },
        {
          url: 'turn:192.158.29.39:3478?transport=tcp',
          credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
          username: '28224511:1379330808',
        },
      ],
    });
    initiatorPeer.current = peer;

    initiatorPeer.current.on('signal', data => {
      socket.emit('offer', {
        target: id,
        signal: data,
        from: socketId,
      });
    });
    initiatorPeer.current.on('stream', stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    initiatorPeer.current.on('close', () => {
      history.push('/rooms');
    });

    socket.on('acceptedCall', data => {
      if ( counter <= 2) {
        initiatorPeer.current.signal(data.signal);
        setCallAccepted(true);
        counter++
      }

    });
  };

  const handleClick = e => {
    const button = e.target;
    button.disabled = true;
    handleAnswer();
  };

  const handleDisconnect = () => {
    if (initiatorPeer.current) {
      initiatorPeer.current.destroy();
      socket.emit('endCall', {
        socketId,
        caller,
      });
    } else {
      receivingPeer.current.destroy();
      socket.emit('endCall', {
        socketId,
        caller,
      });
    }
  };

  // const handleTurnOff = e => {
  //   const newStream = []
  //   stream.getTracks().map(x => {
  //     if(x.kind ==='video') {
  //       x.stop()
  //       return x
  //     }
  //      return newStream.push(x)
  //   })
  //   setStream(newStream)
  //   if (caller) {
  //     socket.emit('turnOffCamera', caller)
  //   } else {
  //     socket.emit('turnOffCamera', id)
  //   }
  // }

  return (
    <>
      <div className='Room__container'>
        <Draggable Draggable nodeRef={userVideo}>
          <video
            className='Room__video-user'
            playsInline
            autoPlay
            muted
            ref={userVideo}
          />
        </Draggable>
        <video
          className='Room__video-partner'
          playsInline
          autoPlay
          controls
          ref={partnerVideo}
        />
      </div>
      <div className='Room__buttons'>
      {/* <button className='Room__accept' onClick={e => handleTurnOff(e)}>
            Turn-off camera
          </button> */}
        {id !== socketId && !callAccepted && (
          <button className='Room__accept' onClick={e => handleSubmit(e, id)}>
            Call
          </button>
        )}
        {caller && callAccepted ? '' : caller ? (
          <button className='Room__accept' onClick={e => handleClick(e)}>
            Accept
          </button>
        ) : (
          ''
        )}
        {callAccepted && (
          <button className='Room__disconnect' onClick={handleDisconnect}>
            Disconnect
          </button>
        )}
      </div>
    </>
  );
};

export default Room;
