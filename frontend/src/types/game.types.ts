// ゲーム関連の型定義

// プレイヤーの位置情報
export interface Position {
  x: number;
  y: number;
  roomId: string;
}

// プレイヤーの状態
export interface PlayerState {
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  position: Position;
  direction: Direction;
  isMoving: boolean;
  status: PlayerStatus;
}

export enum Direction {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right'
}

export enum PlayerStatus {
  ONLINE = 'online',
  IDLE = 'idle',
  BUSY = 'busy',
  OFFLINE = 'offline'
}

// ルーム関連
export interface Room {
  id: string;
  name: string;
  description?: string;
  capacity: number;
  currentUsers: number;
  type: RoomType;
  isPublic: boolean;
  mapData?: string;
  createdAt: Date;
}

export enum RoomType {
  CLASSROOM = 'classroom',
  HALLWAY = 'hallway',
  LIBRARY = 'library',
  CAFETERIA = 'cafeteria',
  PLAYGROUND = 'playground',
  OFFICE = 'office'
}

// ゲームイベント
export interface GameEvent {
  type: GameEventType;
  payload: any;
  timestamp: number;
}

export enum GameEventType {
  PLAYER_JOIN = 'player_join',
  PLAYER_LEAVE = 'player_leave',
  PLAYER_MOVE = 'player_move',
  PLAYER_STOP = 'player_stop',
  PLAYER_INTERACT = 'player_interact'
}
