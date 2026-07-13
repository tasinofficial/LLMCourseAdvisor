import { Check } from 'lucide-react';

const steps = [
  { id: 1, label: 'Student profile' },
  { id: 2, label: 'Course history' },
  { id: 3, label: 'Advising plan' },
];

export function ProgressRail({ current }: { current: number }) {
  return (
    <nav className="progress-rail" aria-label="Advising progress">
      {steps.map((step, index) => {
        const complete = step.id < current;
        const active = step.id === current;
        return (
          <div className={`progress-step ${complete ? 'is-complete' : ''} ${active ? 'is-active' : ''}`} key={step.id}>
            <div className="progress-step__number" aria-hidden="true">
              {complete ? <Check size={15} strokeWidth={3} /> : step.id}
            </div>
            <span>{step.label}</span>
            {index < steps.length - 1 && <span className="progress-step__line" aria-hidden="true" />}
          </div>
        );
      })}
    </nav>
  );
}
