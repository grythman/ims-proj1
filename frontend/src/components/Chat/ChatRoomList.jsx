import React from 'react';
import { format } from 'date-fns';
import { MessageSquare, Users, Clock } from 'lucide-react';
import { Card } from '../UI/Card';

const ChatRoomList = ({ rooms, selectedRoom, onRoomSelect }) => {
  if (!rooms?.length) {
    return (
      <Card className="p-6 text-center text-gray-500">
        No chat rooms found
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {rooms.map(room => (
        <div
          key={room.id}
          onClick={() => onRoomSelect(room)}
          className={`cursor-pointer transition-all ${
            selectedRoom?.id === room.id
              ? 'ring-2 ring-emerald-500'
              : 'hover:shadow-md'
          }`}
        >
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {room.room_type === 'private' ? (
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Users className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {room.name || room.participants
                        .filter(p => p.id !== room.currentUserId)
                        .map(p => p.first_name)
                        .join(', ')}
                    </p>
                    {room.last_message && (
                      <p className="mt-1 text-sm text-gray-500 truncate">
                        {room.last_message.sender_name}: {room.last_message.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="ml-4 flex flex-col items-end">
                {room.last_message && (
                  <div className="flex items-center text-xs text-gray-400">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(new Date(room.last_message.created_at), 'MMM d, h:mm a')}
                  </div>
                )}
                {room.unread_count > 0 && (
                  <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    {room.unread_count}
                  </span>
                )}
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default ChatRoomList; 