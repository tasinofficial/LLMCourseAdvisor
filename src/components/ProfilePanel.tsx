import { BookOpenCheck, Building2, Gauge, UserRound } from 'lucide-react';
import { departments, sampleProfiles } from '../data/catalog';
import type { StudentProfile } from '../types/advisor';

interface ProfilePanelProps {
  profile: StudentProfile;
  onChange: <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) => void;
  onLoadSample: (profile: StudentProfile) => void;
}

export function ProfilePanel({ profile, onChange, onLoadSample }: ProfilePanelProps) {
  return (
    <section className="panel" aria-labelledby="profile-heading">
      <div className="panel-heading">
        <div className="panel-icon"><UserRound size={19} /></div>
        <div>
          <p className="section-kicker">Step 1</p>
          <h2 id="profile-heading">Student profile</h2>
          <p>Use current academic information for a reliable plan.</p>
        </div>
      </div>

      <div className="sample-strip" aria-label="Load a sample student">
        <span>Explore a scenario</span>
        <div className="sample-actions">
          <button type="button" onClick={() => onLoadSample(sampleProfiles.onTrack)}>On-track CSE</button>
          <button type="button" onClick={() => onLoadSample(sampleProfiles.probation)}>Probation BBA</button>
          <button type="button" onClick={() => onLoadSample(sampleProfiles.highPerformer)}>High-performing EEE</button>
        </div>
      </div>

      <div className="form-grid">
        <label className="field field--wide">
          <span>Full name</span>
          <div className="input-shell">
            <UserRound size={17} aria-hidden="true" />
            <input
              autoComplete="name"
              value={profile.name}
              onChange={(event) => onChange('name', event.target.value)}
              placeholder="Student name"
              maxLength={80}
            />
          </div>
        </label>

        <label className="field">
          <span>Student ID</span>
          <input
            value={profile.studentId}
            onChange={(event) => onChange('studentId', event.target.value)}
            placeholder="e.g. 011-231-001"
            maxLength={40}
          />
        </label>

        <label className="field">
          <span>Department</span>
          <div className="input-shell">
            <Building2 size={17} aria-hidden="true" />
            <select value={profile.department} onChange={(event) => onChange('department', event.target.value as StudentProfile['department'])}>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>{department.shortName} — {department.name}</option>
              ))}
            </select>
          </div>
        </label>

        <label className="field">
          <span>Current CGPA</span>
          <div className="input-shell">
            <Gauge size={17} aria-hidden="true" />
            <input
              type="number"
              inputMode="decimal"
              min="0"
              max="4"
              step="0.01"
              value={profile.cgpa}
              onChange={(event) => onChange('cgpa', Number(event.target.value))}
            />
          </div>
        </label>

        <label className="field">
          <span>Credits completed</span>
          <div className="input-shell">
            <BookOpenCheck size={17} aria-hidden="true" />
            <input
              type="number"
              inputMode="numeric"
              min="0"
              max="250"
              value={profile.creditsCompleted}
              onChange={(event) => onChange('creditsCompleted', Number(event.target.value))}
            />
          </div>
        </label>

        <label className="field">
          <span>Upcoming trimester</span>
          <select value={profile.trimester} onChange={(event) => onChange('trimester', event.target.value as StudentProfile['trimester'])}>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Fall">Fall</option>
          </select>
        </label>

        <label className="field">
          <span>Program year</span>
          <select value={profile.year} onChange={(event) => onChange('year', Number(event.target.value))}>
            {[1, 2, 3, 4, 5, 6].map((year) => <option key={year} value={year}>Year {year}</option>)}
          </select>
        </label>
      </div>

      <div className="standing-control">
        <div>
          <strong>Academic probation</strong>
          <span>Use the status shown in the official student portal.</span>
        </div>
        <div className="segmented-control" role="group" aria-label="Academic probation status">
          <button type="button" className={!profile.probation ? 'is-selected' : ''} onClick={() => onChange('probation', false)}>No</button>
          <button type="button" className={profile.probation ? 'is-selected' : ''} onClick={() => onChange('probation', true)}>Yes</button>
        </div>
      </div>
    </section>
  );
}
