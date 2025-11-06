'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import ApplicationDetail from '@/components/ApplicationDetail';
import AssignCounselorModal from '@/components/AssignCounselorModal';
import DocumentList from '@/components/DocumentList';
import DocumentUpload from '@/components/DocumentUpload';
import { Application } from '@/types/types';
import { getApiUrl } from '@/lib/config';

export default function ApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.id as string;

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState<'ADMIN' | 'MANAGER' | 'USER'>('USER');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchUserRole();
    fetchApplication();
  }, [applicationId]);

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

  const fetchApplication = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${getApiUrl()}/applications/${applicationId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Application not found');
        }
        throw new Error('Failed to fetch application');
      }

      const data = await response.json();
      setApplication(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading application...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !application) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error || 'Application not found'}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Applications
        </button>

        {/* Admin Actions */}
        {userRole === 'ADMIN' && !application.assignedManagerId && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-yellow-900">No Counselor Assigned</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  This application needs a counselor to be assigned
                </p>
              </div>
              <button
                onClick={() => setShowAssignModal(true)}
                className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
              >
                Assign Counselor
              </button>
            </div>
          </div>
        )}

        {/* Application Detail */}
        <ApplicationDetail
          application={application}
          userRole={userRole}
          onUpdate={fetchApplication}
        />

        {/* Documents Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
            {userRole === 'USER' && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                + Upload Document
              </button>
            )}
          </div>
          {application.documents && application.documents.length > 0 ? (
            <DocumentList
              documents={application.documents}
              isLoading={false}
              onRefresh={fetchApplication}
              canVerify={userRole === 'MANAGER' || userRole === 'ADMIN'}
              showUser={userRole !== 'USER'}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No documents uploaded yet
            </div>
          )}
        </div>

        {/* Assign Counselor Modal */}
        {showAssignModal && (
          <AssignCounselorModal
            applicationId={applicationId}
            currentCounselorId={application.assignedManagerId}
            onSuccess={() => {
              setShowAssignModal(false);
              fetchApplication();
            }}
            onCancel={() => setShowAssignModal(false)}
          />
        )}

        {/* Upload Document Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Upload Document</h2>
                  <p className="text-blue-100 mt-1">Add documents to your application</p>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <DocumentUpload
                  applicationId={applicationId}
                  onUploadSuccess={() => {
                    setShowUploadModal(false);
                    fetchApplication();
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
