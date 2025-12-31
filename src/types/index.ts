// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: 'ADMIN' | 'STUDENT' | 'INSTRUCTOR';
  description: string;
}

export interface UserRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
}

// Course Types
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number;
  price: number;
  category: string;
  tags: string[];
  thumbnailUrl?: string;
  videoUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseRequest {
  title: string;
  description: string;
  instructor: string;
  duration: number;
  price: number;
  category: string;
  tags: string[];
  thumbnailUrl?: string;
  videoUrl?: string;
  isPublished?: boolean;
}

export interface CourseFilters {
  category?: string;
  instructor?: string;
  minPrice?: number;
  maxPrice?: number;
  isPublished?: boolean;
  search?: string;
}

// Enrollment Types
export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  enrolledAt: string;
  completedAt?: string;
  progress: number;
  course?: Course;
  user?: User;
}

export enum EnrollmentStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface EnrollmentRequest {
  userId: string;
  courseId: string;
}

// Payment Types
export interface Payment {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
  course?: Course;
  user?: User;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface PaymentRequest {
  userId: string;
  courseId: string;
  amount: number;
  currency?: string;
  paymentMethod: string;
}

// Analytics Types
export interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  enrollmentsThisMonth: number;
  revenueThisMonth: number;
}

export interface EnrollmentByCourse {
  courseId: string;
  courseTitle: string;
  enrollmentCount: number;
}

export interface RevenueByCourse {
  courseId: string;
  courseTitle: string;
  revenue: number;
}

export interface AnalyticsData {
  enrollmentsByCourse: EnrollmentByCourse[];
  revenueByCourse: RevenueByCourse[];
  enrollmentsOverTime: Array<{
    date: string;
    count: number;
  }>;
  revenueOverTime: Array<{
    date: string;
    amount: number;
  }>;
}

// Auth Types
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  accessToken: string;
  refreshToken?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'ASC' | 'DESC';
}

// Search Types
export interface SearchParams extends PaginationParams {
  search?: string;
  filters?: Record<string, any>;
}

// UI Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  duration?: number;
}

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<any>;
  children?: MenuItem[];
  roles?: string[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ value: any; label: string }>;
  validation?: any;
}

// Chart Data Types
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

// Keycloak Types
export interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
}

export interface KeycloakToken {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error: ApiError | null;
}

// Table Types
export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string | number;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selected: string[]) => void;
}