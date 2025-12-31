'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Notification } from '@/types';

interface ToastContextType {
  showToast: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Notification[]>([]);

  const showToast = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newToast: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    toasts.forEach(toast => {
      const duration = toast.duration || 5000;
      setTimeout(() => {
        removeToast(toast.id);
      }, duration);
    });
  }, [toasts]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return CheckCircleIcon;
      case 'error':
        return ExclamationCircleIcon;
      case 'warning':
        return ExclamationCircleIcon;
      case 'info':
        return InformationCircleIcon;
    }
  };

  const getColors = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-success-50 border-success-200 text-success-800';
      case 'error':
        return 'bg-error-50 border-error-200 text-error-800';
      case 'warning':
        return 'bg-warning-50 border-warning-200 text-warning-800';
      case 'info':
        return 'bg-primary-50 border-primary-200 text-primary-800';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => {
          const Icon = getIcon(toast.type);
          return (
            <div
              key={toast.id}
              className={`max-w-sm w-full ${getColors(toast.type)} border rounded-lg shadow-lg p-4 animate-slide-up`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium">{toast.title}</h3>
                  <p className="mt-1 text-sm">{toast.message}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="inline-flex text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}