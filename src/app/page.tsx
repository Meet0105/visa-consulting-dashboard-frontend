import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-wide py-16">
        <div className="max-w-4xl mx-auto text-center">

          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-lg mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Visa Consulting Dashboard
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Streamline your visa application process with our comprehensive management system
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="card">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Secure & Reliable</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Enterprise-grade security for your sensitive visa data</p>
              </div>
            </div>

            <div className="card">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Fast Processing</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Streamlined workflows for quicker application processing</p>
              </div>
            </div>

            <div className="card">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Multi-Role Access</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Admin, Manager, and User roles for complete control</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/login" 
                className="btn-primary"
              >
                Get Started
              </Link>
              
              <Link 
                href="/signup" 
                className="btn-secondary"
              >
                Create Account
              </Link>
            </div>

            <div className="card max-w-md mx-auto">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 text-center">Demo Credentials</h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Admin:</span>
                  <span className="font-mono">alice@admin.com / admin123</span>
                </div>
                <div className="flex justify-between">
                  <span>Manager:</span>
                  <span className="font-mono">bob@manager.com / manager123</span>
                </div>
                <div className="flex justify-between">
                  <span>User:</span>
                  <span className="font-mono">david@user.com / user123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
