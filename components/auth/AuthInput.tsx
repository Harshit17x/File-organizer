"use client";

import { motion } from "framer-motion";
import { InputHTMLAttributes, ReactNode } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: ReactNode;
    error?: string;
}

export function AuthInput({ label, icon, error, type, ...props }: AuthInputProps) {
    // Generate id from label for accessibility
    const inputId = label.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="mb-4">
            <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-2">
                {label}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    {...props}
                    id={inputId}
                    name={inputId}
                    type={type}
                    className={`
                        w-full px-4 py-3 ${icon ? 'pl-11' : ''}
                        bg-white/5 border border-white/10
                        rounded-xl text-white placeholder-gray-500
                        focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20
                        transition-all duration-200
                        hover:bg-white/[0.07]
                        ${error ? 'border-red-500/50' : ''}
                    `}
                />
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-400"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
}
