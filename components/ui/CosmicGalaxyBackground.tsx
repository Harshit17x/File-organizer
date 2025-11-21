"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface Star {
    x: number;
    y: number;
    radius: number;
    vx: number;
    vy: number;
    opacity: number;
    twinkleSpeed: number;
    twinklePhase: number;
}

interface Comet {
    x: number;
    y: number;
    vx: number;
    vy: number;
    trailLength: number;
    life: number;
    maxLife: number;
}

interface Galaxy {
    x: number;
    y: number;
    rotation: number;
    rotationSpeed: number;
    size: number;
}

export function CosmicGalaxyBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const isDark = theme === "dark";

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Create stars (reduced for performance)
        const stars: Star[] = [];
        const starCount = 200; // Reduced from 300

        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5,
                vx: (Math.random() - 0.5) * 0.15,
                vy: (Math.random() - 0.5) * 0.15,
                opacity: Math.random(),
                twinkleSpeed: 0.008 + Math.random() * 0.012,
                twinklePhase: Math.random() * Math.PI * 2,
            });
        }

        // Create ONE beautiful galaxy in center
        const galaxy: Galaxy = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            rotation: 0,
            rotationSpeed: 0.0005,
            size: isDark ? 200 : 150
        };

        // Comets array
        const comets: Comet[] = [];

        // Spawn comet occasionally
        const spawnComet = () => {
            if (Math.random() < 0.02 && comets.length < 2) { // Max 2 comets at once
                comets.push({
                    x: Math.random() * canvas.width,
                    y: -50,
                    vx: (Math.random() - 0.5) * 3,
                    vy: 2 + Math.random() * 2,
                    trailLength: 100,
                    life: 0,
                    maxLife: 200
                });
            }
        };

        // Animation loop
        let animationId: number;
        let frameCount = 0;

        const animate = () => {
            frameCount++;
            // Background gradient - cosmic deep space
            const gradient = ctx.createRadialGradient(
                canvas.width / 2,
                canvas.height / 2,
                0,
                canvas.width / 2,
                canvas.height / 2,
                canvas.width
            );

            if (isDark) {
                gradient.addColorStop(0, "#0a0e27");
                gradient.addColorStop(0.5, "#141b3d");
                gradient.addColorStop(1, "#0a0515");
            } else {
                gradient.addColorStop(0, "#e0e7ff");
                gradient.addColorStop(0.5, "#c7d2fe");
                gradient.addColorStop(1, "#ddd6fe");
            }

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw nebulae (lighter/fewer)
            if (frameCount % 2 === 0) { // Draw every other frame for performance
                const nebulae = [
                    { x: canvas.width * 0.3, y: canvas.height * 0.3, radius: 250, color: isDark ? "rgba(139, 92, 246, 0.08)" : "rgba(139, 92, 246, 0.04)" },
                    { x: canvas.width * 0.7, y: canvas.height * 0.6, radius: 200, color: isDark ? "rgba(59, 130, 246, 0.06)" : "rgba(59, 130, 246, 0.03)" },
                ];

                nebulae.forEach((nebula) => {
                    const nebulaGradient = ctx.createRadialGradient(
                        nebula.x,
                        nebula.y,
                        0,
                        nebula.x,
                        nebula.y,
                        nebula.radius
                    );
                    nebulaGradient.addColorStop(0, nebula.color);
                    nebulaGradient.addColorStop(1, "transparent");
                    ctx.fillStyle = nebulaGradient;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                });
            }

            // Draw realistic subtle galaxy
            galaxy.rotation += galaxy.rotationSpeed;

            ctx.save();
            ctx.translate(galaxy.x, galaxy.y);
            ctx.rotate(galaxy.rotation);

            // Very subtle outer glow (barely visible)
            const outerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.size * 1.5);
            outerGlow.addColorStop(0, isDark ? "rgba(200, 210, 230, 0.03)" : "rgba(200, 210, 230, 0.01)");
            outerGlow.addColorStop(1, "transparent");
            ctx.fillStyle = outerGlow;
            ctx.beginPath();
            ctx.arc(0, 0, galaxy.size * 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Draw realistic spiral arms - 2 main arms
            const armColors = [
                "rgba(220, 230, 255, OPACITY)", // Very light blue-white
                "rgba(255, 250, 240, OPACITY)", // Warm white  
            ];

            for (let armIdx = 0; armIdx < 2; armIdx++) {
                // Main arm structure
                ctx.beginPath();
                for (let i = 0; i < 100; i++) {
                    const t = i / 100;
                    const angle = t * Math.PI * 4 + (armIdx * Math.PI);
                    const radius = t * galaxy.size * 0.9;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius * 0.7; // Elliptical

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }

                const baseColor = armColors[armIdx].replace("OPACITY", isDark ? "0.12" : "0.04");
                ctx.strokeStyle = baseColor;
                ctx.lineWidth = isDark ? 8 : 4;
                ctx.stroke();

                // Add subtle inner bright line
                ctx.beginPath();
                for (let i = 0; i < 100; i++) {
                    const t = i / 100;
                    const angle = t * Math.PI * 4 + (armIdx * Math.PI);
                    const radius = t * galaxy.size * 0.9;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius * 0.7;

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }

                const brightColor = armColors[armIdx].replace("OPACITY", isDark ? "0.25" : "0.08");
                ctx.strokeStyle = brightColor;
                ctx.lineWidth = isDark ? 3 : 1.5;
                ctx.stroke();

                // Scattered stars along arms (small, subtle)
                if (isDark) {
                    for (let i = 0; i < 50; i++) {
                        const t = Math.random();
                        const angle = t * Math.PI * 4 + (armIdx * Math.PI);
                        const radius = t * galaxy.size * 0.85;
                        const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 15;
                        const y = Math.sin(angle) * radius * 0.7 + (Math.random() - 0.5) * 15;

                        const starBrightness = Math.random();
                        if (starBrightness > 0.7) {
                            // Slightly brighter stars
                            ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + Math.random() * 0.3})`;
                            ctx.beginPath();
                            ctx.arc(x, y, 0.8, 0, Math.PI * 2);
                            ctx.fill();
                        } else {
                            // Dim stars
                            ctx.fillStyle = `rgba(200, 210, 230, ${0.2 + Math.random() * 0.2})`;
                            ctx.beginPath();
                            ctx.arc(x, y, 0.5, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }
            }

            // Galactic center - subtle, not overpowering
            const coreSize = isDark ? 30 : 20;

            // Soft core glow
            const coreGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, coreSize);
            coreGlow.addColorStop(0, isDark ? "rgba(255, 250, 240, 0.5)" : "rgba(255, 250, 240, 0.2)");
            coreGlow.addColorStop(0.4, isDark ? "rgba(255, 240, 220, 0.3)" : "rgba(255, 240, 220, 0.1)");
            coreGlow.addColorStop(0.7, isDark ? "rgba(200, 210, 230, 0.15)" : "rgba(200, 210, 230, 0.05)");
            coreGlow.addColorStop(1, "transparent");
            ctx.fillStyle = coreGlow;
            ctx.beginPath();
            ctx.arc(0, 0, coreSize, 0, Math.PI * 2);
            ctx.fill();

            // Small bright center
            if (isDark) {
                const innerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 8);
                innerGlow.addColorStop(0, "rgba(255, 255, 255, 0.8)");
                innerGlow.addColorStop(0.5, "rgba(255, 250, 240, 0.4)");
                innerGlow.addColorStop(1, "transparent");
                ctx.fillStyle = innerGlow;
                ctx.beginPath();
                ctx.arc(0, 0, 8, 0, Math.PI * 2);
                ctx.fill();

                // Tiny bright point
                ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
                ctx.beginPath();
                ctx.arc(0, 0, 2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();

            // Draw and animate stars
            stars.forEach((star) => {
                star.x += star.vx;
                star.y += star.vy;

                if (star.x < 0) star.x = canvas.width;
                if (star.x > canvas.width) star.x = 0;
                if (star.y < 0) star.y = canvas.height;
                if (star.y > canvas.height) star.y = 0;

                star.twinklePhase += star.twinkleSpeed;
                star.opacity = 0.4 + Math.sin(star.twinklePhase) * 0.6;

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                ctx.fill();
            });

            // Spawn and animate comets
            if (frameCount % 60 === 0) spawnComet();

            comets.forEach((comet, index) => {
                comet.x += comet.vx;
                comet.y += comet.vy;
                comet.life++;

                // Draw comet trail
                const trailGradient = ctx.createLinearGradient(
                    comet.x,
                    comet.y,
                    comet.x - comet.vx * 20,
                    comet.y - comet.vy * 20
                );

                const headOpacity = Math.min(1, comet.life / 50) * Math.max(0, 1 - comet.life / comet.maxLife);
                trailGradient.addColorStop(0, isDark ? `rgba(6, 182, 212, ${headOpacity})` : `rgba(6, 182, 212, ${headOpacity * 0.6})`);
                trailGradient.addColorStop(1, "transparent");

                ctx.strokeStyle = trailGradient;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(comet.x, comet.y);
                ctx.lineTo(comet.x - comet.vx * 20, comet.y - comet.vy * 20);
                ctx.stroke();

                // Comet head (glow)
                ctx.shadowBlur = 15;
                ctx.shadowColor = isDark ? "rgba(6, 182, 212, 0.8)" : "rgba(6, 182, 212, 0.4)";
                ctx.fillStyle = isDark ? `rgba(147, 197, 253, ${headOpacity})` : `rgba(147, 197, 253, ${headOpacity * 0.7})`;
                ctx.beginPath();
                ctx.arc(comet.x, comet.y, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                // Remove dead comets
                if (comet.life > comet.maxLife || comet.y > canvas.height + 50) {
                    comets.splice(index, 1);
                }
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationId);
        };
    }, [isDark, theme, mounted]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 pointer-events-none"
            style={{
                background: mounted
                    ? isDark
                        ? "radial-gradient(circle at 50% 50%, #0d1b2a 0%, #000000 100%)"
                        : "radial-gradient(circle at 50% 50%, #e0e7ff 0%, #c7d2fe 100%)"
                    : "#0a0e27" // Default dark background during SSR
            }}
        />
    );
}
