import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function StatsCard({ title, value, icon: Icon, trend }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className="h-10 w-10 rounded-lg bg-pink-50 flex items-center justify-center">
          <Icon className="h-5 w-5 text-pink-500" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          {trend.positive ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span
            className={`text-xs font-medium ${
              trend.positive ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.value}
          </span>
          <span className="text-xs text-gray-400">vs mes anterior</span>
        </div>
      )}
    </div>
  );
}
