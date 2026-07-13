// UIU Course Advisor - Gemini Backend Proxy Server
// Proxies student recommendation data to Google Gemini API
// Usage: GEMINI_API_KEY=your_key node gemini-proxy.js

const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-3.1-flash-lite';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

if (!GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY environment variable is required');
  console.error('Get your API key at: https://ai.google.dev/gemini-api/docs/api-key');
  process.exit(1);
}

// CORS headers to allow frontend access
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

function buildSystemPrompt() {
  return `You are an expert academic advisor at United International University (UIU), Bangladesh. You help students choose courses for the upcoming trimester. Rules:
- Trimester system (Spring, Summer, Fall)
- Minimum 9 credits per trimester for undergraduates, 6 for graduates
- Maximum 16 credits for CGPA <= 3.50, maximum 19 for CGPA > 3.50
- Probation students: 6-9 credits, 2:1 old-to-new course ratio
- D is lowest passing grade, minimum CGPA 2.00 for degree
- Failed/dropped courses must be retaken first
- GED courses must be taken each trimester when offered
- 80% attendance required to sit for final exam
- First year students must complete 30 offered credits
Be encouraging but honest. Format with clear headings and bullet points.`;
}

function buildUserPrompt(data) {
  const selectedCourses = data.selected.map(rec =>
    `- ${rec.course.code}: ${rec.course.title} (${rec.course.credits} credits) - ${rec.reason}`
  ).join('\n');
  const retakeList = data.retakes.map(rec => `- ${rec.course.code}: ${rec.course.title}`).join('\n') || 'None';
  const gedList = data.gedNeeded.map(c => `- ${c.code}: ${c.title}`).join('\n') || 'None';
  return `Student Profile:
- Name: ${data.name}
- Department: ${data.dept.toUpperCase()}
- CGPA: ${data.cgpa.toFixed(2)}
- Credits Completed: ${data.credits}
- Probation Status: ${data.probation ? 'YES' : 'No'}
- Current Trimester: ${data.trimester}
- Credit Limit: ${data.creditLimit.min} - ${data.creditLimit.max} credits

Retake Required:
${retakeList}

GED Courses Still Needed:
${gedList}

Recommended Courses (${data.totalCredits} credits):
${selectedCourses}

Please provide personalized advice with priority ranking, strategic advice, warnings, and encouragement.`;
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); } catch (e) { reject(new Error('Invalid JSON')); }
    });
  });
}

async function callGemini(studentData) {
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(studentData);
  const payload = JSON.stringify({
    contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 1200 }
  });

  return new Promise((resolve, reject) => {
    const req = https.request(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) { reject(new Error(json.error.message || 'Gemini API error')); return; }
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
          resolve({ text, usage: json.usageMetadata });
        } catch (e) { reject(new Error('Failed to parse Gemini response')); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function serveStatic(reqPath, res) {
  const filePath = path.join(__dirname, reqPath);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404, CORS_HEADERS); res.end(JSON.stringify({ error: 'Not found' })); return; }
    const ext = path.extname(filePath);
    const contentType = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json' }[ext] || 'application/octet-stream';
    res.writeHead(200, { ...CORS_HEADERS, 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (req.method === 'OPTIONS') { res.writeHead(204, CORS_HEADERS); res.end(); return; }

  if (pathname === '/health' && req.method === 'GET') {
    res.writeHead(200, CORS_HEADERS);
    res.end(JSON.stringify({ status: 'ok', service: 'UIU Course Advisor - Gemini Proxy' }));
    return;
  }

  if (pathname === '/api/advisor' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const result = await callGemini(body);
      res.writeHead(200, CORS_HEADERS);
      res.end(JSON.stringify({ success: true, advisor: result.text, usage: result.usage }));
    } catch (error) {
      console.error('Error:', error.message);
      res.writeHead(500, CORS_HEADERS);
      res.end(JSON.stringify({ success: false, error: error.message, fallback: true }));
    }
    return;
  }

  if (pathname === '/' || pathname === '/index.html') { serveStatic('index.html', res); return; }
  if (pathname === '/gemini-proxy.js') { serveStatic('gemini-proxy.js', res); return; }

  res.writeHead(404, CORS_HEADERS);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`UIU Course Advisor - Gemini Backend Proxy running on http://localhost:${PORT}`);
  console.log(`API endpoint: POST http://localhost:${PORT}/api/advisor`);
  console.log(`Health check: GET http://localhost:${PORT}/health`);
  console.log(`Model: ${GEMINI_MODEL}`);
});

process.on('SIGINT', () => { console.log('\nShutting down...'); server.close(() => process.exit(0)); });
