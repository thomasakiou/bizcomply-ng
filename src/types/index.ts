import { Timestamp } from 'firebase/firestore';

export type UserRole = 'User' | 'Agent' | 'SuperAdmin';

export interface User {
    id: string;
    email: string;
    displayName?: string;
    role: UserRole;
    emailVerified: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    businessProfileId?: string;
}

export type BusinessType =
    | 'Limited Liability Company'
    | 'Business Name'
    | 'Partnership'
    | 'NGO'
    | 'Incorporated Trustees';

export type Industry =
    | 'Technology'
    | 'Manufacturing'
    | 'Retail'
    | 'Services'
    | 'Agriculture'
    | 'Healthcare'
    | 'Education'
    | 'Finance'
    | 'Other';

export interface BusinessProfile {
    id: string;
    userId: string;
    businessName: string;
    businessType: BusinessType;
    industry: Industry;
    cacRegNo: string;
    state: string;
    taxOffice: string;
    tin?: string;
    vatStatus: 'Registered' | 'Not Registered' | 'Pending';
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export type ComplianceStatus = 'Pending' | 'Completed' | 'Overdue';

export type ComplianceCategory =
    | 'CAC'
    | 'Tax'
    | 'PAYE'
    | 'VAT'
    | 'Pension'
    | 'License'
    | 'Other';

export type CompliancePriority = 'Low' | 'Medium' | 'High';

export interface ComplianceTask {
    id: string;
    userId: string;
    businessProfileId: string;
    title: string;
    description: string;
    category: ComplianceCategory;
    status: ComplianceStatus;
    dueDate: Timestamp;
    completedDate?: Timestamp;
    priority: CompliancePriority;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    portalUrl?: string;
    authorityName?: string;
}

export interface Document {
    id: string;
    userId: string;
    businessProfileId: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    storagePath: string;
    downloadUrl: string;
    category: string;
    expiryDate?: Timestamp;
    uploadedAt: Timestamp;
    updatedAt: Timestamp;
}

export type NotificationType = 'deadline' | 'expiry' | 'alert' | 'system';

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    actionUrl?: string;
    createdAt: Timestamp;
}

export interface Agent {
    id: string;
    userId: string;
    name: string;
    email: string;
    phone: string;
    specialization: string[];
    active: boolean;
    isVerified: boolean;
    rating: number;
    completedJobs: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export type SubscriptionTier = 'Free' | 'Basic' | 'Professional' | 'Enterprise';

export interface Subscription {
    id: string;
    userId: string;
    planId: string; // Changed from tier to planId to match service
    amount: number;
    status: 'Active' | 'Cancelled' | 'Expired'; // Capitalized to match service
    startDate: Timestamp;
    endDate: Timestamp;
    autoRenew: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// Form data types (without Firestore Timestamp)
export interface BusinessProfileFormData {
    businessName: string;
    businessType: BusinessType;
    industry: Industry;
    cacRegNo: string;
    state: string;
    taxOffice: string;
    tin?: string;
    vatStatus: 'Registered' | 'Not Registered' | 'Pending';
}

export interface ComplianceTaskFormData {
    title: string;
    description: string;
    category: ComplianceCategory;
    dueDate: Date;
    priority: CompliancePriority;
    portalUrl?: string;
    authorityName?: string;
}
