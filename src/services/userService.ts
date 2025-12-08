import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    where,
    serverTimestamp,
    orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { User, UserRole } from '../types';

const COLLECTION_NAME = 'users';

export const userService = {
    // Get all users (admin only)
    async getAll(): Promise<User[]> {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as User[];
    },

    // Get user by ID
    async getById(id: string): Promise<User | null> {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as User;
        }
        return null;
    },

    // Update user role (admin only)
    async updateRole(id: string, role: UserRole): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            role,
            updatedAt: serverTimestamp(),
        });
    },

    // Update user profile
    async updateProfile(id: string, data: Partial<User>): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    },
};
