import { ReactNode } from "react";
import clsx from "clsx";

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export default function Card({
  title,
  children,
  className,
}: CardProps) {
  return (
    <div
      className={clsx(
        `
        rounded-3xl
        border border-[#4A3A2D]
        bg-[#211D1A]
        backdrop-blur-md
        px-8 pt-6 pb-10

        shadow-[0_8px_30px_rgba(0,0,0,0.18)]

        transition-all
        duration-300

        hover:border-[#D6A15F]/40
        hover:shadow-[0_12px_40px_rgba(214,161,95,0.08)]
        `,
        className
      )}
    >
      {title && (
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.20em] text-[#B8ADA3]">
            {title}
          </h2>
        </div>
      )}

      {children}
    </div>
  );
}