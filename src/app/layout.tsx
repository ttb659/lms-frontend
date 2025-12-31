import './globals.css';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { AuthProvider } from '@/components/AuthProvider';
import ToastProvider from '@/components/ToastProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LMS Platform - Learning Management System',
  description: 'A modern learning management system built with microservices architecture',
  keywords: 'lms, learning, courses, education, microservices',
  authors: [{ name: 'LMS Team' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 lg:ml-64 pt-16">
                <div className="p-4 sm:p-6 lg:p-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}