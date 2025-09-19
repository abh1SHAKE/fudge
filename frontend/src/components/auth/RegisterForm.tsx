import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';

export const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register(formData.username, formData.email, formData.password);
    } catch (error) {
      console.error('Registration failed:', error);
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
        <div className='text-center mb-4'>
          <h2 className='text-xl font-bold text-cocoa'>REGISTER!</h2>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <Input
            label='Username'
            name='username'
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            placeholder='Choose a username'
            required
          />

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
              placeholder='Create a password'
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

          <Input
            label='Confirm Password'
            name='confirmPassword'
            type={showPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder='Confirm your password'
            required
          />

          <Button
            type='submit'
            variant='primary'
            size='md'
            isLoading={isLoading}
            className='w-full'
          >
            Create Account
          </Button>
        </form>

        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-600'>
            Already have an account?{' '}
            <Link to='/login' className='text-raspberry hover:underline font-medium'>
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};