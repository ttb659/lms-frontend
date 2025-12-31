import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

// Définition du type pour le payload JWT
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
  
  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8088',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Intercepteur de requêtes
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Intercepteur de réponses
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newToken = await this.refreshToken();
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            this.logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Méthodes pour la gestion des tokens
  private getAccessToken(): string | null {
    return Cookies.get('access_token') || null;
  }

  private setTokens(accessToken: string) {
    const decoded = this.decodeJwt<JwtPayload>(accessToken);
    const expirationTime = new Date(decoded.exp * 1000);

    Cookies.set('access_token', accessToken, {
      expires: expirationTime,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }

  private clearTokens() {
    Cookies.remove('access_token');
  }

  private decodeJwt<T>(token: string): T {
    return JSON.parse(atob(token.split('.')[1])) as T;
  }

  // Méthode de refresh token (supprimée pour simplification, à ne plus utiliser)
  private async refreshToken(): Promise<string> {
    // Code simplifié : pas de gestion de refresh ici, Keycloak gère tout cela.
    throw new Error("No refresh token used anymore");
  }

    // Method to handle user logout (added back)
  private logout() {
    this.clearTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/login'; // Redirect to login page
    }
  }

  
  // =====================
  // MÉTHODES USER
  // =====================
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

  // =====================
  // MÉTHODES COURSES
  // =====================
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

  // =====================
  // MÉTHODES INSCRIPTIONS
  // =====================
  async getEnrollments(params?: any) {
    try {
      const response = await this.client.get('/enrollments', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createEnrollment(data: any) {
    try {
      const response = await this.client.post('/enrollments', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

const apiClient = new ApiClient();
export default apiClient;
