import 'dotenv/config';
import { createApp } from './app.js';

const port = Number(process.env.PORT || 3000);
const app = createApp();

app.listen(port, () => {
  console.log(`UIU Course Advisor API listening on http://localhost:${port}`);
  console.log(`Gemini configured: ${process.env.GEMINI_API_KEY ? 'yes' : 'no — deterministic fallback enabled'}`);
});
