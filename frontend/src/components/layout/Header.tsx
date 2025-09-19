import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../shared/Button';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className='bg-cream sticky top-0 z-40'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
        <div className='flex justify-between items-center h-16'>
          <Link to='/' className='flex items-center space-x-2'>
            <div>
              <h1 className='text-4xl font-bold text-cocoa praise'>Fudge!</h1>
            </div>
          </Link>

          <div className='flex items-center space-x-4'>
            {isAuthenticated ? (
              <div className='flex items-center space-x-3'>
                <div className='flex items-center space-x-2'>
                  <span className='text-sm font-medium text-cocoa'>{user?.username}</span>
                  {user?.role === 'admin' && (
                    <span className='bg-raspberry text-white px-2 py-1 rounded-full text-xs'>
                      Admin
                    </span>
                  )}
                </div>
                <Button variant='secondary' size='sm' onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className='flex gap-4'>
                <Link to='/login'>
                  <Button variant='secondary' size='sm'>Login</Button>
                </Link>
                <Link to='/register'>
                  <Button variant='primary' size='sm'>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};