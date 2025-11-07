'use client';

import { useState } from 'react';
import { getApiUrl } from '@/lib/config';

type CreateClassModalProps = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreateClassModal({ onClose, onSuccess }: CreateClassModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classType: 'IELTS',
    instructor: '',
    startDateTime: '',
    endDateTime: '',
    duration: 60,
    mode: 'ONLINE',
    capacity: 30,
    location: '',
    meetingLink: '',
    country: '',
    level: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${getApiUrl()}/classes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create class');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'capacity' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl sticky top-0">
          <h3 className="text-xl font-bold">Create New Class</h3>
          <p className="text-blue-100 mt-1">Fill in the details to create a new training session</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg">Basic Information</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., IELTS Writing Skills Workshop"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Brief description of the class..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="classType"
                  value={formData.classType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="IELTS">IELTS</option>
                  <option value="TOEFL">TOEFL</option>
                  <option value="GRE">GRE</option>
                  <option value="GMAT">GMAT</option>
                  <option value="PTE">PTE</option>
                  <option value="SPOKEN_ENGLISH">Spoken English</option>
                  <option value="VISA_COUNSELING">Visa Counseling</option>
                  <option value="INTERVIEW_PREP">Interview Preparation</option>
                  <option value="DOCUMENT_WORKSHOP">Document Workshop</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Ms. Patel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg">Schedule</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="startDateTime"
                  value={formData.startDateTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="endDateTime"
                  value={formData.endDateTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="15"
                step="15"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Class Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg">Class Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mode <span className="text-red-500">*</span>
                </label>
                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ONLINE">Online</option>
                  <option value="IN_PERSON">In-Person</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity (max students)
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {formData.mode !== 'ONLINE' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Room 101, Main Building"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {formData.mode !== 'IN_PERSON' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Link (Zoom/Google Meet)
                </label>
                <input
                  type="url"
                  name="meetingLink"
                  value={formData.meetingLink}
                  onChange={handleChange}
                  placeholder="https://zoom.us/j/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Country (optional)
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g., Canada, USA, UK"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level (optional)
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select level...</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
