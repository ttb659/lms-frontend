import { useState, useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import apiClient from '@/lib/api-client';
import { AuthUser, LoginRequest, RegisterRequest, ApiError } from '@/types';

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

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ApiError | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.login(credentials.username, credentials.password);
          const { user, access_token } = response;
          
          const decoded = jwtDecode<JwtPayload>(access_token);
          const roles = decoded.realm_access?.roles || [];

          const authUser: AuthUser = {
            id: user.id || decoded.sub,
            username: user.username || decoded.preferred_username || '',
            email: user.email || decoded.email || '',
            firstName: user.firstName || decoded.given_name || '',
            lastName: user.lastName || decoded.family_name || '',
            roles,
            accessToken: access_token,
          };

          set({
            user: authUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: {
              message: error.response?.data?.message || 'Login failed',
              code: error.response?.data?.code,
              status: error.response?.status,
            },
          });
          throw error;
        }
      },

      register: async (userData: RegisterRequest) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.register(userData);
          set({ isLoading: false, error: null });
        } catch (error: any) {
          set({
            isLoading: false,
            error: {
              message: error.response?.data?.message || 'Registration failed',
              code: error.response?.data?.code,
              status: error.response?.status,
            },
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await apiClient.logoutUser();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      checkAuth: async () => {
        const token = Cookies.get('access_token');
        if (!token) {
          set({ user: null, isAuthenticated: false });
          return;
        }

        try {
          const decoded = jwtDecode<JwtPayload>(token);
          const isExpired = decoded.exp * 1000 < Date.now();
          
          if (isExpired) {
            set({ user: null, isAuthenticated: false });
            return;
          }

          const user = await apiClient.getCurrentUser();
          const roles = decoded.realm_access?.roles || [];

          const authUser: AuthUser = {
            id: user.id || decoded.sub,
            username: user.username || decoded.preferred_username || '',
            email: user.email || decoded.email || '',
            firstName: user.firstName || decoded.given_name || '',
            lastName: user.lastName || decoded.family_name || '',
            roles,
            accessToken: token,
          };

          set({
            user: authUser,
            isAuthenticated: true,
            error: null,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Custom hook for authentication
export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  } = useAuthStore();

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
      setIsChecking(false);
    };

    initializeAuth();
  }, [checkAuth]);

  const hasRole = (role: string): boolean => {
    return user?.roles.includes(role) || false;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return user?.roles.some(role => roles.includes(role)) || false;
  };

  const hasAllRoles = (roles: string[]): boolean => {
    return roles.every(role => user?.roles.includes(role)) || false;
  };

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || isChecking,
    error,
    login,
    register,
    logout,
    checkAuth,
    clearError,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin: hasRole('ADMIN'),
    isInstructor: hasRole('INSTRUCTOR'),
    isStudent: hasRole('STUDENT'),
  };
};

export default useAuth;