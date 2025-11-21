import { FileText, Image as ImageIcon, MoreVertical, Download, Trash2, File, Star, Share2 } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { clsx } from "clsx";
import { useState } from "react";
import * as storage from "@/lib/storage";
import { ShareModal } from "./ShareModal";

interface FileItemProps {
    id: string;
    name: string;
    type: "pdf" | "image" | "doc" | "other";
    date: string;
    size: number;
    isFavorite: boolean;
    storagePath: string;
    isSelected?: boolean;
    isShared?: boolean;
    onSelect?: (id: string, selected: boolean) => void;
    onDelete: (id: string) => void;
    onToggleFavorite: (id: string) => void;
}

export function FileItem({ id, name, type, date, size, isFavorite, storagePath, isSelected, isShared, onSelect, onDelete, onToggleFavorite }: FileItemProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const getFileIcon = (fileType: FileItemProps['type']) => {
        switch (fileType) {
            case "pdf": return <FileText />;
            case "image": return <ImageIcon />;
            case "doc": return <FileText />;
            default: return <File />;
        }
    };

    const getFileIconColor = (fileType: FileItemProps['type']) => {
        switch (fileType) {
            case "pdf": return "text-red-400";
            case "image": return "text-neon-blue";
            case "doc": return "text-blue-400";
            default: return "text-gray-400";
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const handleOpen = async () => {
        try {
            setIsDownloading(true);
            const url = await storage.getFileUrl(storagePath);
            window.open(url, '_blank');
        } catch (error) {
            console.error("Failed to open file:", error);
            alert("Failed to open file. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDownload = async () => {
        try {
            setIsDownloading(true);
            const url = await storage.getFileUrl(storagePath);
            const link = document.createElement('a');
            link.href = url;
            link.download = name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Failed to download file:", error);
            alert("Failed to download file. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <>
            <GlassCard className={clsx(
                "flex items-center justify-between gap-4 p-4 transition-all group",
                isSelected && "ring-2 ring-purple-500",
                "hover:shadow-lg hover:shadow-purple-500/10"
            )}>
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Checkbox for selection */}
                    {onSelect && (
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => onSelect(id, e.target.checked)}
                            className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500/20"
                        />
                    )}

                    {/* File icon */}
                    <div className={clsx(
                        "p-3 rounded-lg bg-white/5",
                        getFileIconColor(type)
                    )}>
                        {getFileIcon(type)}
                    </div>

                    {/* File details */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground truncate mb-1 group-hover:text-purple-400 transition-colors cursor-pointer" onClick={handleOpen}>
                                {isDownloading ? "Loading..." : name}
                            </h4>
                            {isShared && (
                                <span className="px-2 py-0.5 text-[10px] font-medium bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20">
                                    Shared
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span>{new Date(date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{formatFileSize(size)}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsShareModalOpen(true)}
                        className="p-2 text-gray-400 hover:text-cyan-400 rounded-lg transition-colors"
                        title="Share"
                    >
                        <Share2 size={18} />
                    </button>

                    <button
                        onClick={() => onToggleFavorite(id)}
                        className={clsx(
                            "p-2 rounded-lg transition-colors",
                            isFavorite ? "text-yellow-400 hover:text-yellow-500" : "text-gray-400 hover:text-yellow-400"
                        )}
                        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        <Star size={18} fill={isFavorite ? "currentColor" : "none"} />
                    </button>

                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="p-2 text-gray-400 hover:text-purple-400 rounded-lg transition-colors disabled:opacity-50"
                        title="Download"
                    >
                        <Download size={18} />
                    </button>

                    <button
                        onClick={() => onDelete(id)}
                        className="p-2 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </GlassCard>

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                fileId={id}
                fileName={name}
            />
        </>
    );
}
