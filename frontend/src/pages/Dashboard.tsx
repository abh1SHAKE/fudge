import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import { useSweets } from '../hooks/useSweets';
import type { Sweet } from '../types';
import { SweetCard } from '../components/sweets/SweetCard';
import { SweetForm } from '../components/sweets/SweetForm';
import { SearchFilters } from '../components/sweets/SearchFilters';
import { Modal } from '../components/shared/Modal';
import { Button } from '../components/shared/Button';
import { Loading } from '../components/shared/Loading';
import toast from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const {
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
  } = useSweets();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [showRestockModal, setShowRestockModal] = useState<Sweet | null>(null);
  const [restockQuantity, setRestockQuantity] = useState(1);

  const handleSearch = (filters: any) => {
    fetchSweets(filters);
  };

  const handleCreateSweet = async (sweetData: Partial<Sweet>) => {
    try {
      await createSweet(sweetData);
      setShowCreateModal(false);
      toast.success('Sweet created successfully!');
    } catch (error) {
      console.error('Failed to create sweet:', error);
    }
  };

  const handleUpdateSweet = async (sweetData: Partial<Sweet>) => {
    if (!editingSweet) return;
    
    try {
      await updateSweet(editingSweet._id, sweetData);
      setEditingSweet(null);
      toast.success('Sweet updated successfully!');
    } catch (error) {
      console.error('Failed to update sweet:', error);
    }
  };

  const handleDeleteSweet = async (id: string) => {
    try {
      await deleteSweet(id);
    } catch (error) {
      console.error('Failed to delete sweet:', error);
    }
  };

  const handlePurchaseSweet = async (id: string, quantity: number) => {
    try {
      await purchaseSweet(id, quantity);
    } catch (error) {
      console.error('Failed to purchase sweet:', error);
      throw error;
    }
  };

  const handleRestockSweet = async () => {
    if (!showRestockModal) return;

    try {
      await restockSweet(showRestockModal._id, restockQuantity);
      setShowRestockModal(null);
      setRestockQuantity(1);
      toast.success('Sweet restocked successfully!');
    } catch (error) {
      console.error('Failed to restock sweet:', error);
    }
  };

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-600 text-lg mb-4'>Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            {/* <h1 className='text-2xl font-bold text-cocoa'>Sweet Dashboard</h1> */}
            <p className='text-cocoa'>Welcome back, <span className='font-semibold'>{user?.username}!</span></p>
          </div>
          
          {user?.role === 'admin' && (
            <Button
              variant='primary'
              onClick={() => setShowCreateModal(true)}
              className='flex items-center space-x-2'
            >
              <PlusIcon className='h-5 w-5' />
              <span>Add Sweet</span>
            </Button>
          )}
        </div>

        <SearchFilters onSearch={handleSearch} isLoading={isLoading} />

        {isLoading ? (
          <Loading text='Loading delicious sweets...' />
        ) : (
          <>
            {sweets.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='text-center py-12'
              >
                <h3 className='text-xl text-gray-600 mb-4'>No sweets found</h3>
                <p className='text-gray-500'>Try adjusting your search filters</p>
              </motion.div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {sweets.map((sweet) => (
                  <SweetCard
                    key={sweet._id}
                    sweet={sweet}
                    onPurchase={handlePurchaseSweet}
                    onUpdate={user?.role === 'admin' ? setEditingSweet : undefined}
                    onDelete={user?.role === 'admin' ? handleDeleteSweet : undefined}
                  />
                ))}
              </div>
            )}

            {pagination && pagination.pages > 1 && (
              <div className='flex justify-center mt-8'>
                <div className='flex space-x-2'>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handleSearch({ page })}
                      className={`px-3 py-2 rounded-md ${
                        page === pagination.page
                          ? 'bg-raspberry text-white'
                          : 'bg-white text-cocoa hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title='Add New Sweet'
          size='lg'
        >
          <SweetForm
            onSubmit={handleCreateSweet}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>

        <Modal
          isOpen={!!editingSweet}
          onClose={() => setEditingSweet(null)}
          title='Edit Sweet'
          size='lg'
        >
          {editingSweet && (
            <SweetForm
              sweet={editingSweet}
              onSubmit={handleUpdateSweet}
              onCancel={() => setEditingSweet(null)}
            />
          )}
        </Modal>

        <Modal
          isOpen={!!showRestockModal}
          onClose={() => setShowRestockModal(null)}
          title={`Restock ${showRestockModal?.name}`}
        >
          {showRestockModal && (
            <div className='p-6'>
              <p className='text-gray-600 mb-4'>
                Current stock: <span className='font-semibold'>{showRestockModal.quantity}</span>
              </p>
              
              <div className='mb-6'>
                <label className='block text-sm font-medium text-cocoa mb-2'>
                  Quantity to Add
                </label>
                <input
                  type='number'
                  min='1'
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(Number(e.target.value))}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-raspberry focus:border-raspberry'
                />
              </div>

              <div className='flex justify-end space-x-3'>
                <Button
                  variant='secondary'
                  onClick={() => setShowRestockModal(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant='primary'
                  onClick={handleRestockSweet}
                >
                  Restock
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};