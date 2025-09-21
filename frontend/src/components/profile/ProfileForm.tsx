'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';

const profileSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  bio: z.string().max(500, '自己紹介は500文字以内で入力してください').optional(),
  status: z.string().max(100, 'ステータスは100文字以内で入力してください').optional(),
  interests: z.string().max(200, '興味・関心は200文字以内で入力してください').optional(),
  grade: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  userId: string;
  onSuccess?: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ 
  userId, 
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    // プロフィール情報を取得
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        
        if (response.data) {
          reset(response.data);
        }
      } catch (error) {
        console.error('プロフィール取得エラー:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [userId, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      onSuccess?.();
    } catch (error) {
      console.error('プロフィール更新エラー:', error);
      alert('プロフィールの更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          名前 <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          自己紹介
        </label>
        <textarea
          id="bio"
          rows={4}
          {...register('bio')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="あなたについて教えてください..."
        />
        {errors.bio && (
          <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          現在のステータス
        </label>
        <input
          id="status"
          type="text"
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="例: 勉強中、休憩中など"
        />
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
          興味・関心
        </label>
        <input
          id="interests"
          type="text"
          {...register('interests')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="例: プログラミング、読書、音楽など"
        />
        {errors.interests && (
          <p className="mt-1 text-sm text-red-600">{errors.interests.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
          学年
        </label>
        <select
          id="grade"
          {...register('grade')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">選択してください</option>
          <option value="elementary1">小学1年生</option>
          <option value="elementary2">小学2年生</option>
          <option value="elementary3">小学3年生</option>
          <option value="elementary4">小学4年生</option>
          <option value="elementary5">小学5年生</option>
          <option value="elementary6">小学6年生</option>
          <option value="junior1">中学1年生</option>
          <option value="junior2">中学2年生</option>
          <option value="junior3">中学3年生</option>
          <option value="high1">高校1年生</option>
          <option value="high2">高校2年生</option>
          <option value="high3">高校3年生</option>
          <option value="other">その他</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? '保存中...' : 'プロフィールを保存'}
      </button>
    </form>
  );
};
