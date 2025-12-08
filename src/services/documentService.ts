import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Document } from '../types';

const COLLECTION_NAME = 'documents';

export const documentService = {
    // Upload a document
    async upload(
        userId: string,
        businessProfileId: string,
        file: File,
        category: string,
        expiryDate?: Date
    ): Promise<string> {
        // Create a unique file path
        const timestamp = Date.now();
        const storagePath = `documents/${userId}/${timestamp}_${file.name}`;
        const storageRef = ref(storage, storagePath);

        // Upload file to Firebase Storage
        await uploadBytes(storageRef, file);

        // Get download URL
        const downloadUrl = await getDownloadURL(storageRef);

        // Create document metadata in Firestore
        const docRef = doc(collection(db, COLLECTION_NAME));
        const documentData: any = {
            userId,
            businessProfileId,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            storagePath,
            downloadUrl,
            category,
            uploadedAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        if (expiryDate) {
            documentData.expiryDate = Timestamp.fromDate(expiryDate);
        }

        await setDoc(docRef, documentData);
        return docRef.id;
    },

    // Get document by ID
    async getById(id: string): Promise<Document | null> {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Document;
        }
        return null;
    },

    // Get all documents for a user
    async getByUserId(userId: string): Promise<Document[]> {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('userId', '==', userId),
            orderBy('uploadedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Document[];
    },

    // Get documents by category
    async getByCategory(userId: string, category: string): Promise<Document[]> {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('userId', '==', userId),
            where('category', '==', category),
            orderBy('uploadedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Document[];
    },

    // Update document metadata
    async update(
        id: string,
        data: { category?: string; expiryDate?: Date }
    ): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        const updateData: any = {
            ...data,
            updatedAt: serverTimestamp(),
        };

        if (data.expiryDate) {
            updateData.expiryDate = Timestamp.fromDate(data.expiryDate);
        }

        await updateDoc(docRef, updateData);
    },

    // Delete document (removes from both Storage and Firestore)
    async delete(id: string): Promise<void> {
        // Get document metadata
        const document = await this.getById(id);
        if (!document) {
            throw new Error('Document not found');
        }

        // Delete from Firebase Storage
        const storageRef = ref(storage, document.storagePath);
        await deleteObject(storageRef);

        // Delete from Firestore
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    },

    // Get expiring documents (within next 30 days)
    async getExpiringDocuments(userId: string): Promise<Document[]> {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const q = query(
            collection(db, COLLECTION_NAME),
            where('userId', '==', userId),
            where('expiryDate', '<=', Timestamp.fromDate(thirtyDaysFromNow)),
            orderBy('expiryDate', 'asc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Document[];
    },

    // Get all documents (admin only)
    async getAll(): Promise<Document[]> {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Document[];
    },
};
