import React, { useState, useEffect } from "react";
import queryString from 'query-string'; // retrieve data from URL
import io from "socket.io-client";

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const ENDPOINT = 'localhost:3333'; //endpoint of server

  useEffect(() => {
    // retrieve url parameters from user input
    const { name, room } = queryString.parse(location.search);
    console.log('name', name);
    console.log('room', room);
    socket = io(ENDPOINT);

    setRoom(room);
    setName(name)

    socket.emit('join', { name, room }, (error) => {
      if(error) {
        alert(error);
      }
    });

    console.log('socket', socket);
  }, [ENDPOINT, location.search]); // render useEffect only when these 2 parameters change

  // handling user generated messages
  useEffect(() => {
    socket.on('message', message => {
      setAllMessages(allMessages => [ ...allMessages, message ]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
}, []);

  //handle sending messages
  const sendMessage = (e) => {
    e.preventDefault();

    if(message) {
      // clear message field after sending message
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };

  return (
    <div className="outerContainer">
      <TextContainer users={users}/>
      <div className="container">
          <InfoBar room={room} />
          <Messages messages={allMessages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
    </div>
  );
}

export default Chat;