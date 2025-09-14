const BASE_EXPERIENCE = 20;
const EXPERIENCE_FACTOR = 1.3;

export function calculateLevelFrom(experiencePoints: number): number {
  let level = 1;
  let xpForNext = BASE_EXPERIENCE;

  while (experiencePoints >= xpForNext) {
    experiencePoints -= xpForNext;
    level++;
    xpForNext = Math.floor(BASE_EXPERIENCE * EXPERIENCE_FACTOR ** (level - 1));
  }

  return level;
}

export function calculateExperienceToLevel(level: number) {
  if (level === 1) return 0;
  return Math.floor(BASE_EXPERIENCE * EXPERIENCE_FACTOR ** (level - 1));
}
