import { isDemoMode, supabase } from './supabase';
import { loadDemoState, saveDemoState } from './demoData';
import type { Charity, CricketFormat, MatchResult, Score, UserProfile } from '../types';

export async function signIn(email: string, password: string) {
  if (isDemoMode) {
    const admin = email.toLowerCase().startsWith('admin@');
    if ((admin && password === 'Admin@1234') || (!admin && password === 'Demo@1234')) {
      const state = loadDemoState(admin);
      saveDemoState(state);
      return { profile: state.profile, session: { demo: true } };
    }
    throw new Error('Use the demo credentials shown in Explore Live Demo while demo mode is enabled.');
  }
  const { data, error } = await supabase!.auth.signInWithPassword({ email, password });
  if (error) throw error;
  const { data: profile } = await supabase!.from('profiles').select('*').eq('id', data.user.id).single();
  return { profile: profile as UserProfile, session: data.session };
}

export async function signUp(fullName: string, email: string, password: string) {
  if (isDemoMode) {
    return { profile: { id: crypto.randomUUID(), email, full_name: fullName, role: 'user', created_at: new Date().toISOString() } as UserProfile, session: { demo: true } };
  }
  const { data, error } = await supabase!.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
  if (error) throw error;
  return { profile: data.user ? ({ id: data.user.id, email, full_name: fullName, role: 'user', created_at: new Date().toISOString() } as UserProfile) : null, session: data.session };
}

export function calculateFormScore(runs: number, wickets: number, result: MatchResult) {
  const batting = Math.min(25, Math.round(runs / 4));
  const bowling = Math.min(15, wickets * 5);
  const resultBonus = result === 'Win' ? 5 : result === 'Draw' ? 3 : 1;
  return Math.max(1, Math.min(45, batting + bowling + resultBonus));
}

export async function addScore(
  userId: string,
  runs: number,
  wickets: number,
  format: CricketFormat,
  result: MatchResult,
  scoreDate: string
) {
  if (runs < 0 || runs > 500) throw new Error('Runs must be between 0 and 500.');
  if (wickets < 0 || wickets > 10) throw new Error('Wickets must be between 0 and 10.');
  const score = calculateFormScore(runs, wickets, result);

  if (isDemoMode) {
    const state = loadDemoState();
    if (state.scores.some((s) => s.score_date === scoreDate && s.user_id === userId)) {
      throw new Error('Only one match entry is allowed per date. Edit or delete the existing match.');
    }
    state.scores = [...state.scores, { id: crypto.randomUUID(), user_id: userId, score, score_date: scoreDate, runs, wickets, format, result }]
      .sort((a, b) => b.score_date.localeCompare(a.score_date)).slice(0, 5);
    saveDemoState(state);
    return state.scores;
  }

  const { error } = await supabase!.from('scores').insert({
    user_id: userId,
    score,
    score_date: scoreDate,
    runs,
    wickets,
    format,
    result
  });
  if (error) throw error;
  const { data } = await supabase!.from('scores').select('*').eq('user_id', userId).order('score_date', { ascending: false }).limit(5);
  return (data ?? []) as Score[];
}

export async function deleteScore(id: string, userId: string) {
  if (isDemoMode) {
    const state = loadDemoState();
    state.scores = state.scores.filter((s) => s.id !== id);
    saveDemoState(state);
    return state.scores;
  }
  const { error } = await supabase!.from('scores').delete().eq('id', id).eq('user_id', userId);
  if (error) throw error;
  const { data } = await supabase!.from('scores').select('*').eq('user_id', userId).order('score_date', { ascending: false }).limit(5);
  return (data ?? []) as Score[];
}

export async function getCharities(): Promise<Charity[]> {
  if (isDemoMode) return loadDemoState().charities;
  const { data, error } = await supabase!.from('charities').select('*').order('featured', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Charity[];
}
