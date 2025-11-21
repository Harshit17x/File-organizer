"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface GradientButtonProps extends HTMLMotionProps<"button"> {
    children: ReactNode;
    isLoading?: boolean;
}

export function GradientButton({ children, isLoading, ...props }: GradientButtonProps) {
    return (
        <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            {...props}
            disabled={isLoading || props.disabled}
            className={`
                w-full py-3 px-6 rounded-xl font-medium
                bg-gradient-to-r from-[#d946ef] to-[#06b6d4]
                hover:from-[#c026d3] hover:to-[#0891b2]
                shadow-lg shadow-[#d946ef]/25
                hover:shadow-xl hover:shadow-[#d946ef]/40
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                relative overflow-hidden
                ${props.className || ''}
            `}
        >
            {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Loading...</span>
                </div>
            ) : (
                children
            )}
        </motion.button>
    );
}
