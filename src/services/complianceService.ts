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
import { db } from '../config/firebase';
import { ComplianceTask, ComplianceTaskFormData, ComplianceStatus, BusinessType } from '../types';

const COLLECTION_NAME = 'compliance_tasks';

export const complianceService = {
    // Create a new compliance task
    async create(
        userId: string,
        businessProfileId: string,
        data: ComplianceTaskFormData
    ): Promise<string> {
        const docRef = doc(collection(db, COLLECTION_NAME));
        const task = {
            ...data,
            userId,
            businessProfileId,
            status: 'Pending' as ComplianceStatus,
            dueDate: Timestamp.fromDate(data.dueDate),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        await setDoc(docRef, task);
        return docRef.id;
    },

    // Get task by ID
    async getById(id: string): Promise<ComplianceTask | null> {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as ComplianceTask;
        }
        return null;
    },

    // Get all tasks for a user
    async getByUserId(userId: string): Promise<ComplianceTask[]> {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('userId', '==', userId),
            orderBy('dueDate', 'asc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as ComplianceTask[];
    },

    // Get tasks by status
    async getByStatus(userId: string, status: ComplianceStatus): Promise<ComplianceTask[]> {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('userId', '==', userId),
            where('status', '==', status),
            orderBy('dueDate', 'asc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as ComplianceTask[];
    },

    // Update task status
    async updateStatus(id: string, status: ComplianceStatus): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        const updateData: any = {
            status,
            updatedAt: serverTimestamp(),
        };

        if (status === 'Completed') {
            updateData.completedDate = serverTimestamp();
        }

        await updateDoc(docRef, updateData);
    },

    // Update task
    async update(id: string, data: Partial<ComplianceTaskFormData>): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        const updateData: any = {
            ...data,
            updatedAt: serverTimestamp(),
        };

        if (data.dueDate) {
            updateData.dueDate = Timestamp.fromDate(data.dueDate);
        }

        await updateDoc(docRef, updateData);
    },

    // Delete task
    async delete(id: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    },

    // Generate default tasks based on business type
    async generateDefaultTasks(
        userId: string,
        businessProfileId: string,
        businessType: BusinessType
    ): Promise<void> {
        const defaultTasks = getDefaultTasksForBusinessType(businessType);

        for (const task of defaultTasks) {
            await this.create(userId, businessProfileId, task);
        }
    },

    // Get all tasks (admin only)
    async getAll(): Promise<ComplianceTask[]> {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as ComplianceTask[];
    },
};

// Helper function to generate default tasks based on business type
function getDefaultTasksForBusinessType(businessType: BusinessType): ComplianceTaskFormData[] {
    const commonTasks: ComplianceTaskFormData[] = [
        {
            title: 'CAC Annual Returns',
            description: 'File annual returns with Corporate Affairs Commission',
            category: 'CAC',
            dueDate: new Date(new Date().getFullYear(), 11, 31), // Dec 31
            priority: 'High',
            portalUrl: 'https://post.cac.gov.ng/',
            authorityName: 'CAC Portal',
        },
        {
            title: 'TIN Registration',
            description: 'Register for Tax Identification Number',
            category: 'Tax',
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            priority: 'High',
            portalUrl: 'https://tin.jtb.gov.ng/',
            authorityName: 'JTB Portal',
        },
    ];

    const limitedCompanyTasks: ComplianceTaskFormData[] = [
        {
            title: 'VAT Registration',
            description: 'Register for Value Added Tax if turnover exceeds ₦25 million',
            category: 'VAT',
            dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
            priority: 'Medium',
            portalUrl: 'https://taxpromax.firs.gov.ng/',
            authorityName: 'FIRS TaxPro Max',
        },
        {
            title: 'PAYE Remittance',
            description: 'Monthly Pay As You Earn tax remittance',
            category: 'PAYE',
            dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 10), // 10th of next month
            priority: 'High',
            portalUrl: 'https://lirs.gov.ng/',
            authorityName: 'LIRS Portal (Lagos)',
        },
        {
            title: 'Pension Remittance',
            description: 'Monthly pension contributions to PFA',
            category: 'Pension',
            dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 10),
            priority: 'High',
            portalUrl: 'https://www.pencom.gov.ng/',
            authorityName: 'PenCom',
        },
    ];

    if (businessType === 'Limited Liability Company') {
        return [...commonTasks, ...limitedCompanyTasks];
    }

    return commonTasks;
}
