import { supabase } from './supabase/client';
import type { Subject, FileData } from '@/lib/types';

// ========================================
// SUBJECT OPERATIONS
// ========================================

export async function getAllSubjects(): Promise<Subject[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_trashed', false)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(s => ({
        id: s.id,
        name: s.name,
        color: s.color,
        imageUrl: s.image_url,
        fileCount: s.file_count,
        createdAt: s.created_at,
    }));
}

export async function getSubjectById(id: string): Promise<Subject | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .eq('is_trashed', false)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
    }

    return {
        id: data.id,
        name: data.name,
        color: data.color,
        imageUrl: data.image_url,
        fileCount: data.file_count,
        createdAt: data.created_at,
    };
}

export async function createSubject(subject: Omit<Subject, 'id' | 'createdAt' | 'fileCount'>): Promise<Subject> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('subjects')
        .insert({
            user_id: user.id,
            name: subject.name,
            color: subject.color,
            image_url: subject.imageUrl,
        })
        .select()
        .single();

    if (error) throw error;

    return {
        id: data.id,
        name: data.name,
        color: data.color,
        imageUrl: data.image_url,
        fileCount: 0,
        createdAt: data.created_at,
    };
}

export async function updateSubject(id: string, updates: Partial<Omit<Subject, 'id' | 'createdAt'>>): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.color !== undefined) updateData.color = updates.color;
    if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;

    const { error } = await supabase
        .from('subjects')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) throw error;
}

export async function deleteSubject(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) throw error;
}

export async function moveSubjectToTrash(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
        .from('subjects')
        .update({
            is_trashed: true,
            deleted_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) throw error;
}

export async function getTrashedSubjects(): Promise<Subject[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_trashed', true)
        .order('deleted_at', { ascending: false });

    if (error) throw error;

    return data.map(s => ({
        id: s.id,
        name: s.name,
        color: s.color,
        imageUrl: s.image_url,
        fileCount: s.file_count,
        createdAt: s.created_at,
    }));
}

export async function restoreSubject(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
        .from('subjects')
        .update({
            is_trashed: false,
            deleted_at: null
        })
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) throw error;
}

// ========================================
// FILE OPERATIONS
// ========================================

export async function getFilesBySubject(subjectId: string): Promise<FileData[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('subject_id', subjectId)
        .eq('user_id', user.id)
        .eq('is_trashed', false)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(f => ({
        id: f.id,
        name: f.name,
        size: f.size,
        type: f.type,
        subjectId: f.subject_id,
        uploadedAt: f.created_at,
        isFavorite: f.is_favorite,
        storagePath: f.storage_path,
    }));
}

export async function addFile(file: Omit<FileData, 'id' | 'uploadedAt' | 'isFavorite'>, fileBlob: Blob): Promise<FileData> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Sanitize filename - remove spaces and special characters
    const sanitizedName = file.name
        .replace(/\s+/g, '_')  // Replace spaces with underscores
        .replace(/[^\w\-_.]/g, '');  // Remove special characters except underscore, dash, dot

    // Upload file to Supabase Storage
    const fileName = `${user.id}/${Date.now()}_${sanitizedName}`;
    const { error: uploadError } = await supabase.storage
        .from('user-files')
        .upload(fileName, fileBlob);

    if (uploadError) throw uploadError;

    // Create file record in database
    const { data, error } = await supabase
        .from('files')
        .insert({
            user_id: user.id,
            subject_id: file.subjectId,
            name: file.name,  // Keep original name for display
            size: file.size,
            type: file.type,
            storage_path: fileName,
        })
        .select()
        .single();

    if (error) throw error;

    // Update subject file count
    await updateSubjectFileCount(file.subjectId);

    return {
        id: data.id,
        name: data.name,
        size: data.size,
        type: data.type,
        subjectId: data.subject_id,
        uploadedAt: data.created_at,
        isFavorite: false,
        storagePath: data.storage_path,
    };
}

export async function getFileUrl(storagePath: string): Promise<string> {
    const { data } = await supabase.storage
        .from('user-files')
        .createSignedUrl(storagePath, 3600); // 1 hour expiry

    if (!data) throw new Error('Failed to get file URL');
    return data.signedUrl;
}

export async function deleteFile(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get file info first
    const { data: file } = await supabase
        .from('files')
        .select('storage_path, subject_id')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (!file) throw new Error('File not found');

    // Delete from storage
    await supabase.storage
        .from('user-files')
        .remove([file.storage_path]);

    // Delete from database
    const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) throw error;

    // Update subject file count
    await updateSubjectFileCount(file.subject_id);
}

export async function toggleFileFavorite(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get current favorite status
    const { data: file } = await supabase
        .from('files')
        .select('is_favorite')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (!file) throw new Error('File not found');

    // Toggle favorite
    const { error } = await supabase
        .from('files')
        .update({ is_favorite: !file.is_favorite })
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) throw error;
}

export async function getFavoriteFiles(): Promise<FileData[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_favorite', true)
        .eq('is_trashed', false)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(f => ({
        id: f.id,
        name: f.name,
        size: f.size,
        type: f.type,
        subjectId: f.subject_id,
        uploadedAt: f.created_at,
        isFavorite: true,
        storagePath: f.storage_path,
    }));
}

export async function moveFileToTrash(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: file } = await supabase
        .from('files')
        .select('subject_id')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (!file) throw new Error('File not found');

    const { error } = await supabase
        .from('files')
        .update({
            is_trashed: true,
            deleted_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) throw error;

    await updateSubjectFileCount(file.subject_id);
}

export async function getTrashedFiles(): Promise<FileData[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_trashed', true)
        .order('deleted_at', { ascending: false });

    if (error) throw error;

    return data.map(f => ({
        id: f.id,
        name: f.name,
        size: f.size,
        type: f.type,
        subjectId: f.subject_id,
        uploadedAt: f.created_at,
        isFavorite: f.is_favorite,
        storagePath: f.storage_path,
    }));
}

export async function restoreFile(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: file } = await supabase
        .from('files')
        .select('subject_id')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (!file) throw new Error('File not found');

    const { error } = await supabase
        .from('files')
        .update({
            is_trashed: false,
            deleted_at: null
        })
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) throw error;

    await updateSubjectFileCount(file.subject_id);
}

// ========================================
// HELPER FUNCTIONS
// ========================================

async function updateSubjectFileCount(subjectId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Count non-trashed files
    const { count, error } = await supabase
        .from('files')
        .select('*', { count: 'exact', head: true })
        .eq('subject_id', subjectId)
        .eq('user_id', user.id)
        .eq('is_trashed', false);

    if (error) throw error;

    // Update subject file count
    await supabase
        .from('subjects')
        .update({ file_count: count || 0 })
        .eq('id', subjectId)
        .eq('user_id', user.id);
}

export async function searchFiles(query: string): Promise<FileData[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_trashed', false)
        .ilike('name', `%${query}%`)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(f => ({
        id: f.id,
        name: f.name,
        size: f.size,
        type: f.type,
        subjectId: f.subject_id,
        uploadedAt: f.created_at,
        isFavorite: f.is_favorite,
        storagePath: f.storage_path,
    }));
}

// ========================================
// SHARING OPERATIONS
// ========================================

export async function shareFile(fileId: string, email: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    const { error } = await supabase
        .from('shared_files')
        .insert({
            file_id: fileId,
            shared_by: user.id,
            shared_with_email: normalizedEmail,
        });

    if (error) {
        if (error.code === '23505') { // Unique violation
            throw new Error('File is already shared with this user');
        }
        throw error;
    }
}

export async function getSharedFiles(): Promise<FileData[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    console.log('[getSharedFiles] Checking shares for:', user.email);

    // Get files shared with current user's email
    const { data: sharedRecords, error: sharedError } = await supabase
        .from('shared_files')
        .select('file_id')
        .eq('shared_with_email', user.email?.toLowerCase());

    if (sharedError) {
        console.error('[getSharedFiles] Error fetching shares:', sharedError);
        throw sharedError;
    }

    if (!sharedRecords || sharedRecords.length === 0) {
        console.log('[getSharedFiles] No shared files found');
        return [];
    }

    const fileIds = sharedRecords.map(r => r.file_id);
    console.log('[getSharedFiles] Found file IDs:', fileIds);

    // Fetch the actual files
    const { data: files, error: filesError } = await supabase
        .from('files')
        .select('*')
        .in('id', fileIds)
        .eq('is_trashed', false);

    if (filesError) throw filesError;

    return files.map(f => ({
        id: f.id,
        name: f.name,
        size: f.size,
        type: f.type,
        subjectId: f.subject_id,
        uploadedAt: f.created_at,
        isFavorite: f.is_favorite,
        storagePath: f.storage_path,
        isShared: true // Flag to indicate this is a shared file
    }));
}
