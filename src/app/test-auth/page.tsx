"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function TestAuthPage() {
  const [cookieInfo, setCookieInfo] = useState<any>(null);
  const [testResult, setTestResult] = useState<string>("");

  useEffect(() => {
    // Check if cookie exists
    const cookies = document.cookie;
    setCookieInfo({ allCookies: cookies });
  }, []);

  const testLogin = async () => {
    try {
      setTestResult("Testing login...");
      const response = await api.post("/auth/login", {
        email: "alice@admin.com",
        password: "admin123"
      });
      setTestResult("Login successful! Response: " + JSON.stringify(response.data));
      
      // Check cookies after login
      setTimeout(() => {
        const cookies = document.cookie;
        setCookieInfo({ allCookies: cookies, afterLogin: true });
      }, 1000);
    } catch (error: any) {
      setTestResult("Login failed: " + error.message);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>
      
      <div className="mb-4">
        <button 
          onClick={testLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test Login
        </button>
      </div>

      <div className="mb-4">
        <h2 className="font-bold">Test Result:</h2>
        <pre className="bg-gray-100 p-4 rounded">{testResult}</pre>
      </div>

      <div>
        <h2 className="font-bold">Cookie Info:</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(cookieInfo, null, 2)}
        </pre>
        <p className="text-sm text-gray-600 mt-2">
          Note: httpOnly cookies won't show in document.cookie
        </p>
      </div>
    </div>
  );
}
