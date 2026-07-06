import { ReactNode } from "react";
import clsx from "clsx";

// components/ui/Card.tsx
interface CardProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

export default function Card({ title, className = "", children }: CardProps) {
  return (
    <div
      className={`flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#2A2420] bg-[#1C1815] ${className}`}
    >
      <div className="shrink-0 px-5 pt-4 pb-2 text-xs uppercase tracking-widest text-[#8B8178]">
        {title}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
        {children}
      </div>
    </div>
  );
}