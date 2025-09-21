'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { socketService } from '@/lib/socket';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  useEffect(() => {
    // Socket接続の初期化
    const token = useAuthStore.getState().accessToken;
    if (token) {
      socketService.connect(token);
    }

    // Socket接続状態の監視
    socketService.on('socket:connected', () => {
      setIsSocketConnected(true);
    });

    socketService.on('socket:disconnected', () => {
      setIsSocketConnected(false);
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">
          ようこそ、{user?.displayName || user?.username}さん！
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* ステータスカード */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">接続状態</h3>
            <p className="text-sm">
              Socket.io: {' '}
              <span className={`font-medium ${isSocketConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isSocketConnected ? '接続中' : '未接続'}
              </span>
            </p>
          </div>

          {/* ユーザー情報カード */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">ユーザー情報</h3>
            <p className="text-sm">ロール: {user?.role}</p>
            <p className="text-sm">メール: {user?.email}</p>
          </div>

          {/* アクションカード */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900 mb-2">クイックアクション</h3>
            <button className="text-sm text-purple-600 hover:underline block">
              プロフィール編集
            </button>
            <button className="text-sm text-purple-600 hover:underline block">
              設定
            </button>
          </div>
        </div>
      </div>

      {/* メイン機能エリア（今後実装） */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2D空間エリア */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">バーチャル空間</h3>
          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
            <p className="text-gray-500">
              Phaser.jsを使用した2D空間がここに表示されます
            </p>
          </div>
        </div>

        {/* チャットエリア */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">チャット</h3>
          <div className="bg-gray-50 rounded-lg h-96 flex flex-col">
            <div className="flex-1 p-4 overflow-y-auto">
              <p className="text-gray-500 text-sm">
                チャットメッセージがここに表示されます
              </p>
            </div>
            <div className="p-4 border-t">
              <input
                type="text"
                placeholder="メッセージを入力..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
