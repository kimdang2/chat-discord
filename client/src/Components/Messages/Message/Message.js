import React from 'react';

import './Message.css';

import ReactEmoji from 'react-emoji';

const Message = ({ message: { text, user }, name }) => {
  let isSentByCurrentUser = false;

  const currentUserNameTrimmed = name.trim().toLowerCase();

  if(user === currentUserNameTrimmed) isSentByCurrentUser = true;

  return (
    isSentByCurrentUser
      ? (
        // Messages sent by user
        <div className="messageContainer justifyEnd">
          <p className="sentText pr-10">{currentUserNameTrimmed}</p>
          <div className="messageBox backgroundBlue">
            <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
          </div>
        </div>
        )
        : (
          // Message sent by other users
          <div className="messageContainer justifyStart">
            <div className="messageBox backgroundLight">
              <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
            </div>
            <p className="sentText pl-10 ">{user}</p>
          </div>
        )
  );
}

export default Message;