"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardHeader from "@/components/DashboardHeader";
import DocumentUpload from "@/components/DocumentUpload";
import DocumentList from "@/components/DocumentList";
import { api } from "@/lib/api";
import { Document } from "@/types/types";

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get("/documents/my");
      setDocuments(data.documents);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter((doc) => {
    if (filter === "all") return true;
    return doc.status === filter;
  });

  const stats = {
    total: documents.length,
    pending: documents.filter((d) => d.status === "PENDING_REVIEW").length,
    approved: documents.filter((d) => d.status === "APPROVED").length,
    rejected: documents.filter((d) => d.status === "REJECTED").length,
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container-wide py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <DashboardHeader
            title="My Documents"
            subtitle="Upload and manage your visa documents"
            onLogout={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
          />

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
            <div className="card">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Documents</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stats.total}</p>
              </div>
            </div>
            <div className="card">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{stats.pending}</p>
              </div>
            </div>
            <div className="card">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.approved}</p>
              </div>
            </div>
            <div className="card">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{stats.rejected}</p>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="mb-6 sm:mb-8">
            <DocumentUpload onUploadSuccess={fetchDocuments} />
          </div>

          {/* Filter */}
          <div className="card mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">My Documents</h3>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">Filter:</label>
                <select
                  className="select"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Documents</option>
                  <option value="PENDING_REVIEW">Pending Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Documents List */}
          <DocumentList
            documents={filteredDocuments}
            isLoading={isLoading}
            onRefresh={fetchDocuments}
            canVerify={false}
            showUser={false}
          />
          </div>
        </main>
      </DashboardLayout>
    </AuthGuard>
  );
}
