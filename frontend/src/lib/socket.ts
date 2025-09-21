import { io, Socket } from 'socket.io-client';
import { ChatMessage } from '@/types/chat.types';
import { PlayerState, GameEvent } from '@/types/game.types';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  // Socket接続の初期化
  connect(token?: string): void {
    if (this.socket?.connected) {
      return;
    }

    const url = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000';
    
    this.socket = io(url, {
      transports: ['websocket'],
      auth: token ? { token } : undefined,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.setupEventHandlers();
  }

  // Socket接続の切断
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // イベントハンドラーの設定
  private setupEventHandlers(): void {
    if (!this.socket) return;

    // 接続イベント
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.emit('socket:connected', { id: this.socket?.id });
    });

    // 切断イベント
    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.emit('socket:disconnected', { reason });
    });

    // エラーイベント
    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.emit('socket:error', { error });
    });

    // チャットメッセージ
    this.socket.on('chat:message', (message: ChatMessage) => {
      this.emit('chat:message', message);
    });

    // プレイヤー移動
    this.socket.on('game:playerMove', (data: PlayerState) => {
      this.emit('game:playerMove', data);
    });

    // プレイヤー参加
    this.socket.on('game:playerJoin', (data: PlayerState) => {
      this.emit('game:playerJoin', data);
    });

    // プレイヤー退出
    this.socket.on('game:playerLeave', (data: { userId: string }) => {
      this.emit('game:playerLeave', data);
    });
  }

  // イベントリスナーの登録
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  // イベントリスナーの解除
  off(event: string, callback: Function): void {
    this.listeners.get(event)?.delete(callback);
  }

  // 内部イベントの発火
  private emit(event: string, data: any): void {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }

  // サーバーへのイベント送信
  send(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Unable to send:', event, data);
    }
  }

  // チャットメッセージ送信
  sendChatMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): void {
    this.send('chat:send', message);
  }

  // プレイヤー移動送信
  sendPlayerMove(position: { x: number; y: number }): void {
    this.send('game:move', position);
  }

  // ルーム参加
  joinRoom(roomId: string): void {
    this.send('room:join', { roomId });
  }

  // ルーム退出
  leaveRoom(roomId: string): void {
    this.send('room:leave', { roomId });
  }

  // 接続状態の確認
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Socket IDの取得
  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}

// シングルトンインスタンス
export const socketService = new SocketService();
