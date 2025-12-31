import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

interface JwtPayload {
  exp: number;
  iat: number;
  sub: string;
  realm_access?: {
    roles: string[];
  };
  email?: string;
  given_name?: string;
  family_name?: string;
  preferred_username?: string;
}

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (reason: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest);
            }).catch(err => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshToken();
            this.processQueue(null, newToken);
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            this.logout();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any, token: string | null) {
    this.failedQueue.forEach(promise => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  private getAccessToken(): string | null {
    return Cookies.get('access_token') || null;
  }

  private getRefreshToken(): string | null {
    return Cookies.get('refresh_token') || null;
  }

  private async refreshToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await this.client.post('/auth/refresh', {
        refreshToken,
      });

      const { access_token, refresh_token } = response.data;
      this.setTokens(access_token, refresh_token);
      return access_token;
    } catch (error) {
      throw error;
    }
  }

  private setTokens(accessToken: string, refreshToken?: string) {
    const decoded = jwtDecode<JwtPayload>(accessToken);
    const expirationTime = new Date(decoded.exp * 1000);

    Cookies.set('access_token', accessToken, {
      expires: expirationTime,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    if (refreshToken) {
      const refreshDecoded = jwtDecode<JwtPayload>(refreshToken);
      const refreshExpirationTime = new Date(refreshDecoded.exp * 1000);

      Cookies.set('refresh_token', refreshToken, {
        expires: refreshExpirationTime,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    }
  }

  private clearTokens() {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
  }

  private logout() {
    this.clearTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  // Authentication methods
  async login(username: string, password: string) {
    try {
      const response = await this.client.post('/auth/login', {
        username,
        password,
      });

      const { access_token, refresh_token, user } = response.data;
      this.setTokens(access_token, refresh_token);
      return { user, access_token, refresh_token };
    } catch (error) {
      throw error;
    }
  }

  async register(userData: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) {
    try {
      const response = await this.client.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async logoutUser() {
    try {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        await this.client.post('/auth/logout', {
          refreshToken,
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.logout();
    }
  }

  // User methods
  async getCurrentUser() {
    try {
      const response = await this.client.get('/users/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getUsers(params?: any) {
    try {
      const response = await this.client.get('/users', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      const response = await this.client.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createUser(userData: any) {
    try {
      const response = await this.client.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: string, userData: any) {
    try {
      const response = await this.client.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      const response = await this.client.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Course methods
  async getCourses(params?: any) {
    try {
      const response = await this.client.get('/courses', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCourseById(id: string) {
    try {
      const response = await this.client.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createCourse(courseData: any) {
    try {
      const response = await this.client.post('/courses', courseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateCourse(id: string, courseData: any) {
    try {
      const response = await this.client.put(`/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteCourse(id: string) {
    try {
      const response = await this.client.delete(`/courses/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Enrollment methods
  async getEnrollments(params?: any) {
    try {
      const response = await this.client.get('/enrollments', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getEnrollmentById(id: string) {
    try {
      const response = await this.client.get(`/enrollments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createEnrollment(enrollmentData: any) {
    try {
      const response = await this.client.post('/enrollments', enrollmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateEnrollment(id: string, enrollmentData: any) {
    try {
      const response = await this.client.put(`/enrollments/${id}`, enrollmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteEnrollment(id: string) {
    try {
      const response = await this.client.delete(`/enrollments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Payment methods
  async getPayments(params?: any) {
    try {
      const response = await this.client.get('/payments', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getPaymentById(id: string) {
    try {
      const response = await this.client.get(`/payments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createPayment(paymentData: any) {
    try {
      const response = await this.client.post('/payments', paymentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updatePayment(id: string, paymentData: any) {
    try {
      const response = await this.client.put(`/payments/${id}`, paymentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deletePayment(id: string) {
    try {
      const response = await this.client.delete(`/payments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Analytics methods
  async getDashboardStats() {
    try {
      const response = await this.client.get('/analytics/dashboard');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getEnrollmentsByCourse() {
    try {
      const response = await this.client.get('/analytics/enrollments/by-course');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getRevenueByCourse() {
    try {
      const response = await this.client.get('/analytics/revenue/by-course');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getEnrollmentsCount() {
    try {
      const response = await this.client.get('/analytics/enrollments/count');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic request method
  async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return await this.client.request<T>(config);
    } catch (error) {
      throw error;
    }
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;