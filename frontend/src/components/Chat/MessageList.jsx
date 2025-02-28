import React, { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { FileText, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MessageList = ({ messages, onLoadMore }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    if (scrollTop === 0 && onLoadMore) {
      onLoadMore();
    }
  };

  const renderAttachment = (attachment) => {
    const isImage = attachment.file_type.startsWith('image/');
    
    if (isImage) {
      return (
        <div className="mt-2">
          <img
            src={attachment.file_url}
            alt={attachment.file_name}
            className="max-w-xs rounded-lg shadow-sm"
          />
        </div>
      );
    }

    return (
      <div className="mt-2 flex items-center space-x-2">
        <FileText className="h-4 w-4 text-gray-400" />
        <a
          href={attachment.file_url}
          download={attachment.file_name}
          className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center"
        >
          <span className="truncate max-w-xs">{attachment.file_name}</span>
          <Download className="h-4 w-4 ml-1" />
        </a>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4"
      onScroll={handleScroll}
    >
      {messages.map((message, index) => {
        const isCurrentUser = message.sender.id === user.id;
        const showAvatar = index === 0 || 
          messages[index - 1].sender.id !== message.sender.id;

        return (
          <div
            key={message.id}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[75%]`}>
              {showAvatar && (
                <div className={`flex-shrink-0 ${isCurrentUser ? 'ml-2' : 'mr-2'}`}>
                  {message.sender.avatar ? (
                    <img
                      src={message.sender.avatar}
                      alt={message.sender.first_name}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {message.sender.first_name[0]}
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              <div className={`space-y-1 ${!showAvatar ? 'ml-10' : ''}`}>
                {showAvatar && (
                  <div className={`text-xs text-gray-500 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                    {message.sender.first_name} {message.sender.last_name}
                  </div>
                )}
                
                <div
                  className={`rounded-lg px-4 py-2 max-w-prose break-words ${
                    isCurrentUser
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  
                  {message.attachments?.map(attachment => (
                    <div key={attachment.id}>
                      {renderAttachment(attachment)}
                    </div>
                  ))}
                </div>

                <div className={`text-xs text-gray-400 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                  {format(new Date(message.created_at), 'h:mm a')}
                  {message.is_read && isCurrentUser && (
                    <span className="ml-1">✓</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList; 