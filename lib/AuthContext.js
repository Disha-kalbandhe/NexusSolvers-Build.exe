'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase';
import { 
  signInAnonymously, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';

const AuthContext = createContext({});

// User role types
export const USER_ROLES = {
  ADMIN: 'admin',      // TPO/Employer side - full access
  STUDENT: 'student',  // Student side - limited access
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // 'admin' or 'student'

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      // Get role from localStorage when auth state changes
      if (user) {
        const storedRole = localStorage.getItem('biasbreaker_user_role');
        setUserRole(storedRole || null);
      } else {
        setUserRole(null);
        localStorage.removeItem('biasbreaker_user_role');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Admin login with Google (TPO/Employer)
  const loginAsAdmin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem('biasbreaker_user_role', USER_ROLES.ADMIN);
      setUserRole(USER_ROLES.ADMIN);
      return { success: true, user: result.user, role: USER_ROLES.ADMIN };
    } catch (error) {
      console.error('Admin login error:', error);
      
      // If Google sign-in is not enabled, fall back to anonymous with admin role
      if (error.code === 'auth/operation-not-allowed') {
        console.log('Google sign-in not enabled, using anonymous admin login');
        try {
          const anonResult = await signInAnonymously(auth);
          localStorage.setItem('biasbreaker_user_role', USER_ROLES.ADMIN);
          setUserRole(USER_ROLES.ADMIN);
          return { success: true, user: anonResult.user, role: USER_ROLES.ADMIN };
        } catch (anonError) {
          return { success: false, error: 'Login failed. Please try again.' };
        }
      }
      
      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Login cancelled' };
      } else if (error.code === 'auth/popup-blocked') {
        return { success: false, error: 'Popup blocked by browser. Please allow popups.' };
      }
      
      return { success: false, error: error.message };
    }
  };

  // Student login anonymously
  const loginAsStudent = async () => {
    try {
      const result = await signInAnonymously(auth);
      localStorage.setItem('biasbreaker_user_role', USER_ROLES.STUDENT);
      setUserRole(USER_ROLES.STUDENT);
      return { success: true, user: result.user, role: USER_ROLES.STUDENT };
    } catch (error) {
      console.error('Student login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Legacy anonymous login (keeping for backward compatibility)
  const loginAnonymously = async () => {
    try {
      const result = await signInAnonymously(auth);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Anonymous login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Legacy Google OAuth login (keeping for backward compatibility)
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Google login error:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Login cancelled' };
      } else if (error.code === 'auth/popup-blocked') {
        return { success: false, error: 'Popup blocked by browser. Please allow popups.' };
      }
      
      return { success: false, error: error.message };
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem('biasbreaker_user_role');
      setUserRole(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    userRole,
    isAuthenticated: !!user,
    isAnonymous: user?.isAnonymous || false,
    isAdmin: userRole === USER_ROLES.ADMIN,
    isStudent: userRole === USER_ROLES.STUDENT,
    loginAnonymously,
    loginWithGoogle,
    loginAsAdmin,
    loginAsStudent,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
