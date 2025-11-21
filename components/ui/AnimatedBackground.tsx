"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;
}

const COLORS = ["#4cc9f0", "#7209b7", "#4361ee", "#ec4899"];

export function AnimatedBackground() {
    const [particles, setParticles] = useState<Particle[]>([]);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        // Optimized particle count
        const particleCount = 35;
        const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 3 + 1.5,
            speedX: (Math.random() - 0.5) * 0.8,
            speedY: (Math.random() - 0.5) * 0.8,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
        }));
        setParticles(newParticles);

        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Use requestAnimationFrame for smoother performance
    useEffect(() => {
        if (particles.length === 0) return;

        let animationFrameId: number;

        const animate = () => {
            setParticles((prev) =>
                prev.map((particle) => {
                    let newX = particle.x + particle.speedX;
                    let newY = particle.y + particle.speedY;

                    if (newX < 0 || newX > dimensions.width) {
                        particle.speedX *= -1;
                        newX = particle.x + particle.speedX;
                    }
                    if (newY < 0 || newY > dimensions.height) {
                        particle.speedY *= -1;
                        newY = particle.y + particle.speedY;
                    }

                    return { ...particle, x: newX, y: newY };
                })
            );

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [particles.length, dimensions]);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 opacity-35">
            <svg width={dimensions.width} height={dimensions.height} className="absolute inset-0">
                <defs>
                    {/* Simple glow filter */}
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Optimized connections - limit to closer particles */}
                {particles.map((particle, i) =>
                    particles.slice(i + 1, i + 6).map((otherParticle, j) => {
                        const distance = Math.sqrt(
                            Math.pow(particle.x - otherParticle.x, 2) +
                            Math.pow(particle.y - otherParticle.y, 2)
                        );
                        if (distance < 180) {
                            return (
                                <line
                                    key={`${i}-${j}`}
                                    x1={particle.x}
                                    y1={particle.y}
                                    x2={otherParticle.x}
                                    y2={otherParticle.y}
                                    stroke="#4cc9f0"
                                    strokeWidth="1"
                                    opacity={(1 - distance / 180) * 0.6}
                                />
                            );
                        }
                        return null;
                    })
                )}

                {/* Simplified particles with single glow */}
                {particles.map((particle) => (
                    <motion.circle
                        key={particle.id}
                        cx={particle.x}
                        cy={particle.y}
                        r={particle.size}
                        fill={particle.color}
                        filter="url(#glow)"
                        animate={{ opacity: [0.5, 0.9, 0.5] }}
                        transition={{
                            duration: 2 + Math.random(),
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </svg>

            {/* Simple gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5" />
        </div>
    );
}
