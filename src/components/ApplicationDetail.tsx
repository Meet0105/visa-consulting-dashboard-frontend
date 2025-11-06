'use client';

import { useState } from 'react';
import { Application, ApplicationStatus } from '@/types/types';

type ApplicationDetailProps = {
  application: Application;
  userRole: 'ADMIN' | 'MANAGER' | 'USER';
  onUpdate: () => void;
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

export default function ApplicationDetail({ application, userRole, onUpdate }: ApplicationDetailProps) {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [statusForm, setStatusForm] = useState({
    status: application.status,
    notes: '',
    rejectionReason: '',
  });

  const [notesForm, setNotesForm] = useState({
    counselorNotes: application.counselorNotes || '',
  });

  const canUpdateStatus = userRole === 'MANAGER' || userRole === 'ADMIN';
  const canAddNotes = userRole === 'MANAGER' || userRole === 'ADMIN';

  const handleStatusUpdate = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:4000/applications/${application.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(statusForm),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update status');
      }

      setShowStatusModal(false);
      onUpdate();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNotesUpdate = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:4000/applications/${application.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(notesForm),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update notes');
      }

      setShowNotesModal(false);
      onUpdate();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{application.serviceType}</h1>
            <p className="text-blue-100">Application ID: {application.id.slice(0, 8)}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium border ${statusColors[application.status]} bg-white`}>
            {statusLabels[application.status]}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {canUpdateStatus && (
        <div className="flex gap-3">
          <button
            onClick={() => setShowStatusModal(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Update Status
          </button>
          {canAddNotes && (
            <button
              onClick={() => setShowNotesModal(true)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Add Notes
            </button>
          )}
        </div>
      )}

      {/* Application Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">Service Type</div>
            <div className="text-base font-medium text-gray-900">{application.serviceType}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Preferred Country</div>
            <div className="text-base font-medium text-gray-900">{application.preferredCountry}</div>
          </div>
          {application.university && (
            <div>
              <div className="text-sm text-gray-500 mb-1">University</div>
              <div className="text-base font-medium text-gray-900">{application.university}</div>
            </div>
          )}
          {application.program && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Program</div>
              <div className="text-base font-medium text-gray-900">{application.program}</div>
            </div>
          )}
          {application.intendedStartDate && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Intended Start Date</div>
              <div className="text-base font-medium text-gray-900">
                {new Date(application.intendedStartDate).toLocaleDateString()}
              </div>
            </div>
          )}
          {application.intendedDuration && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Duration</div>
              <div className="text-base font-medium text-gray-900">{application.intendedDuration} months</div>
            </div>
          )}
          <div>
            <div className="text-sm text-gray-500 mb-1">Created</div>
            <div className="text-base font-medium text-gray-900">
              {new Date(application.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Last Updated</div>
            <div className="text-base font-medium text-gray-900">
              {new Date(application.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Student Information */}
      {userRole !== 'USER' && application.user && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Name</div>
              <div className="text-base font-medium text-gray-900">{application.user.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Email</div>
              <div className="text-base font-medium text-gray-900">{application.user.email}</div>
            </div>
            {application.user.phoneNumber && (
              <div>
                <div className="text-sm text-gray-500 mb-1">Phone</div>
                <div className="text-base font-medium text-gray-900">{application.user.phoneNumber}</div>
              </div>
            )}
            {application.user.nationality && (
              <div>
                <div className="text-sm text-gray-500 mb-1">Nationality</div>
                <div className="text-base font-medium text-gray-900">{application.user.nationality}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Counselor Information */}
      {application.assignedManager && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Assigned Counselor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Name</div>
              <div className="text-base font-medium text-gray-900">{application.assignedManager.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Email</div>
              <div className="text-base font-medium text-gray-900">{application.assignedManager.email}</div>
            </div>
          </div>
        </div>
      )}

      {/* Counselor Notes */}
      {application.counselorNotes && (
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Counselor Notes</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{application.counselorNotes}</p>
        </div>
      )}

      {/* Rejection Reason */}
      {application.rejectionReason && (
        <div className="bg-red-50 rounded-xl border border-red-200 p-6">
          <h2 className="text-lg font-semibold text-red-900 mb-2">Rejection Reason</h2>
          <p className="text-red-700">{application.rejectionReason}</p>
        </div>
      )}

      {/* Status History */}
      {application.statusHistory && application.statusHistory.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status History</h2>
          <div className="space-y-4">
            {application.statusHistory.map((history) => (
              <div key={history.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusColors[history.newStatus]}`}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{statusLabels[history.newStatus]}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(history.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Changed by {history.changedByName} ({history.changedByRole})
                  </div>
                  {history.notes && (
                    <div className="mt-2 text-sm text-gray-700 bg-gray-50 rounded p-2">
                      {history.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <h3 className="text-xl font-bold">Update Application Status</h3>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value as ApplicationStatus })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PENDING_REVIEW">Pending Review</option>
                  <option value="ASSIGNED_TO_COUNSELOR">Assigned to Counselor</option>
                  <option value="DOCUMENTS_PENDING">Documents Pending</option>
                  <option value="DOCUMENTS_VERIFIED">Documents Verified</option>
                  <option value="SUBMITTED_TO_EMBASSY">Submitted to Embassy</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={statusForm.notes}
                  onChange={(e) => setStatusForm({ ...statusForm, notes: e.target.value })}
                  rows={3}
                  placeholder="Add notes about this status change..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {statusForm.status === 'REJECTED' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason</label>
                  <textarea
                    value={statusForm.rejectionReason}
                    onChange={(e) => setStatusForm({ ...statusForm, rejectionReason: e.target.value })}
                    rows={3}
                    placeholder="Explain why the application was rejected..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
              <h3 className="text-xl font-bold">Add Counselor Notes</h3>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={notesForm.counselorNotes}
                  onChange={(e) => setNotesForm({ ...notesForm, counselorNotes: e.target.value })}
                  rows={5}
                  placeholder="Add internal notes about this application..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowNotesModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNotesUpdate}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
