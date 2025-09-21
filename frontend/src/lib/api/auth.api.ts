import { api } from './client';
import { AuthResponse, LoginCredentials, RegisterData } from '@/types/auth.types';

export const authApi = {
  // ログイン
  login: (credentials: LoginCredentials): Promise<AuthResponse> => {
    return api.post('/api/auth/login', credentials);
  },

  // 新規登録
  register: (data: RegisterData): Promise<AuthResponse> => {
    return api.post('/api/auth/register', data);
  },

  // ログアウト
  logout: (): Promise<void> => {
    return api.post('/api/auth/logout');
  },

  // トークンリフレッシュ
  refreshToken: (refreshToken: string): Promise<AuthResponse> => {
    return api.post('/api/auth/refresh', { refreshToken });
  },

  // 現在のユーザー情報取得
  getCurrentUser: () => {
    return api.get('/api/auth/me');
  },

  // パスワード変更
  changePassword: (data: { oldPassword: string; newPassword: string }) => {
    return api.post('/api/auth/change-password', data);
  },

  // パスワードリセットリクエスト
  requestPasswordReset: (email: string) => {
    return api.post('/api/auth/forgot-password', { email });
  },

  // パスワードリセット
  resetPassword: (data: { token: string; password: string }) => {
    return api.post('/api/auth/reset-password', data);
  },
};
