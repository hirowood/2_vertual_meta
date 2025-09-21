// チャット関連の型定義

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  content: string;
  type: MessageType;
  roomId?: string;
  timestamp: Date;
  isRead?: boolean;
  attachments?: MessageAttachment[];
}

export enum MessageType {
  TEXT = 'text',
  SYSTEM = 'system',
  ANNOUNCEMENT = 'announcement',
  PRIVATE = 'private'
}

export interface MessageAttachment {
  id: string;
  type: AttachmentType;
  url: string;
  name: string;
  size?: number;
}

export enum AttachmentType {
  IMAGE = 'image',
  FILE = 'file',
  AUDIO = 'audio'
}

// チャットルーム
export interface ChatRoom {
  id: string;
  name: string;
  type: ChatRoomType;
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount?: number;
}

export enum ChatRoomType {
  GLOBAL = 'global',
  ROOM = 'room',
  PRIVATE = 'private',
  GROUP = 'group'
}

// チャット状態
export interface ChatState {
  messages: ChatMessage[];
  activeRoom: ChatRoom | null;
  rooms: ChatRoom[];
  isConnected: boolean;
  isTyping: Record<string, boolean>;
}
