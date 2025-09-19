import React from 'react';
import type { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className='min-h-screen bg-cream poppins'>
      <Header />
      <main className='flex-1'>
        {children}
      </main>
    </div>
  );
};