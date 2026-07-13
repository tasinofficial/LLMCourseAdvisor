# UIU Course Advisor

A policy-first, AI-assisted course planning application for United International University students. The deterministic recommendation engine selects eligible courses; Google Gemini only explains the resulting plan in natural language.

> This project is decision support, not an official registration system. Course codes, prerequisites, curriculum rules, trimester offerings, and probation policies must be validated by UIU before production use.

## What changed in version 2

- React 19 + TypeScript + Vite frontend
- Express + TypeScript API
- Deterministic prerequisite, retake, probation, and credit-load engine
- Gemini explanation layer that cannot alter the course list
- No direct student identifiers sent to Gemini
- Zod request validation and department-level course-code validation
- Helmet, CORS policy, request-size limits, and rate limiting
- Responsive, accessible multi-step advising interface
- Loading, offline fallback, validation, and error states
- Unit and API tests

## Architecture

```text
Student profile + course history
              |
              v
  Deterministic rules engine
  - prerequisites
  - completed courses
  - failed/dropped retakes
  - probation load and old:new ratio
  - CGPA credit ceiling
              |
              v
      Recommendation plan
        |              |
        |              +--> UI course cards and warnings
        v
  Gemini explanation layer
  - receives no direct student identifiers
  - cannot change course selection
  - falls back to deterministic narrative
```

## Local setup

Requirements: Node.js 20 or newer.

```bash
npm install
cp .env.example .env
```

Add a **new, rotated** Gemini key to `.env`:

```env
GEMINI_API_KEY=your_new_key_here
```

Run the frontend and API together:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:3000`
- Status: `http://localhost:3000/api/status`

The app works without Gemini. If `GEMINI_API_KEY` is absent or the model fails, the API returns a deterministic fallback explanation.

## Quality checks

```bash
npm run typecheck
npm test
npm run build
```

## Production

```bash
npm run build
NODE_ENV=production npm start
```

The Express server serves the built frontend from `dist/` in production.

Recommended deployment controls:

1. Put the API behind HTTPS.
2. Set `ALLOWED_ORIGIN` to the deployed frontend origin.
3. Store `GEMINI_API_KEY` in the hosting platform's secret manager.
4. Replace sample course data with advisor-verified curriculum data.
5. Connect to UIU identity and student systems through an approved, least-privilege API.
6. Establish human review, audit, retention, and model-governance policies.

## Security

- Never commit `.env` or API keys.
- The repository's previously exposed Google API key must remain revoked.
- GitHub history may continue to show the old value; revocation is the essential control. History rewriting can remove the string but cannot make an exposed key safe again.
- The server omits student IDs from Gemini prompts.
- The LLM is not trusted to make eligibility decisions.

## Project structure

```text
src/
  components/          React UI components
  data/                Representative catalog and scenarios
  lib/                 Deterministic recommendation engine
  types/               Shared TypeScript contracts
server/
  app.ts               API, validation, security middleware
  advisorService.ts    Gemini narration and fallback
  schema.ts            Zod profile schema
  index.ts             Server entry point
tests/                  Unit and API tests
```

## Data disclaimer

The bundled catalog is representative sample data created for prototyping. Do not use it for real registration until UIU departments and the Registrar verify every course code, prerequisite, credit value, repeat rule, offering, and program requirement.
