import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api-client';
import { Enrollment, EnrollmentStatus, PaginationParams, ApiError } from '@/types';

interface UseEnrollmentsOptions {
  autoFetch?: boolean;
  pagination?: PaginationParams;
  userId?: string;
  courseId?: string;
}

export const useEnrollments = (options: UseEnrollmentsOptions = {}) => {
  const { autoFetch = true, pagination = { page: 0, size: 10 }, userId, courseId } = options;

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchEnrollments = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getEnrollments({
        ...pagination,
        userId,
        courseId,
        ...params,
      });
      
      setEnrollments(response.content || response.data?.content || response);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to fetch enrollments',
        code: err.response?.data?.code,
        status: err.response?.status,
      });
    } finally {
      setLoading(false);
    }
  }, [pagination, userId, courseId]);

  const fetchEnrollmentById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getEnrollmentById(id);
      setEnrollment(response);
      return response;
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to fetch enrollment',
        code: err.response?.data?.code,
        status: err.response?.status,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createEnrollment = useCallback(async (enrollmentData: {
    userId: string;
    courseId: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.createEnrollment(enrollmentData);
      await fetchEnrollments();
      return response;
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to create enrollment',
        code: err.response?.data?.code,
        status: err.response?.status,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchEnrollments]);

  const updateEnrollment = useCallback(async (id: string, enrollmentData: {
    status?: EnrollmentStatus;
    progress?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.updateEnrollment(id, enrollmentData);
      await fetchEnrollments();
      if (enrollment && enrollment.id === id) {
        setEnrollment(response);
      }
      return response;
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to update enrollment',
        code: err.response?.data?.code,
        status: err.response?.status,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchEnrollments, enrollment]);

  const deleteEnrollment = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.deleteEnrollment(id);
      await fetchEnrollments();
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to delete enrollment',
        code: err.response?.data?.code,
        status: err.response?.status,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchEnrollments]);

  const enrollInCourse = useCallback(async (courseId: string, userId: string) => {
    return createEnrollment({ userId, courseId });
  }, [createEnrollment]);

  const updateProgress = useCallback(async (enrollmentId: string, progress: number) => {
    return updateEnrollment(enrollmentId, { progress });
  }, [updateEnrollment]);

  const completeCourse = useCallback(async (enrollmentId: string) => {
    return updateEnrollment(enrollmentId, { 
      status: EnrollmentStatus.COMPLETED, 
      progress: 100 
    });
  }, [updateEnrollment]);

  const cancelEnrollment = useCallback(async (enrollmentId: string) => {
    return updateEnrollment(enrollmentId, { 
      status: EnrollmentStatus.CANCELLED 
    });
  }, [updateEnrollment]);

  const getEnrollmentsByStatus = useCallback((status: EnrollmentStatus) => {
    return enrollments.filter(enrollment => enrollment.status === status);
  }, [enrollments]);

  const getEnrollmentsByUser = useCallback((userId: string) => {
    return enrollments.filter(enrollment => enrollment.userId === userId);
  }, [enrollments]);

  const getEnrollmentsByCourse = useCallback((courseId: string) => {
    return enrollments.filter(enrollment => enrollment.courseId === courseId);
  }, [enrollments]);

  const getActiveEnrollments = useCallback(() => {
    return enrollments.filter(enrollment => 
      enrollment.status === EnrollmentStatus.ACTIVE || 
      enrollment.status === EnrollmentStatus.PENDING
    );
  }, [enrollments]);

  const getCompletedEnrollments = useCallback(() => {
    return enrollments.filter(enrollment => 
      enrollment.status === EnrollmentStatus.COMPLETED
    );
  }, [enrollments]);

  const getCompletionRate = useCallback(() => {
    if (enrollments.length === 0) return 0;
    const completed = getCompletedEnrollments().length;
    return (completed / enrollments.length) * 100;
  }, [enrollments, getCompletedEnrollments]);

  useEffect(() => {
    if (autoFetch) {
      fetchEnrollments();
    }
  }, [autoFetch, fetchEnrollments]);

  return {
    enrollments,
    enrollment,
    loading,
    error,
    totalPages,
    totalElements,
    fetchEnrollments,
    fetchEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
    enrollInCourse,
    updateProgress,
    completeCourse,
    cancelEnrollment,
    getEnrollmentsByStatus,
    getEnrollmentsByUser,
    getEnrollmentsByCourse,
    getActiveEnrollments,
    getCompletedEnrollments,
    getCompletionRate,
    setError,
  };
};