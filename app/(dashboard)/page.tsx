"use client";

import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SubjectCard } from "@/components/dashboard/SubjectCard";
import { NewSubjectModal } from "@/components/dashboard/NewSubjectModal";
import { useState } from "react";
import { useStorage } from "@/components/providers/StorageProvider";
import { motion, AnimatePresence } from "framer-motion";
import * as storage from "@/lib/storage";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { subjects, refreshSubjects, loading } = useStorage();

  // Filter subjects based on search query
  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSubject = async (name: string, color: string, imageUrl?: string) => {
    try {
      await storage.createSubject({ name, color, imageUrl });
      await refreshSubjects();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create subject:", error);
      alert("Failed to create subject. Please try again.");
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject? All files will be moved to trash.")) {
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
      <NewSubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSubject={handleAddSubject}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
            <span className="w-2 h-8 bg-gradient-to-b from-[#d946ef] to-[#06b6d4] rounded-sm shadow-[0_0_10px_rgba(217,70,239,0.5)]" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#e0e7ff]">MY SUBJECTS</span>
          </h1>
          <p className="text-[#a5b4fc] pl-5">
            {filteredSubjects.length === subjects.length
              ? "Manage and organize your academic files"
              : `found ${filteredSubjects.length} subject${filteredSubjects.length === 1 ? '' : 's'}`
            }
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search subjects..."
            icon={<Search size={18} />}
            className="w-full md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            <span>New Subject</span>
          </Button>
        </div>
      </div>

      {/* Subjects Grid */}
      {filteredSubjects.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery ? "No subjects found matching your search." : "No subjects yet. Create your first subject to get started!"}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={20} />
              <span>Create Subject</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredSubjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05 // Stagger effect for initial load
                }}
              >
                <SubjectCard
                  id={subject.id}
                  title={subject.name}
                  fileCount={subject.fileCount}
                  color={subject.color}
                  imageUrl={subject.imageUrl}
                  onDelete={handleDeleteSubject}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
