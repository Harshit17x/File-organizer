"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

function FloatingShape({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) {
    return (
        <Sphere args={[1, 32, 32]} position={position}>
            <MeshDistortMaterial
                color={color}
                attach="material"
                distort={0.3}
                speed={speed}
                roughness={0.2}
                metalness={0.8}
            />
        </Sphere>
    );
}

function Particles() {
    const count = 100;
    const particles = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        particles[i] = (Math.random() - 0.5) * 50;
    }

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.length / 3}
                    array={particles}
                    itemSize={3}
                    args={[particles, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.1}
                color="#4cc9f0"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
}

export function ThreeBackground() {
    return (
        <div className="fixed inset-0 -z-10 pointer-events-none opacity-20">
            <Canvas
                camera={{ position: [0, 0, 10], fov: 75 }}
                gl={{ alpha: true, antialias: true }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />

                    {/* Floating geometric shapes */}
                    <FloatingShape position={[-3, 0, 0]} color="#7209b7" speed={1.5} />
                    <FloatingShape position={[3, 0, 0]} color="#4cc9f0" speed={2} />
                    <FloatingShape position={[0, 3, -2]} color="#4361ee" speed={1.8} />
                    <FloatingShape position={[0, -3, -2]} color="#ec4899" speed={1.3} />

                    {/* Particle field */}
                    <Particles />

                    {/* Slow auto-rotation */}
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        enableRotate={false}
                        autoRotate
                        autoRotateSpeed={0.5}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
