import { describe, expect, it } from 'vitest';
import { sampleProfiles } from '../src/data/catalog.js';
import { calculateCompletedCredits, calculateCreditsFromCourseHistory } from '../src/lib/credits.js';

describe('completed-credit calculator', () => {
  it('sums official credits for courses marked Passed', () => {
    expect(calculateCompletedCredits('cse', ['CSE1110', 'MATH1151', 'BDS1201'])).toBe(6);
  });

  it('does not double-count duplicate course codes', () => {
    expect(calculateCompletedCredits('cse', ['CSE1111', 'CSE1111', 'CSE1112'])).toBe(4);
  });

  it('ignores unknown course codes defensively', () => {
    expect(calculateCompletedCredits('cse', ['CSE1110', 'UNKNOWN999'])).toBe(1);
  });

  it('counts only the completed list supplied by the UI, not failed or dropped selections', () => {
    const history = {
      completedCourses: ['CSE1110'],
      failedCourses: ['CSE1111'],
      droppedCourses: ['MATH1151'],
    };

    expect(calculateCreditsFromCourseHistory('cse', history)).toBe(1);
  });

  it('keeps every sample profile synchronized with its Passed courses', () => {
    for (const profile of Object.values(sampleProfiles)) {
      expect(calculateCreditsFromCourseHistory(profile.department, profile)).toBe(profile.creditsCompleted);
    }
  });
});
