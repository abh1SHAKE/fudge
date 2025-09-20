import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/shared/Button';

export const NotFound: React.FC = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center'
      >
        <h1 className='text-9xl font-bold text-raspberry mb-4'>404</h1>
        <h2 className='text-3xl font-bold text-cocoa mb-4'>Page Not Found</h2>
        <p className='text-gray-600 mb-8'>
          Sorry, we couldn't find the sweet treat you were looking for.
        </p>
        <Link to='/'>
          <Button variant='primary' size='lg'>
            Go Back Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};