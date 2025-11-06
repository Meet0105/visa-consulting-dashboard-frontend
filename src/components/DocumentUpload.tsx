"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { DocumentType } from "@/types/types";

interface DocumentUploadProps {
  applicationId?: string;
  onUploadSuccess?: () => void;
}

const DOCUMENT_TYPES: { value: DocumentType; label: string }[] = [
  { value: "PASSPORT", label: "Passport" },
  { value: "PHOTO", label: "Passport Photo" },
  { value: "BANK_STATEMENT", label: "Bank Statement" },
  { value: "EMPLOYMENT_LETTER", label: "Employment Letter" },
  { value: "TRAVEL_ITINERARY", label: "Travel Itinerary" },
  { value: "ACCOMMODATION_PROOF", label: "Accommodation Proof" },
  { value: "INSURANCE", label: "Travel Insurance" },
  { value: "BIRTH_CERTIFICATE", label: "Birth Certificate" },
  { value: "MARRIAGE_CERTIFICATE", label: "Marriage Certificate" },
  { value: "POLICE_CLEARANCE", label: "Police Clearance" },
  { value: "MEDICAL_REPORT", label: "Medical Report" },
  { value: "OTHER", label: "Other" },
];

export default function DocumentUpload({ applicationId, onUploadSuccess }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>("PASSPORT");
  const [expiryDate, setExpiryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file size (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setMessage({ text: "File size must be less than 10MB", type: "error" });
        return;
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        setMessage({ text: "Invalid file type. Only JPEG, PNG, PDF, and DOC files are allowed.", type: "error" });
        return;
      }

      setFile(selectedFile);
      setMessage(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setMessage({ text: "Please select a file", type: "error" });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", documentType);
      if (applicationId) {
        formData.append("applicationId", applicationId);
      }
      if (expiryDate) {
        formData.append("expiryDate", expiryDate);
      }
      if (notes) {
        formData.append("notes", notes);
      }

      await api.post("/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage({ text: "Document uploaded successfully!", type: "success" });
      
      // Reset form
      setFile(null);
      setDocumentType("PASSPORT");
      setExpiryDate("");
      setNotes("");
      
      // Reset file input
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }

      // Call success callback
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      setMessage({
        text: error.response?.data?.error || "Failed to upload document",
        type: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Upload Document</h3>
        <p className="card-subtitle">Upload visa-related documents (Max 10MB)</p>
      </div>

      <form onSubmit={handleUpload} className="space-y-4">
        {/* Message */}
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === "success" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* File Upload */}
        <div>
          <label className="label">Select File *</label>
          <div className="mt-1">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF, DOC, DOCX, JPEG, PNG (MAX. 10MB)
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                disabled={uploading}
              />
            </label>
          </div>
          {file && (
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
                    if (fileInput) fileInput.value = "";
                  }}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Document Type */}
        <div>
          <label className="label">Document Type *</label>
          <select
            className="select"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value as DocumentType)}
            disabled={uploading}
            required
          >
            {DOCUMENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Expiry Date */}
        <div>
          <label className="label">Expiry Date (Optional)</label>
          <input
            type="date"
            className="input"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            disabled={uploading}
            min={new Date().toISOString().split("T")[0]}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Set expiry date for documents like passports or visas
          </p>
        </div>

        {/* Notes */}
        <div>
          <label className="label">Notes (Optional)</label>
          <textarea
            className="input"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes about this document..."
            disabled={uploading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || uploading}
          className="btn-primary w-full"
        >
          {uploading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="spinner w-5 h-5"></div>
              <span>Uploading...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>Upload Document</span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
}
