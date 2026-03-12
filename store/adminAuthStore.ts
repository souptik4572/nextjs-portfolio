/**
 * Zustand store for admin authentication state.
 * Subscribe to this from any client component that needs auth info.
 */

import { create } from "zustand";
import type { User } from "firebase/auth";

interface AdminAuthState {
  user: User | null;
  isAuthorised: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (v: boolean) => void;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  user: null,
  isAuthorised: false,
  isLoading: true,
  setUser: (user) => {
    const allowedUid = process.env.NEXT_PUBLIC_FIREBASE_ALLOWED_UID ?? "";
    set({
      user,
      isAuthorised: user !== null && user.uid === allowedUid,
    });
  },
  setLoading: (v) => set({ isLoading: v }),
}));
