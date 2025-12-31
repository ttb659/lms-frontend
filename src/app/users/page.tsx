'use client';

export default function UsersPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900">Utilisateurs</h1>
        <p className="mt-2 text-gray-600">
          Gérez les utilisateurs de la plateforme
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Gestion des utilisateurs
        </h3>
        <p className="text-gray-500 mb-6">
          Cette section permet de gérer les utilisateurs, rôles et permissions
        </p>
        <div className="space-y-3 max-w-md mx-auto">
          <div className="bg-gray-50 rounded-lg p-3 text-left">
            <p className="text-sm text-gray-600">
              <strong>Administrateurs:</strong> Accès complet à la plateforme
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-left">
            <p className="text-sm text-gray-600">
              <strong>Instructeurs:</strong> Création et gestion des cours
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-left">
            <p className="text-sm text-gray-600">
              <strong>Étudiants:</strong> Accès aux cours et inscriptions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}