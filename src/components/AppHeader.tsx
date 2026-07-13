import { GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';

interface AppHeaderProps {
  apiState: 'checking' | 'online' | 'offline';
  geminiConfigured: boolean;
}

export function AppHeader({ apiState, geminiConfigured }: AppHeaderProps) {
  const statusLabel = apiState === 'checking'
    ? 'Checking advisor service'
    : apiState === 'online'
      ? geminiConfigured ? 'Gemini advisor ready' : 'Rules engine ready'
      : 'Local rules mode';

  return (
    <header className="app-header">
      <div className="brand-lockup">
        <div className="brand-mark" aria-hidden="true"><GraduationCap size={26} /></div>
        <div>
          <p className="eyebrow">United International University</p>
          <h1>Course Advisor</h1>
        </div>
      </div>
      <div className="header-meta">
        <div className={`service-status service-status--${apiState}`} aria-live="polite">
          <span className="status-dot" aria-hidden="true" />
          {statusLabel}
        </div>
        <div className="trust-label" title="Academic rules are evaluated before AI narration">
          {geminiConfigured ? <Sparkles size={16} /> : <ShieldCheck size={16} />}
          Policy-first advising
        </div>
      </div>
    </header>
  );
}
