'use client';

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MainScene } from './scenes/MainScene';
import { useGameStore } from '@/stores/gameStore';

interface GameCanvasProps {
  userId: string;
  userName: string;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ userId, userName }) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setGameInstance } = useGameStore();

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scene: [MainScene],
      backgroundColor: '#2d2d2d',
    };

    // ゲームインスタンスを作成
    gameRef.current = new Phaser.Game(config);
    setGameInstance(gameRef.current);

    // シーンにユーザー情報を渡す
    gameRef.current.registry.set('userId', userId);
    gameRef.current.registry.set('userName', userName);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [userId, userName, setGameInstance]);

  return (
    <div className="game-container">
      <div ref={containerRef} className="phaser-game" />
    </div>
  );
};
