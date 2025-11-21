import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Subject, FileData } from './storage';

// Define the database schema
interface FileOrganizerDB extends DBSchema {
    subjects: {
        key: number;
        value: Subject;
        indexes: { 'by-trashed': number };
    };
    files: {
        key: number;
        value: FileData;
        indexes: { 'by-subject': number; 'by-trashed': number };
    };
}

const DB_NAME = 'file-organizer-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<FileOrganizerDB> | null = null;

// Open or create the database
export async function getDB(): Promise<IDBPDatabase<FileOrganizerDB>> {
    if (dbInstance) {
        return dbInstance;
    }

    dbInstance = await openDB<FileOrganizerDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Create subjects store
            if (!db.objectStoreNames.contains('subjects')) {
                const subjectStore = db.createObjectStore('subjects', { keyPath: 'id' });
                subjectStore.createIndex('by-trashed', 'isTrashed');
            }

            // Create files store
            if (!db.objectStoreNames.contains('files')) {
                const fileStore = db.createObjectStore('files', { keyPath: 'id' });
                fileStore.createIndex('by-subject', 'subjectId');
                fileStore.createIndex('by-trashed', 'isTrashed');
            }
        },
    });

    return dbInstance;
}

// Clear the database (for testing)
export async function clearDB(): Promise<void> {
    const db = await getDB();
    await db.clear('subjects');
    await db.clear('files');
}

// Get storage usage estimate
export async function getStorageEstimate(): Promise<{ usage: number; quota: number }> {
    if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        return {
            usage: estimate.usage || 0,
            quota: estimate.quota || 50 * 1024 * 1024, // Default to 50MB if not available
        };
    }
    // Fallback for browsers that don't support storage.estimate()
    return { usage: 0, quota: 50 * 1024 * 1024 };
}
