'use client';

import { useState } from 'react';
import {
  UserPlusIcon,
  BookOpenIcon,
  CreditCardIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import { formatRelativeTime } from '@/utils';

export default function RecentActivity() {
  const [activities] = useState([
    {
      id: 1,
      type: 'enrollment',
      message: 'Nouvelle inscription au cours React pour débutants',
      time: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      icon: UserPlusIcon,
      color: 'bg-primary-100 text-primary-800',
    },
    {
      id: 2,
      type: 'course',
      message: 'Nouveau cours créé: JavaScript Avancé',
      time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      icon: BookOpenIcon,
      color: 'bg-success-100 text-success-800',
    },
    {
      id: 3,
      type: 'payment',
      message: 'Paiement reçu: €49.99 - Formation Node.js',
      time: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      icon: CreditCardIcon,
      color: 'bg-accent-100 text-accent-800',
    },
    {
      id: 4,
      type: 'completion',
      message: 'Cours complété: Design UX/UI par Jean Dupont',
      time: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      icon: AcademicCapIcon,
      color: 'bg-warning-100 text-warning-800',
    },
    {
      id: 5,
      type: 'enrollment',
      message: 'Nouvelle inscription au cours Data Science',
      time: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      icon: UserPlusIcon,
      color: 'bg-primary-100 text-primary-800',
    },
  ]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Activité récente</h3>
      </div>
      <div className="p-6">
        <div className="flow-root">
          <ul className="-mb-4">
            {activities.map((activity, index) => (
              <li key={activity.id} className={index !== activities.length - 1 ? 'mb-4' : ''}>
                <div className="relative pb-4">
                  {index !== activities.length - 1 && (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span
                        className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${activity.color}`}
                      >
                        <activity.icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div>
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {formatRelativeTime(activity.time)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}