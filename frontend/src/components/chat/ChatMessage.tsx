'use client';

import React from 'react';
import { format } from '@/lib/utils';

interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div
      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[70%] rounded-lg px-3 py-2 ${
          message.isOwn
            ? 'bg-blue-500 text-white'
            : 'bg-white border border-gray-200'
        }`}
      >
        {!message.isOwn && (
          <div className="text-xs font-semibold mb-1 text-gray-600">
            {message.userName}
          </div>
        )}
        <div className={message.isOwn ? 'text-white' : 'text-gray-800'}>
          {message.content}
        </div>
        <div
          className={`text-xs mt-1 ${
            message.isOwn ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          {format(message.timestamp, 'HH:mm')}
        </div>
      </div>
    </div>
  );
};
