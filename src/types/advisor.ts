export type DepartmentId = 'cse' | 'eee' | 'bba' | 'pharmacy' | 'bge';
export type CourseCategory = 'core' | 'elective' | 'ged';
export type CourseStatus = 'completed' | 'failed' | 'dropped';
export type RecommendationType = 'retake' | 'ged' | 'core' | 'elective';

export interface Department {
  id: DepartmentId;
  name: string;
  shortName: string;
  school: string;
  accent: string;
}

export interface Course {
  code: string;
  title: string;
  credits: number;
  prerequisites: string[];
  category: CourseCategory;
  recommendedYear: number;
  recommendedTerm?: number;
  difficulty: 'foundation' | 'intermediate' | 'advanced';
  requirementGroup?: 'ged-choice' | 'program-option' | 'cse-elective';
  requirementLimit?: number;
}

export interface StudentProfile {
  name: string;
  studentId: string;
  department: DepartmentId;
  cgpa: number;
  creditsCompleted: number;
  trimester: 'Spring' | 'Summer' | 'Fall';
  year: number;
  probation: boolean;
  completedCourses: string[];
  failedCourses: string[];
  droppedCourses: string[];
}

export interface RecommendedCourse {
  course: Course;
  type: RecommendationType;
  priority: 1 | 2 | 3 | 4;
  reason: string;
  warnings: string[];
}

export interface ExcludedCourse {
  course: Course;
  reason: string;
}

export interface CreditLimit {
  min: number;
  max: number;
  rationale: string;
}

export interface RecommendationPlan {
  profile: StudentProfile;
  recommended: RecommendedCourse[];
  excluded: ExcludedCourse[];
  totalCredits: number;
  creditLimit: CreditLimit;
  standing: 'probation' | 'watch' | 'good' | 'excellent';
  riskLevel: 'high' | 'moderate' | 'low';
  notices: string[];
  generatedAt: string;
}

export interface AdviceResponse {
  advice: string;
  source: 'gemini' | 'fallback';
  model?: string;
  plan: RecommendationPlan;
}
