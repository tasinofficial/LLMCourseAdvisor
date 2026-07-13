import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../server/app.js';
import { sampleProfiles } from '../src/data/catalog.js';

beforeEach(() => {
  delete process.env.GEMINI_API_KEY;
  process.env.NODE_ENV = 'test';
});

describe('advisor API', () => {
  it('reports service status without exposing secrets', async () => {
    const response = await request(createApp()).get('/api/status');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ ok: true, geminiConfigured: false });
    expect(response.body).not.toHaveProperty('apiKey');
  });

  it('returns a deterministic plan and fallback advice when Gemini is not configured', async () => {
    const response = await request(createApp()).post('/api/advice').send(sampleProfiles.onTrack);
    expect(response.status).toBe(200);
    expect(response.body.source).toBe('fallback');
    expect(response.body.plan.recommended.length).toBeGreaterThan(0);
    expect(response.body.advice).toContain('academic snapshot');
  });

  it('rejects conflicting course states', async () => {
    const profile = {
      ...sampleProfiles.onTrack,
      failedCourses: ['CSE111'],
    };
    const response = await request(createApp()).post('/api/recommendations').send(profile);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid student profile');
  });

  it('rejects course codes outside the selected department catalog', async () => {
    const profile = {
      ...sampleProfiles.onTrack,
      completedCourses: [...sampleProfiles.onTrack.completedCourses, 'BBA101'],
    };
    const response = await request(createApp()).post('/api/recommendations').send(profile);
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Unknown course codes');
  });
});
