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
    <div className="mb-8 sm:mb-10">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 sm:mb-3">
            {title}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-medium">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></div>
    </div>
  );
};

export default DashboardHeader;