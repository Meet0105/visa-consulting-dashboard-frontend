'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { getApiUrl } from '@/lib/config';

type AnalyticsData = {
  summary?: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    successRate: string;
  };
  overview?: {
    users?: number;
    managers?: number;
    appsTotal?: number;
    approved?: number;
    rejected?: number;
    pending?: number;
    documentsPending?: number;
    approvalRate?: string;
    rejectionRate?: string;
  };
  recentActivity?: {
    period?: string;
    newApplications?: number;
    myAssignedApplications?: number;
  };
  applications?: Array<{
    id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    country: string;
    assignedManager: {
      name: string;
      email: string;
    } | null;
  }>;
  countryBreakdown?: Array<{ country: string; count: number }>;
  monthlyTrend?: Array<{ month: string; total: number; approved: number; rejected: number; pending: number }>;
  counselorPerformance?: Array<{
    id: string;
    name: string;
    email: string;
    country: string;
    students: number;
    approved: number;
    pending: number;
    rejected: number;
    successRate: string;
  }>;
  upcomingAppointments?: Array<{
    id: string;
    studentName: string;
    purpose: string;
    date: string;
    time: string;
    meetingType: string;
  }>;
  studentList?: Array<{
    studentName: string;
    studentEmail: string;
    country: string;
    status: string;
    lastUpdated: string;
  }>;
  alerts?: string[];
};

export default function AnalyticsPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  useEffect(() => {
    fetchUserRole();
  }, []);

  useEffect(() => {
    if (userRole) {
      fetchAnalytics();
    }
  }, [userRole, selectedCountry]);

  const fetchUserRole = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/users/me`, {
        credentials: 'include',
      });

      if (!response.ok) {
        router.push('/login');
        return;
      }

      const data = await response.json();
      setUserRole(data.role);
    } catch (err) {
      console.error('Error fetching user role:', err);
      router.push('/login');
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');

    try {
      let url = `${getApiUrl()}/analytics`;
      
      if (userRole === 'MANAGER') {
        url += '/mine';
      } else if (userRole === 'USER') {
        url += '/me';
      } else if (selectedCountry) {
        url += `?country=${selectedCountry}`;
      }

      const response = await fetch(url, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading analytics...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  if (!analytics) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {userRole === 'ADMIN' ? 'System Analytics' : userRole === 'MANAGER' ? 'My Performance' : 'My Progress'}
            </h1>
            <p className="text-gray-600 mt-1">
              {userRole === 'ADMIN' ? 'Comprehensive system insights and performance metrics' : 
               userRole === 'MANAGER' ? 'Your counseling performance and student progress' :
               'Track your application progress'}
            </p>
          </div>

          {/* Country Filter for Admin */}
          {userRole === 'ADMIN' && (
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Countries</option>
              {analytics.countryBreakdown?.map((item) => (
                <option key={item.country} value={item.country}>
                  {item.country}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Alerts */}
        {analytics.alerts && analytics.alerts.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">📢 Notifications</h3>
            <ul className="space-y-1">
              {analytics.alerts.map((alert, index) => (
                <li key={index} className="text-blue-800 text-sm">• {alert}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="text-blue-100 text-sm font-medium">Total Applications</div>
            <div className="text-4xl font-bold mt-2">
              {analytics.summary?.total || analytics.overview?.appsTotal || 0}
            </div>
            <div className="text-blue-100 text-sm mt-2">
              {analytics.recentActivity?.newApplications || 0} new in last {analytics.recentActivity?.period || '30 days'}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="text-green-100 text-sm font-medium">Approved</div>
            <div className="text-4xl font-bold mt-2">
              {analytics.summary?.approved || analytics.overview?.approved || 0}
            </div>
            <div className="text-green-100 text-sm mt-2">
              Success Rate: {analytics.summary?.successRate || analytics.overview?.approvalRate || '0%'}
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
            <div className="text-yellow-100 text-sm font-medium">Pending</div>
            <div className="text-4xl font-bold mt-2">
              {analytics.summary?.pending || analytics.overview?.pending || 0}
            </div>
            <div className="text-yellow-100 text-sm mt-2">
              Awaiting review
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
            <div className="text-red-100 text-sm font-medium">Rejected</div>
            <div className="text-4xl font-bold mt-2">
              {analytics.summary?.rejected || analytics.overview?.rejected || 0}
            </div>
            <div className="text-red-100 text-sm mt-2">
              Rejection Rate: {analytics.overview?.rejectionRate || '0%'}
            </div>
          </div>
        </div>

        {/* Additional Metrics for Admin/Manager */}
        {(userRole === 'ADMIN' || userRole === 'MANAGER') && analytics.overview?.documentsPending !== undefined && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userRole === 'ADMIN' && (
              <>
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                  <div className="text-gray-600 text-sm font-medium">Total Students</div>
                  <div className="text-3xl font-bold text-gray-900 mt-2">{analytics.overview?.users || 0}</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                  <div className="text-gray-600 text-sm font-medium">Total Counselors</div>
                  <div className="text-3xl font-bold text-gray-900 mt-2">{analytics.overview?.managers || 0}</div>
                </div>
              </>
            )}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="text-gray-600 text-sm font-medium">Documents Pending</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">{analytics.overview?.documentsPending || 0}</div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Country Breakdown */}
          {analytics.countryBreakdown && analytics.countryBreakdown.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications by Country</h3>
              <div className="space-y-3">
                {analytics.countryBreakdown.slice(0, 5).map((item) => {
                  const total = analytics.summary?.total || analytics.overview?.appsTotal || 1;
                  return (
                    <div key={item.country}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{item.country}</span>
                        <span className="font-semibold text-gray-900">{item.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(item.count / total) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Monthly Trend */}
          {analytics.monthlyTrend && analytics.monthlyTrend.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend (Last 6 Months)</h3>
              <div className="space-y-2">
                {analytics.monthlyTrend.map((item) => (
                  <div key={item.month} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 w-20">{item.month}</span>
                    <div className="flex-1 flex gap-1 ml-4">
                      <div className="bg-green-500 h-6 rounded" style={{ width: `${(item.approved / item.total) * 100}%` }} title={`Approved: ${item.approved}`} />
                      <div className="bg-yellow-500 h-6 rounded" style={{ width: `${(item.pending / item.total) * 100}%` }} title={`Pending: ${item.pending}`} />
                      <div className="bg-red-500 h-6 rounded" style={{ width: `${(item.rejected / item.total) * 100}%` }} title={`Rejected: ${item.rejected}`} />
                    </div>
                    <span className="font-semibold text-gray-900 w-12 text-right">{item.total}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded" />
                  <span>Approved</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded" />
                  <span>Pending</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded" />
                  <span>Rejected</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Counselor Performance Table (Admin Only) */}
        {userRole === 'ADMIN' && analytics.counselorPerformance && analytics.counselorPerformance.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Counselor Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Counselor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Top Country</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Students</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Approved</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Pending</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Rejected</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Success Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analytics.counselorPerformance.map((counselor) => (
                    <tr key={counselor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{counselor.name}</div>
                        <div className="text-sm text-gray-500">{counselor.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{counselor.country}</td>
                      <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">{counselor.students}</td>
                      <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">{counselor.approved}</td>
                      <td className="px-6 py-4 text-center text-sm text-yellow-600 font-semibold">{counselor.pending}</td>
                      <td className="px-6 py-4 text-center text-sm text-red-600 font-semibold">{counselor.rejected}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          parseFloat(counselor.successRate) >= 80 ? 'bg-green-100 text-green-800' :
                          parseFloat(counselor.successRate) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {counselor.successRate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Upcoming Appointments (Manager Only) */}
        {userRole === 'MANAGER' && analytics.upcomingAppointments && analytics.upcomingAppointments.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {analytics.upcomingAppointments.map((apt) => (
                <div key={apt.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-900">{apt.studentName}</div>
                      <div className="text-sm text-gray-600">{apt.purpose}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{new Date(apt.date).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-600">{apt.time}</div>
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {apt.meetingType}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Applications (Student Only) */}
        {userRole === 'USER' && analytics.applications && analytics.applications.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">My Applications</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Counselor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analytics.applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{app.country}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          app.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {app.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {app.assignedManager ? app.assignedManager.name : 'Not assigned'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(app.updatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Student List (Manager Only) */}
        {userRole === 'MANAGER' && analytics.studentList && analytics.studentList.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">My Students</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analytics.studentList.map((student, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{student.studentName}</div>
                        <div className="text-sm text-gray-500">{student.studentEmail}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{student.country}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          student.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {student.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(student.lastUpdated).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
