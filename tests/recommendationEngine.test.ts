import { describe, expect, it } from 'vitest';
import { sampleProfiles } from '../src/data/catalog.js';
import { generateRecommendation, getCreditLimit } from '../src/lib/recommendationEngine.js';
import type { StudentProfile } from '../src/types/advisor.js';

describe('recommendation engine', () => {
  it('keeps a standard student within the credit ceiling and removes duplicates', () => {
    const plan = generateRecommendation(sampleProfiles.onTrack);
    const codes = plan.recommended.map((item) => item.course.code);

    expect(plan.totalCredits).toBeLessThanOrEqual(plan.creditLimit.max);
    expect(new Set(codes).size).toBe(codes.length);
    expect(codes).not.toContain('CSE111');
  });

  it('prioritizes failed and dropped courses for probation students', () => {
    const plan = generateRecommendation(sampleProfiles.probation);
    const recommendedTypes = plan.recommended.map((item) => item.type);

    expect(plan.creditLimit).toMatchObject({ min: 6, max: 9 });
    expect(plan.totalCredits).toBeLessThanOrEqual(9);
    expect(recommendedTypes.slice(0, 3)).toEqual(['retake', 'retake', 'retake']);
  });

  it('does not recommend a course whose prerequisite is incomplete', () => {
    const profile: StudentProfile = {
      ...sampleProfiles.onTrack,
      completedCourses: ['CSE111'],
      failedCourses: [],
      droppedCourses: [],
      creditsCompleted: 3,
      year: 2,
    };
    const plan = generateRecommendation(profile);

    expect(plan.recommended.some((item) => item.course.code === 'CSE221')).toBe(false);
    expect(plan.excluded.find((item) => item.course.code === 'CSE221')?.reason).toContain('CSE211');
  });

  it('allows a 19-credit ceiling only above 3.50 CGPA', () => {
    expect(getCreditLimit({ ...sampleProfiles.highPerformer, cgpa: 3.51 }).max).toBe(19);
    expect(getCreditLimit({ ...sampleProfiles.highPerformer, cgpa: 3.5 }).max).toBe(16);
  });

  it('marks a low-CGPA non-probation student as watch risk', () => {
    const plan = generateRecommendation({ ...sampleProfiles.onTrack, cgpa: 2.2, probation: false });
    expect(plan.standing).toBe('watch');
    expect(plan.riskLevel).toBe('moderate');
    expect(plan.totalCredits).toBeLessThanOrEqual(12);
  });
});
