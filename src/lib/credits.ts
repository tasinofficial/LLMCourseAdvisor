import { courseCatalog } from '../data/catalog.js';
import type { DepartmentId, StudentProfile } from '../types/advisor.js';

export function calculateCompletedCredits(department: DepartmentId, completedCourseCodes: readonly string[]) {
  const uniqueCompleted = new Set(completedCourseCodes);
  return courseCatalog[department]
    .filter((course) => uniqueCompleted.has(course.code))
    .reduce((total, course) => total + course.credits, 0);
}

export function calculateCreditsFromCourseHistory(
  department: DepartmentId,
  history: Pick<StudentProfile, 'completedCourses' | 'failedCourses' | 'droppedCourses'>,
) {
  return calculateCompletedCredits(department, history.completedCourses);
}
