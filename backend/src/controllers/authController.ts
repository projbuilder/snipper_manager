import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, revokeRefreshToken, revokeAllUserTokens } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username, email, password, displayName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new AppError('User already exists with this email or username', 409, 'USER_EXISTS');
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      passwordHash: password, // Will be hashed by pre-save hook
      displayName,
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      id: (user._id as any).toString(),
      email: user.email,
      roles: user.roles,
    });

    const refreshToken = await generateRefreshToken((user._id as any).toString());

    logger.info(`New user registered: ${user.email}`);

    res.status(201).json({
      success: true,
      data: {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    
    logger.error('Registration error:', error);
    throw new AppError(error.message || 'Registration failed', 500, 'REGISTRATION_ERROR');
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Update last login
    user.metadata.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken({
      id: (user._id as any).toString(),
      email: user.email,
      roles: user.roles,
    });

    const refreshToken = await generateRefreshToken((user._id as any).toString());

    logger.info(`User logged in: ${user.email}`);

    res.status(200).json({
      success: true,
      data: {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    
    logger.error('Login error:', error);
    throw new AppError('Login failed', 500, 'LOGIN_ERROR');
  }
};

export const refreshAccessToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    const decoded = await verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Generate new access token
    const accessToken = generateAccessToken({
      id: (user._id as any).toString(),
      email: user.email,
      roles: user.roles,
    });

    res.status(200).json({
      success: true,
      data: {
        accessToken,
      },
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    
    logger.error('Token refresh error:', error);
    throw new AppError('Token refresh failed', 500, 'REFRESH_ERROR');
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    logger.info(`User logged out: ${req.user?.email}`);

    res.status(200).json({
      success: true,
      data: {
        message: 'Logged out successfully',
      },
    });
  } catch (error: any) {
    logger.error('Logout error:', error);
    throw new AppError('Logout failed', 500, 'LOGOUT_ERROR');
  }
};

export const logoutAll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    await revokeAllUserTokens(req.user.id);

    logger.info(`User logged out from all devices: ${req.user.email}`);

    res.status(200).json({
      success: true,
      data: {
        message: 'Logged out from all devices successfully',
      },
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    
    logger.error('Logout all error:', error);
    throw new AppError('Logout failed', 500, 'LOGOUT_ERROR');
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    
    logger.error('Get current user error:', error);
    throw new AppError('Failed to get user', 500, 'GET_USER_ERROR');
  }
};
