import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Star, X } from "lucide-react";
import { Button } from "../ui/Button";

interface BulkActionBarProps {
    selectedCount: number;
    onDelete: () => void;
    onFavorite: () => void;
    onUnfavorite: () => void;
    onDeselectAll: () => void;
}

export function BulkActionBar({
    selectedCount,
    onDelete,
    onFavorite,
    onUnfavorite,
    onDeselectAll
}: BulkActionBarProps) {
    return (
        <AnimatePresence>
            {selectedCount > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
                >
                    <div className="bg-white dark:bg-black/90 backdrop-blur-xl border border-black/10 dark:border-white/20 rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4">
                        <span className="text-sm font-medium text-foreground">
                            {selectedCount} selected
                        </span>

                        <div className="h-6 w-px bg-black/10 dark:bg-white/10" />

                        <div className="flex items-center gap-2">
                            <Button
                                variant="secondary"
                                onClick={onFavorite}
                                className="h-9"
                            >
                                <Star size={16} />
                                <span className="hidden sm:inline">Favorite</span>
                            </Button>

                            <Button
                                variant="secondary"
                                onClick={onUnfavorite}
                                className="h-9"
                            >
                                <Star size={16} fill="currentColor" />
                                <span className="hidden sm:inline">Unfavorite</span>
                            </Button>

                            <Button
                                variant="secondary"
                                onClick={onDelete}
                                className="h-9 text-red-500 hover:bg-red-500/10"
                            >
                                <Trash2 size={16} />
                                <span className="hidden sm:inline">Delete</span>
                            </Button>

                            <div className="h-6 w-px bg-black/10 dark:bg-white/10 ml-2" />

                            <button
                                onClick={onDeselectAll}
                                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                                title="Deselect All"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
