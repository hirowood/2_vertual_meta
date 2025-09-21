// Socket関連の型定義

export interface SocketUser {
  userId: string;
  userName: string;
  userRole: string;
  socketId: string;
}

// 位置情報
export interface Position {
  x: number;
  y: number;
  mapId: string;
  direction?: string;
  isMoving?: boolean;
}

// Socket.ioイベント
export interface ServerToClientEvents {
  'user:joined': (data: { user: SocketUser; position: Position }) => void;
  'user:left': (data: { userId: string }) => void;
  'user:moved': (data: { userId: string; position: Position }) => void;
  'users:online': (users: SocketUser[]) => void;
  'chat:message': (message: any) => void;
  'chat:user_typing': (data: { userId: string; userName: string; isTyping: boolean }) => void;
  'room:user_entered': (data: { userId: string; userName: string; roomId: string }) => void;
  'room:user_left': (data: { userId: string; userName: string; roomId: string }) => void;
  'error': (error: { message: string; code?: string }) => void;
}

export interface ClientToServerEvents {
  'user:join': () => void;
  'user:move': (data: { position: Position }) => void;
  'chat:message': (data: { content: string; roomId?: string }) => void;
  'chat:typing': (data: { roomId?: string; isTyping: boolean }) => void;
  'room:enter': (data: { roomId: string }) => void;
  'room:leave': (data: { roomId: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  user: SocketUser;
}
