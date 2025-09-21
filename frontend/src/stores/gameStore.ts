import { create } from 'zustand';
import Phaser from 'phaser';

interface GameState {
  gameInstance: Phaser.Game | null;
  currentScene: string;
  playerPosition: { x: number; y: number };
  otherPlayers: Map<string, { x: number; y: number; userName: string }>;
  
  setGameInstance: (game: Phaser.Game | null) => void;
  setCurrentScene: (scene: string) => void;
  setPlayerPosition: (x: number, y: number) => void;
  updateOtherPlayer: (userId: string, x: number, y: number, userName: string) => void;
  removeOtherPlayer: (userId: string) => void;
  clearOtherPlayers: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  gameInstance: null,
  currentScene: 'MainScene',
  playerPosition: { x: 400, y: 300 },
  otherPlayers: new Map(),

  setGameInstance: (game) => set({ gameInstance: game }),
  
  setCurrentScene: (scene) => set({ currentScene: scene }),
  
  setPlayerPosition: (x, y) => set({ playerPosition: { x, y } }),
  
  updateOtherPlayer: (userId, x, y, userName) =>
    set((state) => {
      const newMap = new Map(state.otherPlayers);
      newMap.set(userId, { x, y, userName });
      return { otherPlayers: newMap };
    }),
  
  removeOtherPlayer: (userId) =>
    set((state) => {
      const newMap = new Map(state.otherPlayers);
      newMap.delete(userId);
      return { otherPlayers: newMap };
    }),
  
  clearOtherPlayers: () => set({ otherPlayers: new Map() }),
}));
