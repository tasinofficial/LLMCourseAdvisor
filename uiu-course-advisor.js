// UIU Course Recommendation Engine - Dataset & Logic
const UIU_DATA = {
  departments: [
    { id: "cse", name: "Computer Science and Engineering", school: "School of Science and Engineering" },
    { id: "eee", name: "Electrical and Electronics Engineering", school: "School of Science and Engineering" },
    { id: "ce", name: "Civil Engineering", school: "School of Science and Engineering" },
    { id: "bba", name: "Business Administration", school: "School of Business and Economics" },
    { id: "econ", name: "Economics", school: "School of Business and Economics" },
    { id: "english", name: "English", school: "School of Humanities and Social Sciences" },
    { id: "msj", name: "Media Studies and Journalism", school: "School of Humanities and Social Sciences" },
    { id: "env", name: "Environment and Development Studies", school: "School of Humanities and Social Sciences" },
    { id: "pharmacy", name: "Pharmacy", school: "School of Life Sciences" },
    { id: "bge", name: "Biotechnology and Genetic Engineering", school: "School of Life Sciences" }
  ],

  courses: {
    cse: [
      { code: "CSE1111", title: "Introduction to Computer Science", credits: 3, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "CSE1112", title: "Programming Language I", credits: 3, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "CSE1113", title: "Programming Language I Lab", credits: 1, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "CSE1211", title: "Data Structures", credits: 3, prerequisites: ["CSE1112"], category: "core", year: 1, trimester: "any" },
      { code: "CSE1212", title: "Data Structures Lab", credits: 1, prerequisites: ["CSE1113"], category: "core", year: 1, trimester: "any" },
      { code: "CSE2111", title: "Object Oriented Programming", credits: 3, prerequisites: ["CSE1211"], category: "core", year: 2, trimester: "any" },
      { code: "CSE2112", title: "OOP Lab", credits: 1, prerequisites: ["CSE1212"], category: "core", year: 2, trimester: "any" },
      { code: "CSE2113", title: "Discrete Mathematics", credits: 3, prerequisites: [], category: "core", year: 2, trimester: "any" },
      { code: "CSE2114", title: "Algorithms", credits: 3, prerequisites: ["CSE1211"], category: "core", year: 2, trimester: "any" },
      { code: "CSE2211", title: "Database Management Systems", credits: 3, prerequisites: ["CSE1211"], category: "core", year: 2, trimester: "any" },
      { code: "CSE2212", title: "DBMS Lab", credits: 1, prerequisites: ["CSE1212"], category: "core", year: 2, trimester: "any" },
      { code: "CSE2213", title: "Computer Organization and Architecture", credits: 3, prerequisites: ["CSE2111"], category: "core", year: 2, trimester: "any" },
      { code: "CSE3111", title: "Operating Systems", credits: 3, prerequisites: ["CSE2213"], category: "core", year: 3, trimester: "any" },
      { code: "CSE3112", title: "OS Lab", credits: 1, prerequisites: ["CSE2212"], category: "core", year: 3, trimester: "any" },
      { code: "CSE3113", title: "Computer Networks", credits: 3, prerequisites: ["CSE2114"], category: "core", year: 3, trimester: "any" },
      { code: "CSE3114", title: "Software Engineering", credits: 3, prerequisites: ["CSE2111"], category: "core", year: 3, trimester: "any" },
      { code: "CSE3211", title: "Compiler Design", credits: 3, prerequisites: ["CSE3111"], category: "core", year: 3, trimester: "any" },
      { code: "CSE3212", title: "Artificial Intelligence", credits: 3, prerequisites: ["CSE2114"], category: "elective", year: 3, trimester: "any" },
      { code: "CSE3213", title: "Machine Learning", credits: 3, prerequisites: ["CSE2114"], category: "elective", year: 3, trimester: "any" },
      { code: "CSE4111", title: "Capstone Project", credits: 3, prerequisites: ["CSE3114"], category: "core", year: 4, trimester: "any" },
      { code: "CSE4112", title: "Cybersecurity", credits: 3, prerequisites: ["CSE3113"], category: "elective", year: 4, trimester: "any" },
      { code: "CSE4113", title: "Cloud Computing", credits: 3, prerequisites: ["CSE3111"], category: "elective", year: 4, trimester: "any" },
      { code: "MATH1111", title: "Calculus I", credits: 3, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "MATH1211", title: "Calculus II", credits: 3, prerequisites: ["MATH1111"], category: "core", year: 1, trimester: "any" },
      { code: "MATH2111", title: "Linear Algebra", credits: 3, prerequisites: ["MATH1211"], category: "core", year: 2, trimester: "any" },
      { code: "STAT1111", title: "Statistics for Engineers", credits: 3, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "GED1111", title: "English Composition", credits: 3, prerequisites: [], category: "ged", year: 1, trimester: "any" },
      { code: "GED1112", title: "Bangladesh Studies", credits: 3, prerequisites: [], category: "ged", year: 1, trimester: "any" },
      { code: "GED2111", title: "World Civilization", credits: 3, prerequisites: [], category: "ged", year: 2, trimester: "any" },
      { code: "GED2112", title: "Professional Ethics", credits: 3, prerequisites: [], category: "ged", year: 2, trimester: "any" }
    ],
    bba: [
      { code: "BBA1111", title: "Principles of Management", credits: 3, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "BBA1112", title: "Principles of Marketing", credits: 3, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "BBA1113", title: "Business Communication", credits: 3, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "BBA1211", title: "Financial Accounting", credits: 3, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "BBA1212", title: "Business Statistics", credits: 3, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "BBA1213", title: "Microeconomics", credits: 3, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "BBA2111", title: "Organizational Behavior", credits: 3, prerequisites: ["BBA1111"], category: "core", year: 2, trimester: "any" },
      { code: "BBA2112", title: "Managerial Accounting", credits: 3, prerequisites: ["BBA1211"], category: "core", year: 2, trimester: "any" },
      { code: "BBA2113", title: "Macroeconomics", credits: 3, prerequisites: ["BBA1213"], category: "core", year: 2, trimester: "any" },
      { code: "BBA2211", title: "Financial Management", credits: 3, prerequisites: ["BBA1211"], category: "core", year: 2, trimester: "any" },
      { code: "BBA2212", title: "Human Resource Management", credits: 3, prerequisites: ["BBA2111"], category: "core", year: 2, trimester: "any" },
      { code: "BBA2213", title: "Operations Management", credits: 3, prerequisites: ["BBA1212"], category: "core", year: 2, trimester: "any" },
      { code: "BBA3111", title: "Strategic Management", credits: 3, prerequisites: ["BBA2111", "BBA2211"], category: "core", year: 3, trimester: "any" },
      { code: "BBA3112", title: "Consumer Behavior", credits: 3, prerequisites: ["BBA1112"], category: "core", year: 3, trimester: "any" },
      { code: "BBA3113", title: "Business Law", credits: 3, prerequisites: [], category: "core", year: 3, trimester: "any" },
      { code: "BBA3211", title: "Entrepreneurship", credits: 3, prerequisites: ["BBA3111"], category: "elective", year: 3, trimester: "any" },
      { code: "BBA3212", title: "International Business", credits: 3, prerequisites: ["BBA2113"], category: "elective", year: 3, trimester: "any" },
      { code: "BBA3213", title: "Digital Marketing", credits: 3, prerequisites: ["BBA1112"], category: "elective", year: 3, trimester: "any" },
      { code: "BBA4111", title: "Capstone Project", credits: 3, prerequisites: ["BBA3111"], category: "core", year: 4, trimester: "any" },
      { code: "BBA4112", title: "Business Analytics", credits: 3, prerequisites: ["BBA1212"], category: "elective", year: 4, trimester: "any" },
      { code: "MATH1111", title: "Calculus I", credits: 3, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "GED1111", title: "English Composition", credits: 3, prerequisites: [], category: "ged", year: 1, trimester: "any" },
      { code: "GED1112", title: "Bangladesh Studies", credits: 3, prerequisites: [], category: "ged", year: 1, trimester: "any" },
      { code: "GED2111", title: "World Civilization", credits: 3, prerequisites: [], category: "ged", year: 2, trimester: "any" },
      { code: "GED2112", title: "Professional Ethics", credits: 3, prerequisites: [], category: "ged", year: 2, trimester: "any" }
    ],
    eee: [
      { code: "EEE1111", title: "Electrical Circuits I", credits: 3, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "EEE1112", title: "Electrical Circuits Lab", credits: 1, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "EEE1113", title: "Electronics I", credits: 3, prerequisites: ["EEE1111"], category: "core", year: 1, trimester: "any" },
      { code: "EEE1211", title: "Electronics II", credits: 3, prerequisites: ["EEE1113"], category: "core", year: 1, trimester: "any" },
      { code: "EEE1212", title: "Electronics Lab", credits: 1, prerequisites: ["EEE1112"], category: "core", year: 1, trimester: "any" },
      { code: "EEE2111", title: "Digital Logic Design", credits: 3, prerequisites: ["EEE1211"], category: "core", year: 2, trimester: "any" },
      { code: "EEE2112", title: "Digital Logic Lab", credits: 1, prerequisites: ["EEE1212"], category: "core", year: 2, trimester: "any" },
      { code: "EEE2113", title: "Signals and Systems", credits: 3, prerequisites: ["MATH1211"], category: "core", year: 2, trimester: "any" },
      { code: "EEE2211", title: "Electromagnetic Fields", credits: 3, prerequisites: ["MATH2111"], category: "core", year: 2, trimester: "any" },
      { code: "EEE2212", title: "Communication Systems", credits: 3, prerequisites: ["EEE2113"], category: "core", year: 2, trimester: "any" },
      { code: "EEE3111", title: "Power Systems", credits: 3, prerequisites: ["EEE1111"], category: "core", year: 3, trimester: "any" },
      { code: "EEE3112", title: "Control Systems", credits: 3, prerequisites: ["EEE2113"], category: "core", year: 3, trimester: "any" },
      { code: "EEE3113", title: "VLSI Design", credits: 3, prerequisites: ["EEE2111"], category: "elective", year: 3, trimester: "any" },
      { code: "EEE3211", title: "Embedded Systems", credits: 3, prerequisites: ["EEE2111"], category: "elective", year: 3, trimester: "any" },
      { code: "EEE3212", title: "Renewable Energy", credits: 3, prerequisites: ["EEE3111"], category: "elective", year: 3, trimester: "any" },
      { code: "EEE4111", title: "Capstone Project", credits: 3, prerequisites: ["EEE3111"], category: "core", year: 4, trimester: "any" },
      { code: "MATH1111", title: "Calculus I", credits: 3, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "MATH1211", title: "Calculus II", credits: 3, prerequisites: ["MATH1111"], category: "core", year: 1, trimester: "any" },
      { code: "MATH2111", title: "Linear Algebra", credits: 3, prerequisites: ["MATH1211"], category: "core", year: 2, trimester: "any" },
      { code: "STAT1111", title: "Statistics for Engineers", credits: 3, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "GED1111", title: "English Composition", credits: 3, prerequisites: [], category: "ged", year: 1, trimester: "any" },
      { code: "GED1112", title: "Bangladesh Studies", credits: 3, prerequisites: [], category: "ged", year: 1, trimester: "any" },
      { code: "GED2111", title: "World Civilization", credits: 3, prerequisites: [], category: "ged", year: 2, trimester: "any" },
      { code: "GED2112", title: "Professional Ethics", credits: 3, prerequisites: [], category: "ged", year: 2, trimester: "any" }
    ],
    pharmacy: [
      { code: "PHARM1111", title: "Pharmaceutical Chemistry I", credits: 3, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "PHARM1112", title: "Pharmacy Orientation", credits: 3, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "PHARM1211", title: "Pharmaceutical Analysis I", credits: 3, prerequisites: ["PHARM1111"], category: "core", year: 1, trimester: "any" },
      { code: "PHARM1212", title: "Pharmaceutical Analysis Lab", credits: 1, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "PHARM2111", title: "Pharmacology I", credits: 3, prerequisites: [], category: "core", year: 2, trimester: "any" },
      { code: "PHARM2112", title: "Pharmacognosy I", credits: 3, prerequisites: [], category: "core", year: 2, trimester: "any" },
      { code: "PHARM2211", title: "Pharmaceutics I", credits: 3, prerequisites: ["PHARM1211"], category: "core", year: 2, trimester: "any" },
      { code: "PHARM2212", title: "Pharmaceutics Lab", credits: 1, prerequisites: ["PHARM1212"], category: "core", year: 2, trimester: "any" },
      { code: "PHARM3111", title: "Pharmaceutical Chemistry II", credits: 3, prerequisites: ["PHARM1111"], category: "core", year: 3, trimester: "any" },
      { code: "PHARM3112", title: "Pharmacology II", credits: 3, prerequisites: ["PHARM2111"], category: "core", year: 3, trimester: "any" },
      { code: "PHARM3211", title: "Clinical Pharmacy", credits: 3, prerequisites: ["PHARM3112"], category: "core", year: 3, trimester: "any" },
      { code: "PHARM3212", title: "Drug Regulatory Affairs", credits: 3, prerequisites: ["PHARM2211"], category: "elective", year: 3, trimester: "any" },
      { code: "PHARM4111", title: "Capstone Project", credits: 3, prerequisites: ["PHARM3211"], category: "core", year: 4, trimester: "any" },
      { code: "MATH1111", title: "Calculus I", credits: 3, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "CHEM1111", title: "General Chemistry", credits: 3, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "BIO1111", title: "General Biology", credits: 3, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "GED1111", title: "English Composition", credits: 3, prerequisites: [], category: "ged", year: 1, trimester: "any" },
      { code: "GED1112", title: "Bangladesh Studies", credits: 3, prerequisites: [], category: "ged", year: 1, trimester: "any" }
    ],
    bge: [
      { code: "BGE1111", title: "Cell Biology", credits: 3, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "BGE1112", title: "General Biochemistry", credits: 3, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "BGE1211", title: "Molecular Biology", credits: 3, prerequisites: ["BGE1111"], category: "core", year: 1, trimester: "any" },
      { code: "BGE1212", title: "Biochemistry Lab", credits: 1, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "BGE2111", title: "Genetics", credits: 3, prerequisites: ["BGE1211"], category: "core", year: 2, trimester: "any" },
      { code: "BGE2112", title: "Microbiology", credits: 3, prerequisites: ["BGE1111"], category: "core", year: 2, trimester: "any" },
      { code: "BGE2211", title: "Genetic Engineering", credits: 3, prerequisites: ["BGE2111"], category: "core", year: 2, trimester: "any" },
      { code: "BGE2212", title: "Genetic Engineering Lab", credits: 1, prerequisites: ["BGE1212"], category: "core", year: 2, trimester: "any" },
      { code: "BGE3111", title: "Bioinformatics", credits: 3, prerequisites: ["BGE2211"], category: "elective", year: 3, trimester: "any" },
      { code: "BGE3112", title: "Immunology", credits: 3, prerequisites: ["BGE2112"], category: "core", year: 3, trimester: "any" },
      { code: "BGE3211", title: "Cancer Biology", credits: 3, prerequisites: ["BGE2111"], category: "elective", year: 3, trimester: "any" },
      { code: "BGE4111", title: "Capstone Project", credits: 3, prerequisites: ["BGE3112"], category: "core", year: 4, trimester: "any" },
      { code: "MATH1111", title: "Calculus I", credits: 3, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "CHEM1111", title: "General Chemistry", credits: 3, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "BIO1111", title: "General Biology", credits: 3, prerequisites: [], category: "core", year: 1, trimester: "any" },
      { code: "GED1111", title: "English Composition", credits: 3, prerequisites: [], category: "ged", year: 1, trimester: "any" },
      { code: "GED1112", title: "Bangladesh Studies", credits: 3, prerequisites: [], category: "ged", year: 1, trimester: "any" }
    ]
  },

  // Sample students for testing
  sampleStudents: {
    student1: {
      id: "UIU-2021-001",
      name: "Rahim Ahmed",
      department: "cse",
      cgpa: 3.45,
      probation: false,
      creditsCompleted: 78,
      currentTrimester: "Summer 2026",
      trimesterCount: 7,
      completedCourses: ["CSE1111", "CSE1112", "CSE1113", "CSE1211", "CSE1212", "CSE2111", "CSE2112", "CSE2113", "CSE2114", "CSE2211", "CSE2212", "CSE2213", "MATH1111", "MATH1211", "MATH2111", "STAT1111", "GED1111", "GED1112", "GED2111"],
      failedCourses: [],
      droppedCourses: []
    },
    student2: {
      id: "UIU-2022-015",
      name: "Sara Khatun",
      department: "bba",
      cgpa: 1.85,
      probation: true,
      creditsCompleted: 32,
      currentTrimester: "Summer 2026",
      trimesterCount: 4,
      completedCourses: ["BBA1111", "BBA1112", "BBA1113", "BBA1211", "BBA1212", "BBA1213", "GED1111", "GED1112"],
      failedCourses: ["BBA2111", "BBA2112"],
      droppedCourses: ["BBA2113"]
    },
    student3: {
      id: "UIU-2023-042",
      name: "Hasan Mahmud",
      department: "eee",
      cgpa: 3.72,
      probation: false,
      creditsCompleted: 45,
      currentTrimester: "Summer 2026",
      trimesterCount: 5,
      completedCourses: ["EEE1111", "EEE1112", "EEE1113", "EEE1211", "EEE1212", "EEE2111", "EEE2112", "MATH1111", "MATH1211", "MATH2111", "STAT1111", "GED1111", "GED1112"],
      failedCourses: [],
      droppedCourses: []
    },
    student4: {
      id: "UIU-2022-089",
      name: "Tasnim Rahman",
      department: "pharmacy",
      cgpa: 2.15,
      probation: true,
      creditsCompleted: 28,
      currentTrimester: "Summer 2026",
      trimesterCount: 4,
      completedCourses: ["PHARM1111", "PHARM1112", "PHARM1211", "PHARM1212", "CHEM1111", "BIO1111", "GED1111"],
      failedCourses: ["PHARM2111"],
      droppedCourses: []
    }
  }
};

// Recommendation Engine Logic
function getDepartmentCourses(departmentId) {
  return UIU_DATA.courses[departmentId] || [];
}

function getCreditLimit(cgpa, probation) {
  if (probation) return { min: 6, max: 9 };
  if (cgpa > 3.50) return { min: 9, max: 19 };
  return { min: 9, max: 16 };
}

function canTakeCourse(course, completedCourses, failedCourses) {
  const allAttempted = [...completedCourses, ...failedCourses];

  // Check prerequisites - all must be completed (passed)
  if (course.prerequisites && course.prerequisites.length > 0) {
    for (const prereq of course.prerequisites) {
      if (!completedCourses.includes(prereq)) {
        return { allowed: false, reason: `Prerequisite not completed: ${prereq}` };
      }
    }
  }

  // Already completed
  if (completedCourses.includes(course.code)) {
    return { allowed: false, reason: "Already completed" };
  }

  return { allowed: true };
}

function generateRecommendations(student) {
  const courses = getDepartmentCourses(student.department);
  const creditLimit = getCreditLimit(student.cgpa, student.probation);
  const recommendations = [];
  const retakeRecommendations = [];
  const newCourseRecommendations = [];

  // GED courses: must be taken when offered
  const gedNeeded = [];
  const allGedCourses = courses.filter(c => c.category === "ged");
  for (const ged of allGedCourses) {
    if (!student.completedCourses.includes(ged.code)) {
      gedNeeded.push(ged);
    }
  }

  // Retake failed courses
  for (const failed of student.failedCourses) {
    const course = courses.find(c => c.code === failed);
    if (course) {
      retakeRecommendations.push({
        course: course,
        reason: "MUST RETAKE: Failed in previous trimester",
        priority: "high"
      });
    }
  }

  // Retake dropped courses
  for (const dropped of student.droppedCourses) {
    const course = courses.find(c => c.code === dropped);
    if (course) {
      retakeRecommendations.push({
        course: course,
        reason: "MUST RETAKE: Dropped in previous trimester",
        priority: "high"
      });
    }
  }

  // New courses (skip GED courses since they are handled separately above)
  for (const course of courses) {
    // Skip already completed
    if (student.completedCourses.includes(course.code)) continue;

    // Skip failed/dropped (already handled above)
    if (student.failedCourses.includes(course.code)) continue;
    if (student.droppedCourses.includes(course.code)) continue;

    // Skip GED courses (handled separately)
    if (course.category === "ged") continue;

    const check = canTakeCourse(course, student.completedCourses, student.failedCourses);
    if (check.allowed) {
      newCourseRecommendations.push({
        course: course,
        reason: "Available based on prerequisites and progress",
        priority: "normal"
      });
    }
  }

  // Sort by priority: GED first, then core, then by year
  newCourseRecommendations.sort((a, b) => {
    if (a.course.category !== b.course.category) {
      if (a.course.category === "ged") return -1;
      if (b.course.category === "ged") return 1;
      if (a.course.category === "core") return -1;
      if (b.course.category === "core") return 1;
    }
    return a.course.year - b.course.year;
  });

  // Build final recommendation set respecting credit limits
  let totalCredits = 0;
  const selected = [];
  const selectedCodes = new Set(); // Track deduplication

  // First, add retakes (must take)
  for (const rec of retakeRecommendations) {
    if (!selectedCodes.has(rec.course.code) && totalCredits + rec.course.credits <= creditLimit.max) {
      selected.push(rec);
      selectedCodes.add(rec.course.code);
      totalCredits += rec.course.credits;
    }
  }

  // For probation students, add old courses to maintain 2:1 ratio
  if (student.probation) {
    const oldCount = retakeRecommendations.length;
    let newCount = 0;

    // Add GED courses first (they are required)
    for (const ged of gedNeeded) {
      if (!selectedCodes.has(ged.code) && totalCredits + ged.credits <= creditLimit.max) {
        selected.push({ course: ged, reason: "MUST TAKE: GED course required", priority: "high" });
        selectedCodes.add(ged.code);
        totalCredits += ged.credits;
        newCount++; // GED counts as new course
      }
    }

    // Add new courses with 2:1 ratio constraint
    for (const rec of newCourseRecommendations) {
      if (selectedCodes.has(rec.course.code)) continue;
      if (totalCredits + rec.course.credits > creditLimit.max) break;
      // Check 2:1 ratio (new courses count vs old/retake courses)
      if (newCount + 1 <= oldCount * 2) {
        selected.push(rec);
        selectedCodes.add(rec.course.code);
        totalCredits += rec.course.credits;
        newCount++;
      }
    }
  } else {
    // Normal students
    // Add GED courses first
    for (const ged of gedNeeded) {
      if (!selectedCodes.has(ged.code) && totalCredits + ged.credits <= creditLimit.max) {
        selected.push({ course: ged, reason: "MUST TAKE: GED course required", priority: "high" });
        selectedCodes.add(ged.code);
        totalCredits += ged.credits;
      }
    }

    // Add remaining new courses by priority (skip duplicates and GEDs already added)
    for (const rec of newCourseRecommendations) {
      if (selectedCodes.has(rec.course.code)) continue;
      if (totalCredits + rec.course.credits > creditLimit.max) break;
      selected.push(rec);
      selectedCodes.add(rec.course.code);
      totalCredits += rec.course.credits;
    }
  }

  return {
    student: student,
    creditLimit: creditLimit,
    totalCredits: totalCredits,
    recommendations: selected,
    allAvailable: newCourseRecommendations,
    retakes: retakeRecommendations,
    gedNeeded: gedNeeded
  };
}

function generateLLMResponse(recommendationResult) {
  const { student, creditLimit, totalCredits, recommendations } = recommendationResult;

  let response = `Hello ${student.name}! I'm your UIU Course Advisor.\n\n`;

  // Status check
  if (student.probation) {
    response += `**Important:** You are currently on academic probation (CGPA: ${student.cgpa}). `;
    response += `You must take 6-9 credits with a 2:1 ratio of old-to-new courses. `;
    response += `Focus on completing your failed/dropped courses first.\n\n`;
  } else {
    response += `Your academic status is good (CGPA: ${student.cgpa}). `;
    if (student.cgpa > 3.50) {
      response += `You can take up to 19 credits this trimester.\n\n`;
    } else {
      response += `You can take up to 16 credits this trimester.\n\n`;
    }
  }

  // Summary
  response += `**Recommended Plan (${totalCredits} credits):**\n\n`;

  let category = "";
  for (const rec of recommendations) {
    if (rec.priority === "high" && rec.reason.includes("RETAKE")) {
      if (category !== "retake") {
        response += `**Retake Required:**\n`;
        category = "retake";
      }
      response += `- ${rec.course.code}: ${rec.course.title} (${rec.course.credits} cr) - ${rec.reason}\n`;
    } else if (rec.course.category === "ged") {
      if (category !== "ged") {
        response += `\n**GED Courses:**\n`;
        category = "ged";
      }
      response += `- ${rec.course.code}: ${rec.course.title} (${rec.course.credits} cr) - ${rec.reason}\n`;
    } else {
      if (category !== "new") {
        response += `\n**New Courses:**\n`;
        category = "new";
      }
      response += `- ${rec.course.code}: ${rec.course.title} (${rec.course.credits} cr) - ${rec.reason}\n`;
    }
  }

  // Additional advice
  response += `\n**Advisor Notes:**\n`;
  if (student.cgpa < 2.50 && !student.probation) {
    response += `- Consider taking fewer courses to focus on improving your CGPA.\n`;
  }
  if (student.cgpa > 3.50) {
    response += `- With your high CGPA, you can challenge yourself with more credits.\n`;
  }
  if (student.trimesterCount <= 2) {
    response += `- First year: focus on completing your 30 foundation credits.\n`;
  }

  return response;
}

// Export for use in web app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UIU_DATA, generateRecommendations, generateLLMResponse, getCreditLimit, canTakeCourse };
}
