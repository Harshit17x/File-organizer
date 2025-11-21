"use client";

import { ArrowLeft, Upload, Filter, Grid, List as ListIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FileItem } from "@/components/dashboard/FileItem";
import { use, useRef, useState, useEffect } from "react";
import * as storage from "@/lib/storage";
import type { Subject, FileData } from "@/lib/types";

export default function SubjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [subject, setSubject] = useState<Subject | null>(null);
    const [files, setFiles] = useState<FileData[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadSubjectAndFiles = async () => {
        try {
            const [subjectData, filesData] = await Promise.all([
                storage.getSubjectById(id),
                storage.getFilesBySubject(id)
            ]);
            setSubject(subjectData);
            setFiles(filesData);
        } catch (error) {
            console.error("Failed to load subject:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubjectAndFiles();
    }, [id]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = async (selectedFiles: FileList | null) => {
        if (!selectedFiles || selectedFiles.length === 0 || !subject) return;

        setIsUploading(true);

        try {
            const uploadPromises = Array.from(selectedFiles).map(async (file) => {
                const fileData: Omit<FileData, 'id' | 'uploadedAt' | 'isFavorite'> = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    subjectId: id,
                    storagePath: '', // Will be set by storage.addFile
                };

                await storage.addFile(fileData, file);
            });

            await Promise.all(uploadPromises);
            await loadSubjectAndFiles();
            alert(`Successfully uploaded ${selectedFiles.length} file(s)`);
        } catch (error) {
            console.error("File upload failed:", error);
            alert("Failed to upload some files. Please try again.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFiles = e.dataTransfer.files;
        await handleFileUpload(droppedFiles);
    };

    const handleDeleteFile = async (fileId: string) => {
        if (!confirm("Move this file to trash?")) return;

        try {
            await storage.moveFileToTrash(fileId);
            await loadSubjectAndFiles();
        } catch (error) {
            console.error("Failed to delete file:", error);
            alert("Failed to delete file. Please try again.");
        }
    };

    const handleToggleFavorite = async (fileId: string) => {
        try {
            await storage.toggleFileFavorite(fileId);
            await loadSubjectAndFiles();
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    if (!subject) {
        return (
            <div className="space-y-8">
                <Link href="/subjects">
                    <Button variant="secondary" size="sm">
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Subjects
                    </Button>
                </Link>
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">Subject not found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/subjects">
                        <Button variant="secondary" size="sm">
                            <ArrowLeft size={16} className="mr-2" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">{subject.name}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {files.length} file{files.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button onClick={handleUploadClick} disabled={isUploading}>
                        <Upload size={20} />
                        <span>{isUploading ? "Uploading..." : "Upload Files"}</span>
                    </Button>
                </div>
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="*/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
            />

            {/* Drag and drop area */}
            <div
                className={`border-2 border-dashed rounded-xl p-8 transition-all ${isDragging
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-gray-700 bg-white/5"
                    }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="text-center">
                    <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                        Drop files here or click to upload
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Maximum file size: 10MB
                    </p>
                    <Button onClick={handleUploadClick} variant="secondary" disabled={isUploading}>
                        {isUploading ? "Uploading..." : "Choose Files"}
                    </Button>
                </div>
            </div>

            {/* Files list */}
            {files.length > 0 ? (
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 px-4">
                        <span>{files.length} Files</span>
                        <div className="flex items-center gap-2">
                            <button className="p-1 hover:text-foreground transition-colors">
                                <ListIcon size={18} />
                            </button>
                            <button className="p-1 hover:text-foreground transition-colors">
                                <Grid size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-3">
                        {files.map((file) => (
                            <FileItem
                                key={file.id}
                                id={file.id}
                                name={file.name}
                                type={file.type as "pdf" | "image" | "doc" | "other"}
                                date={file.uploadedAt}
                                size={file.size}
                                isFavorite={file.isFavorite}
                                storagePath={file.storagePath}
                                onDelete={handleDeleteFile}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No files uploaded yet. Upload your first file to get started!
                </div>
            )}
        </div>
    );
}
