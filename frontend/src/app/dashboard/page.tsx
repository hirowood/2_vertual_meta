'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GameCanvas } from '@/components/game/GameCanvas';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { ProfileForm } from '@/components/profile/ProfileForm';
import socket from '@/lib/socket';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'game' | 'profile'>('game');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ユーザー情報の取得
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setUser(response.data);
        
        // Socket接続
        socket.auth = { token };
        socket.connect();
        
      } catch (error) {
        console.error('認証エラー:', error);
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    return () => {
      socket.disconnect();
    };
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    socket.disconnect();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              バーチャルスクール
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                こんにちは、{user.name}さん
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* タブナビゲーション */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('game')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'game'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              バーチャル空間
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              プロフィール
            </button>
          </nav>
        </div>
      </div>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'game' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
              <GameCanvas userId={user.id} userName={user.name} />
            </div>
            <div className="bg-white rounded-lg shadow">
              <div className="h-[600px]">
                <ChatPanel userId={user.id} userName={user.name} />
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">プロフィール設定</h2>
            <ProfileForm 
              userId={user.id} 
              onSuccess={() => {
                alert('プロフィールを更新しました');
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
