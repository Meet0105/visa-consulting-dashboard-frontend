"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import AuthFormLayout from "@/components/AuthFormLayout";
import AuthFormInput from "@/components/AuthFormInput";
import AuthFormButton from "@/components/AuthFormButton";
import AuthFormMessage from "@/components/AuthFormMessage";

type LoginResponse = {
  user: {
    role: "ADMIN" | "MANAGER" | "USER";
  };
  token?: string;
};

const dashboardRoutes: Record<"ADMIN" | "MANAGER" | "USER", string> = {
  ADMIN: "/dashboard/admin",
  MANAGER: "/dashboard/manager",
  USER: "/dashboard/user",
};

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const router = useRouter();

  const loginMutation = useMutation<LoginResponse, any, typeof formData>({
    mutationFn: async (credentials) => {
      const { data } = await api.post<LoginResponse>("/auth/login", credentials);
      return data;
    },
    onSuccess: async (data) => {
      setMessage({ text: "Login successful! Redirecting...", type: "success" });
      
      // Store user info
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Store token if provided (for cross-domain scenarios)
      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log("Token stored in localStorage for cross-domain auth");
        
        // Also set cookie manually for cross-domain scenarios
        document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=None; Secure`;
        console.log("Token cookie set manually");
      }

      // Wait a bit for cookie to be set, then redirect
      await new Promise(resolve => setTimeout(resolve, 1000));
      const role = data.user.role;
      console.log("Redirecting to:", dashboardRoutes[role]);
      window.location.href = dashboardRoutes[role];
    },
    onError: (error: any) => {
      setMessage({
        text: error.response?.data?.error || error.response?.data?.message || "Login failed. Please check your credentials.",
        type: "error"
      });
      console.error("Login error:", error);
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    loginMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <AuthFormLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
      footerContent={
        <div className="text-center space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium">
              Create one here
            </Link>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              ← Back to Home
            </Link>
          </div>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <AuthFormMessage message={message} />

        <AuthFormInput
          label="Email Address"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          required
          disabled={loginMutation.isPending}
        />

        <AuthFormInput
          label="Password"
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter your password"
          required
          disabled={loginMutation.isPending}
        />

        <AuthFormButton isLoading={loginMutation.isPending}>
          Sign In
        </AuthFormButton>
      </form>

      {/* Demo Accounts */}
      <div className="mt-6 sm:mt-8 p-5 sm:p-6 glass-card border-2 border-indigo-100 dark:border-indigo-900/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/50">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Demo Accounts
          </h3>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
            <span className="font-bold text-indigo-700 dark:text-indigo-300">Admin:</span>
            <span className="font-mono text-gray-700 dark:text-gray-300">alice@admin.com / admin123</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
            <span className="font-bold text-blue-700 dark:text-blue-300">Manager:</span>
            <span className="font-mono text-gray-700 dark:text-gray-300">bob@manager.com / manager123</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800/30">
            <span className="font-bold text-green-700 dark:text-green-300">User:</span>
            <span className="font-mono text-gray-700 dark:text-gray-300">david@user.com / user123</span>
          </div>
        </div>
      </div>
    </AuthFormLayout>
  );
}