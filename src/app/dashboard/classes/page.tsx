'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { getApiUrl } from '@/lib/config';

type Class = {
  id: string;
  title: string;
  description?: string;
  classType: string;
  instructor: string;
  startDateTime: string;
  endDateTime: string;
  duration: number;
  mode: string;
  capacity: number;
  location?: string;
  meetingLink?: string;
  country?: string;
  level?: string;
  status: string;
  _count: {
    registrations: number;
    attendance: number;
  };
  isRegistered?: boolean;
  registrationStatus?: string;
};

export default function ClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    fetchUserRole();
  }, []);

  useEffect(() => {
    if (userRole) {
      fetchClasses();
    }
  }, [userRole, filter]);

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

  const fetchClasses = async () => {
    setLoading(true);
    setError('');

    try {
      let url = `${getApiUrl()}/classes`;
      
      if (filter === 'upcoming') {
        url += '?upcoming=true';
      } else if (filter !== 'all') {
        url += `?status=${filter.toUpperCase()}`;
      }

      const response = await fetch(url, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch classes');
      }

      const data = await response.json();
      setClasses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (classId: string) => {
    try {
      const response = await fetch(`${getApiUrl()}/classes/${classId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to register');
      }

      alert('Successfully registered for class!');
      fetchClasses();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUnregister = async (classId: string) => {
    if (!confirm('Are you sure you want to unregister from this class?')) return;

    try {
      const response = await fetch(`${getApiUrl()}/classes/${classId}/register`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to unregister');
      }

      alert('Successfully unregistered from class');
      fetchClasses();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading classes...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">IELTS & Training Classes</h1>
            <p className="text-gray-600 mt-1">
              {userRole === 'USER' ? 'Browse and register for upcoming classes' : 'Manage training sessions and classes'}
            </p>
          </div>

          {(userRole === 'ADMIN' || userRole === 'MANAGER') && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg"
            >
              + Create New Class
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'upcoming'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Classes
          </button>
        </div>

        {/* Classes Grid */}
        {classes.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-lg">No classes found</p>
            {userRole !== 'USER' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Create your first class
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className={`h-2 ${
                  cls.status === 'UPCOMING' ? 'bg-green-500' :
                  cls.status === 'ONGOING' ? 'bg-blue-500' :
                  cls.status === 'COMPLETED' ? 'bg-gray-400' :
                  'bg-red-500'
                }`} />
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900">{cls.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      cls.mode === 'ONLINE' ? 'bg-blue-100 text-blue-800' :
                      cls.mode === 'IN_PERSON' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {cls.mode.replace('_', ' ')}
                    </span>
                  </div>

                  {cls.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{cls.description}</p>
                  )}

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{cls.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(cls.startDateTime).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{cls.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>{cls._count.registrations} / {cls.capacity} registered</span>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      cls.classType === 'IELTS' ? 'bg-red-100 text-red-800' :
                      cls.classType === 'TOEFL' ? 'bg-blue-100 text-blue-800' :
                      cls.classType === 'SPOKEN_ENGLISH' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {cls.classType.replace('_', ' ')}
                    </span>
                    {cls.country && (
                      <span className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-full font-semibold">
                        {cls.country}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {userRole === 'USER' && (
                      <>
                        {cls.isRegistered ? (
                          <button
                            onClick={() => handleUnregister(cls.id)}
                            className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                          >
                            Unregister
                          </button>
                        ) : cls._count.registrations >= cls.capacity ? (
                          <button
                            disabled
                            className="w-full px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed font-medium"
                          >
                            Class Full
                          </button>
                        ) : cls.status === 'UPCOMING' ? (
                          <button
                            onClick={() => handleRegister(cls.id)}
                            className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                          >
                            Register Now
                          </button>
                        ) : (
                          <button
                            disabled
                            className="w-full px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed font-medium"
                          >
                            {cls.status}
                          </button>
                        )}
                      </>
                    )}

                    {(userRole === 'ADMIN' || userRole === 'MANAGER') && (
                      <button
                        onClick={() => router.push(`/dashboard/classes/${cls.id}`)}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Manage Class
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Class Modal - Will be implemented in next component */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <h3 className="text-xl font-bold">Create New Class</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Create class form will be here...</p>
              <button
                onClick={() => setShowCreateModal(false)}
                className="mt-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
