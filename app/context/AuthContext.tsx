import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type AuthUser = {
    name: string;
    email: string;
    createdAt?: string;
};

type AuthContextType = {
    isAuthLoading: boolean;
    isLoggedIn: boolean;
    user: AuthUser | null;
    signIn: (params: { email: string; name?: string; user?: AuthUser; token?: string }) => Promise<void>;
    signOut: () => Promise<void>;
    refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
    userToken: 'userToken',
    userEmail: 'userEmail',
    userData: 'userData',
    isLoggedIn: 'isLoggedIn',
} as const;

async function loadUserFromStorage(): Promise<{ isLoggedIn: boolean; user: AuthUser | null }> {
    const isLoggedInValue = await AsyncStorage.getItem(STORAGE_KEYS.isLoggedIn);
    const isLoggedIn = isLoggedInValue === 'true';
    if (!isLoggedIn) return { isLoggedIn: false, user: null };

    const rawUserData = await AsyncStorage.getItem(STORAGE_KEYS.userData);
    const userEmail = await AsyncStorage.getItem(STORAGE_KEYS.userEmail);

    let user: AuthUser | null = null;
    if (rawUserData) {
        try {
            user = JSON.parse(rawUserData) as AuthUser;
        } catch {
            user = null;
        }
    }

    // Fallback if only email exists
    if (!user && userEmail) {
        user = { name: userEmail.split('@')[0] ?? 'User', email: userEmail };
    }

    return { isLoggedIn: true, user };
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);

    const refresh = async () => {
        setIsAuthLoading(true);
        try {
            const data = await loadUserFromStorage();
            setIsLoggedIn(data.isLoggedIn);
            setUser(data.user);
        } finally {
            setIsAuthLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    const signIn: AuthContextType['signIn'] = async ({ email, name, user: providedUser, token }) => {
        const nextUser: AuthUser =
            providedUser ?? {
                name: name ?? email.split('@')[0] ?? 'User',
                email,
                createdAt: new Date().toISOString(),
            };

        // Persist
        await AsyncStorage.multiSet([
            [STORAGE_KEYS.userToken, token ?? 'dummy_token'],
            [STORAGE_KEYS.userEmail, email],
            [STORAGE_KEYS.userData, JSON.stringify(nextUser)],
            [STORAGE_KEYS.isLoggedIn, 'true'],
        ]);

        // Update memory
        setUser(nextUser);
        setIsLoggedIn(true);
    };

    const signOut: AuthContextType['signOut'] = async () => {
        await AsyncStorage.multiRemove([
            STORAGE_KEYS.userToken,
            STORAGE_KEYS.userEmail,
            STORAGE_KEYS.userData,
            STORAGE_KEYS.isLoggedIn,
        ]);
        setUser(null);
        setIsLoggedIn(false);
    };

    const value = useMemo<AuthContextType>(
        () => ({
            isAuthLoading,
            isLoggedIn,
            user,
            signIn,
            signOut,
            refresh,
        }),
        [isAuthLoading, isLoggedIn, user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;