import { useState, useEffect } from 'react';
import type { Sweet, PaginatedResponse, SearchFilters } from '../types';
import { sweetsService } from '../services/sweets';

export const useSweets = (initialFilters?: SearchFilters) => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Sweet>['pagination'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSweets = async (filters?: SearchFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      let result: PaginatedResponse<Sweet>;

      if (filters && Object.keys(filters).length > 0) {
        result = await sweetsService.searchSweets(filters);
      } else {
        result = await sweetsService.getSweets({ page: 1, limit: 12 });
      }

      setSweets(result.data);
      setPagination(result.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sweets');
    } finally {
      setIsLoading(false);
    }
  };

  const createSweet = async (sweetData: Partial<Sweet>) => {
    const newSweet = await sweetsService.createSweet(sweetData);
    setSweets(prev => [newSweet, ...prev]);
    return newSweet;
  };

  const updateSweet = async (id: string, sweetData: Partial<Sweet>) => {
    const updatedSweet = await sweetsService.updateSweet(id, sweetData);
    setSweets(prev => prev.map(sweet => sweet._id === id ? updatedSweet : sweet));
    return updatedSweet;
  };

  const deleteSweet = async (id: string) => {
    await sweetsService.deleteSweet(id);
    setSweets(prev => prev.filter(sweet => sweet._id !== id));
  };

  const purchaseSweet = async (id: string, quantity: number = 1) => {
    const updatedSweet = await sweetsService.purchaseSweet(id, quantity);
    setSweets(prev => prev.map(sweet => sweet._id === id ? updatedSweet : sweet));
    return updatedSweet;
  };

  const restockSweet = async (id: string, quantity: number) => {
    const updatedSweet = await sweetsService.restockSweet(id, quantity);
    setSweets(prev => prev.map(sweet => sweet._id === id ? updatedSweet : sweet));
    return updatedSweet;
  };

  useEffect(() => {
    fetchSweets(initialFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    sweets,
    pagination,
    isLoading,
    error,
    fetchSweets,
    createSweet,
    updateSweet,
    deleteSweet,
    purchaseSweet,
    restockSweet,
    refetch: () => fetchSweets(initialFilters),
  };
};
