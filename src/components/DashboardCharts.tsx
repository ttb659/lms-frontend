'use client';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { AnalyticsData } from '@/types';
import { formatCurrency } from '@/utils';

interface DashboardChartsProps {
  data: AnalyticsData;
}

const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316'];

export default function DashboardCharts({ data }: DashboardChartsProps) {
  // Mock data for charts
  const enrollmentData = data.enrollmentsByCourse.length > 0 
    ? data.enrollmentsByCourse 
    : [
        { courseTitle: 'JavaScript Avancé', enrollmentCount: 45 },
        { courseTitle: 'React pour débutants', enrollmentCount: 38 },
        { courseTitle: 'Node.js Mastery', enrollmentCount: 32 },
        { courseTitle: 'Design UX/UI', enrollmentCount: 28 },
        { courseTitle: 'Data Science', enrollmentCount: 22 },
      ];

  const revenueData = data.revenueByCourse.length > 0
    ? data.revenueByCourse.map(item => ({
        ...item,
        revenue: item.revenue
      }))
    : [
        { courseTitle: 'JavaScript Avancé', revenue: 2250 },
        { courseTitle: 'React pour débutants', revenue: 1900 },
        { courseTitle: 'Node.js Mastery', revenue: 1600 },
        { courseTitle: 'Design UX/UI', revenue: 1400 },
        { courseTitle: 'Data Science', revenue: 1100 },
      ];

  const monthlyData = [
    { month: 'Jan', enrollments: 65, revenue: 3200 },
    { month: 'Fév', enrollments: 78, revenue: 3800 },
    { month: 'Mar', enrollments: 92, revenue: 4500 },
    { month: 'Avr', enrollments: 87, revenue: 4200 },
    { month: 'Mai', enrollments: 95, revenue: 4800 },
    { month: 'Jun', enrollments: 103, revenue: 5100 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Enrollments by Course Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Inscriptions par cours
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={enrollmentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="courseTitle" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="enrollmentCount" fill="#0ea5e9" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue by Course Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Revenus par cours
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="courseTitle" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip formatter={(value: any) => formatCurrency(value)} />
            <Bar dataKey="revenue" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Évolution mensuelle
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="enrollments"
              stroke="#0ea5e9"
              strokeWidth={2}
              name="Inscriptions"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#22c55e"
              strokeWidth={2}
              name="Revenus (€)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}