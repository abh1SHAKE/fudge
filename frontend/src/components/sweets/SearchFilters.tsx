import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import type { SearchFilters as ISearchFilters } from '../../types';
import { Button } from '../shared/Button';

interface SearchFiltersProps {
  onSearch: (filters: ISearchFilters) => void;
  isLoading?: boolean;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch, isLoading = false }) => {
  const [filters, setFilters] = useState<ISearchFilters>({
    name: '',
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value === '' ? undefined : (name.includes('Price') ? Number(value) : value)
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      name: '',
      category: '',
      minPrice: undefined,
      maxPrice: undefined,
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  return (
    <div className='bg-cream rounded-lg shadow-xl p-6 mb-12'>
      <div className='flex items-center justify-between mb-4 px-2'>
        <h3 className='text-lg font-semibold text-cocoa'>Search Sweets</h3>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className='flex items-center space-x-2 text-cocoa hover:text-raspberry transition-colors'
        >
          <AdjustmentsHorizontalIcon className='h-5 w-5' />
          <span className='text-cocoa font-semibold text-sm'>Advanced</span>
        </button>
      </div>

      <div className='space-y-4'>
        <div className='flex flex-col md:flex-row gap-4 px-2'>
          <div className='flex-1'>
            <div className='relative'>
              <MagnifyingGlassIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
              <input
                type='text'
                name='name'
                placeholder='Search by name...'
                value={filters.name || ''}
                onChange={handleInputChange}
                className='bg-cream w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-raspberry focus:border-raspberry'
              />
            </div>
          </div>
          
          <div className='w-48'>
            <select
              name='category'
              value={filters.category || ''}
              onChange={handleInputChange}
              className='bg-cream w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-raspberry focus:border-raspberry'
            >
              <option value=''>All Categories</option>
              <option value='chocolate'>Chocolate</option>
              <option value='gummy'>Gummy</option>
              <option value='hard-candy'>Hard Candy</option>
              <option value='lollipop'>Lollipop</option>
              <option value='fudge'>Fudge</option>
              <option value='toffee'>Toffee</option>
              <option value='mint'>Mint</option>
              <option value='nougat'>Nougat</option>
              <option value='other'>Other</option>
            </select>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{
            height: showAdvanced ? 'auto' : 0,
            opacity: showAdvanced ? 1 : 0
          }}
          className='overflow-hidden'
        >
          <div className='pt-4'>
            <div className='grid grid-cols-2 gap-4 p-2'>
              <div>
                <label className='block text-sm font-medium text-cocoa mb-2'>Min Price ($)</label>
                <input
                  type='number'
                  name='minPrice'
                  step='0.01'
                  min='0'
                  placeholder='0.00'
                  value={filters.minPrice || ''}
                  onChange={handleInputChange}
                  className='bg-cream w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-raspberry focus:border-raspberry'
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-cocoa mb-2'>Max Price ($)</label>
                <input
                  type='number'
                  name='maxPrice'
                  step='0.01'
                  min='0'
                  placeholder='100.00'
                  value={filters.maxPrice || ''}
                  onChange={handleInputChange}
                  className='bg-cream w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-raspberry focus:border-raspberry'
                />
              </div>
            </div>
          </div>
        </motion.div>

        <div className='flex justify-end space-x-3'>
          <Button
            variant='secondary'
            size='sm'
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset
          </Button>
          <Button
            variant='primary'
            size='sm'
            onClick={handleSearch}
            isLoading={isLoading}
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};