"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Counselor } from "@/types/types";

interface AppointmentBookingProps {
  onSuccess?: () => void;
}

const PURPOSE_OPTIONS = [
  "Initial Consultation",
  "Document Review",
  "Application Discussion",
  "Visa Interview Preparation",
  "Follow-up Meeting",
  "General Inquiry",
  "Other",
];

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

export default function AppointmentBooking({ onSuccess }: AppointmentBookingProps) {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [formData, setFormData] = useState({
    counselorId: "",
    appointmentDate: "",
    startTime: "",
    endTime: "",
    duration: 60,
    purpose: "",
    notes: "",
    meetingType: "IN_PERSON",
    location: "",
  });

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      const { data } = await api.get("/appointments/counselors/available");
      setCounselors(data.counselors);
    } catch (error) {
      console.error("Failed to fetch counselors:", error);
    }
  };

  const calculateEndTime = (start: string, duration: number) => {
    const [hours, minutes] = start.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
  };

  const handleStartTimeChange = (time: string) => {
    setFormData((prev) => ({
      ...prev,
      startTime: time,
      endTime: calculateEndTime(time, prev.duration),
    }));
  };

  const handleDurationChange = (duration: number) => {
    setFormData((prev) => ({
      ...prev,
      duration,
      endTime: prev.startTime ? calculateEndTime(prev.startTime, duration) : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await api.post("/appointments/book", formData);
      setMessage({ text: "Appointment booked successfully!", type: "success" });
      
      // Reset form
      setFormData({
        counselorId: "",
        appointmentDate: "",
        startTime: "",
        endTime: "",
        duration: 60,
        purpose: "",
        notes: "",
        meetingType: "IN_PERSON",
        location: "",
      });

      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.error || "Failed to book appointment",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/50">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Book Appointment
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Schedule a meeting with your counselor</p>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-xl ${
            message.type === "success"
              ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800"
              : "bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className={`text-sm font-medium ${message.type === "success" ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300"}`}>
              {message.text}
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Counselor Selection */}
        <div>
          <label className="label">Select Counselor *</label>
          <select
            className="input-pro"
            value={formData.counselorId}
            onChange={(e) => setFormData({ ...formData, counselorId: e.target.value })}
            required
            disabled={loading}
          >
            <option value="">Choose a counselor...</option>
            {counselors.map((counselor) => (
              <option key={counselor.id} value={counselor.id}>
                {counselor.name} - {counselor.email}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div>
          <label className="label">Appointment Date *</label>
          <input
            type="date"
            className="input-pro"
            value={formData.appointmentDate}
            onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
            min={today}
            required
            disabled={loading}
          />
        </div>

        {/* Time and Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Start Time *</label>
            <select
              className="input-pro"
              value={formData.startTime}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Select time...</option>
              {TIME_SLOTS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Duration *</label>
            <select
              className="input-pro"
              value={formData.duration}
              onChange={(e) => handleDurationChange(Number(e.target.value))}
              required
              disabled={loading}
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>
        </div>

        {formData.endTime && (
          <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              End Time: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{formData.endTime}</span>
            </p>
          </div>
        )}

        {/* Purpose */}
        <div>
          <label className="label">Purpose *</label>
          <select
            className="input-pro"
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            required
            disabled={loading}
          >
            <option value="">Select purpose...</option>
            {PURPOSE_OPTIONS.map((purpose) => (
              <option key={purpose} value={purpose}>
                {purpose}
              </option>
            ))}
          </select>
        </div>

        {/* Meeting Type */}
        <div>
          <label className="label">Meeting Type *</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "IN_PERSON", label: "In Person", icon: "🏢" },
              { value: "VIDEO_CALL", label: "Video Call", icon: "📹" },
              { value: "PHONE", label: "Phone", icon: "📞" },
            ].map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData({ ...formData, meetingType: type.value })}
                disabled={loading}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.meetingType === type.value
                    ? "border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700"
                }`}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Location (if in-person) */}
        {formData.meetingType === "IN_PERSON" && (
          <div>
            <label className="label">Location</label>
            <input
              type="text"
              className="input-pro"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Enter meeting location..."
              disabled={loading}
            />
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="label">Additional Notes</label>
          <textarea
            className="input-pro"
            rows={4}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Any specific requirements or topics to discuss..."
            disabled={loading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="spinner w-5 h-5"></div>
              <span>Booking...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Book Appointment</span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
}
