'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Course } from '@/types';
import { formatCurrency, truncateText } from '@/utils';
import Button from '@/components/Button';
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface CourseCardProps {
  course: Course;
  onUpdate?: () => void;
}

export default function CourseCard({ course, onUpdate }: CourseCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Course Image */}
      <div className="relative h-48 bg-gray-200">
        {!imageError && course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
            <svg
              className="h-16 w-16 text-primary-400"
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
          </div>
        )}
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              course.isPublished
                ? 'bg-success-100 text-success-800'
                : 'bg-warning-100 text-warning-800'
            }`}
          >
            {course.isPublished ? 'Publié' : 'Brouillon'}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-4">
        {/* Category */}
        <div className="mb-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            {course.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          <Link href={`/courses/${course.id}`} className="hover:text-primary-600">
            {course.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {truncateText(course.description, 100)}
        </p>

        {/* Instructor */}
        <div className="flex items-center mb-3">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {course.instructor.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{course.instructor}</p>
          </div>
        </div>

        {/* Course Details */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{course.duration}h de formation</span>
          <div className="flex space-x-2">
            {course.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
            {course.tags.length > 2 && (
              <span className="text-xs text-gray-500">
                +{course.tags.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">
            {formatCurrency(course.price)}
          </span>
          <div className="flex space-x-2">
            <Link href={`/courses/${course.id}`}>
              <Button
                icon={EyeIcon}
                variant="ghost"
                size="sm"
                className="p-2"
              />
            </Link>
            <Link href={`/courses/${course.id}/edit`}>
              <Button
                icon={PencilIcon}
                variant="ghost"
                size="sm"
                className="p-2"
              />
            </Link>
            <Button
              icon={TrashIcon}
              variant="ghost"
              size="sm"
              className="p-2 text-error-600 hover:text-error-700"
              onClick={() => {
                if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
                  // Handle delete
                  console.log('Delete course:', course.id);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}