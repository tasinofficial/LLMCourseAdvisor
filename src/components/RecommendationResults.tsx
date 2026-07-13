import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  Clipboard,
  GraduationCap,
  Info,
  RefreshCw,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { AdviceResponse, RecommendationPlan, RecommendedCourse } from '../types/advisor';

interface RecommendationResultsProps {
  response: AdviceResponse | null;
  isLoading: boolean;
  error: string | null;
  onGenerate: () => void;
}

function priorityLabel(item: RecommendedCourse) {
  if (item.type === 'retake') return 'Retake first';
  if (item.type === 'ged') return 'Degree requirement';
  if (item.type === 'core') return 'Program core';
  return 'Eligible elective';
}

function PlanOverview({ plan }: { plan: RecommendationPlan }) {
  return (
    <div className="result-overview">
      <div className="overview-card overview-card--primary">
        <span>Recommended load</span>
        <strong>{plan.totalCredits}</strong>
        <small>of {plan.creditLimit.max} maximum credits</small>
        <div className="credit-meter" aria-label={`${plan.totalCredits} of ${plan.creditLimit.max} credits`}>
          <span style={{ width: `${Math.min(100, (plan.totalCredits / plan.creditLimit.max) * 100)}%` }} />
        </div>
      </div>
      <div className="overview-card">
        <span>Academic standing</span>
        <strong className={`standing standing--${plan.standing}`}>{plan.standing}</strong>
        <small>CGPA {plan.profile.cgpa.toFixed(2)}</small>
      </div>
      <div className="overview-card">
        <span>Plan risk</span>
        <strong className={`risk risk--${plan.riskLevel}`}>{plan.riskLevel}</strong>
        <small>{plan.profile.probation ? 'Probation controls applied' : 'Standard rules applied'}</small>
      </div>
    </div>
  );
}

function CourseRecommendation({ item, index }: { item: RecommendedCourse; index: number }) {
  return (
    <article className={`recommendation-card recommendation-card--${item.type}`}>
      <div className="course-priority" aria-label={`Priority ${index + 1}`}>{index + 1}</div>
      <div className="recommendation-card__body">
        <div className="recommendation-card__topline">
          <strong>{item.course.code}</strong>
          <span className={`plan-chip plan-chip--${item.type}`}>{priorityLabel(item)}</span>
        </div>
        <h4>{item.course.title}</h4>
        <p>{item.reason}</p>
        <div className="course-meta">
          <span>{item.course.credits} credits</span>
          <span>{item.course.difficulty}</span>
          {item.course.prerequisites.length > 0 && <span>Prerequisites met</span>}
        </div>
        {item.warnings.map((warning) => <div className="inline-warning" key={warning}><AlertTriangle size={14} /> {warning}</div>)}
      </div>
    </article>
  );
}

function EmptyResults({ onGenerate }: { onGenerate: () => void }) {
  return (
    <div className="results-empty">
      <div className="results-empty__graphic">
        <GraduationCap size={34} />
        <span><ArrowRight size={18} /></span>
        <BookOpen size={34} />
      </div>
      <p className="section-kicker">Step 3</p>
      <h2>Your advising plan appears here</h2>
      <p>The system validates course history, prerequisites, academic standing, and credit policy before asking AI to explain the result.</p>
      <div className="empty-checks">
        <span><Check size={15} /> Prerequisite checks</span>
        <span><Check size={15} /> Probation controls</span>
        <span><Check size={15} /> Credit-load guardrails</span>
      </div>
      <button type="button" className="button button--primary" onClick={onGenerate}>Generate advising plan</button>
    </div>
  );
}

function LoadingResults() {
  return (
    <div className="results-loading" role="status" aria-live="polite">
      <div className="loading-orbit"><RefreshCw size={28} /></div>
      <h2>Building a policy-safe plan</h2>
      <p>Checking prerequisites, retakes, credit limits, and workload balance.</p>
      <div className="skeleton-stack">
        <span /><span /><span />
      </div>
    </div>
  );
}

export function RecommendationResults({ response, isLoading, error, onGenerate }: RecommendationResultsProps) {
  const [copied, setCopied] = useState(false);

  if (isLoading) return <section className="results-panel"><LoadingResults /></section>;
  if (!response && !error) return <section className="results-panel"><EmptyResults onGenerate={onGenerate} /></section>;

  if (error && !response) {
    return (
      <section className="results-panel">
        <div className="error-state" role="alert">
          <ShieldAlert size={32} />
          <h2>We could not generate the plan</h2>
          <p>{error}</p>
          <button type="button" className="button button--primary" onClick={onGenerate}>Try again</button>
        </div>
      </section>
    );
  }

  if (!response) return null;
  const { plan } = response;

  const copyPlan = async () => {
    const text = [
      `UIU Course Advisor plan for ${plan.profile.name}`,
      `Recommended load: ${plan.totalCredits} credits`,
      ...plan.recommended.map((item, index) => `${index + 1}. ${item.course.code} — ${item.course.title} (${item.course.credits} credits)`),
      '',
      'Verify this plan with an official UIU academic advisor.',
    ].join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="results-panel results-panel--complete" aria-labelledby="results-heading">
      <div className="results-heading">
        <div>
          <p className="section-kicker">Step 3</p>
          <h2 id="results-heading">Advising plan</h2>
          <p>Generated {new Date(plan.generatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
        </div>
        <button type="button" className="button button--quiet" onClick={copyPlan}>
          {copied ? <Check size={16} /> : <Clipboard size={16} />}
          {copied ? 'Copied' : 'Copy plan'}
        </button>
      </div>

      <PlanOverview plan={plan} />

      <div className="plan-section">
        <div className="section-title-row">
          <div>
            <h3>Recommended courses</h3>
            <p>Ordered by policy priority, not personal preference.</p>
          </div>
          <span>{plan.recommended.length} courses</span>
        </div>
        <div className="recommendation-list">
          {plan.recommended.map((item, index) => <CourseRecommendation item={item} index={index} key={item.course.code} />)}
          {plan.recommended.length === 0 && <div className="no-recommendations"><Info size={18} /> No eligible courses were identified automatically.</div>}
        </div>
      </div>

      <div className="notice-panel">
        <div className="notice-panel__heading"><ShieldAlert size={18} /><h3>Registration checks</h3></div>
        <ul>{plan.notices.map((notice) => <li key={notice}>{notice}</li>)}</ul>
        <p>{plan.excluded.length} catalog courses were excluded because they are completed or not yet eligible.</p>
      </div>

      <div className="ai-advice">
        <div className="ai-advice__heading">
          <div className="ai-mark"><Sparkles size={19} /></div>
          <div>
            <h3>Advisor explanation</h3>
            <p>AI explains the rule-based plan; it does not choose the courses.</p>
          </div>
          <span className={`source-badge source-badge--${response.source}`}>{response.source === 'gemini' ? 'Gemini' : 'Rules fallback'}</span>
        </div>
        <div className="markdown-content"><ReactMarkdown>{response.advice}</ReactMarkdown></div>
      </div>
    </section>
  );
}
