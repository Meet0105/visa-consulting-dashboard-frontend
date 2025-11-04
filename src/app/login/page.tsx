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
    onSuccess: (data) => {
      setMessage({ text: "Login successful! Redirecting...", type: "success" });
      // Token is stored in httpOnly cookie by backend, no need to store in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      // Use window.location for a hard redirect to ensure middleware runs properly
      setTimeout(() => {
        const role = data.user.role;
        window.location.href = dashboardRoutes[role];
      }, 500);
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
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
          Demo Accounts
        </h3>
        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
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
    </AuthFormLayout>
  );
}