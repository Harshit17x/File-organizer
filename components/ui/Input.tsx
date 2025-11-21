import { InputHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, icon, ...props }, ref) => {
        return (
            <div className="relative group">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#d946ef] group-focus-within:text-[#06b6d4] transition-colors">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={twMerge(
                        "w-full rounded-xl px-4 py-2 transition-all duration-300 focus:outline-none font-mono",
                        // Light mode
                        "bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500",
                        "focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100",
                        // Dark mode - Hacker Terminal Style
                        "dark:bg-black/40 dark:border dark:border-[#d946ef]/30 dark:text-[#06b6d4] dark:placeholder:text-[#d946ef]/50",
                        "dark:focus:border-[#06b6d4] dark:focus:bg-black/60 dark:focus:shadow-[0_0_15px_rgba(6,182,212,0.2)]",
                        icon && "pl-10",
                        className
                    )}
                    {...props}
                />
                {/* Terminal Cursor Effect (Visual only) */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-4 bg-[#06b6d4] animate-pulse opacity-0 group-focus-within:opacity-100 pointer-events-none" />
            </div>
        );
    }
);

Input.displayName = "Input";
