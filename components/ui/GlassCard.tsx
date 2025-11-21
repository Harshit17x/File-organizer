import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({ children, className = "" }: GlassCardProps) {
    return (
        <div
            className={clsx(
                "relative rounded-xl transition-all duration-300 overflow-hidden group",
                // Base styles
                "bg-[rgba(13,12,34,0.6)] backdrop-blur-md border border-[rgba(217,70,239,0.2)]",
                // Hover effects
                "hover:border-[rgba(217,70,239,0.5)] hover:shadow-[0_0_30px_rgba(217,70,239,0.15)] hover:bg-[rgba(13,12,34,0.8)]",
                className
            )}
        >
            {/* Tech Corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[rgba(217,70,239,0.3)] rounded-tl-lg group-hover:border-[#d946ef] transition-colors" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[rgba(217,70,239,0.3)] rounded-tr-lg group-hover:border-[#d946ef] transition-colors" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[rgba(217,70,239,0.3)] rounded-bl-lg group-hover:border-[#d946ef] transition-colors" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[rgba(217,70,239,0.3)] rounded-br-lg group-hover:border-[#d946ef] transition-colors" />

            {/* Scanline overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(217,70,239,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

            {children}
        </div>
    );
}
