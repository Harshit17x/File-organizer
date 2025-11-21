"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode } from "react";

interface AuthCardProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        x.set(clientX - left - width / 2);
        y.set(clientY - top - height / 2);
    }

    const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
    const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ perspective: 1000 }}
            className="w-full max-w-sm mx-auto"
        >
            <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                onMouseMove={onMouseMove}
                onMouseLeave={() => {
                    x.set(0);
                    y.set(0);
                }}
                className="relative"
            >
                {/* Glow effect behind card */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#d946ef]/30 to-[#06b6d4]/30 rounded-3xl blur-2xl transition-opacity duration-500 opacity-75 group-hover:opacity-100" />

                {/* Card content */}
                <div className="relative bg-[rgba(13,12,34,0.6)] backdrop-blur-xl border border-[rgba(217,70,239,0.2)] rounded-xl p-8 shadow-[0_0_50px_rgba(217,70,239,0.15)] overflow-hidden group">
                    {/* Tech Corners - Clip Path Style */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#d946ef] rounded-tl-lg opacity-80" />
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#d946ef] rounded-tr-lg opacity-80" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#d946ef] rounded-bl-lg opacity-80" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#d946ef] rounded-br-lg opacity-80" />

                    {/* Decorative Tech Lines */}
                    <div className="absolute top-8 left-0 w-2 h-12 bg-[#d946ef]/20" />
                    <div className="absolute top-8 right-0 w-2 h-12 bg-[#d946ef]/20" />
                    <div className="absolute bottom-8 left-0 w-2 h-12 bg-[#d946ef]/20" />
                    <div className="absolute bottom-8 right-0 w-2 h-12 bg-[#d946ef]/20" />

                    {/* Scanline overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(217,70,239,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

                    {/* Header */}
                    <div className="text-center mb-8 relative z-10">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2 tracking-tight">
                            {title}
                        </h1>
                        <p className="text-sm text-cyan-100/60 font-medium">
                            {subtitle}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
