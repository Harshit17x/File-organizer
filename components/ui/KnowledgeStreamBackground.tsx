"use client";

import { useEffect, useRef } from "react";

export function KnowledgeStreamBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        // Math symbols and binary characters
        const symbols = ["∫", "∑", "π", "√", "∞", "≠", "≈", "0", "1", "λ", "θ", "Δ", "Ω", "{", "}", "</>"];

        class Particle {
            x: number;
            y: number;
            text: string;
            size: number;
            speed: number;
            opacity: number;
            color: string;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.text = symbols[Math.floor(Math.random() * symbols.length)];
                this.size = Math.random() * 14 + 10; // 10px to 24px
                this.speed = Math.random() * 0.5 + 0.1;
                this.opacity = Math.random() * 0.3 + 0.05;

                // Randomly assign purple or cyan tint
                this.color = Math.random() > 0.5 ? "rgba(217, 70, 239," : "rgba(6, 182, 212,";
            }

            update() {
                this.y -= this.speed; // Float upwards
                if (this.y < -50) {
                    this.y = canvas!.height + 50;
                    this.x = Math.random() * canvas!.width;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.font = `${this.size}px monospace`;
                ctx.fillStyle = `${this.color}${this.opacity})`;
                ctx.fillText(this.text, this.x, this.y);
            }
        }

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 15000); // Density
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none opacity-40"
        />
    );
}
