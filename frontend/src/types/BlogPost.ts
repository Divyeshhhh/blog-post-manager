import type { User } from './Auth';

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  isOwner: boolean;
  user: User;
}

export interface CreateBlogPost {
  title: string;
  content: string;
}

export interface UpdateBlogPost {
  title: string;
  content: string;
}