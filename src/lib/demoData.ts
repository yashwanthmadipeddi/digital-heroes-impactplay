import type { DemoState } from '../types';

const demoUserId = 'demo-user-001';
const demoAdminId = 'demo-admin-001';

export const charities = [
  {
    id: 'charity-hope', name: 'Hope Foundation',
    description: 'Community-led education, nutrition, and youth opportunity programs.',
    image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80',
    featured: true, impact_metric: '1,850 families reached this year'
  },
  {
    id: 'charity-green', name: 'Green Earth Initiative',
    description: 'Restoring local ecosystems through urban forests, water stewardship, and education.',
    image_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
    featured: true, impact_metric: '12,400 native trees planted'
  },
  {
    id: 'charity-child', name: 'Children First',
    description: 'Direct support for children through safe learning spaces and mentorship.',
    image_url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=900&q=80',
    featured: false, impact_metric: '740 students supported'
  },
  {
    id: 'charity-health', name: 'Community Health Trust',
    description: 'Mobile health camps and prevention programs for underserved communities.',
    image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80',
    featured: false, impact_metric: '5,600 screenings delivered'
  }
];

export const defaultState: DemoState = {
  profile: { id: demoUserId, email: 'demo@impactplay-demo.com', full_name: 'Aarav Mehta', role: 'user', created_at: new Date().toISOString() },
  subscription: { id: 'sub-001', user_id: demoUserId, plan: 'monthly', status: 'active', price: 999, charity_percentage: 15, charity_id: 'charity-hope', current_period_end: '2026-10-20' },
  scores: [
    { id: 's1', user_id: demoUserId, score: 32, score_date: '2026-09-18', runs: 78, wickets: 1, format: 'T20', result: 'Win' },
    { id: 's2', user_id: demoUserId, score: 28, score_date: '2026-09-13', runs: 54, wickets: 2, format: 'ODI', result: 'Win' },
    { id: 's3', user_id: demoUserId, score: 24, score_date: '2026-09-06', runs: 41, wickets: 1, format: 'T20', result: 'Loss' },
    { id: 's4', user_id: demoUserId, score: 35, score_date: '2026-08-29', runs: 92, wickets: 2, format: 'ODI', result: 'Win' },
    { id: 's5', user_id: demoUserId, score: 21, score_date: '2026-08-22', runs: 36, wickets: 0, format: 'T20', result: 'Draw' },
  ],
  charities,
  draws: [
    { id: 'draw-sep', draw_month: 'September 2026', draw_type: 'algorithmic', numbers: [7, 14, 22, 31, 40], status: 'published', jackpot_amount: 38400, prize_4_match: 33600, prize_3_match: 24000, eligible_subscribers: 1200, published_at: '2026-09-01' },
    { id: 'draw-oct', draw_month: 'October 2026', draw_type: 'random', numbers: [3, 9, 18, 27, 44], status: 'simulated', jackpot_amount: 40000, prize_4_match: 35000, prize_3_match: 25000, eligible_subscribers: 1250 }
  ],
  winners: [
    { id: 'win-001', draw_id: 'draw-sep', user_id: 'member-08', user_name: 'Maya Rao', match_type: '4-number', amount: 16800, verification_status: 'pending', payment_status: 'pending' }
  ]
};

export const adminState: DemoState = {
  ...defaultState,
  profile: { id: demoAdminId, email: 'admin@impactplay-demo.com', full_name: 'Srijan — Demo Admin', role: 'admin', created_at: new Date().toISOString() }
};

const KEY = 'impactplay-demo-state';
export function loadDemoState(admin = false): DemoState {
  const stored = localStorage.getItem(KEY);
  if (!stored) return structuredClone(admin ? adminState : defaultState);
  try {
    const parsed = JSON.parse(stored) as DemoState;
    parsed.profile = admin ? adminState.profile : defaultState.profile;
    return parsed;
  } catch {
    return structuredClone(admin ? adminState : defaultState);
  }
}

export function saveDemoState(state: DemoState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetDemoState() {
  localStorage.removeItem(KEY);
}
