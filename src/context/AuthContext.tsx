import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { UserProfile } from '../types';
import { isDemoMode, supabase } from '../lib/supabase';
import { signIn, signUp } from '../lib/services';

interface AuthContextValue {
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (name: string, email: string, password: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = 'impactplay-session';

function readStoredProfile(): UserProfile | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserProfile;
    if (!parsed?.id || !parsed?.email || !parsed?.full_name || !parsed?.role) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(() => readStoredProfile());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isDemoMode || !supabase) return;
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session || !mounted) return;
      const { data: p } = await supabase.from('profiles').select('*').eq('id', data.session.user.id).single();
      if (mounted) setProfile((p as UserProfile) || null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        setProfile(null);
        window.localStorage.removeItem(STORAGE_KEY);
        return;
      }
      const { data: p } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (mounted) setProfile((p as UserProfile) || null);
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    profile,
    loading,
    async login(email, password) {
      setLoading(true);
      try {
        const result = await signIn(email, password);
        if (!result.profile) throw new Error('Profile not found.');
        setProfile(result.profile);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(result.profile));
        return result.profile;
      } finally {
        setLoading(false);
      }
    },
    async register(name, email, password) {
      setLoading(true);
      try {
        const result = await signUp(name, email, password);
        if (!result.profile) throw new Error('Could not create profile.');
        setProfile(result.profile);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(result.profile));
        return result.profile;
      } finally {
        setLoading(false);
      }
    },
    async logout() {
      if (!isDemoMode && supabase) await supabase.auth.signOut();
      setProfile(null);
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }), [profile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
