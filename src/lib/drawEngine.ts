import type { DrawType, Score } from '../types';

export const PRIZE_SHARES = { jackpot: 0.40, four: 0.35, three: 0.25 } as const;

function uniqueFive(pool: number[]): number[] {
  const output = new Set<number>();
  while (output.size < 5) {
    output.add(pool[Math.floor(Math.random() * pool.length)]);
  }
  return [...output].sort((a, b) => a - b);
}

export function generateDraw(type: DrawType, scores: Score[]): number[] {
  if (type === 'random') {
    return uniqueFive(Array.from({ length: 45 }, (_, i) => i + 1));
  }
  // Explicit, transparent cricket-form weighting rule:
  // observed Impact Form Scores increase their weight; neighboring values get a smaller halo.
  const weights = Array.from({ length: 45 }, (_, i) => {
    const n = i + 1;
    const frequency = scores.filter((s) => s.score === n).length;
    const neighbors = scores.filter((s) => Math.abs(s.score - n) === 1).length;
    return { n, weight: 1 + frequency * 5 + neighbors * 2 };
  });
  const pool: number[] = [];
  for (const item of weights) {
    const count = Math.min(8, Math.max(1, item.weight));
    for (let i = 0; i < count; i++) pool.push(item.n);
  }
  return uniqueFive(pool);
}

export function calculatePrizePools(totalPrizePool: number, rollover: number) {
  const jackpot = totalPrizePool * PRIZE_SHARES.jackpot + rollover;
  return {
    jackpot: Math.round(jackpot),
    four: Math.round(totalPrizePool * PRIZE_SHARES.four),
    three: Math.round(totalPrizePool * PRIZE_SHARES.three)
  };
}

export function splitTier(amount: number, winners: number) {
  return winners > 0 ? Math.round(amount / winners) : 0;
}
