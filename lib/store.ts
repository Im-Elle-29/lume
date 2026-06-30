import { create } from 'zustand'

interface AuthState {
  user: any | null
  profile: any | null
  loading: boolean
  setUser: (user: any) => void
  setProfile: (profile: any) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  reset: () => set({ user: null, profile: null, loading: false }),
}))