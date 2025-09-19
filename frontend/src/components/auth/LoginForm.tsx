import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='w-full max-w-md mx-auto'
    >
      <div className='bg-white rounded-lg shadow-2xl p-8'>
        <div className='text-center mb-8'>
          <h2 className='text-xl font-bold text-cocoa'>LOGIN TO FUDGE!</h2>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <Input
            label='Email Address'
            name='email'
            type='email'
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder='Enter your email'
            required
          />

          <div className='relative'>
            <Input
              label='Password'
              name='password'
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder='Enter your password'
              required
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-4 top-[40px] text-gray-400 hover:text-gray-600'
            >
              {showPassword ? (
                <EyeSlashIcon className='h-5 w-5' />
              ) : (
                <EyeIcon className='h-5 w-5' />
              )}
            </button>
          </div>

          <Button
            type='submit'
            variant='secondary'
            size='md'
            isLoading={isLoading}
            className='w-full'
          >
            Sign In
          </Button>
        </form>

        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-600'>
            Don't have an account?{' '}
            <Link to='/register' className='text-raspberry hover:underline font-medium'>
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};