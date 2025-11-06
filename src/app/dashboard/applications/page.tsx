'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import ApplicationsList from '@/components/ApplicationsList';
import ApplicationForm from '@/components/ApplicationForm';
import { Application } from '@/types/types';
import { getApiUrl } from '@/lib/config';

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [userRole, setUserRole] = useState<'ADMIN' | 'MANAGER' | 'USER'>('USER');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUserRole();
    fetchApplications();
  }, []);

  const fetchUserRole = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/users/me`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUserRole(data.role);
      }
    } catch (err) {
      console.error('Error fetching user role:', err);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${getApiUrl()}/applications`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      setApplications(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationCreated = (application: Application) => {
    setShowForm(false);
    fetchApplications();
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return ['PENDING_REVIEW', 'ASSIGNED_TO_COUNSELOR', 'DOCUMENTS_PENDING'].includes(app.status);
    if (filter === 'in-progress') return ['DOCUMENTS_VERIFIED', 'SUBMITTED_TO_EMBASSY'].includes(app.status);
    if (filter === 'completed') return ['APPROVED', 'REJECTED', 'CLOSED'].includes(app.status);
    return true;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => ['PENDING_REVIEW', 'ASSIGNED_TO_COUNSELOR', 'DOCUMENTS_PENDING'].includes(a.status)).length,
    inProgress: applications.filter((a) => ['DOCUMENTS_VERIFIED', 'SUBMITTED_TO_EMBASSY'].includes(a.status)).length,
    approved: applications.filter((a) => a.status === 'APPROVED').length,
    rejected: applications.filter((a) => a.status === 'REJECTED').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {userRole === 'USER' ? 'My Applications' : 'Applications Management'}
            </h1>
            <p className="text-gray-600 mt-1">
              {userRole === 'USER' 
                ? 'Track and manage your visa applications' 
                : userRole === 'MANAGER'
                ? 'Manage applications assigned to you'
                : 'View and manage all applications'}
            </p>
          </div>
          {userRole === 'USER' && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl"
            >
              + New Application
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-sm text-gray-500 mb-1">Total</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
            <div className="text-sm text-yellow-700 mb-1">Pending</div>
            <div className="text-3xl font-bold text-yellow-900">{stats.pending}</div>
          </div>
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <div className="text-sm text-blue-700 mb-1">In Progress</div>
            <div className="text-3xl font-bold text-blue-900">{stats.inProgress}</div>
          </div>
          <div className="bg-green-50 rounded-xl border border-green-200 p-6">
            <div className="text-sm text-green-700 mb-1">Approved</div>
            <div className="text-3xl font-bold text-green-900">{stats.approved}</div>
          </div>
          <div className="bg-red-50 rounded-xl border border-red-200 p-6">
            <div className="text-sm text-red-700 mb-1">Rejected</div>
            <div className="text-3xl font-bold text-red-900">{stats.rejected}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('in-progress')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'in-progress'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-gray-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading applications...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
        ) : (
          <ApplicationsList applications={filteredApplications} userRole={userRole} />
        )}

        {/* Application Form Modal */}
        {showForm && (
          <ApplicationForm
            onSuccess={handleApplicationCreated}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
