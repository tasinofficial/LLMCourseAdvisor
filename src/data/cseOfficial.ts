import type { Course } from '../types/advisor.js';

export const CSE_COURSE_PLAN_SOURCE = 'https://cse.uiu.ac.bd/ug-program/course-plan/';

export const cseCurriculumMeta = {
  label: 'BSCSE curriculum — course plan page (211 onwards)',
  degreeCredits: 137,
  sourceUrl: CSE_COURSE_PLAN_SOURCE,
  selectionRules: {
    'ged-choice': { label: 'General Education optional', requiredCourses: 2, requiredCredits: 6 },
    'program-option': { label: 'Programming optional', requiredCourses: 1, requiredCredits: 3 },
    'cse-elective': { label: 'CSE specialization elective', requiredCourses: 5, requiredCredits: 15 },
  },
  reconciliationNotes: [
    'The official page lists General Education as 14 credits and says to choose any two 3-credit optional courses; the trimester table shows three GED option placeholders. This catalog enforces the explicit any-two rule.',
    'The trimester table repeats CSE 2215 and CSE 2216 for Data Structures and Algorithms II; the official course list identifies those courses as CSE 2217 and CSE 2218. This catalog uses CSE 2217 and CSE 2218.',
    'The explicit prerequisite table is used where it provides a prerequisite, even when another table on the same page differs.',
  ],
} as const;

type RequirementGroup = Course['requirementGroup'];

function officialCourse(
  code: string,
  title: string,
  credits: number,
  category: Course['category'],
  recommendedTerm?: number,
  prerequisites: string[] = [],
  requirementGroup?: RequirementGroup,
  requirementLimit?: number,
  recommendedYearOverride?: number,
): Course {
  const recommendedYear = recommendedYearOverride ?? (recommendedTerm ? Math.ceil(recommendedTerm / 3) : 4);
  const difficulty: Course['difficulty'] = recommendedTerm && recommendedTerm <= 3
    ? 'foundation'
    : recommendedTerm && recommendedTerm <= 8
      ? 'intermediate'
      : 'advanced';

  return {
    code,
    title,
    credits,
    prerequisites,
    category,
    recommendedYear,
    recommendedTerm,
    difficulty,
    requirementGroup,
    requirementLimit,
  };
}

export const cseCourses: Course[] = [
  // A. Language — 6 credits
  officialCourse('ENG1011', 'Intensive English I', 3, 'ged', 1),
  officialCourse('ENG1013', 'Intensive English II', 3, 'ged', 2, ['ENG1011']),

  // B. General Education — compulsory 8 credits
  officialCourse('SOC2101', 'Society, Environment and Engineering Ethics', 3, 'ged', 5),
  officialCourse('PMG4101', 'Project Management', 3, 'ged', 9, ['CSE3411']),
  officialCourse('BDS1201', 'History of the Emergence of Bangladesh', 2, 'ged', 1),

  // B. General Education — choose any two, 6 credits
  officialCourse('ECO4101', 'Economics', 3, 'ged', 9, [], 'ged-choice', 2),
  officialCourse('SOC4101', 'Introduction to Sociology', 3, 'ged', 9, [], 'ged-choice', 2),
  officialCourse('ACT2111', 'Financial and Managerial Accounting', 3, 'ged', 9, [], 'ged-choice', 2),
  officialCourse('IPE3401', 'Industrial and Operational Management', 3, 'ged', 9, [], 'ged-choice', 2),
  officialCourse('TEC2499', 'Technology Entrepreneurship', 3, 'ged', 9, [], 'ged-choice', 2),
  officialCourse('PSY2101', 'Psychology', 3, 'ged', 9, [], 'ged-choice', 2),
  officialCourse('BDS2201', 'Bangladesh Studies', 3, 'ged', 9, [], 'ged-choice', 2),
  officialCourse('BAN2501', 'Bangla', 3, 'ged', 9, [], 'ged-choice', 2),

  // C. Basic Sciences — 7 credits
  officialCourse('PHY2105', 'Physics', 3, 'core', 3),
  officialCourse('PHY2106', 'Physics Laboratory', 1, 'core', 3),
  officialCourse('BIO3105', 'Biology for Engineers', 3, 'core', 7),

  // D. Mathematics — 12 credits
  officialCourse('MATH1151', 'Fundamental Calculus', 3, 'core', 1),
  officialCourse('MATH2183', 'Calculus and Linear Algebra', 3, 'core', 3, ['MATH1151']),
  officialCourse('MATH2201', 'Coordinate Geometry and Vector Analysis', 3, 'core', 4, ['MATH1151']),
  officialCourse('MATH2205', 'Probability and Statistics', 3, 'core', 5, ['MATH1151']),

  // E. Other Engineering — 10 credits
  officialCourse('EEE2113', 'Electrical Circuits', 3, 'core', 5),
  officialCourse('EEE2123', 'Electronics', 3, 'core', 6, ['EEE2113']),
  officialCourse('EEE2124', 'Electronics Laboratory', 1, 'core', 6),
  officialCourse('EEE4261', 'Green Computing', 3, 'core', 12),

  // F. Core — Programming compulsory, 10 credits
  officialCourse('CSE1110', 'Introduction to Computer Systems', 1, 'core', 1),
  officialCourse('CSE1111', 'Structured Programming Language', 3, 'core', 2, ['CSE1110']),
  officialCourse('CSE1112', 'Structured Programming Language Laboratory', 1, 'core', 2, ['CSE1110']),
  officialCourse('CSE1115', 'Object Oriented Programming', 3, 'core', 4, ['CSE2215']),
  officialCourse('CSE1116', 'Object Oriented Programming Laboratory', 1, 'core', 4, ['CSE2216']),
  officialCourse('CSE2118', 'Advanced Object Oriented Programming Lab', 1, 'core', 7, ['CSE1116']),

  // F. Core — Programming optional, choose one, 3 credits
  officialCourse('CSE4165', 'Web Programming', 3, 'elective', 6, ['CSE2118'], 'program-option', 1),
  officialCourse('CSE4181', 'Mobile Application Development', 3, 'elective', 6, ['CSE2118'], 'program-option', 1),

  // F. Core — Hardware, 11 credits
  officialCourse('CSE1325', 'Digital Logic Design', 3, 'core', 4),
  officialCourse('CSE1326', 'Digital Logic Design Laboratory', 1, 'core', 4),
  officialCourse('CSE3313', 'Computer Architecture', 3, 'core', 7, ['CSE1325']),
  officialCourse('CSE4325', 'Microprocessors and Microcontrollers', 3, 'core', 8, ['CSE3313']),
  officialCourse('CSE4326', 'Microprocessors and Microcontrollers Laboratory', 1, 'core', 8),

  // F. Core — Logics and Algorithms, 14 credits
  officialCourse('CSE2213', 'Discrete Mathematics', 3, 'core', 2),
  officialCourse('CSE2215', 'Data Structure and Algorithms I', 3, 'core', 3, ['CSE1111']),
  officialCourse('CSE2216', 'Data Structure and Algorithms I Laboratory', 1, 'core', 3, ['CSE1112']),
  officialCourse('CSE2217', 'Data Structure and Algorithms II', 3, 'core', 5, ['CSE2215']),
  officialCourse('CSE2218', 'Data Structure and Algorithms II Laboratory', 1, 'core', 5, ['CSE2216']),
  officialCourse('CSE2233', 'Theory of Computation', 3, 'core', 9),

  // F. Core — Software Engineering, 8 credits
  officialCourse('CSE3411', 'System Analysis and Design', 3, 'core', 7),
  officialCourse('CSE3412', 'System Analysis and Design Laboratory', 1, 'core', 7),
  officialCourse('CSE3421', 'Software Engineering', 3, 'core', 8, ['CSE3411']),
  officialCourse('CSE3422', 'Software Engineering Laboratory', 1, 'core', 8, ['CSE3412']),

  // F. Core — Systems, 19 credits
  officialCourse('CSE4531', 'Computer Security', 3, 'core', 11, ['CSE3711']),
  officialCourse('CSE3521', 'Database Management Systems', 3, 'core', 6),
  officialCourse('CSE3522', 'Database Management Systems Laboratory', 1, 'core', 6),
  officialCourse('CSE4509', 'Operating Systems', 3, 'core', 10),
  officialCourse('CSE4510', 'Operating Systems Laboratory', 1, 'core', 10),
  officialCourse('CSE3711', 'Computer Networks', 3, 'core', 9),
  officialCourse('CSE3712', 'Computer Networks Laboratory', 1, 'core', 9),
  officialCourse('CSE3811', 'Artificial Intelligence', 3, 'core', 8, ['MATH2205']),
  officialCourse('CSE3812', 'Artificial Intelligence Laboratory', 1, 'core', 8),

  // G. CSE elective catalog — choose any five, with at least three from one area
  officialCourse('CSE4601', 'Mathematical Analysis for Computer Science', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4633', 'Basic Graph Theory', 3, 'elective', undefined, ['CSE2217', 'CSE2213'], 'cse-elective', 5),
  officialCourse('CSE4655', 'Algorithm Engineering', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4611', 'Compiler Design', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4613', 'Computational Geometry', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4621', 'Computer Graphics', 3, 'elective', undefined, ['MATH2183', 'MATH2201'], 'cse-elective', 5),
  officialCourse('CSE3715', 'Data Communication', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4759', 'Wireless and Cellular Communication', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4793', 'Advanced Network Services and Management', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4783', 'Cryptography', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4777', 'Networks Security', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4763', 'Electronic Business', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4547', 'Multimedia Systems Design', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4519', 'Distributed Systems', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4523', 'Simulation and Modeling', 3, 'elective', undefined, ['MATH2205'], 'cse-elective', 5),
  officialCourse('CSE4521', 'Computer Graphics', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4587', 'Cloud Computing', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4567', 'Advanced Database Management Systems', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4889', 'Machine Learning', 3, 'elective', undefined, ['CSE3811'], 'cse-elective', 5),
  officialCourse('CSE4891', 'Data Mining', 3, 'elective', undefined, ['CSE3811'], 'cse-elective', 5),
  officialCourse('CSE4893', 'Introduction to Bioinformatics', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4883', 'Digital Image Processing', 3, 'elective', undefined, ['CSE4889'], 'cse-elective', 5),
  officialCourse('CSE4817', 'Big Data Analytics', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4451', 'Human Computer Interaction', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4435', 'Software Architecture', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4495', 'Software Testing and Quality Assurance', 3, 'elective', undefined, ['CSE3421'], 'cse-elective', 5),
  officialCourse('CSE4485', 'Game Design and Development', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4329', 'Digital System Design', 3, 'elective', undefined, ['CSE3313'], 'cse-elective', 5),
  officialCourse('CSE4379', 'Real-time Embedded Systems', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4327', 'VLSI Design', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4337', 'Robotics', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4397', 'Interfacing', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4941', 'Enterprise Systems: Concepts and Practice', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4943', 'Web Application Security', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4463', 'Electronic Business', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4945', 'UI: Concepts and Design', 3, 'elective', undefined, [], 'cse-elective', 5),
  officialCourse('CSE4949', 'IT Audit: Concepts and Practice', 3, 'elective', undefined, [], 'cse-elective', 5),

  // H. University required — 2 credits
  officialCourse('URC1103', 'Life Skills for Success', 2, 'ged', 1),

  // I. Final Year Design Project — 6 credits
  officialCourse('CSE4000A', 'Final Year Design Project – I', 2, 'core', 10),
  officialCourse('CSE4000B', 'Final Year Design Project – II', 2, 'core', 11, ['CSE4000A']),
  officialCourse('CSE4000C', 'Final Year Design Project – III', 2, 'core', 12, ['CSE4000A', 'CSE4000B']),
];
