import { api, apiRequest } from './api';
import type { AuthResponse, User } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>(
      api.post('/auth/login', { email, password })
    );
    return response.data!;
  },

  register: async (
    username: string,
    email: string,
    password: string,
    role?: string
  ): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>(
      api.post('/auth/register', { username, email, password, role })
    );
    return response.data!;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setAuthData: (authData: AuthResponse) => {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
  },
};