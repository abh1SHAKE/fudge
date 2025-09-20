export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Sweet {
  _id: string;
  name: string;
  category: 'chocolate' | 'gummy' | 'hard-candy' | 'lollipop' | 'marshmallow' | 'other';
  price: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SearchFilters {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}