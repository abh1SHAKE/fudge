import { api, apiRequest } from './api';
import type { Sweet, PaginatedResponse, SearchFilters } from '../types';

export const sweetsService = {
  getSweets: async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Sweet>> => {
    const response = await apiRequest<PaginatedResponse<Sweet>>(
      api.get('/sweets', { params })
    );
    return response.data!;
  },

  searchSweets: async (filters: SearchFilters): Promise<PaginatedResponse<Sweet>> => {
    const response = await apiRequest<PaginatedResponse<Sweet>>(
      api.get('/sweets/search', { params: filters })
    );
    return response.data!;
  },

  createSweet: async (sweetData: Partial<Sweet>): Promise<Sweet> => {
    const response = await apiRequest<Sweet>(
      api.post('/sweets', sweetData)
    );
    return response.data!;
  },

  updateSweet: async (id: string, sweetData: Partial<Sweet>): Promise<Sweet> => {
    const response = await apiRequest<Sweet>(
      api.put(`/sweets/${id}`, sweetData)
    );
    return response.data!;
  },

  deleteSweet: async (id: string): Promise<void> => {
    await apiRequest(api.delete(`/sweets/${id}`));
  },

  purchaseSweet: async (id: string, quantity: number = 1): Promise<Sweet> => {
    const response = await apiRequest<Sweet>(
      api.post(`/sweets/${id}/purchase`, { quantity })
    );
    return response.data!;
  },

  restockSweet: async (id: string, quantity: number): Promise<Sweet> => {
    const response = await apiRequest<Sweet>(
      api.post(`/sweets/${id}/restock`, { quantity })
    );
    return response.data!;
  },
};