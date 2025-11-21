import { useState, useRef } from "react";
import { X, Folder, Plus, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { GlassCard } from "../ui/GlassCard";
import { clsx } from "clsx";

interface NewSubjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddSubject: (name: string, color: string, imageUrl?: string) => void;
}

const COLORS = [
    { name: "White", value: "text-white", bg: "bg-white border border-gray-200 dark:border-gray-700" },
    { name: "Purple", value: "text-purple-500", bg: "bg-purple-500" },
    { name: "Blue", value: "text-blue-500", bg: "bg-blue-500" },
    { name: "Cyan", value: "text-cyan-400", bg: "bg-cyan-400" },
    { name: "Emerald", value: "text-emerald-500", bg: "bg-emerald-500" },
    { name: "Amber", value: "text-amber-400", bg: "bg-amber-400" },
    { name: "Orange", value: "text-orange-500", bg: "bg-orange-500" },
    { name: "Rose", value: "text-rose-500", bg: "bg-rose-500" },
];

export function NewSubjectModal({ isOpen, onClose, onAddSubject }: NewSubjectModalProps) {
    const [subjectName, setSubjectName] = useState("");
    const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleCreate = () => {
        if (subjectName.trim()) {
            onAddSubject(subjectName, selectedColor, selectedImage);
            onClose();
            setSubjectName("");
            setSelectedColor(COLORS[0].value);
            setSelectedImage(undefined);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("Image is too large. Please choose an image under 2MB.");
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <GlassCard className="relative w-full max-w-md p-6 space-y-6 animate-in fade-in zoom-in duration-200 bg-white dark:bg-black/40">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-foreground">New Subject</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-foreground dark:hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex justify-center py-4">
                    <div
                        className={`relative group w-32 h-32 rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 ${selectedImage ? 'bg-black/5 dark:bg-white/5' : `${selectedColor.replace('text-', 'bg-')}/10`}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {selectedImage ? (
                            <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className={`p-6 rounded-2xl ${selectedColor} transition-colors duration-300`}>
                                <Folder size={64} />
                            </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="text-white flex flex-col items-center gap-1">
                                <ImageIcon size={24} />
                                <span className="text-xs font-medium">Change Icon</span>
                            </div>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject Name</label>
                        <Input
                            placeholder="e.g. Advanced Mathematics"
                            value={subjectName}
                            onChange={(e) => setSubjectName(e.target.value)}
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleCreate();
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
                        <div className="flex flex-wrap gap-3">
                            {COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => setSelectedColor(color.value)}
                                    className={clsx(
                                        "w-8 h-8 rounded-full transition-all duration-200",
                                        color.bg,
                                        selectedColor === color.value ? "ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110" : "hover:scale-110 opacity-70 hover:opacity-100"
                                    )}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="secondary"
                            className="flex-1"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleCreate}
                            disabled={!subjectName.trim()}
                        >
                            <Plus size={18} />
                            <span>Create Subject</span>
                        </Button>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
