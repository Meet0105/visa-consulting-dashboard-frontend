import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  onLogout,
}) => {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      </div>
      <button
        onClick={onLogout}
        className="btn-secondary flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>
    </div>
  );
};

export default DashboardHeader;