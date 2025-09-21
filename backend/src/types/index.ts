// バックエンド型定義のエクスポート
export * from './auth.types';
export * from './socket.types';

// DTOの型定義
export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export interface UpdateUserDto {
  name?: string;
  avatar?: string;
  isActive?: boolean;
}

export interface CreateRoomDto {
  name: string;
  description?: string;
  type?: string;
  capacity?: number;
  password?: string;
}

export interface UpdateRoomDto {
  name?: string;
  description?: string;
  capacity?: number;
  isActive?: boolean;
}

export interface CreateMessageDto {
  content: string;
  roomId?: string;
  type?: string;
}

export interface CreateReportDto {
  date: Date;
  mood: number;
  activities?: string;
  achievements?: string;
  challenges?: string;
  reflection?: string;
  tomorrowPlan?: string;
  isPrivate?: boolean;
}

export interface UpdateProfileDto {
  bio?: string;
  status?: string;
  interests?: string;
  grade?: string;
  subjects?: string;
}

// エラー型定義
export interface ErrorWithName extends Error {
  name: string;
}

export interface JwtError extends ErrorWithName {
  name: 'JsonWebTokenError' | 'TokenExpiredError' | 'NotBeforeError';
}

export interface PrismaError extends Error {
  code?: string;
  meta?: Record<string, any>;
  clientVersion?: string;
}
