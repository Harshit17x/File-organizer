export interface Subject {
    id: string;
    name: string;
    color: string;
    imageUrl?: string;
    fileCount: number;
    createdAt: string;
}

export interface FileData {
    id: string;
    name: string;
    size: number;
    type: string;
    subjectId: string;
    uploadedAt: string;
    isFavorite: boolean;
    storagePath: string;
}
