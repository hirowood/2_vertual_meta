/// <reference types="node" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?: string;
      DATABASE_URL: string;
      JWT_SECRET: string;
      JWT_EXPIRE: string;
      JWT_REFRESH_SECRET: string;
      JWT_REFRESH_EXPIRE: string;
      FRONTEND_URL: string;
      RATE_LIMIT_WINDOW?: string;
      RATE_LIMIT_MAX?: string;
      LOG_LEVEL?: string;
    }
  }
}

export {};
