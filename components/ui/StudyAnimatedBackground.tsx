"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function StudyAnimatedBackground() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isLight = theme === "light";

    // Study-themed icons
    const studyIcons = ['📚', '📖', '📝', '🎓', '💡', '🧠', '📊', '📈', '✏️', '📑', '🔬', '🎯'];

    return (
        <div className={`fixed inset-0 -z-10 pointer-events-none overflow-hidden ${isLight ? 'opacity-30' : 'opacity-40'}`}>
            {/* Floating study icons */}
            {studyIcons.map((icon, index) => (
                <motion.div
                    key={index}
                    className="absolute text-4xl"
                    style={{
                        filter: isLight ? 'grayscale(30%) brightness(0.7)' : 'none'
                    }}
                    initial={{
                        x: `${Math.random() * 100}%`,
                        y: `${Math.random() * 100}%`,
                        opacity: 0,
                        scale: 0,
                    }}
                    animate={{
                        y: [
                            `${Math.random() * 100}%`,
                            `${Math.random() * 100}%`,
                            `${Math.random() * 100}%`,
                        ],
                        x: [
                            `${Math.random() * 100}%`,
                            `${Math.random() * 100}%`,
                            `${Math.random() * 100}%`,
                        ],
                        opacity: [0, 0.6, 0.4, 0],
                        scale: [0.5, 1, 0.8, 0.5],
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 20 + index * 2,
                        repeat: Infinity,
                        delay: index * 0.5,
                        ease: "easeInOut",
                    }}
                >
                    {icon}
                </motion.div>
            ))}

            {/* Brain pulse effect */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    border: isLight
                        ? '2px solid rgba(139, 92, 246, 0.4)'
                        : '2px solid rgba(139, 92, 246, 0.3)',
                }}
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Secondary pulse */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    border: isLight
                        ? '2px solid rgba(76, 201, 240, 0.5)'
                        : '2px solid rgba(76, 201, 240, 0.3)',
                }}
                animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
            />

            {/* Gradient orbs */}
            <motion.div
                className={isLight ? "absolute w-96 h-96 rounded-full bg-purple-400/30 blur-3xl" : "absolute w-96 h-96 rounded-full bg-purple-600/20 blur-3xl"}
                style={{ top: '20%', left: '10%' }}
                animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className={isLight ? "absolute w-96 h-96 rounded-full bg-cyan-400/30 blur-3xl" : "absolute w-96 h-96 rounded-full bg-cyan-600/20 blur-3xl"}
                style={{ bottom: '20%', right: '10%' }}
                animate={{
                    x: [0, -50, 0],
                    y: [0, -30, 0],
                    scale: [1.2, 1, 1.2],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
}
