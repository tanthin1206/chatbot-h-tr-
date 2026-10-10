import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { GoogleGenAI } from '@google/genai';
import { ZodError } from 'zod';
import { buildChatPrompt, buildPrompt } from './prompt.js';
import { chatRequestSchema, checkSafety, normalizeChatResponse, normalizeReflection, redactPersonalData, requestSchema, responseJsonSchema } from './core.js';

const app = express();
const port = Number(process.env.PORT || 8787);
const apiKey = process.env.GEMINI_API_KEY?.trim();
const model = process.env.GEMINI_MODEL?.trim() || 'gemini-3.5-flash';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '24kb' }));
app.use('/api', rateLimit({ windowMs: 60_000, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false }));

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, geminiConfigured: Boolean(ai), model: ai ? model : null });
});

app.post('/api/analyze', async (request, response) => {
  try {
    const input = requestSchema.parse(request.body);
    const risk = checkSafety(input.rawText);
    if (risk.level === 'urgent') return response.json({ result: null, mode: 'offline', risk });
    if (!ai) return response.status(503).json({ error: 'gemini_not_configured', risk });

    const geminiResponse = await ai.models.generateContent({
      model,
      contents: buildPrompt({
        rawText: redactPersonalData(input.rawText),
        selectedEmotions: input.selectedEmotions,
        riskLevel: risk.level
      }),
      config: {
        maxOutputTokens: 4096,
        thinkingConfig: { thinkingLevel: 'MINIMAL' },
        responseMimeType: 'application/json',
        responseJsonSchema
      }
    });

    if (!geminiResponse.text) throw new Error('Gemini returned an empty response');
    const result = normalizeReflection(JSON.parse(geminiResponse.text), risk.level === 'needs_support');
    return response.json({ result, mode: 'gemini', risk });
  } catch (error) {
    if (error instanceof ZodError) return response.status(400).json({ error: 'invalid_request', details: error.issues });
    console.error('Analyze request failed:', error instanceof Error ? error.message : error);
    return response.status(502).json({ error: 'analysis_failed' });
  }
});

app.post('/api/chat', async (request, response) => {
  try {
    const input = chatRequestSchema.parse(request.body);
    const latestUserText = [...input.messages].reverse().find((message) => message.role === 'user')?.content || '';
    const risk = checkSafety(latestUserText);
    if (risk.level === 'urgent') return response.json({ response: null, mode: 'offline', risk });
    if (!ai) return response.status(503).json({ error: 'gemini_not_configured', risk });

    const messages = input.messages.map((message) => ({
      ...message,
      content: message.role === 'user' ? redactPersonalData(message.content) : message.content
    }));
    const geminiResponse = await ai.models.generateContent({
      model,
      contents: buildChatPrompt({ messages, supportMode: input.supportMode, riskLevel: risk.level }),
      config: {
        maxOutputTokens: 2048,
        thinkingConfig: { thinkingLevel: 'MINIMAL' },
        responseMimeType: 'application/json'
      }
    });
    if (!geminiResponse.text) throw new Error('Gemini returned an empty chat response');
    const chatResponse = normalizeChatResponse(parseGeminiJson(geminiResponse.text), risk.level);
    if (chatResponse.riskLevel === 'urgent') return response.json({ response: null, mode: 'gemini', risk: { level: 'urgent', reasons: ['model_detected_risk'] } });
    return response.json({ response: chatResponse, mode: 'gemini', risk: { ...risk, level: chatResponse.riskLevel } });
  } catch (error) {
    if (error instanceof ZodError) return response.status(400).json({ error: 'invalid_request', details: error.issues });
    console.error('Chat request failed:', error instanceof Error ? error.message : error);
    const upstreamStatus = typeof error === 'object' && error && 'status' in error
      ? Number(error.status)
      : NaN;
    const status = [400, 401, 403, 404, 429, 500, 503].includes(upstreamStatus) ? upstreamStatus : 502;
    return response.status(status).json({ error: 'chat_failed' });
  }
});

function parseGeminiJson(text) {
  const trimmed = text.trim();
  const withoutFence = trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  try {
    return JSON.parse(withoutFence);
  } catch {
    const start = withoutFence.indexOf('{');
    const end = withoutFence.lastIndexOf('}');
    if (start === -1 || end <= start) throw new Error('Gemini returned invalid chat JSON');
    return JSON.parse(withoutFence.slice(start, end + 1));
  }
}

app.use(express.static(path.join(rootDir, 'dist')));
app.get('*splat', (_request, response) => response.sendFile(path.join(rootDir, 'dist', 'index.html')));

// Vercel imports the Express app as a serverless function. The local server
// should only start when this file is run directly with `npm start`.
const isDirectRun = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  app.listen(port, () => {
    console.log(`Khoảng Thở API listening on http://localhost:${port}`);
    console.log(ai ? `Gemini enabled with ${model}` : 'Gemini disabled: set GEMINI_API_KEY to enable it');
  });
}

export default app;
