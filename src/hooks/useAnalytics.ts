import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api-client';
import { DashboardStats, AnalyticsData, ApiError } from '@/types';

interface UseAnalyticsOptions {
  autoFetch?: boolean;
  refreshInterval?: number; // in milliseconds
}

export const useAnalytics = (options: UseAnalyticsOptions = {}) => {
  const { autoFetch = true, refreshInterval } = options;

  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    enrollmentsThisMonth: 0,
    revenueThisMonth: 0,
  });

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    enrollmentsByCourse: [],
    revenueByCourse: [],
    enrollmentsOverTime: [],
    revenueOverTime: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getDashboardStats();
      setStats(response);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to fetch dashboard stats',
        code: err.response?.data?.code,
        status: err.response?.status,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEnrollmentsByCourse = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getEnrollmentsByCourse();
      setAnalyticsData(prev => ({
        ...prev,
        enrollmentsByCourse: response,
      }));
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to fetch enrollments by course',
        code: err.response?.data?.code,
        status: err.response?.status,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRevenueByCourse = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getRevenueByCourse();
      setAnalyticsData(prev => ({
        ...prev,
        revenueByCourse: response,
      }));
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to fetch revenue by course',
        code: err.response?.data?.code,
        status: err.response?.status,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEnrollmentsCount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getEnrollmentsCount();
      setStats(prev => ({
        ...prev,
        totalEnrollments: response,
      }));
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to fetch enrollments count',
        code: err.response?.data?.code,
        status: err.response?.status,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsResponse, enrollmentsResponse, revenueResponse, countResponse] = await Promise.all([
        apiClient.getDashboardStats(),
        apiClient.getEnrollmentsByCourse(),
        apiClient.getRevenueByCourse(),
        apiClient.getEnrollmentsCount(),
      ]);

      setStats({
        ...statsResponse,
        totalEnrollments: countResponse,
      });

      setAnalyticsData({
        enrollmentsByCourse: enrollmentsResponse,
        revenueByCourse: revenueResponse,
        enrollmentsOverTime: [], // Would need separate endpoint
        revenueOverTime: [], // Would need separate endpoint
      });

      setLastUpdated(new Date());
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to fetch analytics',
        code: err.response?.data?.code,
        status: err.response?.status,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate derived metrics
  const getEnrollmentGrowthRate = useCallback(() => {
    // Mock calculation - in real app, would compare with previous period
    return Math.random() * 20 - 5; // Random between -5% and 15%
  }, []);

  const getRevenueGrowthRate = useCallback(() => {
    // Mock calculation - in real app, would compare with previous period
    return Math.random() * 30 - 10; // Random between -10% and 20%
  }, []);

  const getAverageRevenuePerUser = useCallback(() => {
    if (stats.totalUsers === 0) return 0;
    return stats.totalRevenue / stats.totalUsers;
  }, [stats.totalRevenue, stats.totalUsers]);

  const getConversionRate = useCallback(() => {
    if (stats.totalUsers === 0) return 0;
    return (stats.totalEnrollments / stats.totalUsers) * 100;
  }, [stats.totalEnrollments, stats.totalUsers]);

  const getTopPerformingCourses = useCallback(() => {
    return analyticsData.enrollmentsByCourse
      .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
      .slice(0, 5);
  }, [analyticsData.enrollmentsByCourse]);

  const getTopRevenueCourses = useCallback(() => {
    return analyticsData.revenueByCourse
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [analyticsData.revenueByCourse]);

  const getEnrollmentStats = useCallback(() => {
    const total = stats.totalEnrollments;
    const thisMonth = stats.enrollmentsThisMonth;
    const lastMonth = total - thisMonth;
    
    return {
      total,
      thisMonth,
      lastMonth,
      growthRate: lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0,
    };
  }, [stats.totalEnrollments, stats.enrollmentsThisMonth]);

  const getRevenueStats = useCallback(() => {
    const total = stats.totalRevenue;
    const thisMonth = stats.revenueThisMonth;
    const lastMonth = total - thisMonth;
    
    return {
      total,
      thisMonth,
      lastMonth,
      growthRate: lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0,
    };
  }, [stats.totalRevenue, stats.revenueThisMonth]);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoFetch) {
      fetchAllAnalytics();
    }
  }, [autoFetch, fetchAllAnalytics]);

  useEffect(() => {
    if (refreshInterval && autoFetch) {
      const interval = setInterval(fetchAllAnalytics, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, autoFetch, fetchAllAnalytics]);

  return {
    stats,
    analyticsData,
    loading,
    error,
    lastUpdated,
    fetchDashboardStats,
    fetchEnrollmentsByCourse,
    fetchRevenueByCourse,
    fetchEnrollmentsCount,
    fetchAllAnalytics,
    getEnrollmentGrowthRate,
    getRevenueGrowthRate,
    getAverageRevenuePerUser,
    getConversionRate,
    getTopPerformingCourses,
    getTopRevenueCourses,
    getEnrollmentStats,
    getRevenueStats,
    setError,
  };
};

// Hook for real-time updates
export const useRealTimeAnalytics = (refreshInterval: number = 30000) => {
  const analytics = useAnalytics({ 
    autoFetch: true, 
    refreshInterval 
  });

  return analytics;
};