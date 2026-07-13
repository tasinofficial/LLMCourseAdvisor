import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, LockKeyhole, RotateCcw } from 'lucide-react';
import { AppHeader } from './components/AppHeader';
import { CourseHistoryPanel } from './components/CourseHistoryPanel';
import { ProfilePanel } from './components/ProfilePanel';
import { ProgressRail } from './components/ProgressRail';
import { RecommendationResults } from './components/RecommendationResults';
import { sampleProfiles } from './data/catalog';
import { generateRecommendation } from './lib/recommendationEngine';
import type { AdviceResponse, CourseStatus, StudentProfile } from './types/advisor';

const initialProfile: StudentProfile = {
  name: '',
  studentId: '',
  department: 'cse',
  cgpa: 3,
  creditsCompleted: 0,
  trimester: 'Summer',
  year: 1,
  probation: false,
  completedCourses: [],
  failedCourses: [],
  droppedCourses: [],
};

function localAdvice(profile: StudentProfile): AdviceResponse {
  const plan = generateRecommendation(profile);
  const firstName = profile.name.split(/\s+/)[0] || 'Student';
  const courseLines = plan.recommended.map((item, index) =>
    `${index + 1}. **${item.course.code} — ${item.course.title}**: ${item.reason}`,
  ).join('\n');

  return {
    source: 'fallback',
    plan,
    advice: `## Your academic snapshot

${firstName}, the policy engine assessed your standing as **${plan.standing}** and created a **${plan.totalCredits}-credit** plan.

## Why this plan

The plan prioritizes retakes and outstanding requirements, verifies prerequisites, and stays within your ${plan.creditLimit.min}–${plan.creditLimit.max} credit policy.

## What to prioritize

${courseLines || 'No eligible courses were found automatically. Ask your advisor to review substitutions or overrides.'}

## Before you register

${plan.notices.map((notice) => `- ${notice}`).join('\n')}`,
  };
}

export default function App() {
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [response, setResponse] = useState<AdviceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiState, setApiState] = useState<'checking' | 'online' | 'offline'>('checking');
  const [geminiConfigured, setGeminiConfigured] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 2500);
    fetch('/api/status', { signal: controller.signal })
      .then(async (result) => {
        if (!result.ok) throw new Error('API unavailable');
        const status = await result.json() as { geminiConfigured?: boolean };
        setApiState('online');
        setGeminiConfigured(Boolean(status.geminiConfigured));
      })
      .catch(() => setApiState('offline'))
      .finally(() => window.clearTimeout(timeout));
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const markedCourses = profile.completedCourses.length + profile.failedCourses.length + profile.droppedCourses.length;
  const currentStep = response ? 3 : markedCourses > 0 ? 2 : 1;

  const formIssue = useMemo(() => {
    if (!profile.name.trim()) return 'Enter the student name.';
    if (!profile.studentId.trim()) return 'Enter the student ID.';
    if (profile.cgpa < 0 || profile.cgpa > 4) return 'CGPA must be between 0.00 and 4.00.';
    if (!Number.isInteger(profile.creditsCompleted) || profile.creditsCompleted < 0) return 'Credits completed must be a non-negative whole number.';
    return null;
  }, [profile]);

  const updateProfile = <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) => {
    setProfile((current) => {
      if (key === 'department' && value !== current.department) {
        return { ...current, department: value as StudentProfile['department'], completedCourses: [], failedCourses: [], droppedCourses: [] };
      }
      return { ...current, [key]: value };
    });
    setResponse(null);
    setError(null);
  };

  const updateCourseStatus = (courseCode: string, status: CourseStatus | null) => {
    setProfile((current) => {
      const next = {
        ...current,
        completedCourses: current.completedCourses.filter((code) => code !== courseCode),
        failedCourses: current.failedCourses.filter((code) => code !== courseCode),
        droppedCourses: current.droppedCourses.filter((code) => code !== courseCode),
      };
      if (status === 'completed') next.completedCourses = [...next.completedCourses, courseCode];
      if (status === 'failed') next.failedCourses = [...next.failedCourses, courseCode];
      if (status === 'dropped') next.droppedCourses = [...next.droppedCourses, courseCode];
      return next;
    });
    setResponse(null);
    setError(null);
  };

  const loadSample = (sample: StudentProfile) => {
    setProfile(structuredClone(sample));
    setResponse(null);
    setError(null);
  };

  const generate = async () => {
    if (formIssue) {
      setError(formIssue);
      document.querySelector<HTMLElement>('.workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    if (apiState === 'offline') {
      window.setTimeout(() => {
        setResponse(localAdvice(profile));
        setIsLoading(false);
      }, 650);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20_000);
    try {
      const result = await fetch('/api/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
        signal: controller.signal,
      });
      const payload = await result.json() as AdviceResponse & { error?: string };
      if (!result.ok) throw new Error(payload.error || 'The advisor API rejected the request.');
      setResponse(payload);
      setApiState('online');
    } catch (requestError) {
      console.warn('API advice failed; using local deterministic fallback.', requestError);
      setApiState('offline');
      setResponse(localAdvice(profile));
    } finally {
      window.clearTimeout(timeout);
      setIsLoading(false);
    }
  };

  const reset = () => {
    setProfile(initialProfile);
    setResponse(null);
    setError(null);
  };

  return (
    <div className="app-shell">
      <AppHeader apiState={apiState} geminiConfigured={geminiConfigured} />
      <main>
        <section className="hero">
          <div>
            <p className="hero-kicker">Policy-aware academic planning</p>
            <h2>Plan the next trimester with fewer surprises.</h2>
            <p>Build a course plan from academic standing, completed credits, prerequisites, and retake obligations. AI explains the result—academic rules decide it.</p>
          </div>
          <div className="hero-proof">
            <LockKeyhole size={20} />
            <div><strong>Privacy by design</strong><span>Direct identifiers never go to Gemini.</span></div>
          </div>
        </section>

        <ProgressRail current={currentStep} />

        <div className="workspace">
          <div className="input-column">
            <ProfilePanel profile={profile} onChange={updateProfile} onLoadSample={loadSample} />
            <CourseHistoryPanel profile={profile} onStatusChange={updateCourseStatus} />
            <div className="workspace-actions">
              <button type="button" className="button button--quiet" onClick={reset}><RotateCcw size={16} /> Reset</button>
              <div className="action-note">
                {formIssue ? <span>{formIssue}</span> : <span>{markedCourses} course{markedCourses === 1 ? '' : 's'} marked</span>}
              </div>
              <button type="button" className="button button--primary button--large" onClick={generate} disabled={isLoading}>
                Generate advising plan <ArrowRight size={17} />
              </button>
            </div>
          </div>

          <RecommendationResults response={response} isLoading={isLoading} error={error} onGenerate={generate} />
        </div>
      </main>
      <footer className="app-footer">
        <span>UIU Course Advisor</span>
        <p>Decision support only. Official UIU curriculum, offerings, and advisor approval remain authoritative.</p>
      </footer>
    </div>
  );
}
