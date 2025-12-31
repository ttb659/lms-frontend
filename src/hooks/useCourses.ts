import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api-client';
import { Course, CourseFilters, PaginationParams, ApiError } from '@/types';

interface UseCoursesOptions {
  autoFetch?: boolean;
  pagination?: PaginationParams;
  filters?: CourseFilters;
}

export const useCourses = (options: UseCoursesOptions = {}) => {
  const { autoFetch = true, pagination = { page: 0, size: 10 }, filters = {} } = options;

  const [courses, setCourses] = useState<Course[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchCourses = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getCourses({
        ...pagination,
        ...filters,
        ...params,
      });
      
      setCourses(response.content || response.data?.content || response);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to fetch courses',
        code: err.response?.data?.code,
        status: err.response?.status,
      });
    } finally {
      setLoading(false);
    }
  }, [pagination, filters]);

  const fetchCourseById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getCourseById(id);
      setCourse(response);
      return response;
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to fetch course',
        code: err.response?.data?.code,
        status: err.response?.status,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCourse = useCallback(async (courseData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.createCourse(courseData);
      await fetchCourses();
      return response;
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to create course',
        code: err.response?.data?.code,
        status: err.response?.status,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCourses]);

  const updateCourse = useCallback(async (id: string, courseData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.updateCourse(id, courseData);
      await fetchCourses();
      if (course && course.id === id) {
        setCourse(response);
      }
      return response;
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to update course',
        code: err.response?.data?.code,
        status: err.response?.status,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCourses, course]);

  const deleteCourse = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.deleteCourse(id);
      await fetchCourses();
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to delete course',
        code: err.response?.data?.code,
        status: err.response?.status,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCourses]);

  const searchCourses = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getCourses({
        search: searchTerm,
        ...pagination,
      });
      setCourses(response.content || response.data?.content || response);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to search courses',
        code: err.response?.data?.code,
        status: err.response?.status,
      });
    } finally {
      setLoading(false);
    }
  }, [pagination]);

  useEffect(() => {
    if (autoFetch) {
      fetchCourses();
    }
  }, [autoFetch, fetchCourses]);

  return {
    courses,
    course,
    loading,
    error,
    totalPages,
    totalElements,
    fetchCourses,
    fetchCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    searchCourses,
    setError,
  };
};

export const useCourseCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock categories for demo - in real app, this would be an API call
      const mockCategories = [
        'Développement Web',
        'Data Science',
        'Design',
        'Marketing',
        'Business',
        'Photographie',
        'Musique',
        'Santé & Fitness',
        'Cuisine',
        'Langues',
      ];
      setCategories(mockCategories);
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to fetch categories',
        code: err.response?.data?.code,
        status: err.response?.status,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, fetchCategories };
};