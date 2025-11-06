"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from '@tanstack/react-query';
import AuthFormLayout from "@/components/AuthFormLayout";
import AuthFormInput from "@/components/AuthFormInput";
import AuthFormSelect from "@/components/AuthFormSelect";
import AuthFormButton from "@/components/AuthFormButton";
import AuthFormMessage from "@/components/AuthFormMessage";



export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER" as "ADMIN" | "MANAGER" | "USER"
  });
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const router = useRouter();



  const signupMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await api.post("/auth/signup", userData);
      return response.data;
    },
    onSuccess: () => {
      setMessage({ text: "Account created successfully! Redirecting to login...", type: "success" });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    },
    onError: (error: any) => {
      setMessage({
        text: error.response?.data?.error || "Failed to create account",
        type: "error"
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ text: "Password must be at least 6 characters long", type: "error" });
      return;
    }

    setMessage(null);
    signupMutation.mutate({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <AuthFormLayout
      title="Create Account"
      subtitle="Join our visa consulting platform"
      footerContent={
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthFormMessage message={message} />

        <AuthFormInput
          label="Full Name"
          id="name"
          name="name"
          type="text"
          required
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleInputChange}
          autoComplete="off"
        />

        <AuthFormInput
          label="Email Address"
          id="email"
          name="email"
          type="email"
          required
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          autoComplete="off"
        />

        <AuthFormInput
          label="Password"
          id="password"
          name="password"
          type="password"
          required
          placeholder="Create a password (min 6 characters)"
          value={formData.password}
          onChange={handleInputChange}
          autoComplete="off"
        />

        <AuthFormInput
          label="Confirm Password"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          autoComplete="off"
        />

        <AuthFormSelect
          label="Role"
          id="role"
          name="role"
          required
          value={formData.role}
          onChange={handleInputChange}
          autoComplete="off"
        >
          <option value="USER">User</option>
          <option value="MANAGER">Manager</option>
          <option value="ADMIN">Admin</option>
        </AuthFormSelect>



        <AuthFormButton isLoading={signupMutation.isPending}>
          Sign Up
        </AuthFormButton>
      </form>
    </AuthFormLayout>
  );
}