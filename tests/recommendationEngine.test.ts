import { describe, expect, it } from 'vitest';
import { courseCatalog, sampleProfiles } from '../src/data/catalog.js';
import { cseCurriculumMeta } from '../src/data/cseOfficial.js';
import { generateRecommendation, getCreditLimit } from '../src/lib/recommendationEngine.js';
import type { StudentProfile } from '../src/types/advisor.js';

describe('recommendation engine', () => {
  it('keeps a standard student within the credit ceiling and removes duplicates', () => {
    const plan = generateRecommendation(sampleProfiles.onTrack);
    const codes = plan.recommended.map((item) => item.course.code);

    expect(plan.totalCredits).toBeLessThanOrEqual(plan.creditLimit.max);
    expect(new Set(codes).size).toBe(codes.length);
    expect(codes).not.toContain('CSE1110');
    expect(codes).toEqual(['CSE3421', 'CSE3422', 'CSE3811', 'CSE3812', 'CSE4325', 'CSE4326']);
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
      completedCourses: ['CSE1110'],
      failedCourses: [],
      droppedCourses: [],
      creditsCompleted: 1,
      trimester: 'Fall',
      year: 1,
    };
    const plan = generateRecommendation(profile);

    expect(plan.recommended.some((item) => item.course.code === 'CSE2215')).toBe(false);
    expect(plan.excluded.find((item) => item.course.code === 'CSE2215')?.reason).toContain('CSE1111');
  });

  it('allows a 19-credit ceiling only above 3.50 CGPA', () => {
    expect(getCreditLimit({ ...sampleProfiles.highPerformer, cgpa: 3.51 }).max).toBe(19);
    expect(getCreditLimit({ ...sampleProfiles.highPerformer, cgpa: 3.5 }).max).toBe(16);
  });

  it('loads the full official CSE catalog and reconciles to the 137-credit degree requirement', () => {
    const catalog = courseCatalog.cse;
    const codes = catalog.map((course) => course.code);
    const requiredCredits = catalog
      .filter((course) => !course.requirementGroup)
      .reduce((sum, course) => sum + course.credits, 0);
    const choiceCredits = Object.values(cseCurriculumMeta.selectionRules)
      .reduce((sum, rule) => sum + rule.requiredCredits, 0);

    expect(catalog).toHaveLength(97);
    expect(new Set(codes).size).toBe(97);
    expect(requiredCredits + choiceCredits).toBe(cseCurriculumMeta.degreeCredits);
  });

  it('enforces official CSE choice-group limits', () => {
    const catalog = courseCatalog.cse;
    const profile: StudentProfile = {
      ...sampleProfiles.onTrack,
      year: 4,
      trimester: 'Fall',
      creditsCompleted: 113,
      completedCourses: catalog.filter((course) => !course.requirementGroup).map((course) => course.code),
      failedCourses: [],
      droppedCourses: [],
    };
    const plan = generateRecommendation(profile);
    const groupCounts = plan.recommended.reduce<Record<string, number>>((counts, item) => {
      if (item.course.requirementGroup) {
        counts[item.course.requirementGroup] = (counts[item.course.requirementGroup] ?? 0) + 1;
      }
      return counts;
    }, {});

    expect(groupCounts['ged-choice']).toBeLessThanOrEqual(2);
    expect(groupCounts['program-option']).toBeLessThanOrEqual(1);
    expect(groupCounts['cse-elective']).toBeLessThanOrEqual(5);
    expect(plan.totalCredits).toBeLessThanOrEqual(plan.creditLimit.max);
  });

  it('marks a low-CGPA non-probation student as watch risk', () => {
    const plan = generateRecommendation({ ...sampleProfiles.onTrack, cgpa: 2.2, probation: false });
    expect(plan.standing).toBe('watch');
    expect(plan.riskLevel).toBe('moderate');
    expect(plan.totalCredits).toBeLessThanOrEqual(12);
  });
});
