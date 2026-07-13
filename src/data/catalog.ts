import type { Course, Department, DepartmentId, StudentProfile } from '../types/advisor.js';

export const departments: Department[] = [
  { id: 'cse', name: 'Computer Science & Engineering', shortName: 'CSE', school: 'School of Science & Engineering', accent: '#0f766e' },
  { id: 'eee', name: 'Electrical & Electronic Engineering', shortName: 'EEE', school: 'School of Science & Engineering', accent: '#2563eb' },
  { id: 'bba', name: 'Business Administration', shortName: 'BBA', school: 'School of Business & Economics', accent: '#7c3aed' },
  { id: 'pharmacy', name: 'Pharmacy', shortName: 'Pharmacy', school: 'School of Life Sciences', accent: '#dc2626' },
  { id: 'bge', name: 'Biotechnology & Genetic Engineering', shortName: 'BGE', school: 'School of Life Sciences', accent: '#15803d' },
];

const shared: Course[] = [
  { code: 'ENG101', title: 'English Composition', credits: 3, prerequisites: [], category: 'ged', recommendedYear: 1, difficulty: 'foundation' },
  { code: 'GED102', title: 'Bangladesh Studies', credits: 3, prerequisites: [], category: 'ged', recommendedYear: 1, difficulty: 'foundation' },
  { code: 'GED201', title: 'World Civilization', credits: 3, prerequisites: [], category: 'ged', recommendedYear: 2, difficulty: 'intermediate' },
  { code: 'GED202', title: 'Professional Ethics', credits: 3, prerequisites: [], category: 'ged', recommendedYear: 2, difficulty: 'intermediate' },
];

export const courseCatalog: Record<DepartmentId, Course[]> = {
  cse: [
    { code: 'CSE111', title: 'Programming Language I', credits: 3, prerequisites: [], category: 'core', recommendedYear: 1, difficulty: 'foundation' },
    { code: 'CSE112', title: 'Programming Language I Laboratory', credits: 1, prerequisites: [], category: 'core', recommendedYear: 1, difficulty: 'foundation' },
    { code: 'CSE211', title: 'Data Structures', credits: 3, prerequisites: ['CSE111'], category: 'core', recommendedYear: 1, difficulty: 'intermediate' },
    { code: 'CSE212', title: 'Data Structures Laboratory', credits: 1, prerequisites: ['CSE112'], category: 'core', recommendedYear: 1, difficulty: 'intermediate' },
    { code: 'CSE221', title: 'Object Oriented Programming', credits: 3, prerequisites: ['CSE211'], category: 'core', recommendedYear: 2, difficulty: 'intermediate' },
    { code: 'CSE222', title: 'Algorithms', credits: 3, prerequisites: ['CSE211'], category: 'core', recommendedYear: 2, difficulty: 'advanced' },
    { code: 'CSE311', title: 'Database Management Systems', credits: 3, prerequisites: ['CSE211'], category: 'core', recommendedYear: 2, difficulty: 'intermediate' },
    { code: 'CSE312', title: 'Computer Architecture', credits: 3, prerequisites: ['CSE221'], category: 'core', recommendedYear: 2, difficulty: 'advanced' },
    { code: 'CSE321', title: 'Operating Systems', credits: 3, prerequisites: ['CSE312'], category: 'core', recommendedYear: 3, difficulty: 'advanced' },
    { code: 'CSE322', title: 'Computer Networks', credits: 3, prerequisites: ['CSE222'], category: 'core', recommendedYear: 3, difficulty: 'advanced' },
    { code: 'CSE331', title: 'Software Engineering', credits: 3, prerequisites: ['CSE221'], category: 'core', recommendedYear: 3, difficulty: 'intermediate' },
    { code: 'CSE411', title: 'Artificial Intelligence', credits: 3, prerequisites: ['CSE222'], category: 'elective', recommendedYear: 3, difficulty: 'advanced' },
    { code: 'CSE412', title: 'Machine Learning', credits: 3, prerequisites: ['CSE222'], category: 'elective', recommendedYear: 4, difficulty: 'advanced' },
    { code: 'CSE413', title: 'Cybersecurity', credits: 3, prerequisites: ['CSE322'], category: 'elective', recommendedYear: 4, difficulty: 'advanced' },
    ...shared,
  ],
  eee: [
    { code: 'EEE101', title: 'Electrical Circuits I', credits: 3, prerequisites: [], category: 'core', recommendedYear: 1, difficulty: 'foundation' },
    { code: 'EEE102', title: 'Electrical Circuits Laboratory', credits: 1, prerequisites: [], category: 'core', recommendedYear: 1, difficulty: 'foundation' },
    { code: 'EEE201', title: 'Electronics I', credits: 3, prerequisites: ['EEE101'], category: 'core', recommendedYear: 1, difficulty: 'intermediate' },
    { code: 'EEE202', title: 'Electronics Laboratory', credits: 1, prerequisites: ['EEE102'], category: 'core', recommendedYear: 1, difficulty: 'intermediate' },
    { code: 'EEE211', title: 'Digital Logic Design', credits: 3, prerequisites: ['EEE201'], category: 'core', recommendedYear: 2, difficulty: 'intermediate' },
    { code: 'EEE301', title: 'Signals and Systems', credits: 3, prerequisites: ['EEE201'], category: 'core', recommendedYear: 2, difficulty: 'advanced' },
    { code: 'EEE302', title: 'Communication Systems', credits: 3, prerequisites: ['EEE301'], category: 'core', recommendedYear: 3, difficulty: 'advanced' },
    { code: 'EEE311', title: 'Power Systems', credits: 3, prerequisites: ['EEE101'], category: 'core', recommendedYear: 3, difficulty: 'advanced' },
    { code: 'EEE401', title: 'Control Systems', credits: 3, prerequisites: ['EEE301'], category: 'core', recommendedYear: 3, difficulty: 'advanced' },
    { code: 'EEE411', title: 'Embedded Systems', credits: 3, prerequisites: ['EEE211'], category: 'elective', recommendedYear: 4, difficulty: 'advanced' },
    { code: 'EEE412', title: 'Renewable Energy', credits: 3, prerequisites: ['EEE311'], category: 'elective', recommendedYear: 4, difficulty: 'advanced' },
    ...shared,
  ],
  bba: [
    { code: 'BBA101', title: 'Principles of Management', credits: 3, prerequisites: [], category: 'core', recommendedYear: 1, difficulty: 'foundation' },
    { code: 'BBA102', title: 'Principles of Marketing', credits: 3, prerequisites: [], category: 'core', recommendedYear: 1, difficulty: 'foundation' },
    { code: 'BBA103', title: 'Financial Accounting', credits: 3, prerequisites: [], category: 'core', recommendedYear: 1, difficulty: 'foundation' },
    { code: 'BBA201', title: 'Organizational Behavior', credits: 3, prerequisites: ['BBA101'], category: 'core', recommendedYear: 2, difficulty: 'intermediate' },
    { code: 'BBA202', title: 'Managerial Accounting', credits: 3, prerequisites: ['BBA103'], category: 'core', recommendedYear: 2, difficulty: 'intermediate' },
    { code: 'BBA203', title: 'Business Statistics', credits: 3, prerequisites: [], category: 'core', recommendedYear: 2, difficulty: 'intermediate' },
    { code: 'BBA301', title: 'Financial Management', credits: 3, prerequisites: ['BBA103'], category: 'core', recommendedYear: 3, difficulty: 'advanced' },
    { code: 'BBA302', title: 'Operations Management', credits: 3, prerequisites: ['BBA203'], category: 'core', recommendedYear: 3, difficulty: 'advanced' },
    { code: 'BBA311', title: 'Strategic Management', credits: 3, prerequisites: ['BBA201', 'BBA301'], category: 'core', recommendedYear: 3, difficulty: 'advanced' },
    { code: 'BBA401', title: 'Digital Marketing', credits: 3, prerequisites: ['BBA102'], category: 'elective', recommendedYear: 4, difficulty: 'intermediate' },
    { code: 'BBA402', title: 'Business Analytics', credits: 3, prerequisites: ['BBA203'], category: 'elective', recommendedYear: 4, difficulty: 'advanced' },
    ...shared,
  ],
  pharmacy: [
    { code: 'PHA101', title: 'Pharmacy Orientation', credits: 3, prerequisites: [], category: 'core', recommendedYear: 1, difficulty: 'foundation' },
    { code: 'PHA102', title: 'Pharmaceutical Chemistry I', credits: 3, prerequisites: [], category: 'core', recommendedYear: 1, difficulty: 'foundation' },
    { code: 'PHA201', title: 'Pharmaceutical Analysis I', credits: 3, prerequisites: ['PHA102'], category: 'core', recommendedYear: 2, difficulty: 'intermediate' },
    { code: 'PHA202', title: 'Pharmaceutical Analysis Laboratory', credits: 1, prerequisites: ['PHA102'], category: 'core', recommendedYear: 2, difficulty: 'intermediate' },
    { code: 'PHA211', title: 'Pharmacology I', credits: 3, prerequisites: [], category: 'core', recommendedYear: 2, difficulty: 'intermediate' },
    { code: 'PHA301', title: 'Pharmaceutics I', credits: 3, prerequisites: ['PHA201'], category: 'core', recommendedYear: 3, difficulty: 'advanced' },
    { code: 'PHA302', title: 'Pharmacology II', credits: 3, prerequisites: ['PHA211'], category: 'core', recommendedYear: 3, difficulty: 'advanced' },
    { code: 'PHA311', title: 'Clinical Pharmacy', credits: 3, prerequisites: ['PHA302'], category: 'core', recommendedYear: 3, difficulty: 'advanced' },
    { code: 'PHA401', title: 'Drug Regulatory Affairs', credits: 3, prerequisites: ['PHA301'], category: 'elective', recommendedYear: 4, difficulty: 'advanced' },
    ...shared,
  ],
  bge: [
    { code: 'BGE101', title: 'Cell Biology', credits: 3, prerequisites: [], category: 'core', recommendedYear: 1, difficulty: 'foundation' },
    { code: 'BGE102', title: 'General Biochemistry', credits: 3, prerequisites: [], category: 'core', recommendedYear: 1, difficulty: 'foundation' },
    { code: 'BGE201', title: 'Molecular Biology', credits: 3, prerequisites: ['BGE101'], category: 'core', recommendedYear: 2, difficulty: 'intermediate' },
    { code: 'BGE202', title: 'Biochemistry Laboratory', credits: 1, prerequisites: ['BGE102'], category: 'core', recommendedYear: 2, difficulty: 'intermediate' },
    { code: 'BGE211', title: 'Genetics', credits: 3, prerequisites: ['BGE201'], category: 'core', recommendedYear: 2, difficulty: 'advanced' },
    { code: 'BGE301', title: 'Microbiology', credits: 3, prerequisites: ['BGE101'], category: 'core', recommendedYear: 3, difficulty: 'advanced' },
    { code: 'BGE302', title: 'Genetic Engineering', credits: 3, prerequisites: ['BGE211'], category: 'core', recommendedYear: 3, difficulty: 'advanced' },
    { code: 'BGE401', title: 'Bioinformatics', credits: 3, prerequisites: ['BGE302'], category: 'elective', recommendedYear: 4, difficulty: 'advanced' },
    { code: 'BGE402', title: 'Immunology', credits: 3, prerequisites: ['BGE301'], category: 'elective', recommendedYear: 4, difficulty: 'advanced' },
    ...shared,
  ],
};

export const sampleProfiles: Record<string, StudentProfile> = {
  onTrack: {
    name: 'Rahim Ahmed', studentId: '011-211-001', department: 'cse', cgpa: 3.45, creditsCompleted: 72,
    trimester: 'Summer', year: 3, probation: false,
    completedCourses: ['CSE111', 'CSE112', 'CSE211', 'CSE212', 'CSE221', 'CSE222', 'CSE311', 'CSE312', 'ENG101', 'GED102', 'GED201'],
    failedCourses: [], droppedCourses: [],
  },
  probation: {
    name: 'Sara Khatun', studentId: '111-222-015', department: 'bba', cgpa: 1.85, creditsCompleted: 32,
    trimester: 'Summer', year: 2, probation: true,
    completedCourses: ['BBA101', 'BBA102', 'BBA103', 'ENG101', 'GED102'],
    failedCourses: ['BBA201', 'BBA202'], droppedCourses: ['BBA203'],
  },
  highPerformer: {
    name: 'Hasan Mahmud', studentId: '021-231-042', department: 'eee', cgpa: 3.72, creditsCompleted: 48,
    trimester: 'Summer', year: 3, probation: false,
    completedCourses: ['EEE101', 'EEE102', 'EEE201', 'EEE202', 'EEE211', 'EEE301', 'ENG101', 'GED102'],
    failedCourses: [], droppedCourses: [],
  },
};

export const getDepartment = (id: DepartmentId) => departments.find((department) => department.id === id)!;
