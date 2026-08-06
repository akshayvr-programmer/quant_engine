import clsx from "clsx";

interface CardProps {
    title?: string;
    className?: string;
    children: React.ReactNode;
}

export default function Card({
    title,
    className = "",
    children,
}: CardProps) {
    return (
        <div
            className={clsx(
                "flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#2A2420] bg-[#1C1815]",
                className
            )}
        >
            {title && (
                <div className="shrink-0 px-5 pb-2 pt-4 text-xs uppercase tracking-widest text-[#8B8178]">
                    {title}
                </div>
            )}

            <div className="scroll-area min-h-0 flex-1 px-5 pb-5">
                {children}
            </div>
        </div>
    );
}
