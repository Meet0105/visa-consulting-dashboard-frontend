import React from 'react';
import { UserProfile } from '@/types/types';

interface UserProfileCardProps {
  me: UserProfile | undefined;
  isLoadingMe: boolean;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ me, isLoadingMe }) => {
  return (
    <div className="card mb-8">
      <div className="card-header">
        <h2 className="card-title">Your Profile</h2>
        <p className="card-subtitle">Personal information and workspace details</p>
      </div>
      
      {isLoadingMe ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="skeleton h-6 w-32"></div>
            <div className="skeleton h-6 w-48"></div>
            <div className="skeleton h-6 w-40"></div>
          </div>
          <div className="space-y-4">
            <div className="skeleton h-6 w-36"></div>
            <div className="skeleton h-6 w-44"></div>
            <div className="skeleton h-6 w-38"></div>
          </div>
        </div>
      ) : me ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Full Name</label>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{me.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email Address</label>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{me.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Role</label>
              <span className="badge badge-info">{me.role}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Workspace</label>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {me.workspace?.name || "Not assigned"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Member Since</label>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {new Date(me.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Account Status</label>
              <span className="badge badge-success">Active</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Unable to load profile information</p>
        </div>
      )}
    </div>
  );
};