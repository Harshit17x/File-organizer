"use client";

import { useEffect, useState } from "react";
import { FileItem } from "@/components/dashboard/FileItem";
import { Grid, List as ListIcon } from "lucide-react";
import * as storage from "@/lib/storage";
import type { FileData } from "@/lib/types";

export default function FavoritesPage() {
    const [favoriteFiles, setFavoriteFiles] = useState<FileData[]>([]);
    const [loading, setLoading] = useState(true);

    const loadFavorites = async () => {
        try {
            const files = await storage.getFavoriteFiles();
            setFavoriteFiles(files);
        } catch (error) {
            console.error("Failed to load favorites:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFavorites();
    }, []);

    const handleToggleFavorite = async (id: string) => {
        try {
            await storage.toggleFileFavorite(id);
            await loadFavorites();
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Move this file to trash?")) return;

        try {
            await storage.moveFileToTrash(id);
            await loadFavorites();
        } catch (error) {
            console.error("Failed to delete file:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-gray-500 dark:text-gray-400">Loading favorites...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Favorites</h1>
                <p className="text-gray-500 dark:text-gray-400">{favoriteFiles.length} items</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 px-4">
                    <span>Starred Files</span>
                    <div className="flex items-center gap-2">
                        <button className="p-1 hover:text-foreground transition-colors"><ListIcon size={18} /></button>
                        <button className="p-1 hover:text-foreground transition-colors"><Grid size={18} /></button>
                    </div>
                </div>

                <div className="grid gap-3">
                    {favoriteFiles.map((file) => (
                        <FileItem
                            key={file.id}
                            id={file.id}
                            name={file.name}
                            type={file.type as "pdf" | "image" | "doc" | "other"}
                            date={file.uploadedAt}
                            size={file.size}
                            isFavorite={true}
                            storagePath={file.storagePath}
                            onDelete={handleDelete}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    ))}
                    {favoriteFiles.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            No favorite files yet. Star some files to see them here!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
