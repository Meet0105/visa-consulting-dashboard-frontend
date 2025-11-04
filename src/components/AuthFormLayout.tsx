import React from 'react';

interface AuthFormLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
}

const AuthFormLayout: React.FC<AuthFormLayoutProps> = ({
  title,
  subtitle,
  children,
  footerContent,
}) => {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        </div>

        {/* Form Card */}
        <div className="card">
          {children}
        </div>

        {/* Footer Content (e.g., links to other pages) */}
        {footerContent && (
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            {footerContent}
          </div>
        )}
      </div>
    </main>
  );
};

export default AuthFormLayout;