"use client";

import { useState } from "react";
import { X, Share2, Mail, Check } from "lucide-react";
import { shareFile } from "@/lib/storage";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileId: string;
    fileName: string;
}

export function ShareModal({ isOpen, onClose, fileId, fileName }: ShareModalProps) {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess(false);

        try {
            await shareFile(fileId, email);
            setSuccess(true);
            setEmail("");
            setTimeout(() => {
                onClose();
                setSuccess(false);
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Failed to share file");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-[#0A0A0F] border border-cyan-500/20 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                            <Share2 size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Share File</h3>
                            <p className="text-xs text-gray-400 truncate max-w-[200px]">{fileName}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {success ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 mb-4 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                                <Check size={32} />
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-2">Shared Successfully!</h4>
                            <p className="text-gray-400">The file has been shared with {email}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Recipient Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="friend@example.com"
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Share2 size={18} />
                                            Share File
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
