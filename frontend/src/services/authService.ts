import { api } from './api';
import { User, AuthTokens, LoginCredentials, RegisterData, ApiResponse } from '../types';

export const authService = {
  async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await api.post<ApiResponse<{ user: User } & AuthTokens>>(
      '/auth/register',
      data
    );
    const { user, accessToken, refreshToken } = response.data.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    return { user, tokens: { accessToken, refreshToken } };
  },

  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await api.post<ApiResponse<{ user: User } & AuthTokens>>(
      '/auth/login',
      credentials
    );
    const { user, accessToken, refreshToken } = response.data.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    return { user, tokens: { accessToken, refreshToken } };
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await api.post('/auth/logout', { refreshToken });
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data.data.user;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },
};
