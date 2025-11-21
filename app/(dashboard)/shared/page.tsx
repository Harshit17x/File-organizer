"use client";

import { useEffect, useState } from "react";
import { FileItem } from "@/components/dashboard/FileItem";
import { getSharedFiles, toggleFileFavorite, deleteFile } from "@/lib/storage";
import { FileData } from "@/lib/types";
import { Loader2, Share2 } from "lucide-react";

export default function SharedPage() {
    const [files, setFiles] = useState<FileData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [debugInfo, setDebugInfo] = useState<any>(null);

    useEffect(() => {
        loadSharedFiles();
    }, []);

    const loadSharedFiles = async () => {
        try {
            setIsLoading(true);
            // Debug: Get current user
            const { supabase } = await import('@/lib/supabase/client');
            const { data: { user } } = await supabase.auth.getUser();

            const data = await getSharedFiles();
            setFiles(data);

            setDebugInfo({
                currentUser: user?.email,
                filesFound: data.length,
                timestamp: new Date().toISOString()
            });
        } catch (err: any) {
            console.error("Failed to load shared files:", err);
            setError("Failed to load shared files: " + err.message);
            setDebugInfo({ error: err.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleFavorite = async (id: string) => {
        try {
            await toggleFileFavorite(id);
            // Update local state
            setFiles(files.map(f =>
                f.id === id ? { ...f, isFavorite: !f.isFavorite } : f
            ));
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
        }
    };

    // Note: Users cannot delete shared files from the sender's storage, 
    // but we could implement "remove from my shared list" later.
    // For now, we'll disable the delete action or show a message.
    const handleDelete = async (id: string) => {
        alert("You cannot delete files shared with you.");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Shared with Me</h1>
                    <p className="text-gray-400">Files shared with you by others</p>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                    {error}
                </div>
            )}

            {/* DEBUG INFO - TEMPORARY */}
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-4">
                <p><strong>Debug Info:</strong></p>
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>

            {files.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 mb-4 rounded-full bg-white/5 flex items-center justify-center text-gray-500">
                        <Share2 size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No shared files yet</h3>
                    <p className="text-gray-400 max-w-sm">
                        When someone shares a file with you via email, it will appear here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {files.map((file) => (
                        <FileItem
                            key={file.id}
                            id={file.id}
                            name={file.name}
                            type={file.type as any}
                            date={file.uploadedAt}
                            size={file.size}
                            isFavorite={file.isFavorite}
                            storagePath={file.storagePath}
                            isShared={true}
                            onDelete={handleDelete}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
