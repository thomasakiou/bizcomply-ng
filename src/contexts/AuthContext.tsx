import React, { createContext, useEffect, useState } from 'react';
import {
    User as FirebaseUser,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    sendEmailVerification,
    onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User, UserRole } from '../types';

interface AuthContextType {
    currentUser: FirebaseUser | null;
    userProfile: User | null;
    loading: boolean;
    signup: (email: string, password: string, displayName?: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    resendVerificationEmail: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    userProfile: null,
    loading: true,
    signup: async () => { },
    login: async () => { },
    logout: async () => { },
    resetPassword: async () => { },
    resendVerificationEmail: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const signup = async (email: string, password: string, displayName?: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send email verification
        await sendEmailVerification(user);

        // Create user profile in Firestore
        const userDoc: Omit<User, 'id'> = {
            email: user.email!,
            displayName: displayName || '',
            role: 'User' as UserRole,
            emailVerified: false,
            createdAt: serverTimestamp() as any,
            updatedAt: serverTimestamp() as any,
        };

        await setDoc(doc(db, 'users', user.uid), userDoc);
    };

    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        await signOut(auth);
        localStorage.removeItem('userProfile');
        setUserProfile(null);
    };

    const resetPassword = async (email: string) => {
        await sendPasswordResetEmail(auth, email);
    };

    const resendVerificationEmail = async () => {
        if (currentUser) {
            await sendEmailVerification(currentUser);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                // 1. Try to load from local storage first for speed
                const cachedProfile = localStorage.getItem('userProfile');
                if (cachedProfile) {
                    try {
                        setUserProfile(JSON.parse(cachedProfile));
                        // If we have cache, we can stop loading immediately
                        setLoading(false);
                    } catch (e) {
                        console.error("Error parsing cached profile", e);
                    }
                }

                // 2. Fetch fresh data from Firestore in background
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const profileData = { id: userDoc.id, ...userDoc.data() } as User;
                        setUserProfile(profileData);
                        localStorage.setItem('userProfile', JSON.stringify(profileData));
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            } else {
                localStorage.removeItem('userProfile');
                setUserProfile(null);
            }

            // Ensure loading is set to false eventually
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value: AuthContextType = {
        currentUser,
        userProfile,
        loading,
        signup,
        login,
        logout,
        resetPassword,
        resendVerificationEmail,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
