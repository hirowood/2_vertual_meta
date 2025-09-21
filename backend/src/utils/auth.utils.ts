import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '@config/config';
import { JwtPayload, RefreshTokenPayload } from '@/types/auth.types';

// パスワードのハッシュ化
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// パスワードの検証
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// アクセストークンの生成
export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

// リフレッシュトークンの生成
export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

// アクセストークンの検証
export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
};

// リフレッシュトークンの検証
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as RefreshTokenPayload;
};

// トークンの有効期限を取得
export const getTokenExpiration = (expiresIn: string): Date => {
  const match = expiresIn.match(/(\d+)([dhms])/);
  if (!match) {
    throw new Error('Invalid expiration format');
  }

  const [, value, unit] = match;
  const now = new Date();
  const amount = parseInt(value, 10);

  switch (unit) {
    case 'd':
      now.setDate(now.getDate() + amount);
      break;
    case 'h':
      now.setHours(now.getHours() + amount);
      break;
    case 'm':
      now.setMinutes(now.getMinutes() + amount);
      break;
    case 's':
      now.setSeconds(now.getSeconds() + amount);
      break;
    default:
      throw new Error('Invalid time unit');
  }

  return now;
};
