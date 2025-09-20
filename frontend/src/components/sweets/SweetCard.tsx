import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCartIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { Sweet } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../shared/Button';
import toast from 'react-hot-toast';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (id: string, quantity: number) => Promise<void>;
  onUpdate?: (sweet: Sweet) => void;
  onDelete?: (id: string) => Promise<void>;
}

export const SweetCard: React.FC<SweetCardProps> = ({
  sweet,
  onPurchase,
  onUpdate,
  onDelete
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handlePurchase = async () => {
    if (sweet.quantity < quantity) {
      toast.error('Not enough stock available');
      return;
    }

    setIsLoading(true);
    try {
      await onPurchase(sweet._id, quantity);
      toast.success(`Purchased ${quantity} ${sweet.name}(s)!`);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${sweet.name}?`)) {
      try {
        await onDelete?.(sweet._id);
        toast.success('Sweet deleted successfully');
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      chocolate: 'bg-amber-100 text-amber-800',
      gummy: 'bg-green-100 text-green-800', 
      'hard-candy': 'bg-red-100 text-red-800',    
      lollipop: 'bg-pink-100 text-pink-800',      
      fudge: 'bg-yellow-100 text-yellow-800',    
      toffee: 'bg-orange-100 text-orange-800', 
      mint: 'bg-emerald-100 text-emerald-800', 
      nougat: 'bg-blue-100 text-blue-800', 
      marshmallow: 'bg-purple-100 text-purple-800',
      other: 'bg-gray-100 text-gray-800',  
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className='bg-white rounded-xl shadow-lg overflow-hidden transition-shadow hover:shadow-xl'
    >
      <div className='relative'>
        <img
          src={sweet.imageUrl || `https://via.placeholder.com/300x200?text=${encodeURIComponent(sweet.name)}`}
          alt={sweet.name}
          className='w-full h-48 object-cover'
        />
        
        <div className='absolute flex top-2 right-2 bg-cream p-[3px] rounded-full cursor-default'>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            sweet.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of stock'}
          </span>
        </div>

        {user?.role === 'admin' && (
          <div className='absolute top-2 left-2 flex space-x-1'>
            <span className='flex p-[3px] bg-white rounded-full'>
              <button
                onClick={() => onUpdate?.(sweet)}
                className='p-1 bg-caramel text-white rounded-full hover:bg-opacity-80 transition-colors'
              >
                <PencilIcon className='h-4 w-4' />
              </button>
            </span>
            <span className='flex p-[3px] bg-white rounded-full'>
              <button
                onClick={handleDelete}
                className='p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors'
              >
                <TrashIcon className='h-4 w-4' />
              </button>
            </span>
          </div>
        )}
      </div>

      <div className='p-4'>
        <div className='flex items-start justify-between mb-2 gap-4'>
          <h3 className='font-semibold text-lg text-cocoa line-clamp-2'>{sweet.name}</h3>
          <span className='text-xl font-bold text-raspberry'>₹{sweet.price.toFixed(2)}</span>
        </div>

        <div className='mb-3'>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(sweet.category)}`}>
            {sweet.category.replace('-', ' ').toUpperCase()}
          </span>
        </div>

        {sweet.description && (
          <p className='text-sm text-gray-600 mb-4 line-clamp-2'>{sweet.description}</p>
        )}

        <div className='flex items-center space-x-2'>
          <div className='flex items-center space-x-2 flex-1'>
            <label htmlFor={`quantity-${sweet._id}`} className='text-sm font-medium text-cocoa'>
              Qty:
            </label>
            <select
              id={`quantity-${sweet._id}`}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className='border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-raspberry'
              disabled={sweet.quantity === 0}
            >
              {Array.from({ length: Math.min(sweet.quantity, 10) }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          
          <Button
            variant='primary'
            size='sm'
            onClick={handlePurchase}
            disabled={sweet.quantity === 0 || isLoading}
            isLoading={isLoading}
            className='flex items-center space-x-1'
          >
            <ShoppingCartIcon className='h-4 w-4' />
            <span>Buy</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};