'use client';

import { useState, useEffect } from 'react';
import { Counselor } from '@/types/types';
import { getApiUrl } from '@/lib/config';

type AssignCounselorModalProps = {
  applicationId: string;
  currentCounselorId?: string | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function AssignCounselorModal({
  applicationId,
  currentCounselorId,
  onSuccess,
  onCancel,
}: AssignCounselorModalProps) {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [selectedCounselorId, setSelectedCounselorId] = useState(currentCounselorId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/users?role=MANAGER`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch counselors');
      }

      const data = await response.json();
      // The API returns { users: [...], pagination: {...} }
      setCounselors(data.users || data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAssign = async () => {
    if (!selectedCounselorId) {
      setError('Please select a counselor');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${getApiUrl()}/applications/${applicationId}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ counselorId: selectedCounselorId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to assign counselor');
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <h3 className="text-xl font-bold">Assign Counselor</h3>
          <p className="text-blue-100 mt-1">Select a counselor to handle this application</p>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Counselor <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedCounselorId}
              onChange={(e) => setSelectedCounselorId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a counselor...</option>
              {counselors.map((counselor) => (
                <option key={counselor.id} value={counselor.id}>
                  {counselor.name} - {counselor.email}
                </option>
              ))}
            </select>
          </div>

          {counselors.length === 0 && !error && (
            <div className="text-sm text-gray-500 text-center py-4">
              Loading counselors...
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={loading || !selectedCounselorId}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Assigning...' : 'Assign Counselor'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
