import { GoogleGenAI } from '@google/genai';
import type { RecommendationPlan } from '../src/types/advisor.js';

const DEFAULT_MODEL = 'gemini-3.1-flash-lite';
const REQUEST_TIMEOUT_MS = 15_000;

function planFacts(plan: RecommendationPlan) {
  const courses = plan.recommended.map((item) =>
    `- ${item.course.code}: ${item.course.title} (${item.course.credits} credits) — ${item.reason}`,
  ).join('\n');

  return `Academic profile (direct identifiers intentionally omitted):
- Department: ${plan.profile.department.toUpperCase()}
- CGPA: ${plan.profile.cgpa.toFixed(2)}
- Credits completed: ${plan.profile.creditsCompleted}
- Academic standing: ${plan.standing}
- Probation: ${plan.profile.probation ? 'yes' : 'no'}
- Credit policy: ${plan.creditLimit.min}–${plan.creditLimit.max}
- Recommended load: ${plan.totalCredits}

Deterministic recommendation plan:
${courses || '- No eligible courses were found.'}

Notices:
${plan.notices.map((notice) => `- ${notice}`).join('\n')}`;
}

function buildPrompt(plan: RecommendationPlan) {
  return `You are the first-level academic advising assistant for United International University (UIU), Bangladesh.

Your role is to EXPLAIN the deterministic plan supplied below. Do not add, remove, swap, or invent course codes. Do not claim that registration is approved. State clearly that a human advisor and the official offered-course schedule remain authoritative.

Use concise, warm, professional language. Format the response in Markdown with these headings:
1. "Your academic snapshot"
2. "Why this plan"
3. "What to prioritize"
4. "Before you register"

Mention workload risk if the plan includes multiple advanced courses or probation. Never shame the student. Do not request, infer, or repeat any direct identifier.

${planFacts(plan)}`;
}

export function buildFallbackAdvice(plan: RecommendationPlan) {
  const firstName = plan.profile.name.split(/\s+/)[0] || 'Student';
  const priorities = plan.recommended.slice(0, 5).map((item, index) =>
    `${index + 1}. **${item.course.code} — ${item.course.title}**: ${item.reason}`,
  ).join('\n');

  return `## Your academic snapshot

${firstName}, your current standing is **${plan.standing}** with a CGPA of **${plan.profile.cgpa.toFixed(2)}**. The policy-aware plan contains **${plan.totalCredits} credits**, within the ${plan.creditLimit.min}–${plan.creditLimit.max} credit range.

## Why this plan

The recommendation engine checked completed courses, prerequisites, retakes, probation status, program sequence, and credit limits before selecting courses.

## What to prioritize

${priorities || 'No eligible courses were found automatically. Please ask your academic advisor to review your record.'}

## Before you register

${plan.notices.map((notice) => `- ${notice}`).join('\n')}
`;
}

async function withTimeout<T>(promise: Promise<T>, milliseconds: number): Promise<T> {
  let timeout: NodeJS.Timeout | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => reject(new Error('Gemini request timed out')), milliseconds);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export async function generateAdvice(plan: RecommendationPlan) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  if (!apiKey) {
    return { advice: buildFallbackAdvice(plan), source: 'fallback' as const };
  }

  try {
    const client = new GoogleGenAI({ apiKey });
    const response = await withTimeout(
      client.models.generateContent({
        model,
        contents: buildPrompt(plan),
        config: {
          temperature: 0.35,
          maxOutputTokens: 900,
        },
      }),
      REQUEST_TIMEOUT_MS,
    );

    const advice = response.text?.trim();
    if (!advice) throw new Error('Gemini returned an empty response');

    return { advice, source: 'gemini' as const, model };
  } catch (error) {
    console.error('Gemini advice generation failed; using fallback.', error instanceof Error ? error.message : 'Unknown error');
    return { advice: buildFallbackAdvice(plan), source: 'fallback' as const };
  }
}
