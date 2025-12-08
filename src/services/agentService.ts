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
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Agent } from '../types';

const COLLECTION_NAME = 'agents';

export const agentService = {
    // Create new agent profile
    async create(userId: string, data: Partial<Agent>): Promise<string> {
        const docRef = doc(collection(db, COLLECTION_NAME));
        const agentData = {
            ...data,
            userId,
            isVerified: false,
            rating: 0,
            completedJobs: 0,
            active: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        await setDoc(docRef, agentData);
        return docRef.id;
    },

    // Get agent by ID
    async getById(id: string): Promise<Agent | null> {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Agent;
        }
        return null;
    },

    // Get agent by User ID
    async getByUserId(userId: string): Promise<Agent | null> {
        const q = query(collection(db, COLLECTION_NAME), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() } as Agent;
        }
        return null;
    },

    // Get all verified agents
    async getAllVerified(): Promise<Agent[]> {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('isVerified', '==', true),
            where('active', '==', true),
            orderBy('rating', 'desc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Agent[];
    },

    // Update agent profile
    async update(id: string, data: Partial<Agent>): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    },

    // Approve verify agent
    async verify(id: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            isVerified: true,
            updatedAt: serverTimestamp(),
        });
    }
};
