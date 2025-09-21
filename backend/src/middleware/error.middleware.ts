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

// エラー型ガード
function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

// Prismaエラー型ガード
function isPrismaError(error: any): boolean {
  return error?.constructor?.name === 'PrismaClientKnownRequestError';
}

// 404エラーハンドラー
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(`エンドポイントが見つかりません: ${req.originalUrl}`, 404);
  next(error);
};

// グローバルエラーハンドラー
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'サーバーエラーが発生しました';
  let isOperational = false;

  // エラーの型チェックと処理
  if (isAppError(err)) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  } else if (err instanceof Error) {
    message = err.message;
    
    // Prismaエラーの処理
    if (isPrismaError(err)) {
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

  // レスポンス送信
  sendError(res, message, statusCode);
};

// 非同期エラーキャッチャー
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
