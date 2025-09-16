import { describe, expect, test } from 'vitest';

import {
  calculateExperienceToLevel,
  calculateLevelFrom,
  calculateTotalExperienceForLevel,
} from 'src/shared/utils/gamification.util';

describe('Gamification functions', () => {
  test('experience to level', () => {
    const exp1 = calculateExperienceToLevel(1);
    const exp2 = calculateExperienceToLevel(2);
    const exp3 = calculateExperienceToLevel(3);

    expect(exp1).toEqual(0);
    expect(exp2).toEqual(26);
    expect(exp3).toEqual(33);
  });

  test('total experience to level', () => {
    const lev1 = calculateTotalExperienceForLevel(1);
    const lev2 = calculateTotalExperienceForLevel(2);
    const lev3 = calculateTotalExperienceForLevel(3);
    const lev4 = calculateTotalExperienceForLevel(4);

    expect(lev1).toEqual(0);
    expect(lev2).toEqual(26);
    expect(lev3).toEqual(26 + 33);
    expect(lev4).toEqual(26 + 33 + 43);
  });

  test('level from experience', () => {
    const lev1 = calculateLevelFrom(10);
    const lev2 = calculateLevelFrom(27);
    const lev4 = calculateLevelFrom(26 + 33 + 43);

    expect(lev1).toEqual(1);
    expect(lev2).toEqual(2);
    expect(lev4).toEqual(4);
  });
});
