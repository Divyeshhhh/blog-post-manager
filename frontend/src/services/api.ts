import axios from 'axios';
import type { BlogPost, CreateBlogPost, UpdateBlogPost } from '../types/BlogPost';
import type {
  LoginData,
  RegisterData,
  AuthResponse,
  User,
} from '../types/Auth';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = axios.create({
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
  getUserPosts: async (userId: number): Promise<BlogPost[]> => {
    const response = await api.get<BlogPost[]>(`/blogposts/user/${userId}`);
    return response.data;
  },
};

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },
  getUserById: async (userId: number): Promise<User> => {
    const response = await api.get<User>(`/auth/user/${userId}`);
    return response.data;
  },
  updateProfile: async (data: Partial<{ fullName?: string; bio?: string; profileImageUrl?: string }>): Promise<User> => {
    const response = await api.put<User>('/auth/profile', data);
    return response.data;
  },
};