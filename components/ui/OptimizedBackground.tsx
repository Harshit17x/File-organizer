"use client";

import { motion } from "framer-motion";

export function OptimizedBackground() {
    return (
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
            {/* Animated gradient blobs */}
            <motion.div
                className="absolute top-0 -left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute bottom-0 -right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl"
                animate={{
                    x: [0, -100, 0],
                    y: [0, -50, 0],
                    scale: [1.2, 1, 1.2],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Static gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10" />
        </div>
    );
}
