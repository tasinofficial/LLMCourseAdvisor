import { courseCatalog } from '../data/catalog.js';
import type {
  Course,
  CreditLimit,
  ExcludedCourse,
  RecommendationPlan,
  RecommendedCourse,
  StudentProfile,
} from '../types/advisor.js';

export function getCreditLimit(profile: StudentProfile): CreditLimit {
  if (profile.probation) {
    return { min: 6, max: 9, rationale: 'Probation students should take a focused 6–9 credit load.' };
  }
  if (profile.cgpa > 3.5) {
    return { min: 9, max: 19, rationale: 'Students above 3.50 CGPA may take up to 19 credits, subject to advising.' };
  }
  return { min: 9, max: 16, rationale: 'The standard undergraduate load is 9–16 credits.' };
}

function getStanding(profile: StudentProfile): RecommendationPlan['standing'] {
  if (profile.probation || profile.cgpa < 2) return 'probation';
  if (profile.cgpa < 2.5) return 'watch';
  if (profile.cgpa > 3.5) return 'excellent';
  return 'good';
}

function getRiskLevel(profile: StudentProfile): RecommendationPlan['riskLevel'] {
  if (profile.probation || profile.cgpa < 2) return 'high';
  if (profile.cgpa < 2.5) return 'moderate';
  return 'low';
}

function allPrerequisitesMet(course: Course, completed: Set<string>) {
  return course.prerequisites.every((prerequisite) => completed.has(prerequisite));
}

function targetCredits(profile: StudentProfile, limit: CreditLimit) {
  if (profile.probation) return limit.max;
  if (profile.cgpa < 2.5) return Math.min(12, limit.max);
  if (profile.cgpa > 3.5) return Math.min(18, limit.max);
  return Math.min(15, limit.max);
}

function asRecommendation(course: Course, type: RecommendedCourse['type'], priority: RecommendedCourse['priority'], reason: string): RecommendedCourse {
  return { course, type, priority, reason, warnings: [] };
}

function pickWithinCreditLimit(
  candidates: RecommendedCourse[],
  maxCredits: number,
  initiallySelected: RecommendedCourse[] = [],
) {
  const selected = [...initiallySelected];
  const selectedCodes = new Set(selected.map((item) => item.course.code));
  let total = selected.reduce((sum, item) => sum + item.course.credits, 0);

  for (const candidate of candidates) {
    if (selectedCodes.has(candidate.course.code)) continue;
    if (total + candidate.course.credits > maxCredits) continue;
    selected.push(candidate);
    selectedCodes.add(candidate.course.code);
    total += candidate.course.credits;
  }

  return selected;
}

export function generateRecommendation(profile: StudentProfile): RecommendationPlan {
  const catalog = courseCatalog[profile.department];
  const completed = new Set(profile.completedCourses);
  const failed = new Set(profile.failedCourses);
  const attemptedOld = new Set([...profile.failedCourses, ...profile.droppedCourses]);
  const creditLimit = getCreditLimit(profile);
  const target = targetCredits(profile, creditLimit);
  const excluded: ExcludedCourse[] = [];

  const retakes: RecommendedCourse[] = [];
  const eligible: RecommendedCourse[] = [];

  for (const course of catalog) {
    if (completed.has(course.code)) {
      excluded.push({ course, reason: 'Already completed.' });
      continue;
    }

    if (attemptedOld.has(course.code)) {
      retakes.push(asRecommendation(
        course,
        'retake',
        1,
        failed.has(course.code)
          ? 'Failed previously; retake before advancing to dependent courses.'
          : 'Dropped previously; clear this course before adding lower-priority courses.',
      ));
      continue;
    }

    if (!allPrerequisitesMet(course, completed)) {
      const missing = course.prerequisites.filter((prerequisite) => !completed.has(prerequisite));
      excluded.push({ course, reason: `Missing prerequisite${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}.` });
      continue;
    }

    if (course.category === 'ged') {
      eligible.push(asRecommendation(course, 'ged', 2, 'Outstanding general-education requirement and eligible now.'));
    } else if (course.category === 'core') {
      const onSequence = course.recommendedYear <= profile.year;
      eligible.push(asRecommendation(
        course,
        'core',
        3,
        onSequence ? 'Required core course aligned with current program progress.' : 'Eligible core course that advances the prerequisite chain.',
      ));
    } else {
      eligible.push(asRecommendation(course, 'elective', 4, 'Eligible elective that fits the current prerequisite profile.'));
    }
  }

  retakes.sort((a, b) => a.course.recommendedYear - b.course.recommendedYear || a.course.code.localeCompare(b.course.code));
  eligible.sort((a, b) =>
    a.priority - b.priority
    || Number(a.course.recommendedYear > profile.year) - Number(b.course.recommendedYear > profile.year)
    || a.course.recommendedYear - b.course.recommendedYear
    || a.course.code.localeCompare(b.course.code),
  );

  let recommended = pickWithinCreditLimit(retakes, creditLimit.max);

  if (profile.probation) {
    const oldCount = recommended.length;
    const maximumNewCourses = oldCount > 0 ? Math.floor(oldCount / 2) : 2;
    const probationEligible = eligible.slice(0, maximumNewCourses);
    recommended = pickWithinCreditLimit(probationEligible, creditLimit.max, recommended);
  } else {
    recommended = pickWithinCreditLimit(eligible, target, recommended);
  }

  const totalCredits = recommended.reduce((sum, item) => sum + item.course.credits, 0);
  const advancedCount = recommended.filter((item) => item.course.difficulty === 'advanced').length;
  const notices: string[] = [];

  if (totalCredits < creditLimit.min) {
    notices.push(`Only ${totalCredits} eligible credits were found; an academic advisor should review substitutions or overrides.`);
  }
  if (retakes.length > recommended.filter((item) => item.type === 'retake').length) {
    notices.push('Not every retake fits within the credit ceiling; advisor prioritization is required.');
  }
  if (profile.probation) {
    notices.push('Probation plans require advisor approval and prioritize old courses before new courses.');
  }
  if (advancedCount >= 3) {
    notices.push('This plan includes several advanced courses; confirm the combined workload and exam schedule.');
    recommended = recommended.map((item) => item.course.difficulty === 'advanced'
      ? { ...item, warnings: [...item.warnings, 'Advanced workload concentration'] }
      : item);
  }
  if (profile.creditsCompleted < 30) {
    notices.push('First-year students should prioritize the offered foundation sequence.');
  }
  notices.push('This is decision support, not final registration approval. Confirm offerings, sections, and conflicts with UIU advising.');

  return {
    profile,
    recommended,
    excluded,
    totalCredits,
    creditLimit,
    standing: getStanding(profile),
    riskLevel: getRiskLevel(profile),
    notices,
    generatedAt: new Date().toISOString(),
  };
}
