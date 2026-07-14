import { useMemo, useState } from 'react';
import { BadgeCheck, CheckCircle2, Circle, ExternalLink, MinusCircle, RotateCcw, Search } from 'lucide-react';
import { courseCatalog } from '../data/catalog';
import { CSE_COURSE_PLAN_SOURCE, cseCurriculumMeta } from '../data/cseOfficial';
import type { CourseCategory, CourseStatus, StudentProfile } from '../types/advisor';

interface CourseHistoryPanelProps {
  profile: StudentProfile;
  onStatusChange: (courseCode: string, status: CourseStatus | null) => void;
}

const filters: Array<{ value: 'all' | CourseCategory; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'core', label: 'Core' },
  { value: 'ged', label: 'GED' },
  { value: 'elective', label: 'Elective' },
];

export function CourseHistoryPanel({ profile, onStatusChange }: CourseHistoryPanelProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | CourseCategory>('all');
  const catalog = courseCatalog[profile.department];

  const statusFor = (code: string): CourseStatus | null => {
    if (profile.completedCourses.includes(code)) return 'completed';
    if (profile.failedCourses.includes(code)) return 'failed';
    if (profile.droppedCourses.includes(code)) return 'dropped';
    return null;
  };

  const visibleCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return catalog.filter((course) => {
      const matchesCategory = filter === 'all' || course.category === filter;
      const matchesQuery = !normalizedQuery
        || course.code.toLowerCase().includes(normalizedQuery)
        || course.title.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [catalog, filter, query]);

  const selectedCount = profile.completedCourses.length + profile.failedCourses.length + profile.droppedCourses.length;

  return (
    <section className="panel course-history" aria-labelledby="history-heading">
      <div className="panel-heading panel-heading--split">
        <div className="panel-heading__title">
          <div className="panel-icon"><CheckCircle2 size={19} /></div>
          <div>
            <p className="section-kicker">Step 2</p>
            <h2 id="history-heading">Course history</h2>
            <p>Mark each attempted course once. Prerequisites use completed courses only.</p>
          </div>
        </div>
        <span className="selection-count" aria-live="polite">{selectedCount} marked · {profile.creditsCompleted} credits passed</span>
      </div>

      {profile.department === 'cse' && (
        <div className="official-source-banner">
          <BadgeCheck size={18} aria-hidden="true" />
          <div>
            <strong>Official UIU CSE course plan</strong>
            <span>{catalog.length} catalog courses · {cseCurriculumMeta.degreeCredits}-credit degree plan · 211 onwards</span>
          </div>
          <a href={CSE_COURSE_PLAN_SOURCE} target="_blank" rel="noopener noreferrer">
            Source <ExternalLink size={14} />
          </a>
        </div>
      )}

      <div className="history-toolbar">
        <label className="search-field">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Search courses</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search code or title" />
        </label>
        <div className="filter-pills" role="group" aria-label="Course category filter">
          {filters.map((option) => (
            <button
              type="button"
              key={option.value}
              className={filter === option.value ? 'is-selected' : ''}
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="course-table" role="table" aria-label={`${profile.department.toUpperCase()} course history`}>
        <div className="course-table__header" role="row">
          <span role="columnheader">Course</span>
          <span role="columnheader">Credits</span>
          <span role="columnheader">Status</span>
        </div>
        <div className="course-table__body">
          {visibleCourses.length === 0 && <div className="no-courses">No courses match this search.</div>}
          {visibleCourses.map((course) => {
            const status = statusFor(course.code);
            return (
              <div className={`course-row ${status ? `course-row--${status}` : ''}`} role="row" key={course.code}>
                <div className="course-identity" role="cell">
                  <div>
                    <strong>{course.code}</strong>
                    <span className={`category-chip category-chip--${course.category}`}>{course.category}</span>
                    {course.recommendedTerm && <span className="term-chip">T{course.recommendedTerm}</span>}
                    {course.requirementGroup && <span className="choice-chip">choice</span>}
                  </div>
                  <p>{course.title}</p>
                  {course.prerequisites.length > 0 && <small>Requires {course.prerequisites.join(', ')}</small>}
                </div>
                <span className="credit-value" role="cell">{course.credits}</span>
                <div className="status-actions" role="cell" aria-label={`${course.code} status`}>
                  <button
                    type="button"
                    className={status === 'completed' ? 'is-selected is-completed' : ''}
                    onClick={() => onStatusChange(course.code, status === 'completed' ? null : 'completed')}
                    title="Mark completed"
                    aria-label={`Mark ${course.code} completed`}
                  ><CheckCircle2 size={16} /> <span>Passed</span></button>
                  <button
                    type="button"
                    className={status === 'failed' ? 'is-selected is-failed' : ''}
                    onClick={() => onStatusChange(course.code, status === 'failed' ? null : 'failed')}
                    title="Mark failed"
                    aria-label={`Mark ${course.code} failed`}
                  ><RotateCcw size={16} /> <span>Failed</span></button>
                  <button
                    type="button"
                    className={status === 'dropped' ? 'is-selected is-dropped' : ''}
                    onClick={() => onStatusChange(course.code, status === 'dropped' ? null : 'dropped')}
                    title="Mark dropped"
                    aria-label={`Mark ${course.code} dropped`}
                  ><MinusCircle size={16} /> <span>Dropped</span></button>
                  {status && (
                    <button
                      type="button"
                      className="clear-status"
                      onClick={() => onStatusChange(course.code, null)}
                      title="Clear status"
                      aria-label={`Clear ${course.code} status`}
                    ><Circle size={15} /></button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
