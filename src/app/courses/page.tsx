'use client';

import { useState } from 'react';
import { useCourses } from '@/hooks/useCourses';
import { useCourseCategories } from '@/hooks/useCourses';
import CourseCard from '@/components/CourseCard';
import CourseFilters from '@/components/CourseFilters';
import LoadingSpinner from '@/components/LoadingSpinner';
import Button from '@/components/Button';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function CoursesPage() {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    isPublished: true,
  });

  const { courses, loading, error, totalElements, fetchCourses } = useCourses({
    filters,
  });

  const { categories } = useCourseCategories();

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cours</h1>
          <p className="mt-2 text-gray-600">
            Découvrez et gérez les formations disponibles
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            href="/courses/new"
            icon={PlusIcon}
            variant="primary"
          >
            Nouveau cours
          </Button>
        </div>
      </div>

      {/* Filters */}
      <CourseFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        categories={categories}
        onSearch={handleSearch}
      />

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        {totalElements} cours trouvés
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      )}

      {/* Courses Grid */}
      {!loading && courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onUpdate={() => fetchCourses()}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && courses.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Aucun cours trouvé
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Essayez de modifier vos filtres de recherche
          </p>
        </div>
      )}
    </div>
  );
}