
export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  bio?: string;
  profileImageUrl?: string;
  createdAt: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface LoginData {
  emailOrUsername: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
export interface UpdateProfileData {
  fullName?: string;
  bio?: string;
  profileImageUrl?: string;
}