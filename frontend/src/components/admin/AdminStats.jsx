import { useEffect, useState } from "react";
import {
  FileText,
  MessageCircle,
  Star
} from "lucide-react";
import { fetchAdminStats } from "../../services/adminApi";

export default function AdminStats() {
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    fetchAdminStats()
      .then(res => setStatsData(res.data))
      .catch(err => {
        console.error("Failed to load admin stats", err);
      });
  }, []);

  if (!statsData) return null;

  const stats = [
    {
      title: "Total Resources",
      value: statsData.totalResources ?? "—",
      icon: <FileText size={22} />,
    },
    {
      title: "Questions Asked",
      value: statsData.questionsAsked ?? "—",
      icon: <MessageCircle size={22} />,
    },
    {
      title: "Most Used Resource",
      value: statsData.mostUsedResource || "Coming Soon",
      icon: <Star size={22} />,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="
            bg-white
            border border-[#E5E7EB]
            rounded-xl
            p-5
            transition
            hover:bg-[#F3F4F4]
          "
        >
          {/* HEADER ROW */}
          <div className="flex items-center justify-between mb-3">

            {/* TITLE */}
            <p className="text-sm text-[#5F9598] font-medium">
              {stat.title}
            </p>

            {/* ICON */}
            <div className="text-[#1D546D]">
              {stat.icon}
            </div>
          </div>

          {/* VALUE */}
          <h2 className="text-2xl font-semibold text-[#061E29] truncate">
            {stat.value}
          </h2>
        </div>
      ))}
    </div>
  );
}
