import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail, 
  isSignInWithEmailLink, 
  signInWithEmailLink, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  deleteDoc,
  serverTimestamp,
  getDocFromServer,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { generateExecutiveJwt, verifyExecutiveJwt, createShareableJwtUrl, ExecutiveJwtPayload } from '../utils/jwtSession';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export interface DenyListEntry {
  id: string;
  value: string;
  type: 'ip' | 'email' | 'domain';
  reason: string;
  blockedBy: string;
  blockedAt: any;
  active: boolean;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

// Test connection on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration or connection.");
    }
  }
}
testConnection();

export interface AllowlistItem {
  email: string;
  authorized: boolean;
  role: 'viewer' | 'admin';
  scope?: 'global' | 'specific' | 'roadmaps';
  allowedItems?: string[]; // IDs of specific articles/resources
  allowedSections?: string[]; // e.g. ['case-studies', 'publications', 'archives']
  addedBy: string;
  addedAt: any;
}

export interface SecurityLocks {
  lockedSections: string[];
  lockedItems: string[];
  unlockedItems: string[];
  updatedBy?: string;
  updatedAt?: any;
}

export interface TargetResource {
  id: string;
  section: string;
  title: string;
}

export interface AccessCheckResult {
  allowed: boolean;
  reason: 'public' | 'admin' | 'global_clearance' | 'item_clearance' | 'section_clearance' | 'auth_required' | 'item_forbidden';
  allowedItems?: string[];
  userScope?: 'global' | 'specific';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isAuthorized: boolean;
  currentUserEntry: AllowlistItem | null;
  allowlist: AllowlistItem[];
  
  // Granular locks
  lockedSections: string[];
  lockedItems: string[];
  unlockedItems: string[];
  toggleSectionLock: (sectionId: string) => Promise<void>;
  toggleItemLock: (itemId: string, defaultSectionId?: string) => Promise<void>;
  setItemLockState: (itemId: string, state: 'locked' | 'unlocked' | 'default') => Promise<void>;
  isItemLocked: (itemId: string, sectionId: string) => boolean;
  isSectionLocked: (sectionId: string) => boolean;
  canAccessItem: (itemId: string, sectionId: string) => AccessCheckResult;

  // Identity & Permissions
  checkAllowlistStatus: (email: string) => Promise<{ 
    authorized: boolean; 
    role: 'viewer' | 'admin' | null;
    scope?: 'global' | 'specific' | 'roadmaps';
    allowedItems?: string[];
    allowedSections?: string[];
  }>;
  signInWithGoogle: () => Promise<User>;
  sendMagicLink: (email: string) => Promise<void>;
  signInWithPasscode: (passcode: string, email?: string) => Promise<void>;
  completeSignIn: () => Promise<void>;
  signOut: () => Promise<void>;
  addToAllowlist: (
    email: string, 
    role: 'viewer' | 'admin', 
    scope?: 'global' | 'specific' | 'roadmaps',
    allowedItems?: string[],
    allowedSections?: string[]
  ) => Promise<void>;
  updateAllowlistEntry: (
    email: string,
    updates: Partial<AllowlistItem>
  ) => Promise<void>;
  removeFromAllowlist: (email: string) => Promise<void>;
  fetchAllowlist: () => Promise<void>;

  // Resource-aware Gating
  gateItem: (
    itemOrRole: string, 
    sectionOrGrant?: string | (() => void), 
    titleOrGrant?: string, 
    onGrant?: () => void
  ) => void;
  gateModalOpen: boolean;
  setGateModalOpen: (open: boolean) => void;
  targetResource: TargetResource | null;
  setTargetResource: (res: TargetResource | null) => void;

  // Dynamic Deny List (Real-Time Blacklisting)
  denyList: DenyListEntry[];
  clientIp: string | null;
  isDenied: boolean;
  denyReason: string | null;
  addToDenyList: (value: string, type: 'ip' | 'email' | 'domain', reason: string) => Promise<void>;
  removeFromDenyList: (id: string) => Promise<void>;
  toggleDenyListEntry: (id: string, active: boolean) => Promise<void>;

  // JWT-Based Sessions (72-Hour Time-Bound Access)
  jwtSessionInfo: {
    active: boolean;
    expiresAt?: number;
    hoursRemaining?: number;
    minutesRemaining?: number;
    email?: string;
    partnerName?: string;
    scope?: string;
  } | null;
  jwtExpiredAlert: string | null;
  dismissJwtAlert: () => void;
  createPartnerJwtLink: (options: {
    email: string;
    role?: 'viewer' | 'admin';
    scope?: 'global' | 'roadmaps' | 'specific';
    allowedItems?: string[];
    partnerName?: string;
    expiresInHours?: number;
  }) => Promise<string>;

  // The "Executive Vault" Gate (Aspirational Roadmaps)
  isVaultUnlocked: boolean;
  vaultModalOpen: boolean;
  setVaultModalOpen: (open: boolean) => void;
  targetRoadmap: any | null;
  setTargetRoadmap: (rm: any | null) => void;
  unlockVaultWithPin: (pin: string) => Promise<boolean>;
  activeVaultPin: string;
  updateVaultPin: (newPin: string) => Promise<void>;
  openVaultGate: (roadmap: any, onGrant?: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ALLOWLIST: AllowlistItem[] = [
  {
    email: 'munish.world@gmail.com',
    authorized: true,
    role: 'admin',
    scope: 'global',
    allowedItems: [],
    allowedSections: [],
    addedBy: 'portfolio-owner',
    addedAt: '2026-01-01T00:00:00.000Z'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentUserEntry, setCurrentUserEntry] = useState<AllowlistItem | null>(null);
  const [allowlist, setAllowlist] = useState<AllowlistItem[]>(DEFAULT_ALLOWLIST);
  const [gateModalOpen, setGateModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [targetResource, setTargetResource] = useState<TargetResource | null>(null);

  // Dynamic Deny List State (Real-Time IP / User Blacklisting)
  const [denyList, setDenyList] = useState<DenyListEntry[]>([]);
  const [clientIp, setClientIp] = useState<string | null>(null);
  const [isDenied, setIsDenied] = useState<boolean>(false);
  const [denyReason, setDenyReason] = useState<string | null>(null);

  // JWT 72-Hour Time-Bound Session State
  const [jwtSessionInfo, setJwtSessionInfo] = useState<{
    active: boolean;
    expiresAt?: number;
    hoursRemaining?: number;
    minutesRemaining?: number;
    email?: string;
    partnerName?: string;
    scope?: string;
  } | null>(null);
  const [jwtExpiredAlert, setJwtExpiredAlert] = useState<string | null>(null);

  // The "Executive Vault" Gate State (Aspirational Roadmaps)
  const [isVaultUnlocked, setIsVaultUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('exec_vault_unlocked') === 'true';
    } catch {
      return false;
    }
  });
  const [vaultModalOpen, setVaultModalOpen] = useState(false);
  const [targetRoadmap, setTargetRoadmap] = useState<any | null>(null);
  const [activeVaultPin, setActiveVaultPin] = useState<string>('739104'); // 6-digit Search Partner PIN

  // Granular locks state: by default, archives and publications are locked; case studies can also be locked individually or entirely
  const [lockedSections, setLockedSections] = useState<string[]>(['archives', 'publications']);
  const [lockedItems, setLockedItems] = useState<string[]>([]);
  const [unlockedItems, setUnlockedItems] = useState<string[]>([]);

  // Helper to determine if email is super admin
  const isSuperAdminEmail = (email: string | null | undefined) => {
    return email?.toLowerCase() === 'munish.world@gmail.com';
  };

  // Helper to normalize section aliases
  const normalizeSectionId = (sec: string): string => {
    if (!sec) return '';
    const s = sec.toLowerCase().trim();
    if (s === 'archive' || s === 'archives') return 'archives';
    if (s === 'publication' || s === 'publications' || s === 'blog') return 'publications';
    if (s === 'case-study' || s === 'case-studies' || s === 'projects') return 'case-studies';
    return s;
  };

  // Sync locks from Firestore in real-time
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'security_settings', 'locks'),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data.lockedSections)) {
            setLockedSections(data.lockedSections);
          } else {
            setLockedSections(['archives', 'publications']);
          }
          if (Array.isArray(data.lockedItems)) {
            setLockedItems(data.lockedItems);
          }
          if (Array.isArray(data.unlockedItems)) {
            setUnlockedItems(data.unlockedItems);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'security_settings/locks');
      }
    );
    return () => unsub();
  }, []);

  // Determine if a specific item is locked
  const isItemLocked = useCallback((itemId: string, sectionId: string): boolean => {
    if (lockedItems.includes(itemId)) return true;
    if (unlockedItems.includes(itemId)) return false;
    const targetNorm = normalizeSectionId(sectionId);
    return lockedSections.some(s => normalizeSectionId(s) === targetNorm);
  }, [lockedItems, unlockedItems, lockedSections]);

  // Determine if an entire section is locked
  const isSectionLocked = useCallback((sectionId: string): boolean => {
    const targetNorm = normalizeSectionId(sectionId);
    return lockedSections.some(s => normalizeSectionId(s) === targetNorm);
  }, [lockedSections]);

  // Evaluate whether the current user can access a specific item
  const canAccessItem = useCallback((itemId: string, sectionId: string): AccessCheckResult => {
    const locked = isItemLocked(itemId, sectionId);
    if (!locked) {
      return { allowed: true, reason: 'public' };
    }

    if (!user) {
      return { allowed: false, reason: 'auth_required' };
    }

    if (isAdmin || isSuperAdminEmail(user.email)) {
      return { allowed: true, reason: 'admin' };
    }

    if (!isAuthorized) {
      return { allowed: false, reason: 'auth_required' };
    }

    // User is authorized - check scope
    if (currentUserEntry?.scope === 'specific') {
      const allowedItems = currentUserEntry.allowedItems || [];
      const allowedSections = currentUserEntry.allowedSections || [];

      if (allowedItems.includes(itemId)) {
        return { 
          allowed: true, 
          reason: 'item_clearance', 
          allowedItems, 
          userScope: 'specific' 
        };
      }
      if (allowedSections.includes(sectionId)) {
        return { 
          allowed: true, 
          reason: 'section_clearance', 
          allowedItems, 
          userScope: 'specific' 
        };
      }
      return { 
        allowed: false, 
        reason: 'item_forbidden', 
        allowedItems, 
        userScope: 'specific' 
      };
    }

    // Default global clearance
    return { 
      allowed: true, 
      reason: 'global_clearance', 
      userScope: 'global' 
    };
  }, [isItemLocked, user, isAdmin, isAuthorized, currentUserEntry]);

  // Toggle lock on an entire section
  const toggleSectionLock = async (sectionId: string) => {
    if (!isAdmin) return;
    const norm = normalizeSectionId(sectionId);
    const isCurrentlyLocked = lockedSections.some(s => normalizeSectionId(s) === norm);
    const updated = isCurrentlyLocked
      ? lockedSections.filter(s => normalizeSectionId(s) !== norm)
      : [...lockedSections.filter(s => normalizeSectionId(s) !== norm), norm];
    setLockedSections(updated);

    try {
      await setDoc(doc(db, 'security_settings', 'locks'), {
        lockedSections: updated,
        lockedItems,
        unlockedItems,
        updatedBy: user?.email || 'admin',
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'security_settings/locks');
    }
  };

  // Toggle lock on a single specific item
  const toggleItemLock = async (itemId: string, defaultSectionId: string = 'case-studies') => {
    if (!isAdmin) return;
    const currentlyLocked = isItemLocked(itemId, defaultSectionId);
    
    let newLocked = [...lockedItems];
    let newUnlocked = [...unlockedItems];

    if (currentlyLocked) {
      // Unlock item
      newLocked = newLocked.filter(id => id !== itemId);
      if (lockedSections.includes(defaultSectionId) && !newUnlocked.includes(itemId)) {
        newUnlocked.push(itemId);
      }
    } else {
      // Lock item
      newUnlocked = newUnlocked.filter(id => id !== itemId);
      if (!newLocked.includes(itemId)) {
        newLocked.push(itemId);
      }
    }

    setLockedItems(newLocked);
    setUnlockedItems(newUnlocked);

    try {
      await setDoc(doc(db, 'security_settings', 'locks'), {
        lockedSections,
        lockedItems: newLocked,
        unlockedItems: newUnlocked,
        updatedBy: user?.email || 'admin',
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'security_settings/locks');
    }
  };

  // Explicitly set item lock state ('locked', 'unlocked', or 'default' to inherit)
  const setItemLockState = async (itemId: string, state: 'locked' | 'unlocked' | 'default') => {
    if (!isAdmin) return;
    let newLocked = lockedItems.filter(id => id !== itemId);
    let newUnlocked = unlockedItems.filter(id => id !== itemId);

    if (state === 'locked') {
      newLocked.push(itemId);
    } else if (state === 'unlocked') {
      newUnlocked.push(itemId);
    }

    setLockedItems(newLocked);
    setUnlockedItems(newUnlocked);

    try {
      await setDoc(doc(db, 'security_settings', 'locks'), {
        lockedSections,
        lockedItems: newLocked,
        unlockedItems: newUnlocked,
        updatedBy: user?.email || 'admin',
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'security_settings/locks');
    }
  };

  // Check allowlist in Firestore
  const checkAllowlistStatus = async (email: string): Promise<{ 
    authorized: boolean; 
    role: 'viewer' | 'admin' | null;
    scope?: 'global' | 'specific';
    allowedItems?: string[];
    allowedSections?: string[];
  }> => {
    if (isSuperAdminEmail(email)) {
      return { 
        authorized: true, 
        role: 'admin', 
        scope: 'global',
        allowedItems: [],
        allowedSections: []
      };
    }

    try {
      const docRef = doc(db, 'allowlist', email.toLowerCase().trim());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return { 
          authorized: data.authorized === true, 
          role: data.role || 'viewer',
          scope: data.scope || 'global',
          allowedItems: Array.isArray(data.allowedItems) ? data.allowedItems : [],
          allowedSections: Array.isArray(data.allowedSections) ? data.allowedSections : []
        };
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, `allowlist/${email}`);
    }
    return { authorized: false, role: null };
  };

  // Fetch complete allowlist (Admins only)
  const fetchAllowlist = async () => {
    // Only attempt Firestore query if user has an active, authenticated Firebase Auth session
    if (!auth.currentUser || !auth.currentUser.email) {
      return;
    }
    const isUserAdmin = isSuperAdminEmail(auth.currentUser.email) || isAdmin;
    if (!isUserAdmin) {
      return;
    }

    try {
      const querySnapshot = await getDocs(collection(db, 'allowlist'));
      const list: AllowlistItem[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          email: docSnap.id,
          authorized: data.authorized === true,
          role: data.role || 'viewer',
          scope: data.scope || 'global',
          allowedItems: Array.isArray(data.allowedItems) ? data.allowedItems : [],
          allowedSections: Array.isArray(data.allowedSections) ? data.allowedSections : [],
          addedBy: data.addedBy || '',
          addedAt: data.addedAt
        });
      });
      if (list.length > 0) {
        setAllowlist(list);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, 'allowlist');
    }
  };

  // Add email to allowlist with optional single-article or multi-resource clearance
  const addToAllowlist = async (
    email: string, 
    role: 'viewer' | 'admin', 
    scope: 'global' | 'specific' | 'roadmaps' = 'global',
    allowedItems: string[] = [],
    allowedSections: string[] = []
  ) => {
    const targetEmail = email.toLowerCase().trim();
    if (!auth.currentUser) {
      // Local state management during passcode/synthetic session
      const newItem: AllowlistItem = {
        email: targetEmail,
        authorized: true,
        role: role,
        scope: scope,
        allowedItems: allowedItems,
        allowedSections: allowedSections,
        addedBy: user?.email || 'executive-admin',
        addedAt: new Date().toISOString()
      };
      setAllowlist(prev => [newItem, ...prev.filter(i => i.email !== targetEmail)]);
      return;
    }
    try {
      const docRef = doc(db, 'allowlist', targetEmail);
      await setDoc(docRef, {
        authorized: true,
        role: role,
        scope: scope,
        allowedItems: allowedItems,
        allowedSections: allowedSections,
        addedBy: user?.email || 'admin',
        addedAt: serverTimestamp()
      });
      await fetchAllowlist();
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `allowlist/${targetEmail}`);
      throw e;
    }
  };

  // Update existing allowlist entry (e.g. modify granted articles)
  const updateAllowlistEntry = async (email: string, updates: Partial<AllowlistItem>) => {
    const targetEmail = email.toLowerCase().trim();
    if (!auth.currentUser) {
      setAllowlist(prev => prev.map(item => item.email === targetEmail ? { ...item, ...updates } : item));
      return;
    }
    try {
      const docRef = doc(db, 'allowlist', targetEmail);
      await setDoc(docRef, {
        ...updates,
        addedBy: user?.email || 'admin',
        addedAt: serverTimestamp()
      }, { merge: true });
      await fetchAllowlist();
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `allowlist/${targetEmail}`);
      throw e;
    }
  };

  // Remove email from allowlist
  const removeFromAllowlist = async (email: string) => {
    const targetEmail = email.toLowerCase().trim();
    if (!auth.currentUser) {
      setAllowlist(prev => prev.filter(i => i.email !== targetEmail));
      return;
    }
    try {
      const docRef = doc(db, 'allowlist', targetEmail);
      await deleteDoc(docRef);
      await fetchAllowlist();
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `allowlist/${targetEmail}`);
      throw e;
    }
  };

  // Sign in with Google (Firebase Auth Provider)
  const signInWithGoogle = async (): Promise<User> => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;
      if (currentUser && currentUser.email) {
        const access = await checkAllowlistStatus(currentUser.email);
        if (!access.authorized && !isSuperAdminEmail(currentUser.email)) {
          await firebaseSignOut(auth);
          throw new Error(`Access Denied: ${currentUser.email} is not authorized. Please request access from the administrator.`);
        }
      }
      return currentUser;
    } catch (e: any) {
      if (e?.code === 'auth/operation-not-allowed' || e?.message?.includes('operation-not-allowed')) {
        console.warn("Firebase Google Sign-In provider is disabled in Firebase Console:", e.message);
      } else {
        console.error("Error signing in with Google:", e);
      }
      throw e;
    }
  };

  // Send Magic Link
  const sendMagicLink = async (email: string) => {
    const actionCodeSettings = {
      url: window.location.origin + window.location.pathname,
      handleCodeInApp: true,
    };
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
    } catch (e: any) {
      if (e?.code === 'auth/operation-not-allowed' || e?.message?.includes('operation-not-allowed')) {
        console.warn("Firebase Email Link sign-in provider is disabled in Firebase Console:", e.message);
      } else {
        console.error("Error sending sign-in link:", e);
      }
      throw e;
    }
  };

  // Complete sign-in from email link
  const completeSignIn = async () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please enter your email for confirmation:');
      }
      if (email) {
        try {
          await signInWithEmailLink(auth, email, window.location.href);
          window.localStorage.removeItem('emailForSignIn');
          window.history.replaceState({}, document.title, window.location.pathname);
          
          const access = await checkAllowlistStatus(email);
          if (!access.authorized) {
            await firebaseSignOut(auth);
            alert("Access Denied: Your email is not on the invite-only allowlist.");
          }
        } catch (e) {
          console.error("Error signing in with email link:", e);
          alert("Sign-in link is invalid or expired.");
        }
      }
    }
  };

  // Executive Passcode Validation list (Executive Passcode: 'C1$02026p@$$c0d3')
  const VALID_PASSCODES = ['C1$02026p@$$c0d3'];

  // Sign in with Executive Passcode (Direct authorization for owners, search partners, and board reviewers)
  const signInWithPasscode = async (passcode: string, customEmail?: string) => {
    const rawCode = passcode.trim();
    const upperCode = rawCode.toUpperCase();
    const isExecutivePasscode = rawCode === 'C1$02026p@$$c0d3' || upperCode === 'C1$02026P@$$C0D3';
    const isValid = isExecutivePasscode || 
                    VALID_PASSCODES.some(p => p.toUpperCase() === upperCode || p === rawCode) || 
                    rawCode === activeVaultPin;
    if (!isValid) {
      throw new Error('Invalid Executive Access Code. Please enter an authorized passcode.');
    }

    const email = (customEmail && customEmail.trim()) ? customEmail.trim().toLowerCase() : 'munish.world@gmail.com';
    const isSuperAdmin = isSuperAdminEmail(email) || isExecutivePasscode;

    const executiveUser = {
      uid: 'exec-' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12),
      email: email,
      displayName: isSuperAdmin ? 'Munish Dhiman (CISO)' : 'Executive Reviewer',
      emailVerified: true,
      isAnonymous: false,
    } as unknown as User;

    setUser(executiveUser);
    setIsAdmin(isSuperAdmin);
    setIsAuthorized(true);

    const entry: AllowlistItem = {
      email: email,
      authorized: true,
      role: isSuperAdmin ? 'admin' : 'viewer',
      scope: 'global',
      allowedItems: [],
      allowedSections: [],
      addedBy: 'executive-passcode',
      addedAt: new Date().toISOString()
    };
    setCurrentUserEntry(entry);

    try {
      const now = Date.now();
      localStorage.setItem('executiveSession', JSON.stringify({
        email,
        role: isSuperAdmin ? 'admin' : 'viewer',
        authorized: true,
        timestamp: now,
        expiresAt: now + 8 * 60 * 60 * 1000 // 8 hours validity
      }));
    } catch (e) {
      console.warn('Could not persist executiveSession to localStorage', e);
    }

    if (isSuperAdmin && auth.currentUser) {
      fetchAllowlist().catch(() => {});
    }

    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    setGateModalOpen(false);
  };

  // -------------------------------------------------------------
  // Dynamic IP Blacklisting / Deny List Operations
  // -------------------------------------------------------------
  const addToDenyList = async (value: string, type: 'ip' | 'email' | 'domain', reason: string) => {
    const val = value.trim();
    if (!val) throw new Error('A target value is required to add to the Deny List.');
    const docId = `${type}_${val.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_').slice(0, 32)}`;
    try {
      await setDoc(doc(db, 'denylist', docId), {
        value: val,
        type,
        reason: reason.trim() || 'Intrusive traffic or unauthorized access mitigation',
        blockedBy: user?.email || 'admin',
        blockedAt: new Date().toISOString(),
        active: true
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `denylist/${docId}`);
      throw e;
    }
  };

  const removeFromDenyList = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'denylist', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `denylist/${id}`);
      throw e;
    }
  };

  const toggleDenyListEntry = async (id: string, active: boolean) => {
    try {
      await setDoc(doc(db, 'denylist', id), { active }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `denylist/${id}`);
      throw e;
    }
  };

  // -------------------------------------------------------------
  // Executive Vault Gate (Aspirational Roadmaps)
  // -------------------------------------------------------------
  const unlockVaultWithPin = async (pin: string): Promise<boolean> => {
    const clean = pin.trim();
    if (clean === activeVaultPin || clean === '739104' || clean === 'C1$02026p@$$c0d3' || VALID_PASSCODES.some(p => p.toUpperCase() === clean.toUpperCase() || p === clean)) {
      setIsVaultUnlocked(true);
      try {
        sessionStorage.setItem('exec_vault_unlocked', 'true');
      } catch {}
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
      return true;
    }
    return false;
  };

  const updateVaultPin = async (newPin: string) => {
    const clean = newPin.trim();
    if (clean.length !== 6 || !/^\d{6}$/.test(clean)) {
      throw new Error('Executive Vault PIN must be an exact 6-digit numeric code.');
    }
    setActiveVaultPin(clean);
    try {
      await setDoc(doc(db, 'security_settings', 'vault_config'), {
        vaultPin: clean,
        updatedBy: user?.email || 'admin',
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'security_settings/vault_config');
    }
  };

  const openVaultGate = (roadmap: any, onGrant?: () => void) => {
    const action = onGrant || roadmap?.action;
    if (isVaultUnlocked || isAdmin || isSuperAdminEmail(user?.email) || jwtSessionInfo?.active) {
      if (action) action();
      return;
    }
    setTargetRoadmap(roadmap);
    if (action) {
      setPendingAction(() => action);
    }
    setVaultModalOpen(true);
  };

  // -------------------------------------------------------------
  // JWT-Based Sessions (72-Hour Time-Bound Access)
  // -------------------------------------------------------------
  const createPartnerJwtLink = async (options: {
    email: string;
    role?: 'viewer' | 'admin';
    scope?: 'global' | 'roadmaps' | 'specific';
    allowedItems?: string[];
    partnerName?: string;
    expiresInHours?: number;
  }): Promise<string> => {
    const jwt = await generateExecutiveJwt({
      email: options.email,
      role: options.role || 'viewer',
      scope: options.scope || 'roadmaps',
      allowedItems: options.allowedItems || [],
      partnerName: options.partnerName,
      expiresInHours: options.expiresInHours || 8
    });
    return createShareableJwtUrl(jwt);
  };

  const dismissJwtAlert = () => {
    setJwtExpiredAlert(null);
  };

  // Sign out
  const signOut = async () => {
    try {
      localStorage.removeItem('executiveSession');
      await firebaseSignOut(auth);
    } catch (e) {
      console.error("Error signing out:", e);
    } finally {
      setUser(null);
      setIsAdmin(false);
      setIsAuthorized(false);
      setCurrentUserEntry(null);
    }
  };

  // Intercept action if gated (supports both legacy role signature and granular resource signature)
  const gateItem = (
    itemOrRole: string, 
    sectionOrGrant?: string | (() => void), 
    titleOrGrant?: string, 
    onGrant?: () => void
  ) => {
    // Legacy support: gateItem('viewer' | 'admin', onGrant)
    if (typeof sectionOrGrant === 'function') {
      const requiredRole = itemOrRole as 'viewer' | 'admin';
      const grantFn = sectionOrGrant;
      if (requiredRole === 'admin' && isAdmin) {
        grantFn();
      } else if (requiredRole === 'viewer' && isAuthorized) {
        grantFn();
      } else {
        setTargetResource(null);
        setPendingAction(() => grantFn);
        setGateModalOpen(true);
      }
      return;
    }

    // Granular resource check: gateItem(itemId, sectionId, itemTitle, onGrant)
    const itemId = itemOrRole;
    const sectionId = (typeof sectionOrGrant === 'string' ? sectionOrGrant : '') || 'case-studies';
    const itemTitle = titleOrGrant || itemId;
    const grantFn = onGrant;

    const access = canAccessItem(itemId, sectionId);
    if (access.allowed) {
      if (grantFn) grantFn();
    } else {
      setTargetResource({ id: itemId, section: sectionId, title: itemTitle });
      if (grantFn) {
        setPendingAction(() => grantFn);
      } else {
        setPendingAction(null);
      }
      setGateModalOpen(true);
    }
  };

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email) {
        const access = await checkAllowlistStatus(currentUser.email);
        setIsAuthorized(access.authorized);
        const isUserAdmin = access.role === 'admin' || isSuperAdminEmail(currentUser.email);
        setIsAdmin(isUserAdmin);

        setCurrentUserEntry({
          email: currentUser.email,
          authorized: access.authorized,
          role: access.role || 'viewer',
          scope: access.scope || 'global',
          allowedItems: access.allowedItems || [],
          allowedSections: access.allowedSections || [],
          addedBy: '',
          addedAt: null
        });

        if (isUserAdmin) {
          fetchAllowlist();
          // Ensure requested publications and archives locks are persisted in Firestore
          try {
            const locksDocRef = doc(db, 'security_settings', 'locks');
            getDoc(locksDocRef).then((snap) => {
              if (!snap.exists()) {
                setDoc(locksDocRef, {
                  lockedSections: ['archives', 'publications'],
                  lockedItems: [],
                  unlockedItems: [],
                  updatedBy: currentUser.email,
                  updatedAt: serverTimestamp()
                }).catch(() => {});
              } else {
                const existingData = snap.data();
                const existingSections: string[] = Array.isArray(existingData?.lockedSections) ? existingData.lockedSections : [];
                if (!existingSections.includes('publications')) {
                  setDoc(locksDocRef, {
                    lockedSections: [...existingSections, 'publications'],
                    updatedBy: currentUser.email,
                    updatedAt: serverTimestamp()
                  }, { merge: true }).catch(() => {});
                }
              }
            }).catch(() => {});
          } catch (e) {
            // Ignore background sync errors
          }
        }
        
        // If they had a pending action, execute it upon successful auth if granted
        if (access.authorized && pendingAction) {
          pendingAction();
          setPendingAction(null);
          setGateModalOpen(false);
        }
      } else {
        setIsAdmin(false);
        setIsAuthorized(false);
        setCurrentUserEntry(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pendingAction]);

  // 8-Hour Access Validity Enforcement
  const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;

  // Restore local executive session if valid within 8 hours, post which reauthentication is required
  useEffect(() => {
    const checkAndEnforceSessionValidity = () => {
      try {
        const saved = localStorage.getItem('executiveSession');
        if (saved) {
          const data = JSON.parse(saved);
          const now = Date.now();
          const sessionTimestamp = data?.timestamp || 0;
          const sessionAge = now - sessionTimestamp;
          const isExpired = sessionAge >= EIGHT_HOURS_MS || (data?.expiresAt && now > data.expiresAt);

          if (!isExpired && data && data.email) {
            const isSuperAdmin = isSuperAdminEmail(data.email) || data.role === 'admin';
            const execUser = {
              uid: 'exec-stored',
              email: data.email,
              displayName: isSuperAdmin ? 'Munish Dhiman (CISO)' : 'Executive Reviewer',
              emailVerified: true,
              isAnonymous: false
            } as unknown as User;

            setUser(execUser);
            setIsAdmin(isSuperAdmin);
            setIsAuthorized(true);
            setCurrentUserEntry({
              email: data.email,
              authorized: true,
              role: isSuperAdmin ? 'admin' : 'viewer',
              scope: 'global',
              allowedItems: [],
              allowedSections: [],
              addedBy: 'stored-session-8h',
              addedAt: null
            });
          } else if (isExpired && data?.email) {
            // Session exceeded 8-hour access validity: require reauthentication
            localStorage.removeItem('executiveSession');
            setUser(null);
            setIsAdmin(false);
            setIsAuthorized(false);
            setCurrentUserEntry(null);
            console.info('[AUTH] 8-hour access validity elapsed. Reauthentication required.');
          }
        }
      } catch (e) {
        console.warn("Failed to check executive session validity:", e);
      }
    };

    checkAndEnforceSessionValidity();

    // Re-verify session validity periodically (every 30 seconds) to enforce 8-hour boundary live
    const intervalId = setInterval(checkAndEnforceSessionValidity, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Detect client IP address for perimeter deny list evaluation
  useEffect(() => {
    fetch('/api/client-info')
      .then(res => res.json())
      .then(data => {
        if (data && data.ip) {
          setClientIp(data.ip);
        }
      })
      .catch(() => {
        // Fallback to public ipify if server proxy is unavailable
        fetch('https://api.ipify.org?format=json')
          .then(res => res.json())
          .then(data => {
            if (data && data.ip) setClientIp(data.ip);
          })
          .catch(() => {});
      });
  }, []);

  // Real-time synchronization of dynamic Deny List from Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'denylist'),
      (snapshot) => {
        const list: DenyListEntry[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          list.push({
            id: d.id,
            value: data.value || '',
            type: data.type || 'ip',
            reason: data.reason || 'Restricted individual or network interface',
            blockedBy: data.blockedBy || 'admin',
            blockedAt: data.blockedAt,
            active: data.active !== false
          });
        });
        setDenyList(list);
        // Sync to server-side perimeter filter
        fetch('/api/denylist/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entries: list })
        }).catch(() => {});
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'denylist');
      }
    );
    return () => unsub();
  }, []);

  // Real-time synchronization of Executive Vault PIN configuration
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'security_settings', 'vault_config'),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && data.vaultPin && typeof data.vaultPin === 'string') {
            setActiveVaultPin(data.vaultPin);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'security_settings/vault_config');
      }
    );
    return () => unsub();
  }, []);

  // Real-time Deny List enforcement evaluator
  useEffect(() => {
    if (!denyList.length) {
      setIsDenied(false);
      setDenyReason(null);
      return;
    }

    const currentEmail = user?.email?.toLowerCase().trim() || '';
    const emailDomain = currentEmail.includes('@') ? currentEmail.split('@')[1] : '';

    for (const entry of denyList) {
      if (!entry.active) continue;
      const targetVal = entry.value.toLowerCase().trim();

      // Check IP match (exact match or subnet prefix match)
      if (entry.type === 'ip' && clientIp) {
        const normClientIp = clientIp.trim();
        if (normClientIp === targetVal || normClientIp.startsWith(targetVal)) {
          setIsDenied(true);
          setDenyReason(entry.reason);
          return;
        }
      }

      // Check Email match
      if (entry.type === 'email' && currentEmail && currentEmail === targetVal) {
        setIsDenied(true);
        setDenyReason(entry.reason);
        return;
      }

      // Check Domain match
      if (entry.type === 'domain' && emailDomain && emailDomain === targetVal) {
        setIsDenied(true);
        setDenyReason(entry.reason);
        return;
      }
    }

    setIsDenied(false);
    setDenyReason(null);
  }, [denyList, clientIp, user]);

  // Handle 72-Hour JWT token in query parameters (?token=... or ?exec_token=...)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('exec_token') || urlParams.get('token');
      if (token) {
        verifyExecutiveJwt(token).then((res) => {
          if (res.valid && res.payload) {
            const p = res.payload;
            const isSuperAdmin = isSuperAdminEmail(p.sub) || p.role === 'admin';
            const execUser = {
              uid: 'jwt-' + p.jti.slice(0, 10),
              email: p.sub,
              displayName: p.partnerName ? `${p.partnerName} (Search Partner)` : 'Executive Reviewer',
              emailVerified: true,
              isAnonymous: false
            } as unknown as User;

            setUser(execUser);
            setIsAdmin(isSuperAdmin);
            setIsAuthorized(true);
            setIsVaultUnlocked(true);
            try {
              sessionStorage.setItem('exec_vault_unlocked', 'true');
            } catch {}

            setCurrentUserEntry({
              email: p.sub,
              authorized: true,
              role: p.role || 'viewer',
              scope: p.scope || 'roadmaps',
              allowedItems: p.allowedItems || [],
              allowedSections: ['archives', 'publications', 'case-studies'],
              addedBy: 'jwt-8h-token',
              addedAt: new Date(p.iat * 1000).toISOString()
            });

            setJwtSessionInfo({
              active: true,
              expiresAt: p.exp,
              hoursRemaining: res.hoursRemaining,
              minutesRemaining: res.minutesRemaining,
              email: p.sub,
              partnerName: p.partnerName,
              scope: p.scope
            });

            // Clean query params without refreshing
            const cleanUrl = window.location.pathname + (window.location.hash || '');
            window.history.replaceState({}, document.title, cleanUrl);
          } else if (res.expired) {
            setJwtExpiredAlert(
              'The 8-Hour Executive Access Link has expired. For compliance and confidentiality, access expires strictly after 8 hours. Please reauthenticate or contact the portfolio administrator for a fresh link.'
            );
          }
        });
      }
    } catch (e) {
      console.warn("Error parsing URL token:", e);
    }
  }, []);

  // Try parsing landing login link
  useEffect(() => {
    completeSignIn();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAdmin,
      isAuthorized,
      currentUserEntry,
      allowlist,
      lockedSections,
      lockedItems,
      unlockedItems,
      toggleSectionLock,
      toggleItemLock,
      setItemLockState,
      isItemLocked,
      isSectionLocked,
      canAccessItem,
      checkAllowlistStatus,
      signInWithGoogle,
      sendMagicLink,
      signInWithPasscode,
      completeSignIn,
      signOut,
      addToAllowlist,
      updateAllowlistEntry,
      removeFromAllowlist,
      fetchAllowlist,
      gateItem,
      gateModalOpen,
      setGateModalOpen,
      targetResource,
      setTargetResource,

      // Dynamic Deny List
      denyList,
      clientIp,
      isDenied,
      denyReason,
      addToDenyList,
      removeFromDenyList,
      toggleDenyListEntry,

      // JWT Sessions
      jwtSessionInfo,
      jwtExpiredAlert,
      dismissJwtAlert,
      createPartnerJwtLink,

      // Executive Vault Gate
      isVaultUnlocked,
      vaultModalOpen,
      setVaultModalOpen,
      targetRoadmap,
      setTargetRoadmap,
      unlockVaultWithPin,
      activeVaultPin,
      updateVaultPin,
      openVaultGate
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

