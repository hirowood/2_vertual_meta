'use client';

import { useState, useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import socket from '@/lib/socket';
import { useChatStore } from '@/stores/chatStore';

interface ChatPanelProps {
  userId: string;
  userName: string;
  roomId?: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ 
  userId, 
  userName, 
  roomId 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, addMessage, setMessages } = useChatStore();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Socket接続の管理
    const handleConnect = () => {
      setIsConnected(true);
      // ルームに参加
      if (roomId) {
        socket.emit('room:join', { roomId, userId, userName });
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    // メッセージ受信
    const handleMessage = (data: {
      id: string;
      userId: string;
      userName: string;
      content: string;
      timestamp: string;
      roomId?: string;
    }) => {
      addMessage({
        id: data.id,
        userId: data.userId,
        userName: data.userName,
        content: data.content,
        timestamp: new Date(data.timestamp),
        isOwn: data.userId === userId,
      });
    };

    // メッセージ履歴の受信
    const handleMessageHistory = (history: any[]) => {
      const formattedMessages = history.map(msg => ({
        id: msg.id,
        userId: msg.userId,
        userName: msg.userName,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        isOwn: msg.userId === userId,
      }));
      setMessages(formattedMessages);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('chat:message', handleMessage);
    socket.on('chat:history', handleMessageHistory);

    // 初期接続
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('chat:message', handleMessage);
      socket.off('chat:history', handleMessageHistory);
      
      if (roomId) {
        socket.emit('room:leave', { roomId, userId });
      }
    };
  }, [roomId, userId, userName, addMessage, setMessages]);

  // 自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content: string) => {
    if (!content.trim() || !isConnected) return;

    socket.emit('chat:send', {
      userId,
      userName,
      content,
      roomId,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg shadow-inner">
      <div className="flex items-center justify-between p-3 border-b bg-white">
        <h3 className="font-semibold text-gray-700">
          {roomId ? 'ルームチャット' : 'グローバルチャット'}
        </h3>
        <div className="flex items-center space-x-2">
          <div 
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-xs text-gray-500">
            {isConnected ? '接続中' : '切断中'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSendMessage={handleSendMessage} disabled={!isConnected} />
    </div>
  );
};
