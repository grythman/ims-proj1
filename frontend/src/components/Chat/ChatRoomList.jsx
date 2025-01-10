import React from 'react';

const ChatRoomList = ({ rooms, onSelectRoom }) => {
  return (
    <div className="chat-room-list">
      <h2>Chat Rooms</h2>
      <ul>
        {rooms.map(room => (
          <li key={room.id} onClick={() => onSelectRoom(room.id)}>
            {room.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRoomList; 