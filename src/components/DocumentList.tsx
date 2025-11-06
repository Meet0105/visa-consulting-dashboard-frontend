"use client";
import { useState } from "react";
import { Document, DocumentStatus } from "@/types/types";
import { api } from "@/lib/api";

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  onRefresh?: () => void;
  canVerify?: boolean;
  showUser?: boolean;
}

export default function DocumentList({
  documents,
  isLoading,
  onRefresh,
  canVerify = false,
  showUser = false,
}: DocumentListProps) {
  const [verifying, setVerifying] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case "APPROVED":
        return "badge badge-success";
      case "REJECTED":
        return "badge badge-danger";
      case "EXPIRED":
        return "badge badge-gray";
      case "PENDING_REVIEW":
      default:
        return "badge badge-warning";
    }
  };

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case "APPROVED":
        return (
          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "REJECTED":
        return (
          <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "EXPIRED":
        return (
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDownload = async (documentId: string, filename: string) => {
    try {
      const response = await api.get(`/documents/${documentId}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download document");
    }
  };

  const handleVerify = async (documentId: string, status: "APPROVED" | "REJECTED") => {
    let rejectionReason = null;
    
    if (status === "REJECTED") {
      rejectionReason = prompt("Please provide a reason for rejection:");
      if (!rejectionReason) return;
    }

    setVerifying(documentId);
    try {
      await api.patch(`/documents/${documentId}/verify`, {
        status,
        rejectionReason,
      });

      if (onRefresh) {
        onRefresh();
      }
    } catch (error: any) {
      console.error("Verify error:", error);
      alert(error.response?.data?.error || "Failed to verify document");
    } finally {
      setVerifying(null);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

    setDeleting(documentId);
    try {
      await api.delete(`/documents/${documentId}`);
      
      if (onRefresh) {
        onRefresh();
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      alert(error.response?.data?.error || "Failed to delete document");
    } finally {
      setDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No documents found</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">Upload your first document to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(doc.status)}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{doc.originalFilename}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{doc.documentType.replace(/_/g, " ")}</p>
                </div>
              </div>
              <span className={getStatusBadge(doc.status)}>{doc.status.replace(/_/g, " ")}</span>
            </div>

            {showUser && doc.user && (
              <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Uploaded by: <span className="font-medium text-gray-900 dark:text-gray-100">{doc.user.name}</span>
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Size:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">{formatFileSize(doc.fileSize)}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Uploaded:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">{formatDate(doc.createdAt)}</span>
              </div>
              {doc.expiryDate && (
                <div className="col-span-2">
                  <span className="text-gray-500 dark:text-gray-400">Expires:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">{formatDate(doc.expiryDate)}</span>
                </div>
              )}
            </div>

            {doc.rejectionReason && (
              <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm text-red-800 dark:text-red-300">
                <strong>Rejection Reason:</strong> {doc.rejectionReason}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleDownload(doc.id, doc.originalFilename)}
                className="btn-sm btn-primary flex-1"
              >
                Download
              </button>
              
              {canVerify && doc.status === "PENDING_REVIEW" && (
                <>
                  <button
                    onClick={() => handleVerify(doc.id, "APPROVED")}
                    disabled={verifying === doc.id}
                    className="btn-sm btn-success flex-1"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleVerify(doc.id, "REJECTED")}
                    disabled={verifying === doc.id}
                    className="btn-sm btn-danger flex-1"
                  >
                    Reject
                  </button>
                </>
              )}
              
              <button
                onClick={() => handleDelete(doc.id)}
                disabled={deleting === doc.id}
                className="btn-sm btn-secondary"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block card">
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-3">Document</th>
                <th className="px-6 py-3">Type</th>
                {showUser && <th className="px-6 py-3">User</th>}
                <th className="px-6 py-3">Size</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Uploaded</th>
                <th className="px-6 py-3">Expiry</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(doc.status)}
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{doc.originalFilename}</div>
                        {doc.rejectionReason && (
                          <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                            Rejected: {doc.rejectionReason}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {doc.documentType.replace(/_/g, " ")}
                    </span>
                  </td>
                  {showUser && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">{doc.user?.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{doc.user?.email}</div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {formatFileSize(doc.fileSize)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(doc.status)}>{doc.status.replace(/_/g, " ")}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(doc.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {doc.expiryDate ? formatDate(doc.expiryDate) : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDownload(doc.id, doc.originalFilename)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        title="Download"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      
                      {canVerify && doc.status === "PENDING_REVIEW" && (
                        <>
                          <button
                            onClick={() => handleVerify(doc.id, "APPROVED")}
                            disabled={verifying === doc.id}
                            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                            title="Approve"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleVerify(doc.id, "REJECTED")}
                            disabled={verifying === doc.id}
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                            title="Reject"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => handleDelete(doc.id)}
                        disabled={deleting === doc.id}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
