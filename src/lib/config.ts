// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const getApiUrl = () => {
  // In production, use environment variable
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_URL || 'https://visa-consulting-dashboard-backend.vercel.app';
  }
  // In development, use localhost
  return 'http://localhost:4000';
};
