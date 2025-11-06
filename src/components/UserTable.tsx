import React from 'react';
import { UserRow } from '@/types/types';

interface UserTableProps {
  users: UserRow[];
  isLoading: boolean;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
}) => {
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'badge badge-danger';
      case 'MANAGER':
        return 'badge badge-info';
      case 'USER':
        return 'badge badge-success';
      default:
        return 'badge badge-gray';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">User Management</h2>
        <p className="card-subtitle">Overview of all users in the system</p>
      </div>
      
      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="spinner w-8 h-8 mx-auto mb-2"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400">No users found</p>
          </div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{user.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
                </div>
                <span className={getRoleBadgeClass(user.role)}>{user.role}</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-600">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Workspace:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">{user.workspace?.name || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Apps:</span>
                  <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">{user._count?.applications || 0}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="table-auto w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Workspace</th>
              <th className="px-6 py-3 text-center">Applications</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-8">
                  <div className="spinner w-8 h-8 mx-auto mb-2"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-400">No users found</p>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-600 dark:text-gray-400">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getRoleBadgeClass(user.role)}>{user.role}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900 dark:text-gray-100">{user.workspace?.name || "N/A"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-semibold text-sm">
                      {user._count?.applications || 0}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;