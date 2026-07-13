# UIU Course Advisor - LLM Integration Guide

## Overview

The UIU Course Advisor now features a dual-mode AI advisor system:

1. **Built-in LLM Simulator** (Default) - Works out of the box, no API key needed
2. **OpenAI GPT-4 Integration** (Optional) - Requires an API key for premium responses

## Architecture

```
Student Input → Recommendation Engine → Results Display
                                  ↓
                           AI Advisor Panel
                                  ↓
                    ┌─────────────┴─────────────┐
                    ↓                           ↓
            API Key Set?                   No API Key?
                    ↓                           ↓
              OpenAI GPT-4              Built-in LLM
                    ↓                           ↓
            Natural Language            Natural Language
              Response                  Response
```

## How It Works

### 1. Built-in LLM Simulator (Default)

When no API key is provided, the system uses a local `generateLocalLLMResponse()` function that:
- Analyzes the student's profile (CGPA, probation status, credits)
- Generates personalized academic advice in natural language
- Provides course priority rankings with rationale
- Offers strategic CGPA improvement advice
- Includes warnings and encouragement
- Formats responses like a real academic advisor

**Advantages:**
- No API costs or rate limits
- Instant response (no network latency)
- Works offline
- Privacy (no data sent to external APIs)
- UIU-specific knowledge embedded in templates

**Limitations:**
- Less creative/variable than a real LLM
- Fixed template structure (though content adapts)
- Cannot answer unexpected questions

### 2. OpenAI GPT-4 Integration (Optional)

When an API key is entered, the system sends a structured prompt to OpenAI's API:

```javascript
fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + apiKey
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are an expert academic advisor at UIU...' },
      { role: 'user', content: buildAIPrompt(data) }
    ],
    temperature: 0.7,
    max_tokens: 800
  })
})
```

**System Prompt:**
The system prompt instructs GPT-4 to act as a UIU academic advisor with knowledge of:
- Trimester system (Spring, Summer, Fall)
- Credit limits (9 min, 16/19 max depending on CGPA)
- Probation rules (6-9 credits, 2:1 old:new ratio)
- Grading system (D = lowest pass, F = fail, 2.00 CGPA minimum)
- GED requirements, prerequisite enforcement, attendance rules

**User Prompt:**
The prompt includes:
- Student profile (name, department, CGPA, credits, probation status)
- List of required retakes
- List of needed GED courses
- List of recommended courses with credits and reasons
- Request for personalized assessment, priority ranking, strategic advice, and warnings

**Advantages:**
- Natural, varied, and human-like responses
- Can adapt to unusual situations
- Can answer follow-up questions (if implemented)
- More creative and encouraging tone

**Limitations:**
- Requires API key and internet connection
- API costs (GPT-4: ~$0.03 per request)
- Rate limits
- Data sent to external service (privacy consideration)
- API key must be kept secure

## Setup Instructions

### For Students (No API Key)

The system works immediately with the built-in LLM simulator. Simply:
1. Fill in student information
2. Select course history
3. Click "Get Course Recommendations"
4. The AI advisor panel will show personalized advice after a 2-second "typing" animation

### For Developers (With OpenAI API Key)

1. Get an OpenAI API key from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Enter the API key in the "OpenAI API Key" field in the student form
3. Click "Get Course Recommendations"
4. The system will now use GPT-4 for responses

**Security Note:** The API key is stored only in the browser's memory (not persisted). For a production deployment, store the key server-side or use a backend proxy to avoid exposing it in client-side JavaScript.

### Production Deployment Strategy

For a production environment, use a backend proxy:

```
Browser → Backend Server → OpenAI API
```

This approach:
- Protects the API key from client-side exposure
- Enables response caching
- Allows rate limiting and cost control
- Enables audit logging
- Supports multiple LLM providers (OpenAI, Anthropic, Google, etc.)

Example backend (Node.js/Express):
```javascript
app.post('/api/advisor', async (req, res) => {
  const { studentData } = req.body;
  const prompt = buildAIPrompt(studentData);
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: { 'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY },
    // ... body with prompt
  });
  const aiResponse = await response.json();
  res.json(aiResponse);
});
```

## Extending the LLM Integration

### Using Other LLM Providers

The system is designed to be provider-agnostic. To use Claude, Gemini, or other models:

1. Change the `fetch` endpoint in `callAIAdvisor()`
2. Adjust the request body format for the specific API
3. Update the response parsing logic

Example for Anthropic Claude:
```javascript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 800,
    messages: [
      { role: 'user', content: systemPrompt + '\n\n' + prompt }
    ]
  })
});
```

### Using a Local LLM (e.g., Ollama, LM Studio)

For complete privacy and zero API costs, you can run a local LLM:

```javascript
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'llama3',
    prompt: systemPrompt + '\n\n' + prompt,
    stream: false
  })
});
```

### Adding Streaming Responses

For a more interactive feel, implement streaming:

```javascript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: { ... },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [...],
    stream: true  // Enable streaming
  })
});

const reader = response.body.getReader();
// Read chunks and append to DOM as they arrive
```

### Adding Follow-up Q&A

To make the advisor conversational, add a chat interface:

```html
<div class="chat-history" id="chatHistory"></div>
<input type="text" id="chatInput" placeholder="Ask a follow-up question...">
<button onclick="sendFollowUp()">Send</button>
```

```javascript
async function sendFollowUp() {
  const question = document.getElementById('chatInput').value;
  const context = buildAIPrompt(data); // Previous context
  const response = await callLLM([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: context },
    { role: 'assistant', content: previousResponse },
    { role: 'user', content: question }
  ]);
  // Append to chat history
}
```

## Prompt Engineering Tips

### Current System Prompt
```
You are an expert academic advisor at United International University (UIU), Bangladesh. 
You help students choose courses for the upcoming trimester. You know the following rules:
- Trimester system (Spring, Summer, Fall)
- Minimum 9 credits per trimester for undergraduates, 6 for graduates
- Maximum 16 credits for CGPA <= 3.50, maximum 19 for CGPA > 3.50
- Probation students: 6-9 credits, 2:1 old-to-new course ratio
- D is lowest passing grade, minimum CGPA 2.00 for degree
- Failed/dropped courses must be retaken first
- GED courses must be taken each trimester when offered
- 80% attendance required to sit for final exam
- First year students must complete 30 offered credits
Be encouraging but honest. Give practical advice. Format with clear headings and bullet points.
```

### Improving the Prompt

To get better responses, you can:

1. **Add few-shot examples**: Include 2-3 example responses in the system prompt to set the tone and format
2. **Add persona details**: "You are Professor Sarah Ahmed, a 20-year veteran advisor..."
3. **Add constraints**: "Do not recommend more than 6 courses per trimester..."
4. **Add output format**: JSON mode for structured data extraction
5. **Temperature tuning**: Use `temperature: 0.3` for more consistent, `temperature: 0.9` for more creative responses

### Example Few-Shot Prompting

```
Here are examples of good advisor responses:

Example 1 (Probation student):
"Hello [Name], I'm glad you're being proactive about your academic situation. 
Being on probation is a wake-up call, not a dead end. Here's your focused plan..."

Example 2 (High CGPA student):
"Congratulations on your excellent academic performance! Your CGPA of [X] 
puts you in the top tier. You have the flexibility to challenge yourself..."

Now respond to this student's profile: [student data]
```

## Cost Estimation

### OpenAI GPT-4 Pricing
- Input tokens: ~$0.03 per 1K tokens
- Output tokens: ~$0.06 per 1K tokens
- Average request: ~500 input + 400 output = ~$0.015-0.03 per student
- 1,000 students: ~$15-30
- 10,000 students: ~$150-300 per trimester

### Cost Optimization Strategies
1. **Use GPT-3.5-turbo** for standard responses (~10x cheaper)
2. **Cache responses** for similar student profiles
3. **Use the built-in simulator** for simple cases, LLM only for edge cases
4. **Implement a hybrid system**: Rule-based for 90% of responses, LLM for 10% complex cases
5. **Streaming**: Reduces perceived wait time without reducing actual cost

## Privacy Considerations

### Data Sensitivity
The prompt sent to the LLM API includes:
- Student name (can be anonymized)
- Department
- CGPA and credits
- Course history (completed, failed, dropped)

### Mitigation Strategies
1. **Anonymization**: Replace names with student IDs before sending to API
2. **Local LLM**: Run models like Llama 3 locally for complete privacy
3. **Backend proxy**: Only the backend server sees the API key
4. **Data minimization**: Only send essential fields, not full transcripts
5. **Consent**: Add a checkbox requiring student consent before AI processing
6. **Retention**: Don't store LLM prompts or responses on the LLM provider's servers

## Testing

### Test the Built-in Simulator
1. Open the web app
2. Click any "Quick Load" sample student
3. Click "Get Course Recommendations"
4. Verify the AI advisor panel appears with personalized advice after 2 seconds

### Test the OpenAI Integration
1. Enter your OpenAI API key in the form
2. Click any "Quick Load" sample student
3. Click "Get Course Recommendations"
4. Verify the AI advisor panel shows a GPT-4 generated response (usually more verbose and natural-sounding)

### Debug Tips
- Check browser console for API errors
- Verify API key has credits remaining
- Check CORS settings if using a backend proxy
- Use the OpenAI Playground to test prompts before deploying

## Future Enhancements

1. **Multi-turn conversations**: Allow students to ask follow-up questions
2. **Voice interface**: Text-to-speech for the AI advisor responses
3. **Multiple LLM providers**: Let users choose between OpenAI, Anthropic, Google
4. **Custom fine-tuning**: Fine-tune a model on UIU-specific advising data
5. **Sentiment analysis**: Detect student stress/anxiety from their input and adjust tone
6. **Multilingual support**: Bengali language responses for better accessibility
7. **Course difficulty prediction**: Use historical data to predict course difficulty scores
8. **Peer comparison**: "Students like you typically take..." recommendations

---

*Last updated: July 2026*
*For questions, contact the UIU Course Advisor development team.*
