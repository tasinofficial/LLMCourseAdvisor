# UIU production data checklist

The repository ships with representative sample data only. A production advisor should source and verify the following data before use.

## Student record contract

Required fields:

- Pseudonymous internal student identifier
- Program and curriculum version or intake/batch
- Current CGPA and trimester GPA
- Credits attempted, earned, transferred, and remaining
- Probation status and probation-notice count
- Course attempts with result state: completed, failed, withdrawn, dropped, incomplete, retake
- Approved waivers, substitutions, and prerequisite overrides
- Current registration and in-progress courses

Do not send the student ID, full transcript, or advisor notes to the LLM. The deterministic engine should process records inside the trusted application boundary and send only the minimum plan facts needed for explanation.

## Curriculum contract

For each curriculum version and department, collect:

- Canonical course code, title, and credits
- Course category and requirement group
- All prerequisite and co-requisite expressions
- Minimum prerequisite grade where applicable
- Repeat and replacement rules
- Recommended sequence and term availability
- Program-level credit and residency requirements
- Capstone, internship, lab, and thesis gates
- Equivalent and cross-listed courses

## Trimester offering contract

A recommendation is not registrable unless it appears in the official offering list. Each section should include:

- Trimester and academic year
- Course and section
- Capacity and remaining seats
- Meeting times and exam slot
- Campus or delivery mode
- Instructor when published
- Department restrictions and reserved seats

## Academic-policy contract

Maintain policy rules as versioned data rather than prompt text:

- Minimum and maximum credit loads
- CGPA-based overload rules
- Probation credit limits and old:new ratios
- Dismissal and continuation rules
- Retake priority and grade-replacement rules
- Attendance and course-evaluation restrictions
- Advising holds and registration blocks

Every rule should include an effective date, owner, source URL or document reference, and approval status.

## Governance

1. Assign a Registrar or Academic Affairs owner for source-of-truth approval.
2. Version curriculum and policy data by effective trimester.
3. Run scenario-based acceptance tests with advisors from each department.
4. Record which rule and data version produced each recommendation.
5. Provide an override workflow with reason and approver.
6. Define retention, access, breach-response, and model-vendor policies.
