import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { ApiError } from '@/types/auth.types';

// Axios instanceの作成
const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - トークンの追加
  instance.interceptors.request.use(
    (config) => {
      // Zustand storeから直接アクセストークンを取得
      if (typeof window !== 'undefined') {
        const storage = localStorage.getItem('auth-storage');
        if (storage) {
          try {
            const { state } = JSON.parse(storage);
            if (state?.accessToken) {
              config.headers.Authorization = `Bearer ${state.accessToken}`;
            }
          } catch (error) {
            console.error('Failed to parse auth storage:', error);
          }
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - エラーハンドリングとトークンリフレッシュ
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiError>) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      // 401エラーでリトライしていない場合
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // トークンのリフレッシュを試みる
          const storage = localStorage.getItem('auth-storage');
          if (storage) {
            const { state } = JSON.parse(storage);
            if (state?.refreshToken) {
              // ここでリフレッシュトークンを使用して新しいトークンを取得
              const refreshResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
                { refreshToken: state.refreshToken }
              );

              // 新しいトークンを保存
              const newState = {
                ...state,
                accessToken: refreshResponse.data.accessToken,
                refreshToken: refreshResponse.data.refreshToken,
              };
              localStorage.setItem(
                'auth-storage',
                JSON.stringify({ state: newState })
              );

              // リトライ
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
              }
              return instance(originalRequest);
            }
          }
        } catch (refreshError) {
          // リフレッシュ失敗時はログアウト
          localStorage.removeItem('auth-storage');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      // エラーレスポンスの整形
      const apiError: ApiError = {
        message: error.response?.data?.message || 'An error occurred',
        statusCode: error.response?.status || 500,
        errors: error.response?.data?.errors,
      };

      return Promise.reject(apiError);
    }
  );

  return instance;
};

// APIクライアントのエクスポート
export const apiClient = createApiClient();

// 共通APIメソッド
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then((res) => res.data),
    
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config).then((res) => res.data),
    
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config).then((res) => res.data),
    
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config).then((res) => res.data),
    
  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config).then((res) => res.data),
};
