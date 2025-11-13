export interface User {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  roles: string[];
  createdAt: string;
  metadata: {
    lastLogin?: string;
    emailVerified: boolean;
    profilePicture?: string;
  };
}

export interface Snippet {
  _id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  tags: string[];
  author: User | string;
  visibility: 'public' | 'private' | 'unlisted';
  forks: number;
  parentSnippet?: string | null;
  createdAt: string;
  updatedAt: string;
  stats: {
    views: number;
    stars: number;
  };
  executionAllowed: boolean;
  license?: string;
}

export interface Collection {
  _id: string;
  name: string;
  description?: string;
  owner: User | string;
  snippetIds: string[];
  visibility: 'private' | 'shared' | 'public';
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  displayName: string;
}

export interface SearchParams {
  q?: string;
  language?: string;
  tags?: string;
  author?: string;
  visibility?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
