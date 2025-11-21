import { storage, STORAGE_KEYS, Subject, FileData, DEFAULT_SUBJECTS } from './storage';

/**
 * Migrate data from localStorage to IndexedDB
 * This runs once on first load after the IndexedDB migration
 */
export async function migrateFromLocalStorage(): Promise<void> {
    // Check if already migrated
    if (typeof window === "undefined") return;

    const migrated = localStorage.getItem(STORAGE_KEYS.MIGRATED);
    if (migrated === "true") {
        return; // Already migrated
    }

    console.log("Starting migration from localStorage to IndexedDB...");

    try {
        // Get data from localStorage
        const subjectsData = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
        const filesData = localStorage.getItem(STORAGE_KEYS.FILES);

        let subjects: Subject[] = DEFAULT_SUBJECTS;
        let files: FileData[] = [];

        if (subjectsData) {
            try {
                subjects = JSON.parse(subjectsData);
            } catch (e) {
                console.error("Failed to parse subjects from localStorage:", e);
            }
        }

        if (filesData) {
            try {
                files = JSON.parse(filesData);
            } catch (e) {
                console.error("Failed to parse files from localStorage:", e);
            }
        }

        // Save to IndexedDB
        await storage.saveSubjects(subjects);
        await storage.saveFiles(files);

        // Mark as migrated
        localStorage.setItem(STORAGE_KEYS.MIGRATED, "true");

        // Optionally clear old data (keep for now as backup)
        // localStorage.removeItem(STORAGE_KEYS.SUBJECTS);
        // localStorage.removeItem(STORAGE_KEYS.FILES);

        console.log(`Migration complete! Migrated ${subjects.length} subjects and ${files.length} files.`);
    } catch (error) {
        console.error("Migration failed:", error);
        // Don't throw - allow app to continue with default data
    }
}
