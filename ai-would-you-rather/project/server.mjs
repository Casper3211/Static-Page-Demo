// Node.js 22+; no npm packages. Run: node --env-file=.env server.mjs
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// CHANGE 1: Give your bot a role, an output format, and a boundary.
export const SYSTEM_PROMPT = `You create playful would-you-rather questions.
Use the user's theme. If no theme is given, choose a light everyday theme.
Write exactly two funny, balanced choices labeled A and B.
End with: Which would you pick, and why?
Keep the whole reply under 70 words. Keep it friendly and suitable for a club meeting.
Avoid dangerous dares, personal attacks, and private information.`;

export const MODEL = 'nvidia/nemotron-3-ultra-550b-a55b:free';
const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const ROOT = new URL('./', import.meta.url);
const json = (res, status, data) => {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(data));
};

export function createApp({ apiKey = process.env.OPENROUTER_API_KEY,
  demo = process.env.DEMO_MODE === 'true', fetchImpl = fetch } = {}) {
  let busy = false;
  return http.createServer(async (req, res) => {
    try {
      // This teaching server is local only. Accept only local Host and same-origin requests.
      const host = req.headers.host || '';
      if (!/^(127\.0\.0\.1|localhost):\d+$/.test(host)) return json(res, 403, { error: 'Use the local workshop URL.' });
      if (req.headers.origin && req.headers.origin !== `http://${host}`) return json(res, 403, { error: 'Open the page from this server.' });
      const pathname = new URL(req.url, `http://${host}`).pathname;
      if (req.method === 'GET' && ['/', '/bot'].includes(pathname)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
        return res.end(await readFile(new URL('index.html', ROOT)));
      }
      if (req.method === 'GET' && pathname === '/api/config') return json(res, 200, { demo, model: MODEL });
      if (req.method === 'GET' && pathname === '/favicon.ico') { res.writeHead(204); return res.end(); }
      if (pathname !== '/api/chat') return json(res, 404, { error: 'Route not found.' });
      if (req.method !== 'POST') return json(res, 405, { error: 'Use POST /api/chat.' });
      if (!req.headers['content-type']?.startsWith('application/json')) return json(res, 415, { error: 'Send JSON.' });
      let body = '';
      for await (const chunk of req) {
        body += chunk;
        if (Buffer.byteLength(body) > 8192) return json(res, 413, { error: 'Request too large.' });
      }
      let input;
      try { input = JSON.parse(body); } catch { return json(res, 400, { error: 'Invalid JSON.' }); }
      const message = input?.message;
      if (typeof message !== 'string' || !message.trim() || message.length > 1000) return json(res, 400, { error: 'Write a message of 1–1000 characters.' });
      if (demo) return json(res, 200, { demo: true, reply: 'DEMO RESPONSE (canned, not AI)\nWould you rather…\nA. Teleport anywhere, but arrive in pajamas?\nB. Fly anywhere, but only at walking speed?\n\nWhich would you pick, and why?\n\nLive mode generates a question for your theme.' });
      if (!apiKey || apiKey === 'paste_your_key_here') return json(res, 503, { error: 'Add your key to .env, then restart the server. Or use DEMO_MODE=true.' });
      if (busy) return json(res, 429, { error: 'One request is already running. Wait for it to finish.' });
      busy = true;
      try {
        // The browser calls OUR route. Only the server sends the secret to OpenRouter.
        const upstream = await fetchImpl(ENDPOINT, {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: MODEL,
            messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: message.trim() }],
            max_tokens: 2048, stream: false }),
          signal: AbortSignal.timeout(60000)
        });
        const data = await upstream.json();
        if (!upstream.ok || data.error) {
          const code = upstream.ok ? Number(data.error?.code) || 502 : upstream.status;
          const advice = code === 401 ? 'Check your API key in .env and restart.'
            : code === 402 ? 'Check your OpenRouter account balance and key limits.'
            : code === 429 ? 'Free model is busy or quota is exhausted. Wait, check your limits, or use demo mode.'
            : code === 403 ? 'Check the model access and privacy settings in OpenRouter.'
            : 'OpenRouter is unavailable. Try later or use demo mode.';
          return json(res, code >= 400 && code <= 599 ? code : 502, { error: advice });
        }
        const reply = data.choices?.[0]?.message?.content;
        if (typeof reply !== 'string' || !reply.trim()) return json(res, 502, { error: 'No text answer returned. Try a shorter request, or check the model output limit.' });
        return json(res, 200, { reply, demo: false });
      } catch (error) {
        return json(res, 502, { error: error.name === 'TimeoutError' ? 'The model took over 60 seconds. Try later or use demo mode.' : 'Could not reach OpenRouter. Check your connection or use demo mode.' });
      } finally { busy = false; }
    } catch {
      if (!res.headersSent) json(res, 500, { error: 'Local server error. Restart and try again.' });
      else res.end();
    }
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const port = Number(process.env.PORT || 4320);
  const server = createApp();
  server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? `Port ${port} is busy. Stop the other server, or change PORT in .env.` : error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`Would You Rather: http://127.0.0.1:${port}\nMode: ${process.env.DEMO_MODE === 'true' ? 'DEMO (no AI calls)' : 'LIVE (OpenRouter)'}\nKeep this terminal open. Ctrl+C stops the server.`));
}
