import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import RefreshToken from '../models/RefreshToken';
import mongoose from 'mongoose';

interface TokenPayload {
  id: string;
  email: string;
  roles: string[];
}

export const generateAccessToken = (payload: TokenPayload): string => {
  // @ts-ignore - Type assertion for JWT config
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiry,
  });
};

export const generateRefreshToken = async (
  userId: string
): Promise<string> => {
  // @ts-ignore - Type assertion for JWT config
  const token = jwt.sign({ id: userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiry,
  });

  // Calculate expiry date
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await RefreshToken.create({
    userId,
    token,
    expiresAt,
  });

  return token;
};

export const verifyRefreshToken = async (
  token: string
): Promise<TokenPayload | null> => {
  try {
    // @ts-ignore - Type assertion for JWT config
    const decoded = jwt.verify(token, config.jwt.refreshSecret) as { id: string };

    // Check if token exists in database and is not revoked
    const refreshToken = await RefreshToken.findOne({
      token,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    });

    if (!refreshToken) {
      return null;
    }

    return decoded as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const revokeRefreshToken = async (token: string): Promise<boolean> => {
  try {
    const result = await RefreshToken.updateOne(
      { token },
      { isRevoked: true }
    );

    return result.modifiedCount > 0;
  } catch (error) {
    return false;
  }
};

export const revokeAllUserTokens = async (userId: string): Promise<void> => {
  await RefreshToken.updateMany(
    { userId: new mongoose.Types.ObjectId(userId), isRevoked: false },
    { isRevoked: true }
  );
};
