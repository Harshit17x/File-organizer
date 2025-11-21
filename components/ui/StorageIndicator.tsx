import { useEffect, useState } from "react";
import { HardDrive } from "lucide-react";
import { motion } from "framer-motion";
import { getStorageEstimate } from "@/lib/indexedDB";

function useStorageSize() {
    const [storage, setStorage] = useState({ usage: 0, quota: 50 * 1024 * 1024 });

    useEffect(() => {
        const updateStorage = async () => {
            try {
                const estimate = await getStorageEstimate();
                setStorage(estimate);
            } catch (error) {
                console.error("Failed to get storage estimate:", error);
            }
        };

        updateStorage();

        // Recalculate periodically
        const interval = setInterval(updateStorage, 3000);
        return () => clearInterval(interval);
    }, []);

    return storage;
}

export function StorageIndicator() {
    const { usage, quota } = useStorageSize();
    const percentage = Math.min((usage / quota) * 100, 100);

    const getColor = () => {
        if (percentage < 50) return "bg-green-500";
        if (percentage < 80) return "bg-yellow-500";
        return "bg-red-500";
    };

    const getTextColor = () => {
        if (percentage < 50) return "text-green-500";
        if (percentage < 80) return "text-yellow-500";
        return "text-red-500";
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes}B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
        if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)}GB`;
    };

    return (
        <div className="px-4 py-3 border-t border-white/10">
            <div className="flex items-center gap-2 mb-2">
                <HardDrive size={16} className={`${getTextColor()}`} />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Storage
                </span>
                <span className={`text-xs font-semibold ml-auto ${getTextColor()}`}>
                    {percentage.toFixed(0)}%
                </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full ${getColor()} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </div>

            {/* Size Info */}
            <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-500">
                    {formatSize(usage)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                    {formatSize(quota)}
                </span>
            </div>

            {/* Warning Message */}
            {percentage >= 80 && (
                <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-xs text-red-500 mt-2"
                >
                    {percentage >= 95 ? "Almost full! Delete files to continue." : "Storage running low. Consider deleting files."}
                </motion.p>
            )}
        </div>
    );
}
