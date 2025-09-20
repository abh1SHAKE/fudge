import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CakeIcon, SparklesIcon, UsersIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/shared/Button';

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: CakeIcon,
      title: 'Candyverse Unlocked',
      description: 'From gummies to fudges to things your dentist fears. All in one place.',
    },
    {
      icon: SparklesIcon,
      title: 'Quality So Good, Willy Wonka Called',
      description: 'Only the fanciest, most magical ingredients make the cut.',
    },
    {
      icon: UsersIcon,
      title: 'Sweet Squad Approved',
      description: 'Thousands of sugar-addicts can’t be wrong. Join the cult.',
    },
    {
      icon: LockClosedIcon,
      title: 'Safe As a Cookie Jar With a Padlock',
      description: 'We keep your payments safer than grandma’s secret fudge recipe.',
    },
  ];

  return (
    <div className='min-h-screen'>
      <section className='bg-gradient-to-br from-raspberry to-caramel text-white py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='text-4xl md:text-6xl text-cocoa font-bold praise mb-2'
            >
              Sugar Rush, No Apologies.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='text-md md:text-xl font-semibold mb-12 text-cocoa'
            >
              Making dentists nervous since 2025!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='flex flex-col sm:flex-row gap-4 justify-center'
            >
              {isAuthenticated ? (
                <Link to='/dashboard'>
                  <Button variant='secondary' size='lg'>
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to='/register'>
                    <Button variant='secondary' size='md' className=''>
                      Get Started
                    </Button>
                  </Link>
                  <Link to='/login'>
                    <Button variant='primary' size='md' className='bg-transparent border-2 border-white hover:text-raspberry'>
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <section className='py-20 bg-cream'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='md:text-3xl font-bold text-cocoa mb-4'>
              Why Fudge!?
            </h2>
            <p className='text-xl text-cocoa'>
              Because boring candy is a crime and we’re the sweetest law-breakers in town.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className='bg-cream rounded-lg p-6 shadow-2xl text-center'
              >
                <feature.icon className='h-8 w-8 text-raspberry mx-auto mb-8' />
                <h3 className='text-xl font-semibold text-cocoa mb-2 cursor-default'>{feature.title}</h3>
                <p className='text-gray-600 cursor-default'>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};