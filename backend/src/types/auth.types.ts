import { Request } from 'express';
import { User } from '@prisma/client';

// 認証済みリクエスト
export interface AuthRequest extends Request {
  user?: AuthUser;
}

// 認証ユーザー情報
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

// JWTペイロード
export interface JwtPayload extends AuthUser {
  iat?: number;
  exp?: number;
}

// リフレッシュトークンペイロード
export interface RefreshTokenPayload {
  id: string;
  tokenId: string;
}

// APIレスポンス
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: any[];
}

// ページネーション
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
