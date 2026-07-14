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

function currentProgramTerm(profile: StudentProfile) {
  const offset = profile.trimester === 'Spring' ? 1 : profile.trimester === 'Summer' ? 2 : 3;
  return ((profile.year - 1) * 3) + offset;
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

type RequirementGroup = NonNullable<Course['requirementGroup']>;

function pickWithinCreditLimit(
  candidates: RecommendedCourse[],
  maxCredits: number,
  initiallySelected: RecommendedCourse[] = [],
  fulfilledGroupCounts: ReadonlyMap<RequirementGroup, number> = new Map(),
) {
  const selected = [...initiallySelected];
  const selectedCodes = new Set(selected.map((item) => item.course.code));
  const groupCounts = new Map(fulfilledGroupCounts);
  let total = selected.reduce((sum, item) => sum + item.course.credits, 0);

  for (const item of selected) {
    if (item.course.requirementGroup) {
      groupCounts.set(item.course.requirementGroup, (groupCounts.get(item.course.requirementGroup) ?? 0) + 1);
    }
  }

  for (const candidate of candidates) {
    if (selectedCodes.has(candidate.course.code)) continue;
    if (total + candidate.course.credits > maxCredits) continue;

    const group = candidate.course.requirementGroup;
    if (group && candidate.course.requirementLimit) {
      const fulfilled = groupCounts.get(group) ?? 0;
      if (fulfilled >= candidate.course.requirementLimit) continue;
      groupCounts.set(group, fulfilled + 1);
    }

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
  const fulfilledGroupCounts = new Map<RequirementGroup, number>();
  for (const course of catalog) {
    if (completed.has(course.code) && course.requirementGroup) {
      fulfilledGroupCounts.set(course.requirementGroup, (fulfilledGroupCounts.get(course.requirementGroup) ?? 0) + 1);
    }
  }
  const attemptedOld = new Set([...profile.failedCourses, ...profile.droppedCourses]);
  const creditLimit = getCreditLimit(profile);
  const currentTerm = currentProgramTerm(profile);
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

    const scheduledLater = course.recommendedTerm
      ? course.recommendedTerm > currentTerm
      : course.recommendedYear > profile.year;
    if (scheduledLater) {
      excluded.push({ course, reason: course.recommendedTerm
        ? `Officially sequenced for trimester ${course.recommendedTerm}.`
        : `Recommended from program year ${course.recommendedYear}.` });
      continue;
    }

    if (!allPrerequisitesMet(course, completed)) {
      const missing = course.prerequisites.filter((prerequisite) => !completed.has(prerequisite));
      excluded.push({ course, reason: `Missing prerequisite${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}.` });
      continue;
    }

    if (course.category === 'ged') {
      eligible.push(asRecommendation(
        course,
        'ged',
        course.requirementGroup === 'ged-choice' ? 3 : 2,
        course.requirementGroup === 'ged-choice'
          ? 'Eligible choice within the official General Education optional requirement.'
          : 'Outstanding General Education or university requirement and eligible now.',
      ));
    } else if (course.category === 'core') {
      const onSequence = course.recommendedTerm
        ? course.recommendedTerm <= currentTerm
        : course.recommendedYear <= profile.year;
      eligible.push(asRecommendation(
        course,
        'core',
        3,
        onSequence ? 'Required core course aligned with the official trimester sequence.' : 'Eligible core course that advances the prerequisite chain.',
      ));
    } else {
      const reason = course.requirementGroup === 'program-option'
        ? 'Eligible choice within the official programming optional requirement.'
        : course.requirementGroup === 'cse-elective'
          ? 'Eligible choice within the official CSE specialization elective requirement.'
          : 'Eligible elective that fits the current prerequisite profile.';
      eligible.push(asRecommendation(course, 'elective', 4, reason));
    }
  }

  const sequenceNumber = (course: Course) => course.recommendedTerm ?? (course.recommendedYear * 3);
  retakes.sort((a, b) => sequenceNumber(a.course) - sequenceNumber(b.course) || a.course.code.localeCompare(b.course.code));
  eligible.sort((a, b) =>
    a.priority - b.priority
    || Number(a.course.recommendedYear > profile.year) - Number(b.course.recommendedYear > profile.year)
    || sequenceNumber(a.course) - sequenceNumber(b.course)
    || a.course.code.localeCompare(b.course.code),
  );

  let recommended = pickWithinCreditLimit(retakes, creditLimit.max);

  if (profile.probation) {
    const oldCount = recommended.length;
    const maximumNewCourses = oldCount > 0 ? Math.floor(oldCount / 2) : 2;
    const probationEligible = eligible.slice(0, maximumNewCourses);
    recommended = pickWithinCreditLimit(probationEligible, creditLimit.max, recommended, fulfilledGroupCounts);
  } else {
    recommended = pickWithinCreditLimit(eligible, target, recommended, fulfilledGroupCounts);
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
