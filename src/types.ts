export type Role = 'user' | 'admin';
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'past_due';
export type Plan = 'monthly' | 'yearly';
export type DrawType = 'random' | 'algorithmic';
export type DrawStatus = 'draft' | 'simulated' | 'published';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type PaymentStatus = 'pending' | 'paid';
export type CricketFormat = 'T20' | 'ODI' | 'Test';
export type MatchResult = 'Win' | 'Draw' | 'Loss';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  avatar_url?: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: Plan;
  status: SubscriptionStatus;
  price: number;
  charity_percentage: number;
  charity_id: string;
  current_period_end: string;
}

export interface Score {
  id: string;
  user_id: string;
  score: number;
  score_date: string;
  runs: number;
  wickets: number;
  format: CricketFormat;
  result: MatchResult;
}

export interface Charity {
  id: string;
  name: string;
  description: string;
  image_url: string;
  website_url?: string;
  featured: boolean;
  impact_metric: string;
}

export interface Draw {
  id: string;
  draw_month: string;
  draw_type: DrawType;
  numbers: number[];
  status: DrawStatus;
  jackpot_amount: number;
  prize_4_match: number;
  prize_3_match: number;
  eligible_subscribers: number;
  published_at?: string | null;
}

export interface Winner {
  id: string;
  draw_id: string;
  user_id: string;
  user_name: string;
  match_type: '5-number' | '4-number' | '3-number';
  amount: number;
  verification_status: VerificationStatus;
  payment_status: PaymentStatus;
  proof_url?: string | null;
}

export interface DemoState {
  profile: UserProfile;
  subscription: Subscription;
  scores: Score[];
  charities: Charity[];
  draws: Draw[];
  winners: Winner[];
}
