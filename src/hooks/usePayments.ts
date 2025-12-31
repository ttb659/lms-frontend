import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api-client';
import { Payment, PaymentStatus, PaginationParams, ApiError } from '@/types';

interface UsePaymentsOptions {
  autoFetch?: boolean;
  pagination?: PaginationParams;
  userId?: string;
  courseId?: string;
}

export const usePayments = (options: UsePaymentsOptions = {}) => {
  const { autoFetch = true, pagination = { page: 0, size: 10 }, userId, courseId } = options;

  const [payments, setPayments] = useState<Payment[]>([]);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchPayments = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getPayments({
        ...pagination,
        userId,
        courseId,
        ...params,
      });
      
      const paymentsData = response.content || response.data?.content || response;
      setPayments(paymentsData);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
      
      // Calculate total revenue from PAID payments
      const paidPayments = paymentsData.filter((p: Payment) => p.status === PaymentStatus.PAID);
      const revenue = paidPayments.reduce((sum: number, p: Payment) => sum + p.amount, 0);
      setTotalRevenue(revenue);
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to fetch payments',
        code: err.response?.data?.code,
        status: err.response?.status,
      });
    } finally {
      setLoading(false);
    }
  }, [pagination, userId, courseId]);

  const fetchPaymentById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getPaymentById(id);
      setPayment(response);
      return response;
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to fetch payment',
        code: err.response?.data?.code,
        status: err.response?.status,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPayment = useCallback(async (paymentData: {
    userId: string;
    courseId: string;
    amount: number;
    paymentMethod: string;
    currency?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.createPayment({
        ...paymentData,
        currency: paymentData.currency || 'EUR',
      });
      await fetchPayments();
      return response;
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to create payment',
        code: err.response?.data?.code,
        status: err.response?.status,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPayments]);

  const updatePayment = useCallback(async (id: string, paymentData: {
    status?: PaymentStatus;
    transactionId?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.updatePayment(id, paymentData);
      await fetchPayments();
      if (payment && payment.id === id) {
        setPayment(response);
      }
      return response;
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to update payment',
        code: err.response?.data?.code,
        status: err.response?.status,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPayments, payment]);

  const deletePayment = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.deletePayment(id);
      await fetchPayments();
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || 'Failed to delete payment',
        code: err.response?.data?.code,
        status: err.response?.status,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPayments]);

  const processPayment = useCallback(async (
    courseId: string, 
    userId: string, 
    amount: number,
    paymentMethod: string = 'card'
  ) => {
    return createPayment({
      userId,
      courseId,
      amount,
      paymentMethod,
    });
  }, [createPayment]);

  const confirmPayment = useCallback(async (paymentId: string, transactionId: string) => {
    return updatePayment(paymentId, {
      status: PaymentStatus.PAID,
      transactionId,
    });
  }, [updatePayment]);

  const refundPayment = useCallback(async (paymentId: string) => {
    return updatePayment(paymentId, {
      status: PaymentStatus.REFUNDED,
    });
  }, [updatePayment]);

  const getPaymentsByStatus = useCallback((status: PaymentStatus) => {
    return payments.filter(payment => payment.status === status);
  }, [payments]);

  const getPaymentsByUser = useCallback((userId: string) => {
    return payments.filter(payment => payment.userId === userId);
  }, [payments]);

  const getPaymentsByCourse = useCallback((courseId: string) => {
    return payments.filter(payment => payment.courseId === courseId);
  }, [payments]);

  const getSuccessfulPayments = useCallback(() => {
    return payments.filter(payment => payment.status === PaymentStatus.PAID);
  }, [payments]);

  const getPendingPayments = useCallback(() => {
    return payments.filter(payment => payment.status === PaymentStatus.PENDING);
  }, [payments]);

  const getFailedPayments = useCallback(() => {
    return payments.filter(payment => payment.status === PaymentStatus.FAILED);
  }, [payments]);

  const getRefundedPayments = useCallback(() => {
    return payments.filter(payment => payment.status === PaymentStatus.REFUNDED);
  }, [payments]);

  const getRevenueByCourse = useCallback((courseId: string) => {
    const coursePayments = getPaymentsByCourse(courseId);
    const paidPayments = coursePayments.filter(p => p.status === PaymentStatus.PAID);
    return paidPayments.reduce((sum, payment) => sum + payment.amount, 0);
  }, [getPaymentsByCourse]);

  const getRevenueByUser = useCallback((userId: string) => {
    const userPayments = getPaymentsByUser(userId);
    const paidPayments = userPayments.filter(p => p.status === PaymentStatus.PAID);
    return paidPayments.reduce((sum, payment) => sum + payment.amount, 0);
  }, [getPaymentsByUser]);

  const getPaymentSuccessRate = useCallback(() => {
    if (payments.length === 0) return 0;
    const successful = getSuccessfulPayments().length;
    return (successful / payments.length) * 100;
  }, [payments, getSuccessfulPayments]);

  const getAveragePaymentAmount = useCallback(() => {
    const successfulPayments = getSuccessfulPayments();
    if (successfulPayments.length === 0) return 0;
    return successfulPayments.reduce((sum, payment) => sum + payment.amount, 0) / successfulPayments.length;
  }, [getSuccessfulPayments]);

  useEffect(() => {
    if (autoFetch) {
      fetchPayments();
    }
  }, [autoFetch, fetchPayments]);

  return {
    payments,
    payment,
    loading,
    error,
    totalPages,
    totalElements,
    totalRevenue,
    fetchPayments,
    fetchPaymentById,
    createPayment,
    updatePayment,
    deletePayment,
    processPayment,
    confirmPayment,
    refundPayment,
    getPaymentsByStatus,
    getPaymentsByUser,
    getPaymentsByCourse,
    getSuccessfulPayments,
    getPendingPayments,
    getFailedPayments,
    getRefundedPayments,
    getRevenueByCourse,
    getRevenueByUser,
    getPaymentSuccessRate,
    getAveragePaymentAmount,
    setError,
  };
};