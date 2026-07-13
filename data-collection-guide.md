# UIU Course Recommendation Engine: Data Collection Guide

## Overview

To power the LLM-based course recommendation system for United International University (UIU), you need to gather structured data from the following categories. This guide outlines what data to collect, recommended sources, and formats.

---

## 1. Student Data

### Required Fields

| Field | Description | Data Type | Example |
|-------|-------------|-----------|---------|
| student_id | Unique student identifier | string | UIU-2021-001 |
| name | Full name | string | Rahim Ahmed |
| department_id | Department code | string | cse, bba, eee, etc. |
| cgpa | Cumulative GPA | float (0.00-4.00) | 3.45 |
| probation | Academic probation status | boolean | true/false |
| credits_completed | Total credits earned | integer | 78 |
| current_trimester | Active trimester name | string | Summer 2026 |
| trimester_count | Number of trimesters completed | integer | 7 |

### Academic History

| Field | Description | Data Type | Example |
|-------|-------------|-----------|---------|
| completed_courses | Array of passed course codes | array[string] | ["CSE1111", "CSE1112"] |
| failed_courses | Array of failed course codes | array[string] | ["BBA2111"] |
| dropped_courses | Array of dropped course codes | array[string] | ["BBA2113"] |
| in_progress_courses | Currently enrolled courses | array[string] | ["CSE3111"] |
| grades_per_course | Mapping of course to grade | object | {"CSE1111": "A", "CSE1112": "B+"} |

### Data Sources
- **UIU Student Portal / ERP**: Extract student records, transcripts, and registration history
- **Department Office**: Probation status, advisor notes, special permissions
- **Registrar's Office**: Official credit counts, trimester enrollment records

### Recommended Format: JSON
```json
{
  "student_id": "UIU-2021-001",
  "name": "Rahim Ahmed",
  "department_id": "cse",
  "cgpa": 3.45,
  "probation": false,
  "credits_completed": 78,
  "current_trimester": "Summer 2026",
  "trimester_count": 7,
  "completed_courses": ["CSE1111", "CSE1112", ...],
  "failed_courses": [],
  "dropped_courses": [],
  "in_progress_courses": [],
  "grades_per_course": {
    "CSE1111": "A",
    "CSE1112": "B+"
  }
}
```

---

## 2. Course Catalog Data

### Required Fields

| Field | Description | Data Type | Example |
|-------|-------------|-----------|---------|
| course_code | Unique course identifier | string | CSE1111 |
| title | Course name | string | Introduction to Computer Science |
| credits | Credit hours | integer | 3 |
| department_id | Offering department | string | cse |
| prerequisites | Required prior courses | array[string] | ["CSE1112"] |
| category | Course type | string | core / elective / ged |
| year | Recommended year | integer | 1 |
| trimester | When offered | string | any / spring / summer / fall |
| description | Brief course description | string | Fundamentals of computing... |

### Data Sources
- **Department Curriculum Committee**: Official course lists, prerequisite chains
- **UIU Academic Catalog**: Published course descriptions and requirements
- **Course Offering Schedules**: Per-trimester availability (varies by demand)

### Recommended Format: JSON
```json
{
  "courses": [
    {
      "course_code": "CSE1111",
      "title": "Introduction to Computer Science",
      "credits": 3,
      "department_id": "cse",
      "prerequisites": [],
      "category": "core",
      "year": 1,
      "trimester": "any",
      "description": "Fundamentals of computing and problem solving."
    }
  ]
}
```

---

## 3. Academic Rules & Constraints

### Required Rules for the Engine

| Rule | Description | Source |
|------|-------------|--------|
| Credit Limits | Max 16 (CGPA <= 3.50), Max 19 (CGPA > 3.50) | UIU Academic Policy |
| Probation Load | 6-9 credits, 2:1 old:new ratio | UIU Probation Policy |
| Min Credits | 9 for undergrad, 6 for grad | UIU Academic Policy |
| Degree CGPA | Minimum 2.00 | UIU Grading Policy |
| First Year | Must complete 30 offered credits | BGE Advising Guidelines |
| GED Requirement | Must take each trimester when offered | BGE Advising Guidelines |
| Retake Priority | Failed/dropped courses must be taken first | BGE Advising Guidelines |
| Prerequisite Enforcement | Must pass prerequisites before enrolling | UIU Academic Policy |
| Attendance | 80% required to sit for final exam | UIU Academic Policy |

### Data Sources
- UIU Academic Information Policies page
- Department-specific advising guidelines (varies by department)
- UIU Probation Policy (updated Spring 2025)
- Grading and Performance Evaluation Policy

---

## 4. Department-Specific Data

### Department List (Confirmed)

| ID | Department | School |
|----|------------|--------|
| cse | Computer Science and Engineering | School of Science and Engineering |
| eee | Electrical and Electronics Engineering | School of Science and Engineering |
| ce | Civil Engineering | School of Science and Engineering |
| bba | Business Administration | School of Business and Economics |
| econ | Economics | School of Business and Economics |
| english | English | School of Humanities and Social Sciences |
| msj | Media Studies and Journalism | School of Humanities and Social Sciences |
| env | Environment and Development Studies | School of Humanities and Social Sciences |
| pharmacy | Pharmacy | School of Life Sciences |
| bge | Biotechnology and Genetic Engineering | School of Life Sciences |

---

## 5. Integration Strategy

### Option A: Direct Database Integration
Connect to UIU's existing student information system (ERP) to pull live data.
- **Pros**: Real-time, always accurate
- **Cons**: Requires IT department approval, API access, security compliance

### Option B: CSV/Excel Upload
Export data from the student portal into structured files, upload to the system.
- **Pros**: Simple, no direct DB access needed
- **Cons**: Manual, requires periodic updates

### Option C: Student Self-Input
Students manually enter their completed courses and current status.
- **Pros**: No backend integration needed, immediate deployment
- **Cons**: Relies on student accuracy, no verification

### Recommended: Hybrid Approach
Start with **Option C** for immediate deployment, then gradually add **Option B** for bulk data imports, and eventually **Option A** for full integration.

---

## 6. Data Collection Checklist

- [ ] Extract student records from ERP/portal
- [ ] Compile official course catalogs per department
- [ ] Map prerequisite chains for each program
- [ ] Document credit limits and probation rules
- [ ] Collect department-specific advising guidelines
- [ ] Verify GED course requirements
- [ ] Test data with sample students from each department
- [ ] Validate prerequisite logic with academic advisors
- [ ] Establish data update frequency (per trimester)
- [ ] Create backup/rollback plan for data updates

---

## 7. Sample Data Files

The recommendation engine includes sample data for 5 departments with realistic course structures. Use these as templates when collecting actual UIU data.

| Department | Courses | Sample Students |
|------------|---------|----------------|
| CSE | 30 | Rahim Ahmed (3.45 CGPA) |
| BBA | 25 | Sara Khatun (probation) |
| EEE | 24 | Hasan Mahmud (3.72 CGPA) |
| Pharmacy | 17 | Tasnim Rahman (probation) |
| BGE | 17 | - |

---

*Last updated: July 2026*
*For questions, contact the UIU Academic Advising Office or the system development team.*
