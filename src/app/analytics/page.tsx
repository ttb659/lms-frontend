'use client';

import { useRealTimeAnalytics } from '@/hooks/useAnalytics';
import DashboardStats from '@/components/DashboardStats';
import DashboardCharts from '@/components/DashboardCharts';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AnalyticsPage() {
  const { 
    stats, 
    analyticsData, 
    loading, 
    error, 
    getConversionRate,
    getAverageRevenuePerUser,
    getEnrollmentGrowthRate,
    getRevenueGrowthRate 
  } = useRealTimeAnalytics();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-error-50 border border-error-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-error-800">Erreur</h2>
          <p className="text-error-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-gray-600">
          Analysez les performances de votre plateforme de formation
        </p>
      </div>

      {/* Key Metrics */}
      <DashboardStats stats={stats} />

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Taux de conversion</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {getConversionRate().toFixed(1)}%
          </p>
          <p className="mt-1 text-sm text-success-600">+2.5% vs mois dernier</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Revenu moyen par utilisateur</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {getAverageRevenuePerUser().toFixed(0)}€
          </p>
          <p className="mt-1 text-sm text-success-600">+8.3% vs mois dernier</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Croissance des inscriptions</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {getEnrollmentGrowthRate().toFixed(1)}%
          </p>
          <p className="mt-1 text-sm text-success-600">+{getRevenueGrowthRate().toFixed(1)}% revenus</p>
        </div>
      </div>

      {/* Charts */}
      <DashboardCharts data={analyticsData} />

      {/* Top Performing Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cours les plus populaires
          </h3>
          <div className="space-y-3">
            {analyticsData.enrollmentsByCourse.length > 0 ? (
              analyticsData.enrollmentsByCourse
                .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
                .slice(0, 5)
                .map((course, index) => (
                  <div key={course.courseId} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 w-6">
                        #{index + 1}
                      </span>
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {course.courseTitle}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {course.enrollmentCount} inscriptions
                    </span>
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-500">Aucune donnée disponible</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cours les plus rentables
          </h3>
          <div className="space-y-3">
            {analyticsData.revenueByCourse.length > 0 ? (
              analyticsData.revenueByCourse
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5)
                .map((course, index) => (
                  <div key={course.courseId} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 w-6">
                        #{index + 1}
                      </span>
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {course.courseTitle}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatCurrency(course.revenue)}
                    </span>
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-500">Aucune donnée disponible</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}