import { api } from './api';
import { Snippet, ApiResponse, SearchParams } from '../types';

export const snippetService = {
  async getSnippets(params: SearchParams = {}) {
    const response = await api.get<ApiResponse<{ snippets: Snippet[]; pagination: any }>>(
      '/snippets',
      { params }
    );
    return response.data.data;
  },

  async getSnippetById(id: string) {
    const response = await api.get<ApiResponse<{ snippet: Snippet; isStarred: boolean }>>(
      `/snippets/${id}`
    );
    return response.data.data;
  },

  async createSnippet(data: Partial<Snippet>) {
    const response = await api.post<ApiResponse<{ snippet: Snippet }>>('/snippets', data);
    return response.data.data.snippet;
  },

  async updateSnippet(id: string, data: Partial<Snippet>) {
    const response = await api.put<ApiResponse<{ snippet: Snippet }>>(`/snippets/${id}`, data);
    return response.data.data.snippet;
  },

  async deleteSnippet(id: string) {
    await api.delete(`/snippets/${id}`);
  },

  async forkSnippet(id: string) {
    const response = await api.post<ApiResponse<{ snippet: Snippet }>>(`/snippets/${id}/fork`);
    return response.data.data.snippet;
  },

  async starSnippet(id: string) {
    const response = await api.post<
      ApiResponse<{ message: string; isStarred: boolean; stars: number }>
    >(`/snippets/${id}/star`);
    return response.data.data;
  },

  async getUserSnippets(userId: string, page = 1, limit = 20) {
    const response = await api.get<ApiResponse<{ snippets: Snippet[]; pagination: any }>>(
      `/users/${userId}/snippets`,
      { params: { page, limit } }
    );
    return response.data.data;
  },
};
