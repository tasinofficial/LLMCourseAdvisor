import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { ZodError } from 'zod';
import { courseCatalog } from '../src/data/catalog.js';
import { generateRecommendation } from '../src/lib/recommendationEngine.js';
import type { DepartmentId, StudentProfile } from '../src/types/advisor.js';
import { generateAdvice } from './advisorService.js';
import { studentProfileSchema } from './schema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../dist');

function validateCourseCodes(profile: StudentProfile) {
  const allowed = new Set(courseCatalog[profile.department as DepartmentId].map((course) => course.code));
  const submitted = [...profile.completedCourses, ...profile.failedCourses, ...profile.droppedCourses];
  const unknown = [...new Set(submitted.filter((code) => !allowed.has(code)))];
  if (unknown.length > 0) {
    const error = new Error(`Unknown course codes for ${profile.department.toUpperCase()}: ${unknown.join(', ')}`);
    error.name = 'ValidationError';
    throw error;
  }
}

export function createApp() {
  const app = express();
  const allowedOrigin = process.env.ALLOWED_ORIGIN;

  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
      },
    },
  }));
  app.use(cors({ origin: allowedOrigin ? allowedOrigin.split(',').map((origin) => origin.trim()) : false, methods: ['GET', 'POST'] }));
  app.use(express.json({ limit: '100kb' }));

  const apiLimiter = rateLimit({ windowMs: 60_000, limit: 60, standardHeaders: 'draft-8', legacyHeaders: false });
  const adviceLimiter = rateLimit({ windowMs: 60_000, limit: 12, standardHeaders: 'draft-8', legacyHeaders: false });
  app.use('/api', apiLimiter);

  app.get('/api/status', (_request, response) => {
    response.json({ ok: true, service: 'UIU Course Advisor API', geminiConfigured: Boolean(process.env.GEMINI_API_KEY) });
  });

  app.post('/api/recommendations', (request, response, next) => {
    try {
      const profile = studentProfileSchema.parse(request.body) as StudentProfile;
      validateCourseCodes(profile);
      response.json({ plan: generateRecommendation(profile) });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/advice', adviceLimiter, async (request, response, next) => {
    try {
      const profile = studentProfileSchema.parse(request.body) as StudentProfile;
      validateCourseCodes(profile);
      const plan = generateRecommendation(profile);
      const generated = await generateAdvice(plan);
      response.json({ ...generated, plan });
    } catch (error) {
      next(error);
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(distPath));
    app.get(/^(?!\/api).*/, (_request, response) => response.sendFile(path.join(distPath, 'index.html')));
  }

  app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
    if (error instanceof ZodError) {
      response.status(400).json({
        error: 'Invalid student profile',
        details: error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
      });
      return;
    }

    if (error instanceof Error && error.name === 'ValidationError') {
      response.status(400).json({ error: error.message });
      return;
    }

    console.error('Unhandled API error:', error instanceof Error ? error.message : 'Unknown error');
    response.status(500).json({ error: 'The advisor service could not complete this request.' });
  });

  return app;
}
