'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/stores/auth.store';

// バリデーションスキーマ
const registerSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上である必要があります'),
  confirmPassword: z.string(),
  username: z.string().min(3, 'ユーザー名は3文字以上である必要があります'),
  displayName: z.string().min(1, '表示名を入力してください'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const [error, setError] = useState<string>('');

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('');
      const { confirmPassword, ...registerData } = data;
      await register(registerData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || '登録に失敗しました');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            メールアドレス
          </label>
          <input
            {...formRegister('email')}
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="email@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-2">
            ユーザー名
          </label>
          <input
            {...formRegister('username')}
            type="text"
            id="username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="username"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="displayName" className="block text-sm font-medium mb-2">
            表示名
          </label>
          <input
            {...formRegister('displayName')}
            type="text"
            id="displayName"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="表示される名前"
          />
          {errors.displayName && (
            <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            パスワード
          </label>
          <input
            {...formRegister('password')}
            type="password"
            id="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
            パスワード（確認）
          </label>
          <input
            {...formRegister('confirmPassword')}
            type="password"
            id="confirmPassword"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '登録中...' : '新規登録'}
        </button>

        <div className="text-center text-sm">
          <span className="text-gray-600">既にアカウントをお持ちの方は</span>
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-blue-600 hover:underline ml-1"
          >
            ログイン
          </button>
        </div>
      </form>
    </div>
  );
}
