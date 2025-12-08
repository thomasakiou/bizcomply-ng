import {
    collection,
    doc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Notification, NotificationType } from '../types';

const COLLECTION_NAME = 'notifications';

export const notificationService = {
    // Create a new notification
    async create(
        userId: string,
        type: NotificationType,
        title: string,
        message: string,
        actionUrl?: string
    ): Promise<string> {
        const docRef = doc(collection(db, COLLECTION_NAME));
        const notification = {
            userId,
            type,
            title,
            message,
            read: false,
            actionUrl,
            createdAt: serverTimestamp(),
        };

        await setDoc(docRef, notification);
        return docRef.id;
    },

    // Get all notifications for a user
    async getByUserId(userId: string, limitCount: number = 50): Promise<Notification[]> {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Notification[];
    },

    // Get unread notifications
    async getUnread(userId: string): Promise<Notification[]> {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('userId', '==', userId),
            where('read', '==', false),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Notification[];
    },

    // Mark notification as read
    async markAsRead(id: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, { read: true });
    },

    // Mark all notifications as read for a user
    async markAllAsRead(userId: string): Promise<void> {
        const unreadNotifications = await this.getUnread(userId);

        const updatePromises = unreadNotifications.map(notification =>
            this.markAsRead(notification.id)
        );

        await Promise.all(updatePromises);
    },

    // Delete notification
    async delete(id: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    },

    // Delete all notifications for a user
    async deleteAll(userId: string): Promise<void> {
        const notifications = await this.getByUserId(userId, 1000);

        const deletePromises = notifications.map(notification =>
            this.delete(notification.id)
        );

        await Promise.all(deletePromises);
    },

    // Create deadline notification
    async createDeadlineNotification(
        userId: string,
        taskTitle: string,
        dueDate: Date,
        taskId: string
    ): Promise<string> {
        const daysUntilDue = Math.ceil(
            (dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );

        let message = '';
        if (daysUntilDue < 0) {
            message = `Task "${taskTitle}" is overdue by ${Math.abs(daysUntilDue)} days`;
        } else if (daysUntilDue === 0) {
            message = `Task "${taskTitle}" is due today`;
        } else if (daysUntilDue <= 7) {
            message = `Task "${taskTitle}" is due in ${daysUntilDue} days`;
        } else {
            message = `Task "${taskTitle}" is due on ${dueDate.toLocaleDateString()}`;
        }

        return this.create(
            userId,
            'deadline',
            'Compliance Deadline',
            message,
            `#/compliance?task=${taskId}`
        );
    },

    // Create document expiry notification
    async createExpiryNotification(
        userId: string,
        documentName: string,
        expiryDate: Date,
        documentId: string
    ): Promise<string> {
        const daysUntilExpiry = Math.ceil(
            (expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );

        let message = '';
        if (daysUntilExpiry < 0) {
            message = `Document "${documentName}" expired ${Math.abs(daysUntilExpiry)} days ago`;
        } else if (daysUntilExpiry === 0) {
            message = `Document "${documentName}" expires today`;
        } else {
            message = `Document "${documentName}" expires in ${daysUntilExpiry} days`;
        }

        return this.create(
            userId,
            'expiry',
            'Document Expiry',
            message,
            `#/documents?doc=${documentId}`
        );
    },
};
