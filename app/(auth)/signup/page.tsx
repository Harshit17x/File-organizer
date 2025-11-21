"use client";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthInput } from "@/components/auth/AuthInput";
import { GradientButton } from "@/components/auth/GradientButton";
import { SocialButton } from "@/components/auth/SocialButton";
import { User, Mail, Lock, Rocket } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const { signUp } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await signUp(email, password, fullName);
            setSuccess(true);
            // Auto-redirect after showing success message
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Failed to create account");
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
                    Join the workspace
                </p>
            </div>

            <AuthCard
                title="Create Account"
                subtitle="Start organizing your subjects and files"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                            Account created! Redirecting to login...
                        </div>
                    )}

                    <AuthInput
                        label="Full Name"
                        type="text"
                        placeholder="John Doe"
                        icon={<User size={18} />}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />

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

                    <GradientButton type="submit" isLoading={isLoading} disabled={success}>
                        {success ? "Account Created!" : "Create Account"}
                    </GradientButton>
                </form>

                {/* Terms */}
                <p className="mt-4 text-xs text-center text-gray-500">
                    By creating an account, you agree to our{" "}
                    <Link href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                        Privacy Policy
                    </Link>
                </p>

                {/* Login link */}
                <p className="mt-8 text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </AuthCard>
        </div>
    );
}
