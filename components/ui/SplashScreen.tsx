"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Rocket, Terminal, Cpu, Wifi, Database, Shield } from "lucide-react";

const SYSTEM_LOGS = [
    "Initializing core systems...",
    "Loading neural interface...",
    "Connecting to secure storage...",
    "Decrypting user data...",
    "Optimizing particle engine...",
    "Syncing with cloud nodes...",
    "Verifying integrity...",
    "System ready."
];

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Progress simulation
        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + Math.random() * 2;
                if (next >= 100) {
                    clearInterval(timer);
                    setIsReady(true);
                    return 100;
                }
                return next;
            });
        }, 50);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // Log simulation
        let logIndex = 0;
        const logTimer = setInterval(() => {
            if (logIndex < SYSTEM_LOGS.length) {
                setLogs(prev => [...prev.slice(-4), SYSTEM_LOGS[logIndex]]);
                logIndex++;
            } else {
                clearInterval(logTimer);
            }
        }, 400);

        return () => clearInterval(logTimer);
    }, []);

    const handleStart = () => {
        onComplete();
    };

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] text-cyan-500 font-mono overflow-hidden"
        >
            {/* Background Grid Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(217,70,239,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />

            {/* Central Container */}
            <div className="relative z-10 w-full max-w-md p-8">

                {/* Header / Logo */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-[rgba(217,70,239,0.1)] border border-[rgba(217,70,239,0.3)] shadow-[0_0_30px_rgba(217,70,239,0.3)]">
                        <Rocket className="w-8 h-8 text-[#d946ef]" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tighter text-white mb-2">
                        ORGANIZE<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d946ef] to-[#06b6d4]">.OS</span>
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-xs text-[#d946ef]/60 uppercase tracking-widest">
                        <Shield className="w-3 h-3" /> Secure Environment
                    </div>
                </motion.div>

                {/* Main Display Area */}
                <div className="bg-[rgba(13,12,34,0.6)] border border-[rgba(217,70,239,0.3)] rounded-lg p-6 backdrop-blur-sm mb-8 relative overflow-hidden">
                    {/* Scanline */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#d946ef]/5 to-transparent h-full w-full animate-scan" />

                    {!isReady ? (
                        <>
                            {/* Progress Bar */}
                            <div className="mb-6">
                                <div className="flex justify-between text-xs mb-2 text-[#d946ef]">
                                    <span>SYSTEM_LOAD</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="h-2 bg-[rgba(217,70,239,0.1)] rounded-full overflow-hidden border border-[rgba(217,70,239,0.2)]">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-[#d946ef] to-[#06b6d4] shadow-[0_0_10px_rgba(217,70,239,0.5)]"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>

                            {/* System Logs */}
                            <div className="space-y-1 font-mono text-xs h-24 flex flex-col justify-end">
                                {logs.map((log, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-[#e0e7ff]/80 flex items-center gap-2"
                                    >
                                        <span className="text-[#d946ef]">{">"}</span> {log}
                                    </motion.div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-4"
                        >
                            <div className="text-[#06b6d4] mb-4 flex items-center justify-center gap-2">
                                <Wifi className="w-4 h-4" /> SYSTEM ONLINE
                            </div>
                            <p className="text-gray-400 text-sm mb-6">
                                Workspace environment initialized successfully.
                            </p>
                            <motion.button
                                onClick={handleStart}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                animate={{ boxShadow: ["0 0 20px rgba(217,70,239,0.4)", "0 0 40px rgba(217,70,239,0.6)", "0 0 20px rgba(217,70,239,0.4)"] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="group relative px-8 py-3 bg-gradient-to-r from-[#d946ef] to-[#06b6d4] hover:from-[#c026d3] hover:to-[#0891b2] text-white font-bold rounded-sm transition-all cursor-pointer z-50"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    ENTER WORKSPACE <Terminal className="w-4 h-4" />
                                </span>
                            </motion.button>
                        </motion.div>
                    )}
                </div>

                {/* Footer Status */}
                <div className="flex justify-between text-[10px] text-cyan-900 uppercase tracking-wider">
                    <div className="flex items-center gap-1"><Cpu className="w-3 h-3" /> CPU: OPTIMAL</div>
                    <div className="flex items-center gap-1"><Database className="w-3 h-3" /> MEM: STABLE</div>
                    <div>VER 2.0.4</div>
                </div>
            </div>
        </motion.div>
    );
}
