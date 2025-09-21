import { create } from 'zustand';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
  roomId?: string;
}

interface ChatState {
  messages: ChatMessage[];
  unreadCount: number;
  isTyping: Map<string, boolean>;
  
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  clearMessages: () => void;
  setTyping: (userId: string, isTyping: boolean) => void;
  incrementUnread: () => void;
  resetUnread: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  unreadCount: 0,
  isTyping: new Map(),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      unreadCount: message.isOwn ? state.unreadCount : state.unreadCount + 1,
    })),

  setMessages: (messages) => set({ messages }),

  clearMessages: () => set({ messages: [] }),

  setTyping: (userId, isTyping) =>
    set((state) => {
      const newTyping = new Map(state.isTyping);
      if (isTyping) {
        newTyping.set(userId, true);
      } else {
        newTyping.delete(userId);
      }
      return { isTyping: newTyping };
    }),

  incrementUnread: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),

  resetUnread: () => set({ unreadCount: 0 }),
}));
