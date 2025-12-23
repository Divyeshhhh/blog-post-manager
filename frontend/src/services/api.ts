import axios from 'axios';
import type { BlogPost, CreateBlogPost, UpdateBlogPost } from '../types/BlogPost';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const blogPostApi = {
  getAll: async (): Promise<BlogPost[]> => {
    const response = await api.get<BlogPost[]>('/blogposts');
    return response.data;
  },

  getById: async (id: number): Promise<BlogPost> => {
    const response = await api.get<BlogPost>(`/blogposts/${id}`);
    return response.data;
  },

  create: async (post: CreateBlogPost): Promise<BlogPost> => {
    const response = await api.post<BlogPost>('/blogposts', post);
    return response.data;
  },

  update: async (id: number, post: UpdateBlogPost): Promise<BlogPost> => {
    const response = await api.put<BlogPost>(`/blogposts/${id}`, post);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/blogposts/${id}`);
  },
};