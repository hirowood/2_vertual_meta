import { Request, Response, NextFunction } from 'express';
import logger from '@config/logger';
import { sendError } from '@utils/response.utils';

// エラーハンドリングクラス
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// 404エラーハンドラー
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(`エンドポイントが見つかりません: ${req.originalUrl}`, 404);
  next(error);
};

// グローバルエラーハンドラー
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'サーバーエラーが発生しました';
  let isOperational = false;

  // AppErrorの場合
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }

  // Prismaエラーの処理
  if (err.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    
    switch (prismaError.code) {
      case 'P2002':
        statusCode = 400;
        message = '既に登録されているデータです';
        break;
      case 'P2025':
        statusCode = 404;
        message = 'データが見つかりません';
        break;
      default:
        statusCode = 400;
        message = 'データベースエラーが発生しました';
    }
    
    isOperational = true;
  }

  // ログ出力
  if (!isOperational) {
    logger.error('Unexpected error:', {
      error: err,
      request: {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body,
      },
    });
  }

  // 開発環境ではスタックトレースを含める
  const response = {
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err,
    }),
  };

  sendError(res, message, statusCode);
};

// 非同期エラーキャッチャー
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
