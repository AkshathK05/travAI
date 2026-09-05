import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  getDoc,
  collection,
  query,
  orderBy
} from 'firebase/firestore';
import { ChatMessage, ChatSession } from '../types';

const firebaseConfig = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY as string) || '',
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string) || '',
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) || '',
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string) || '',
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || '',
  appId: (import.meta.env.VITE_FIREBASE_APP_ID as string) || '',
};

const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app: any = null;
let auth: any = null;
let db: any = null;
let googleProvider: any = null;

if (isConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  } catch (err) {
    console.warn('Firebase initialization error, defaulting to local mode:', err);
  }
} else {
  console.info('Firebase keys not detected in .env.local; running in local guest mode.');
}

export { auth, db, isConfigured };

export async function signInWithGoogle(): Promise<User | null> {
  if (!auth || !googleProvider) {
    console.warn('Firebase Auth is not configured. Set VITE_FIREBASE_API_KEY in .env.local.');
    return null;
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign-In failed:', error);
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  if (!auth) return;
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-Out error:', error);
  }
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

/**
 * Saves or updates a chat session and its full message history in Firestore.
 */
export async function saveCloudSession(
  uid: string,
  session: ChatSession,
  messages: ChatMessage[]
): Promise<void> {
  if (!db || !uid) return;
  try {
    const chatDocRef = doc(db, 'users', uid, 'chats', session.id);
    await setDoc(chatDocRef, {
      ...session,
      messages: JSON.stringify(messages),
      syncedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    console.warn('Failed to sync session to cloud:', error);
  }
}

/**
 * Loads all chat sessions belonging to a user from Firestore.
 */
export async function loadCloudSessions(uid: string): Promise<ChatSession[]> {
  if (!db || !uid) return [];
  try {
    const chatsCol = collection(db, 'users', uid, 'chats');
    const q = query(chatsCol);
    const snap = await getDocs(q);
    const sessions: ChatSession[] = [];

    snap.forEach((docSnap) => {
      const data = docSnap.data();
      sessions.push({
        id: docSnap.id,
        title: data.title || 'Untitled Trip',
        createdAt: data.createdAt || 'Saved',
        updatedAt: data.updatedAt || 'Recent',
        messageCount: data.messageCount || 0,
        preview: data.preview || '',
      });
    });

    return sessions;
  } catch (error) {
    console.warn('Failed to load sessions from cloud:', error);
    return [];
  }
}

/**
 * Loads the full message list for a specific chat session from Firestore.
 */
export async function loadCloudSessionMessages(
  uid: string,
  sessionId: string
): Promise<ChatMessage[]> {
  if (!db || !uid) return [];
  try {
    const chatDocRef = doc(db, 'users', uid, 'chats', sessionId);
    const snap = await getDoc(chatDocRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.messages) {
        return JSON.parse(data.messages) as ChatMessage[];
      }
    }
  } catch (error) {
    console.warn('Failed to load session messages from cloud:', error);
  }
  return [];
}
