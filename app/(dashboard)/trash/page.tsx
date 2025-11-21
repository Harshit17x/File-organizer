"use client";

import { useEffect, useState } from "react";
import { FileItem } from "@/components/dashboard/FileItem";
import { SubjectCard } from "@/components/dashboard/SubjectCard";
import { Trash2, RotateCcw, XCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import * as storage from "@/lib/storage";
import type { Subject, FileData } from "@/lib/types";

export default function TrashPage() {
    const [trashedSubjects, setTrashedSubjects] = useState<Subject[]>([]);
    const [trashedFiles, setTrashedFiles] = useState<FileData[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTrash = async () => {
        try {
            const [subjects, files] = await Promise.all([
                storage.getTrashedSubjects(),
                storage.getTrashedFiles()
            ]);
            setTrashedSubjects(subjects);
            setTrashedFiles(files);
        } catch (error) {
            console.error("Failed to load trash:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTrash();
    }, []);

    const handleRestoreSubject = async (id: string) => {
        try {
            await storage.restoreSubject(id);
            await loadTrash();
        } catch (error) {
            console.error("Failed to restore subject:", error);
        }
    };

    const handleRestoreFile = async (id: string) => {
        try {
            await storage.restoreFile(id);
            await loadTrash();
        } catch (error) {
            console.error("Failed to restore file:", error);
        }
    };

    const handleDeleteSubject = async (id: string) => {
        if (!confirm("Permanently delete this subject and all its files? This cannot be undone!")) return;

        try {
            await storage.deleteSubject(id);
            await loadTrash();
        } catch (error) {
            console.error("Failed to delete subject:", error);
        }
    };

    const handleDeleteFile = async (id: string) => {
        if (!confirm("Permanently delete this file? This cannot be undone!")) return;

        try {
            await storage.deleteFile(id);
            await loadTrash();
        } catch (error) {
            console.error("Failed to delete file:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-gray-500 dark:text-gray-400">Loading trash...</div>
            </div>
        );
    }

    const totalItems = trashedSubjects.length + trashedFiles.length;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Trash</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    {totalItems} items • Items in trash can be restored or deleted permanently
                </p>
            </div>

            <div className="space-y-4">
                <div className="grid gap-3">
                    {trashedSubjects.map((subject) => (
                        <GlassCard key={`subject-${subject.id}`} className="flex items-center justify-between p-4 hover:bg-white/5 group" hoverEffect={false}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-white/5 text-purple-400">
                                    <Trash2 size={20} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-foreground group-hover:text-purple-400 transition-colors">
                                        {subject.name}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Subject • {subject.fileCount} files
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleRestoreSubject(subject.id)}
                                >
                                    <RotateCcw size={16} className="mr-2" />
                                    Restore
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeleteSubject(subject.id)}
                                >
                                    <XCircle size={16} className="mr-2" />
                                    Delete Forever
                                </Button>
                            </div>
                        </GlassCard>
                    ))}

                    {trashedFiles.map((file) => (
                        <GlassCard key={`file-${file.id}`} className="flex items-center justify-between p-4 hover:bg-white/5 group" hoverEffect={false}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-white/5 text-gray-400">
                                    <Trash2 size={20} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-foreground group-hover:text-red-400 transition-colors">
                                        {file.name}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        File • {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleRestoreFile(file.id)}
                                >
                                    <RotateCcw size={16} className="mr-2" />
                                    Restore
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeleteFile(file.id)}
                                >
                                    <XCircle size={16} className="mr-2" />
                                    Delete Forever
                                </Button>
                            </div>
                        </GlassCard>
                    ))}

                    {totalItems === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            Trash is empty.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
