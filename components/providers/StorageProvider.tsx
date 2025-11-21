"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Subject, FileData } from "../../lib/types";
import * as storage from "@/lib/storage";
import { useAuth } from "./AuthProvider";

interface StorageContextType {
    subjects: Subject[];
    files: FileData[];
    loading: boolean;
    refreshSubjects: () => Promise<void>;
    refreshFiles: () => Promise<void>;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export function StorageProvider({ children }: { children: React.ReactNode }) {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [files, setFiles] = useState<FileData[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const refreshSubjects = async () => {
        if (!user) {
            setSubjects([]);
            return;
        }

        try {
            const data = await storage.getAllSubjects();
            setSubjects(data);
        } catch (error) {
            console.error("Failed to load subjects:", error);
        }
    };

    const refreshFiles = async () => {
        if (!user) {
            setFiles([]);
            return;
        }

        try {
            // Note: We'll load files per-subject as needed
            // For now, just clear the global files array
            setFiles([]);
        } catch (error) {
            console.error("Failed to load files:", error);
        }
    };

    // Load data when user changes
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([refreshSubjects(), refreshFiles()]);
            setLoading(false);
        };

        if (user) {
            loadData();
        } else {
            setSubjects([]);
            setFiles([]);
            setLoading(false);
        }
    }, [user]);

    return (
        <StorageContext.Provider
            value={{
                subjects,
                files,
                loading,
                refreshSubjects,
                refreshFiles,
            }}
        >
            {children}
        </StorageContext.Provider>
    );
}

export const useStorage = () => {
    const context = useContext(StorageContext);
    if (context === undefined) {
        throw new Error("useStorage must be used within a StorageProvider");
    }
    return context;
};
