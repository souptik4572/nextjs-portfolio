/**
 * Admin auth helpers.
 * All Firebase Auth calls must go through this module.
 */

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type Unsubscribe,
} from "firebase/auth";
import { auth } from "./firebase";

export async function adminSignIn(
  email: string,
  password: string,
): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function adminSignOut(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuthState(
  cb: (user: User | null) => void,
): Unsubscribe {
  return onAuthStateChanged(auth, cb);
}

export function getAllowedUid(): string {
  return process.env.NEXT_PUBLIC_FIREBASE_ALLOWED_UID ?? "";
}
