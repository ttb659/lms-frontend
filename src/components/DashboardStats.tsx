'use client';

import { 
  UsersIcon, 
  BookOpenIcon, 
  UserGroupIcon, 
  BanknotesIcon 
} from '@heroicons/react/24/outline';
import { DashboardStats as DashboardStatsType } from '@/types';
import { formatNumber, formatCurrency } from '@/utils';

interface DashboardStatsProps {
  stats: DashboardStatsType;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      name: 'Total Utilisateurs',
      value: formatNumber(stats.totalUsers),
      icon: UsersIcon,
      color: 'bg-primary-500',
      trend: '+12%',
      trendType: 'up' as const,
    },
    {
      name: 'Cours Disponibles',
      value: formatNumber(stats.totalCourses),
      icon: BookOpenIcon,
      color: 'bg-success-500',
      trend: '+5%',
      trendType: 'up' as const,
    },
    {
      name: 'Inscriptions',
      value: formatNumber(stats.totalEnrollments),
      icon: UserGroupIcon,
      color: 'bg-warning-500',
      trend: '+18%',
      trendType: 'up' as const,
    },
    {
      name: 'Revenus Totaux',
      value: formatCurrency(stats.totalRevenue),
      icon: BanknotesIcon,
      color: 'bg-accent-500',
      trend: '+25%',
      trendType: 'up' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <div
          key={stat.name}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className={`${stat.color} rounded-lg p-3`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600 truncate">
                {stat.name}
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span
              className={`text-sm font-medium ${
                stat.trendType === 'up' ? 'text-success-600' : 'text-error-600'
              }`}
            >
              {stat.trend}
            </span>
            <span className="ml-2 text-sm text-gray-500">vs mois dernier</span>
          </div>
        </div>
      ))}
    </div>
  );
}