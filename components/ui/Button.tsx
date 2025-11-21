import { ButtonHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
        const variants = {
            primary: "bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500 text-white shadow-md dark:shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-lg dark:hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:-translate-y-0.5 border border-transparent",
            secondary: "bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white border border-gray-300 dark:border-white/20 hover:bg-gray-300 dark:hover:bg-white/20 hover:-translate-y-0.5",
            danger: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/20",
            ghost: "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-transparent",
        };

        const sizes = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2",
            lg: "px-6 py-3 text-lg",
        };

        return (
            <button
                ref={ref}
                className={twMerge(
                    "rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95",
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="animate-spin" size={18} />}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";
