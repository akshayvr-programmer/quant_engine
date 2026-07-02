import { ReactNode } from "react";
import Card from "../ui/Card";

type MetricCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  trend?: string;
  positive?: boolean;
};

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  positive = true,
}: MetricCardProps) {
  return (
    <Card className="px-8 py-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#D6A15F]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-base font-medium text-[#D8CEC5]">
            {title}
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#F5F1EB]">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-3 text-sm text-[#B8ADA3]">
              {subtitle}
            </p>
          )}
        </div>

        <div className="ml-8 rounded-2xl bg-[#2F2925] p-3">
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-6">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              positive
                ? "bg-green-500/15 text-green-400"
                : "bg-red-500/15 text-red-400"
            }`}
          >
            {trend}
          </span>
        </div>
      )}
    </Card>
  );
}
