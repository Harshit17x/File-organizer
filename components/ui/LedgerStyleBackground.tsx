"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    size: number;
    opacity: number;
}

export function LedgerStyleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mounted, setMounted] = useState(false);

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

        // Create particles in 3D space
        const particles: Particle[] = [];
        const particleCount = 80;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                z: Math.random() * 1000,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                vz: Math.random() * 0.5 + 0.2,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3
            });
        }

        let animationId: number;
        let mouseX = canvas.width / 2;
        let mouseY = canvas.height / 2;

        // Mouse move parallax effect
        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };
        window.addEventListener("mousemove", handleMouseMove);

        const animate = () => {
            // Dark gradient background
            const gradient = ctx.createRadialGradient(
                canvas.width / 2,
                canvas.height / 2,
                0,
                canvas.width / 2,
                canvas.height / 2,
                canvas.width
            );

            gradient.addColorStop(0, "#0a0e1a");
            gradient.addColorStop(0.5, "#050810");
            gradient.addColorStop(1, "#000000");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            particles.forEach((particle, index) => {
                // Move particle
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.z -= particle.vz;

                // Parallax effect based on mouse
                const parallaxX = (mouseX - canvas.width / 2) * 0.01 * (particle.z / 500);
                const parallaxY = (mouseY - canvas.height / 2) * 0.01 * (particle.z / 500);

                // Reset particle when it goes out of bounds
                if (particle.z < 1) {
                    particle.z = 1000;
                    particle.x = Math.random() * canvas.width;
                    particle.y = Math.random() * canvas.height;
                }

                if (particle.x < 0 || particle.x > canvas.width) {
                    particle.vx *= -1;
                }
                if (particle.y < 0 || particle.y > canvas.height) {
                    particle.vy *= -1;
                }

                // Calculate screen position with perspective
                const scale = 1000 / (1000 + particle.z);
                const x2d = (particle.x - canvas.width / 2) * scale + canvas.width / 2 + parallaxX;
                const y2d = (particle.y - canvas.height / 2) * scale + canvas.height / 2 + parallaxY;
                const size = particle.size * scale;

                // Draw particle
                const alpha = particle.opacity * (1 - particle.z / 1000);

                // Glow effect
                const particleGradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, size * 3);
                particleGradient.addColorStop(0, `rgba(100, 150, 255, ${alpha * 0.8})`);
                particleGradient.addColorStop(0.5, `rgba(80, 120, 200, ${alpha * 0.4})`);
                particleGradient.addColorStop(1, "transparent");

                ctx.fillStyle = particleGradient;
                ctx.beginPath();
                ctx.arc(x2d, y2d, size * 3, 0, Math.PI * 2);
                ctx.fill();

                // Core
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.beginPath();
                ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
                ctx.fill();

                // Draw connections to nearby particles
                particles.forEach((other, otherIndex) => {
                    if (otherIndex <= index) return;

                    const dx = particle.x - other.x;
                    const dy = particle.y - other.y;
                    const dz = particle.z - other.z;
                    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (distance < 200) {
                        const otherScale = 1000 / (1000 + other.z);
                        const otherX2d = (other.x - canvas.width / 2) * otherScale + canvas.width / 2 + parallaxX;
                        const otherY2d = (other.y - canvas.height / 2) * otherScale + canvas.height / 2 + parallaxY;

                        const lineAlpha = (1 - distance / 200) * 0.15;
                        ctx.strokeStyle = `rgba(100, 150, 255, ${lineAlpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(x2d, y2d);
                        ctx.lineTo(otherX2d, otherY2d);
                        ctx.stroke();
                    }
                });
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationId);
        };
    }, [mounted]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 pointer-events-none"
            style={{ background: "#0a0e1a" }}
        />
    );
}
