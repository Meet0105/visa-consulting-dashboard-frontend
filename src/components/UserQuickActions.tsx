import React from 'react';

interface UserQuickActionsProps {
  // No specific props needed for now, as content is static
}

export const UserQuickActions: React.FC<UserQuickActionsProps> = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Application Tips</h3>
          <p className="card-subtitle">Helpful information for your applications</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">Complete Documentation</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ensure all required documents are submitted to avoid delays.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">Track Your Status</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Regularly check your application status for updates.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">Contact Support</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Reach out to support for any questions or issues.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Important Links</h3>
          <p className="card-subtitle">Quick access to essential resources</p>
        </div>
        <div className="space-y-4">
          <a href="#" className="flex items-center space-x-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            <span>Visa Requirements Guide</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <span>Appointment Scheduling</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <span>Payment Portal</span>
          </a>
        </div>
      </div>
    </div>
  );
};