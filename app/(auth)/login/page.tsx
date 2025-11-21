"use client";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthInput } from "@/components/auth/AuthInput";
import { GradientButton } from "@/components/auth/GradientButton";
import { SocialButton } from "@/components/auth/SocialButton";
import { Mail, Lock, Rocket } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { signIn } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        console.log("Login attempt:", email);

        try {
            console.log("Calling signIn...");
            await signIn(email, password);
            console.log("SignIn successful!");
            // Router.push("/") is handled in AuthProvider
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.message || "Failed to sign in");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            {/* Brand Header */}
            <div className="mb-12 text-center relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.3)] backdrop-blur-sm animate-pulse-slow">
                    <Rocket className="w-8 h-8 text-cyan-400" />
                </div>
                <h1 className="text-5xl font-bold tracking-tighter text-white mb-2 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                    Organize
                </h1>
                <p className="text-cyan-200/60 text-sm font-medium tracking-widest uppercase">
                    Your files, beautifully organized
                </p>
            </div>

            <AuthCard
                title="Welcome Back"
                subtitle="Sign in to continue organizing"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <AuthInput
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        icon={<Mail size={18} />}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <AuthInput
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        icon={<Lock size={18} />}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-cyan-500/30 bg-white/5 text-cyan-500 focus:ring-cyan-500/20 focus:ring-2 transition-all"
                            />
                            <span className="text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
                        </label>
                        <Link
                            href="#"
                            className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <GradientButton type="submit" isLoading={isLoading}>
                        Sign In
                    </GradientButton>
                </form>

                {/* Sign up link */}
                <p className="mt-8 text-center text-sm text-gray-400">
                    Don't have an account?{" "}
                    <Link
                        href="/signup"
                        className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                    >
                        Create account
                    </Link>
                </p>
            </AuthCard>
        </div>
    );
}
