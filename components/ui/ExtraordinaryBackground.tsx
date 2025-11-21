"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export function ExtraordinaryBackground() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    // Theme-aware colors
    const colors = isDark
        ? {
            primary: '#9b5de5',
            secondary: '#00f5d4',
            tertiary: '#00bbf9',
        }
        : {
            primary: '#7c3aed',
            secondary: '#3b82f6',
            tertiary: '#8b5cf6',
        };

    return (
        <div
            className="fixed inset-0 overflow-hidden pointer-events-none -z-10"
            style={{
                background: isDark
                    ? 'radial-gradient(circle at 50% 50%, #0a0a0a, #000000)'
                    : 'radial-gradient(circle at 50% 50%, #f5f7fa, #e5e7eb)'
            }}
        >
            {/* Morphing Gradient Orbs */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={`orb-${i}`}
                    className="absolute rounded-full"
                    style={{
                        background: `radial-gradient(circle, ${i % 2 === 0 ? colors.primary : colors.secondary}, transparent)`,
                        filter: isDark ? 'blur(60px)' : 'blur(40px)',
                        width: '300px',
                        height: '300px',
                    }}
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                    }}
                    animate={{
                        x: [
                            Math.random() * window.innerWidth,
                            Math.random() * window.innerWidth,
                            Math.random() * window.innerWidth,
                        ],
                        y: [
                            Math.random() * window.innerHeight,
                            Math.random() * window.innerHeight,
                            Math.random() * window.innerHeight,
                        ],
                        scale: [1, 2, 1.5, 1],
                        opacity: isDark ? [0.3, 0.4, 0.2, 0.3] : [0.15, 0.2, 0.1, 0.15],
                    }}
                    transition={{
                        duration: 20 + i * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Floating Study Icons */}
            {['📚', '✏️', '⚛️', '🎓', '📖', '🔬', '📝', '💡'].map((icon, i) => (
                <motion.div
                    key={`icon-${i}`}
                    className="absolute text-4xl"
                    style={{
                        opacity: isDark ? 0.15 : 0.08,
                        filter: isDark ? 'grayscale(30%)' : 'grayscale(60%) brightness(1.2)',
                    }}
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        rotate: 0,
                    }}
                    animate={{
                        x: [
                            Math.random() * window.innerWidth,
                            Math.random() * window.innerWidth,
                        ],
                        y: [
                            Math.random() * window.innerHeight,
                            Math.random() * window.innerHeight,
                        ],
                        rotate: [0, 360],
                        scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                        duration: 15 + i * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Geometric Particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={`particle-${i}`}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                        background: i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.tertiary,
                        boxShadow: `0 0 10px ${i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.tertiary}`,
                    }}
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                    }}
                    animate={{
                        x: [
                            Math.random() * window.innerWidth,
                            Math.random() * window.innerWidth,
                            Math.random() * window.innerWidth,
                        ],
                        y: [
                            Math.random() * window.innerHeight,
                            Math.random() * window.innerHeight,
                            Math.random() * window.innerHeight,
                        ],
                        scale: [1, 1.5, 1],
                        opacity: isDark ? [0.3, 0.6, 0.3] : [0.15, 0.3, 0.15],
                    }}
                    transition={{
                        duration: 10 + i * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.2,
                    }}
                />
            ))}

            {/* Pulsing Rings */}
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={`ring-${i}`}
                    className="absolute rounded-full border-2"
                    style={{
                        borderColor: i % 2 === 0 ? colors.primary : colors.tertiary,
                        opacity: isDark ? 0.2 : 0.1,
                    }}
                    initial={{
                        x: window.innerWidth / 2,
                        y: window.innerHeight / 2,
                        width: 50,
                        height: 50,
                    }}
                    animate={{
                        width: [50, 300, 50],
                        height: [50, 300, 50],
                        opacity: isDark ? [0.4, 0, 0.4] : [0.2, 0, 0.2],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: i * 1.5,
                    }}
                />
            ))}

            {/* Floating Shapes */}
            {[...Array(10)].map((_, i) => {
                const shapes = ['circle', 'square', 'triangle'];
                const shape = shapes[i % 3];

                return (
                    <motion.div
                        key={`shape-${i}`}
                        className="absolute"
                        style={{
                            width: '60px',
                            height: '60px',
                            opacity: isDark ? 0.2 : 0.1,
                        }}
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            rotate: 0,
                        }}
                        animate={{
                            x: [
                                Math.random() * window.innerWidth,
                                Math.random() * window.innerWidth,
                            ],
                            y: [
                                Math.random() * window.innerHeight,
                                Math.random() * window.innerHeight,
                            ],
                            rotate: [0, 360],
                            scale: [0.5, 1.5, 0.5],
                        }}
                        transition={{
                            duration: 12 + i,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.3,
                        }}
                    >
                        {shape === 'circle' && (
                            <div
                                className="w-full h-full rounded-full border-2"
                                style={{ borderColor: colors.primary }}
                            />
                        )}
                        {shape === 'square' && (
                            <div
                                className="w-full h-full border-2 rotate-45"
                                style={{ borderColor: colors.secondary }}
                            />
                        )}
                        {shape === 'triangle' && (
                            <div
                                className="w-0 h-0 border-l-[30px] border-r-[30px] border-b-[52px] border-l-transparent border-r-transparent"
                                style={{ borderBottomColor: colors.tertiary }}
                            />
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}
