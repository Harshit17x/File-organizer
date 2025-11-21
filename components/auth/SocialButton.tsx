"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface SocialButtonProps extends HTMLMotionProps<"button"> {
    icon: ReactNode;
    label: string;
}

export function SocialButton({ icon, label, ...props }: SocialButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            {...props}
            className={`
                flex items-center justify-center gap-3
                px-4 py-3 rounded-xl
                bg-white/5 border border-white/10
                hover:bg-white/10 hover:border-white/20
                transition-all duration-200
                group
                ${props.className || ''}
            `}
        >
            <div className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors">
                {icon}
            </div>
            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                {label}
            </span>
        </motion.button>
    );
}
