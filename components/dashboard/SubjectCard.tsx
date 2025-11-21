import { Folder, Trash2 } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import Link from "next/link";

interface SubjectCardProps {
    id: string;
    title: string;
    fileCount: number;
    color: string;
    imageUrl?: string;
    onDelete?: (id: string) => void;
}

import { useState } from "react";
import { motion } from "framer-motion";

export function SubjectCard({ id, title, fileCount, color, imageUrl, onDelete }: SubjectCardProps) {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative group"
        >
            <Link href={`/subjects/${id}`} className="block h-full">
                <GlassCard className="p-6 flex flex-col items-center text-center gap-4 h-full relative overflow-hidden group-hover:shadow-lg group-hover:shadow-[#d946ef]/20 transition-all duration-300 border border-[#d946ef]/20 group-hover:border-[#d946ef]/50">
                    {/* Tech Header */}
                    <div className="absolute top-2 left-3 text-[10px] font-mono text-[#d946ef]/60 tracking-widest">
                        MOD_ID: {id.slice(0, 4).toUpperCase()}
                    </div>
                    <div className="absolute top-2 right-3 text-[10px] font-mono text-[#06b6d4]/60 tracking-widest">
                        STATUS: ACT
                    </div>

                    <motion.div
                        className={`p-4 rounded-full bg-[rgba(217,70,239,0.05)] ${color} mb-2 overflow-hidden relative border border-[#d946ef]/20 mt-4`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                        {imageUrl && !imageError && (
                            <img
                                src={imageUrl}
                                alt={title}
                                className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                onLoad={() => setImageLoaded(true)}
                                onError={() => setImageError(true)}
                            />
                        )}

                        {(!imageUrl || imageError || !imageLoaded) && (
                            <Folder size={32} fill="currentColor" className="opacity-80" />
                        )}

                        {imageUrl && <div className="w-8 h-8" />} {/* Spacer for size */}
                    </motion.div>

                    <div className="w-full">
                        <h3 className="text-lg font-bold font-mono text-foreground mb-1 group-hover:text-[#d946ef] transition-colors uppercase tracking-tight">{title}</h3>

                        {/* Tech Data Grid */}
                        <div className="grid grid-cols-2 gap-2 mt-3 border-t border-[#d946ef]/10 pt-3">
                            <div className="text-xs font-mono text-gray-500 dark:text-gray-400 flex flex-col items-center">
                                <span className="text-[10px] text-[#06b6d4]/60 uppercase">Files</span>
                                <span>{fileCount}</span>
                            </div>
                            <div className="text-xs font-mono text-gray-500 dark:text-gray-400 flex flex-col items-center">
                                <span className="text-[10px] text-[#06b6d4]/60 uppercase">Size</span>
                                <span>-- MB</span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative glow */}
                    <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${color.replace('text-', 'bg-')}/10 blur-3xl rounded-full pointer-events-none group-hover:opacity-100 transition-opacity duration-500`} />
                </GlassCard>
            </Link>

            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete?.(id);
                }}
                className="absolute top-2 right-2 p-2 rounded-full bg-black/20 hover:bg-red-500/20 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                title="Move to Trash"
            >
                <Trash2 size={16} />
            </button>
        </motion.div>
    );
}
