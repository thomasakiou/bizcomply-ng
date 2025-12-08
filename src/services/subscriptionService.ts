import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Subscription } from '../types';

const COLLECTION_NAME = 'subscriptions';

export const subscriptionService = {
    // Create new subscription
    async create(userId: string, planId: string, amount: number, durationMonths: number): Promise<string> {
        const docRef = doc(collection(db, COLLECTION_NAME));

        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + durationMonths);

        const subscription: Omit<Subscription, 'id'> = {
            userId,
            planId,
            status: 'Active',
            amount,
            startDate: Timestamp.fromDate(startDate),
            endDate: Timestamp.fromDate(endDate),
            autoRenew: false,
            createdAt: serverTimestamp() as any,
            updatedAt: serverTimestamp() as any
        };

        await setDoc(docRef, subscription);
        return docRef.id;
    },

    // Get current active subscription for user
    async getCurrentSubscription(userId: string): Promise<Subscription | null> {
        // In a real app, query for status='Active' and endDate > now
        // Simplified query for now
        const subscriptionsRef = collection(db, COLLECTION_NAME);
        const q = query(
            subscriptionsRef,
            where('userId', '==', userId),
            where('status', '==', 'Active'),
            orderBy('endDate', 'desc'),
            limit(1)
        );

        // Note: Composite index might be needed for this query
        // Fallback or try-catch block if index missing
        try {
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return { id: doc.id, ...doc.data() } as Subscription;
            }
        } catch (e) {
            console.warn("Index query failed, falling back or handling error", e);
        }

        return null;
    },

    // Cancel subscription
    async cancel(id: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            status: 'Cancelled',
            updatedAt: serverTimestamp(),
            autoRenew: false
        });
    }
};

// Need to import query helpers that were missing
import { query, where, orderBy, limit } from 'firebase/firestore';
