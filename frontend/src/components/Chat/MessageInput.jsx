import React, { useState, useRef } from 'react';
import { Paperclip, Send, X } from 'lucide-react';
import { Button } from '../UI/Button';

const MessageInput = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim() && files.length === 0) return;

    onSend({
      content: message.trim(),
      files
    });

    setMessage('');
    setFiles([]);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalSize = [...files, ...selectedFiles].reduce((sum, file) => sum + file.size, 0);
    
    if (totalSize > 25 * 1024 * 1024) { // 25MB limit
      alert('Total file size must be less than 25MB');
      return;
    }

    if (files.length + selectedFiles.length > 5) { // 5 files limit
      alert('Maximum 5 files allowed');
      return;
    }

    setFiles(prev => [...prev, ...selectedFiles]);
    fileInputRef.current.value = ''; // Reset file input
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      {/* Selected Files */}
      {files.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-100 rounded-full px-3 py-1"
            >
              <span className="text-sm text-gray-600 truncate max-w-xs">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end space-x-2">
        {/* Message Input */}
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full resize-none rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
            rows={1}
            style={{
              minHeight: '2.5rem',
              maxHeight: '10rem'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
        </div>

        {/* File Attachment Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="p-2"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
        </div>

        {/* Send Button */}
        <Button
          type="submit"
          disabled={disabled || (!message.trim() && files.length === 0)}
          className="p-2"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>

      {/* File Upload Limits */}
      <div className="mt-2 text-xs text-gray-500">
        Max 5 files, 25MB total
      </div>
    </form>
  );
};

export default MessageInput; 