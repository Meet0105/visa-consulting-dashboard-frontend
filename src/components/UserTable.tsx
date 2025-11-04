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
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">User Management</h2>
        <p className="card-subtitle">Overview of all users in the system</p>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr className="text-left text-gray-600 dark:text-gray-400">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Workspace</th>
              <th className="px-4 py-2">Applications</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2">{user.workspace?.name || "N/A"}</td>
                  <td className="px-4 py-2">{user._count?.applications || 0}</td>
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