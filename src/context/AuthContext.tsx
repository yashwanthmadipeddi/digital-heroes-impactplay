import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { UserProfile } from '../types';
import { isDemoMode, supabase } from '../lib/supabase';
import { signIn, signUp } from '../lib/services';
import { adminState, defaultState } from '../lib/demoData';
import { clearDemoSession, getDemoSessionRole, startDemoSession, type DemoRole } from '../lib/demoSession';

interface AuthContextValue {
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (name: string, email: string, password: string) => Promise<UserProfile>;
  openDemo: (role: DemoRole) => Promise<UserProfile>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = 'impactplay-session';

function readStoredProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as UserProfile;
    if (!p?.id || !p?.email || !p?.full_name || !p?.role) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return p;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function readDemoProfile(): UserProfile | null {
  const role = getDemoSessionRole();
  if (!role) return null;
  return role === 'admin' ? adminState.profile : defaultState.profile;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(() => readDemoProfile() ?? readStoredProfile());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getDemoSessionRole() || isDemoMode || !supabase) return;
    const client = supabase;
    let mounted = true;
    const loadProfile = async (userId: string) => {
      const { data, error } = await client.from('profiles').select('*').eq('id', userId).single();
      if (!mounted || error || !data) return;
      setProfile(data as UserProfile);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    };
    void client.auth.getSession().then(async ({ data }) => {
      if (data.session && mounted && !getDemoSessionRole()) await loadProfile(data.session.user.id);
    });
    const { data: listener } = client.auth.onAuthStateChange(async (_event, session) => {
      if (getDemoSessionRole()) return;
      if (!session) {
        setProfile(null);
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      await loadProfile(session.user.id);
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
        clearDemoSession();
        const result = await signIn(email, password);
        if (!result.profile) throw new Error('Profile not found.');
        setProfile(result.profile);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result.profile));
        return result.profile;
      } finally { setLoading(false); }
    },
    async register(name, email, password) {
      setLoading(true);
      try {
        clearDemoSession();
        const result = await signUp(name, email, password);
        if (!result.profile) throw new Error('Account created. Confirm your email, then log in.');
        setProfile(result.profile);
        if (result.session) localStorage.setItem(STORAGE_KEY, JSON.stringify(result.profile));
        return result.profile;
      } finally { setLoading(false); }
    },
    async openDemo(role) {
      setLoading(true);
      try {
        localStorage.removeItem(STORAGE_KEY);
        clearDemoSession();
        startDemoSession(role);
        const p = role === 'admin' ? adminState.profile : defaultState.profile;
        setProfile(p);
        return p;
      } finally { setLoading(false); }
    },
    async logout() {
      if (!getDemoSessionRole() && !isDemoMode && supabase) await supabase.auth.signOut();
      clearDemoSession();
      setProfile(null);
      localStorage.removeItem(STORAGE_KEY);
    },
  }), [profile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
