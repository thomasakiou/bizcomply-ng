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
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { BusinessProfile, BusinessProfileFormData } from '../types';

const COLLECTION_NAME = 'business_profiles';

export const businessService = {
    // Create a new business profile
    async create(userId: string, data: BusinessProfileFormData): Promise<string> {
        const docRef = doc(collection(db, COLLECTION_NAME));
        const businessProfile = {
            ...data,
            userId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        await setDoc(docRef, businessProfile);
        return docRef.id;
    },

    // Get business profile by ID
    async getById(id: string): Promise<BusinessProfile | null> {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as BusinessProfile;
        }
        return null;
    },

    // Get business profile by user ID
    async getByUserId(userId: string): Promise<BusinessProfile | null> {
        const q = query(collection(db, COLLECTION_NAME), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() } as BusinessProfile;
        }
        return null;
    },

    // Update business profile
    async update(id: string, data: Partial<BusinessProfileFormData>): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    },

    // Delete business profile
    async delete(id: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    },

    // Get all business profiles (admin only)
    async getAll(): Promise<BusinessProfile[]> {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as BusinessProfile[];
    },
};
