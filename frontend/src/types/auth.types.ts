// ユーザー関連の型定義
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

// 認証関連の型定義
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
  displayName: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// エラーレスポンスの型定義
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
