import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  setPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export const MASTER_ADMIN_EMAIL = 'faraabee1@gmail.com';

const SESSION_ACTIVE_KEY = 'farabi_admin_session_active';
const SESSION_ID_KEY = 'farabi_admin_session_id';

interface SessionTerminatedNotice {
  device: string;
  time: string;
}

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  isAuthReady: boolean;
  sessionTerminatedNotice: SessionTerminatedNotice | null;
  clearSessionTerminatedNotice: () => void;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getDeviceSummary = () => {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const platform = (navigator as any)?.userAgentData?.platform || (navigator ? navigator.platform : 'Device');
  const screenRes = typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'Standard';
  return `${platform} • ${isMobile ? 'Mobile' : 'Desktop'} (${screenRes})`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [sessionTerminatedNotice, setSessionTerminatedNotice] = useState<SessionTerminatedNotice | null>(null);

  // Configure session-only persistence so closing the tab or browser clears the session
  useEffect(() => {
    try {
      setPersistence(auth, browserSessionPersistence);
    } catch (e) {
      console.warn('Session persistence configuration note:', e);
    }
  }, []);

  // Listen to Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userEmail = (user.email || '').trim().toLowerCase();

        // STRICT SECURITY: Only the master owner email is ever granted access
        if (userEmail !== MASTER_ADMIN_EMAIL.toLowerCase()) {
          console.warn(`Unauthorized login attempt blocked: ${user.email}`);
          await signOut(auth);
          setCurrentUser(null);
          setIsAdmin(false);
          setIsAuthReady(true);
          return;
        }

        // Check if an explicit active session exists in sessionStorage for this browser window/tab
        const hasActiveSession = sessionStorage.getItem(SESSION_ACTIVE_KEY) === 'true';
        const localSessionId = sessionStorage.getItem(SESSION_ID_KEY);

        if (!hasActiveSession || !localSessionId) {
          // Tab or window was reopened/reloaded without active session -> require re-login
          setCurrentUser(user);
          setIsAdmin(false);
          setIsAuthReady(true);
          return;
        }

        setCurrentUser(user);
        setIsAdmin(true);

        try {
          await setDoc(
            doc(db, 'admins', user.uid),
            {
              uid: user.uid,
              email: MASTER_ADMIN_EMAIL,
              role: 'master_admin',
              lastLogin: new Date().toISOString(),
              deviceSummary: getDeviceSummary(),
            },
            { merge: true }
          );
        } catch (adminDocErr) {
          console.warn('Could not sync admin document:', adminDocErr);
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Real-time Concurrent Device Session Enforcement (Only 1 device active at a time)
  useEffect(() => {
    if (!isAdmin) return;

    const unsubSession = onSnapshot(
      doc(db, 'settings', 'adminActiveSession'),
      async (docSnap) => {
        if (docSnap.exists()) {
          const remote = docSnap.data();
          const localSessionId = sessionStorage.getItem(SESSION_ID_KEY);

          // If another device logged in and registered a different sessionId
          if (remote.activeSessionId && localSessionId && remote.activeSessionId !== localSessionId) {
            console.warn('Admin session displaced by newer login on another device');
            setSessionTerminatedNotice({
              device: remote.deviceSummary || 'Another Device',
              time: remote.loginTimestamp || new Date().toISOString(),
            });

            // Invalidate local session immediately
            sessionStorage.removeItem(SESSION_ACTIVE_KEY);
            sessionStorage.removeItem(SESSION_ID_KEY);
            setIsAdmin(false);
            try {
              await signOut(auth);
            } catch {}
          }
        }
      },
      (err) => {
        console.warn('Active session stream notice:', err.message);
      }
    );

    return () => unsubSession();
  }, [isAdmin]);

  const clearSessionTerminatedNotice = () => {
    setSessionTerminatedNotice(null);
  };

  // Sign in with Email and Password (strictly restricted to faraabee@gmail.com)
  const loginWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail !== MASTER_ADMIN_EMAIL.toLowerCase()) {
      throw new Error(`Access Denied: Only the verified owner account (${MASTER_ADMIN_EMAIL}) is permitted to log in. All other accounts are strictly blocked.`);
    }

    try {
      await setPersistence(auth, browserSessionPersistence);
    } catch {}

    let userCredential;
    try {
      userCredential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    } catch (err: any) {
      // If user does not exist yet in Firebase email/password provider, create master account
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
        } catch (createErr) {
          throw err;
        }
      } else {
        throw err;
      }
    }

    // Register unique active session for 1-login-per-device enforcement
    const newSessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const deviceSummary = getDeviceSummary();

    sessionStorage.setItem(SESSION_ACTIVE_KEY, 'true');
    sessionStorage.setItem(SESSION_ID_KEY, newSessionId);

    try {
      await setDoc(doc(db, 'settings', 'adminActiveSession'), {
        activeSessionId: newSessionId,
        adminEmail: MASTER_ADMIN_EMAIL,
        deviceSummary,
        loginTimestamp: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      });
    } catch (sessionErr) {
      console.warn('Could not register active session record:', sessionErr);
    }

    setCurrentUser(userCredential.user);
    setIsAdmin(true);
    setSessionTerminatedNotice(null);
  };

  // Sign in with Google (strictly restricted to faraabee@gmail.com)
  const loginWithGoogle = async () => {
    try {
      await setPersistence(auth, browserSessionPersistence);
    } catch {}

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
      login_hint: MASTER_ADMIN_EMAIL,
    });

    const result = await signInWithPopup(auth, provider);
    const authedEmail = (result.user.email || '').trim().toLowerCase();

    if (authedEmail !== MASTER_ADMIN_EMAIL.toLowerCase()) {
      await signOut(auth);
      sessionStorage.removeItem(SESSION_ACTIVE_KEY);
      sessionStorage.removeItem(SESSION_ID_KEY);
      setIsAdmin(false);
      throw new Error(`Access Denied: Google Account "${result.user.email}" is not authorized. Only the owner account (${MASTER_ADMIN_EMAIL}) can access this portal.`);
    }

    const newSessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const deviceSummary = getDeviceSummary();

    sessionStorage.setItem(SESSION_ACTIVE_KEY, 'true');
    sessionStorage.setItem(SESSION_ID_KEY, newSessionId);

    try {
      await setDoc(doc(db, 'settings', 'adminActiveSession'), {
        activeSessionId: newSessionId,
        adminEmail: MASTER_ADMIN_EMAIL,
        deviceSummary,
        loginTimestamp: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      });
    } catch (sessionErr) {
      console.warn('Could not register active session record:', sessionErr);
    }

    setCurrentUser(result.user);
    setIsAdmin(true);
    setSessionTerminatedNotice(null);
  };

  // Sign Out: completely destroys session both locally and terminates active session
  const logout = async () => {
    sessionStorage.removeItem(SESSION_ACTIVE_KEY);
    sessionStorage.removeItem(SESSION_ID_KEY);
    setIsAdmin(false);
    setCurrentUser(null);

    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign out error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isAuthReady,
        sessionTerminatedNotice,
        clearSessionTerminatedNotice,
        loginWithEmail,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
