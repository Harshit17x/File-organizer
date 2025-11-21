"use client";

import { useStorage } from "@/components/providers/StorageProvider";
import { SubjectCard } from "@/components/dashboard/SubjectCard";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import * as storage from "@/lib/storage";

export default function AllSubjectsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const { subjects, refreshSubjects, loading } = useStorage();

    // Filter subjects based on search query
    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeleteSubject = async (id: string) => {
        if (!confirm("Are you sure you want to delete this subject?")) {
            return;
        }

        try {
            await storage.moveSubjectToTrash(id);
            await refreshSubjects();
        } catch (error) {
            console.error("Failed to delete subject:", error);
            alert("Failed to delete subject. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-gray-500 dark:text-gray-400">Loading subjects...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">All Subjects</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {filteredSubjects.length === subjects.length
                            ? `${subjects.length} subject${subjects.length === 1 ? '' : 's'}`
                            : `Found ${filteredSubjects.length} of ${subjects.length} subject${subjects.length === 1 ? '' : 's'}`
                        }
                    </p>
                </div>

                <Input
                    placeholder="Search subjects..."
                    icon={<Search size={18} />}
                    className="w-full md:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSubjects.map((subject) => (
                    <SubjectCard
                        key={subject.id}
                        id={subject.id}
                        title={subject.name}
                        fileCount={subject.fileCount}
                        color={subject.color}
                        imageUrl={subject.imageUrl}
                        onDelete={handleDeleteSubject}
                    />
                ))}

                {subjects.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                        No subjects found.
                    </div>
                )}

                {searchQuery && filteredSubjects.length === 0 && subjects.length > 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                        No subjects found for "{searchQuery}"
                    </div>
                )}
            </div>
        </div>
    );
}
