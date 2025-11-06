'use client';

import { Application } from '@/types/types';
import { useRouter } from 'next/navigation';

type ApplicationsListProps = {
  applications: Application[];
  userRole: 'ADMIN' | 'MANAGER' | 'USER';
};

const statusColors: Record<string, string> = {
  PENDING_REVIEW: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  ASSIGNED_TO_COUNSELOR: 'bg-blue-100 text-blue-800 border-blue-200',
  DOCUMENTS_PENDING: 'bg-orange-100 text-orange-800 border-orange-200',
  DOCUMENTS_VERIFIED: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  SUBMITTED_TO_EMBASSY: 'bg-purple-100 text-purple-800 border-purple-200',
  APPROVED: 'bg-green-100 text-green-800 border-green-200',
  REJECTED: 'bg-red-100 text-red-800 border-red-200',
  CLOSED: 'bg-gray-100 text-gray-800 border-gray-200',
};

const statusLabels: Record<string, string> = {
  PENDING_REVIEW: 'Pending Review',
  ASSIGNED_TO_COUNSELOR: 'Assigned to Counselor',
  DOCUMENTS_PENDING: 'Documents Pending',
  DOCUMENTS_VERIFIED: 'Documents Verified',
  SUBMITTED_TO_EMBASSY: 'Submitted to Embassy',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CLOSED: 'Closed',
};

export default function ApplicationsList({ applications, userRole }: ApplicationsListProps) {
  const router = useRouter();

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No applications found</h3>
        <p className="text-gray-500">
          {userRole === 'USER' 
            ? 'Create your first application to get started' 
            : 'No applications to display'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <div
          key={application.id}
          onClick={() => router.push(`/dashboard/applications/${application.id}`)}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {application.serviceType}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[application.status]}`}>
                  {statusLabels[application.status]}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {application.preferredCountry}
                </span>
                {application.university && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {application.university}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                Created {new Date(application.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
            {userRole !== 'USER' && application.user && (
              <div>
                <div className="text-xs text-gray-500 mb-1">Student</div>
                <div className="text-sm font-medium text-gray-900">{application.user.name}</div>
              </div>
            )}
            {application.assignedManager && (
              <div>
                <div className="text-xs text-gray-500 mb-1">Counselor</div>
                <div className="text-sm font-medium text-gray-900">{application.assignedManager.name}</div>
              </div>
            )}
            {!application.assignedManager && userRole === 'USER' && (
              <div>
                <div className="text-xs text-gray-500 mb-1">Counselor</div>
                <div className="text-sm text-gray-400 italic">Not assigned yet</div>
              </div>
            )}
            <div>
              <div className="text-xs text-gray-500 mb-1">Documents</div>
              <div className="text-sm font-medium text-gray-900">
                {application._count?.documents || 0} uploaded
              </div>
            </div>
            {application.priority && (
              <div>
                <div className="text-xs text-gray-500 mb-1">Priority</div>
                <div className={`text-sm font-medium ${
                  application.priority === 'URGENT' ? 'text-red-600' : 
                  application.priority === 'NORMAL' ? 'text-blue-600' : 
                  'text-gray-600'
                }`}>
                  {application.priority}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-end">
            <span className="text-sm text-blue-600 group-hover:text-blue-700 font-medium flex items-center gap-1">
              View Details
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
