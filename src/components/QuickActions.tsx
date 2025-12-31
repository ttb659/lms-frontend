'use client';

import {
  PlusIcon,
  UserPlusIcon,
  DocumentTextIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import Button from '@/components/Button';

export default function QuickActions() {
  const actions = [
    {
      name: 'Créer un cours',
      description: 'Ajouter une nouvelle formation',
      icon: PlusIcon,
      href: '/courses/new',
      color: 'bg-primary-500',
    },
    {
      name: 'Inscrire un étudiant',
      description: 'Gérer les inscriptions',
      icon: UserPlusIcon,
      href: '/enrollments',
      color: 'bg-success-500',
    },
    {
      name: 'Générer un rapport',
      description: 'Exporter les données',
      icon: DocumentTextIcon,
      href: '/analytics',
      color: 'bg-warning-500',
    },
    {
      name: 'Voir les statistiques',
      description: 'Analyser les performances',
      icon: ChartBarIcon,
      href: '/analytics',
      color: 'bg-accent-500',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Actions rapides</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <Button
              key={action.name}
              href={action.href}
              variant="ghost"
              className="flex flex-col items-center justify-center p-6 text-center hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors duration-200"
            >
              <div className={`${action.color} rounded-lg p-3 mb-3`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">
                {action.name}
              </h4>
              <p className="text-xs text-gray-500">
                {action.description}
              </p>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}