import { z } from 'zod';

const courseCodeArray = z.array(z.string().trim().min(2).max(20)).max(80).transform((codes) => [...new Set(codes)]);

export const studentProfileSchema = z.object({
  name: z.string().trim().min(1).max(80),
  studentId: z.string().trim().min(3).max(40),
  department: z.enum(['cse', 'eee', 'bba', 'pharmacy', 'bge']),
  cgpa: z.number().min(0).max(4),
  creditsCompleted: z.number().int().min(0).max(250),
  trimester: z.enum(['Spring', 'Summer', 'Fall']),
  year: z.number().int().min(1).max(6),
  probation: z.boolean(),
  completedCourses: courseCodeArray,
  failedCourses: courseCodeArray,
  droppedCourses: courseCodeArray,
}).superRefine((profile, context) => {
  const completed = new Set(profile.completedCourses);
  for (const code of [...profile.failedCourses, ...profile.droppedCourses]) {
    if (completed.has(code)) {
      context.addIssue({
        code: 'custom',
        message: `${code} cannot be both completed and failed/dropped.`,
        path: ['completedCourses'],
      });
    }
  }
});

export type ValidatedStudentProfile = z.infer<typeof studentProfileSchema>;
