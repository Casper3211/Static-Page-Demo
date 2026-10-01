# Sidequest Bot: a 20-minute AI Club project

Add a floating AI chatbot to a single-file website using OpenRouter. Change its job to make a study coach, a creative activity planner, or a guide to your own site.

- **Slides:** [Six-slide workshop](slides/OpenRouter-20-Minute-Workshop.pptx), with timed speaker notes and source links.
- **Local project:** `project/index.html`, `project/server.mjs`, `.env.example`, and `.gitignore`.
- **GitHub materials:** [Static-Page-Demo / ai-sidequest](https://github.com/Casper3211/Static-Page-Demo/tree/main/ai-sidequest).
- **Model:** `nvidia/nemotron-3-ultra-550b-a55b:free`.

The 20 minutes include a short demonstration and hands-on changes. **Install Node.js LTS (22 or newer), sign in to OpenRouter, and download the files before the meeting.** No npm packages, framework, database, or model training are needed. If installation or sign-in happens during class, allow extra time.

## Before class

1. Install [Node.js LTS](https://nodejs.org/en/download) and an editor such as VS Code. Reopen the terminal after installation.
2. Run `node --version`. It must report version 22 or newer.
3. Sign in at [OpenRouter](https://openrouter.ai/). Use fictional or non-sensitive inputs: the selected free endpoint discloses provider logging.
4. On [the repository](https://github.com/Casper3211/Static-Page-Demo), choose **Code > Download ZIP** and extract it. Open `ai-sidequest/project` in your editor.
5. Have the presenter try one real request before class. Free-model availability and quotas can change. Keep demo mode ready.

## Slide 1 — The project, 0:00–2:00

Click **Ask Sidequest** and try: “I have 15 minutes, $0, and feel creative. Give me one activity indoors.”

The browser sends your message to your server at `/api/chat`. The server adds its private API key and sends it to OpenRouter. OpenRouter routes it to the selected NVIDIA model. The server extracts the text and sends `{reply}` back to the browser.

An **API route** is a URL with code behind it that receives a request and returns a response. Your browser page and this route have different jobs. The interface fits inside `index.html`; a private owner key needs server code.

The screenshot and public static preview use a fixed example clearly labeled as demo output. They do not demonstrate real AI inference.

## Slide 2 — The key and files, 2:00–5:00

1. Visit [OpenRouter API keys](https://openrouter.ai/settings/keys).
2. Choose **Create Key**, give it a name such as `AI Club workshop`, and copy it privately.
3. In the editor, copy `.env.example` to a new file named **`.env`** in the same `project` folder. Ensure the name is not `.env.txt`.
4. Replace the placeholder after `OPENROUTER_API_KEY=` with your own key. Save:

   ```dotenv
   OPENROUTER_API_KEY=paste_your_actual_key_here
   DEMO_MODE=false
   PORT=4320
   ```

5. Keep `.env` private. The supplied `.gitignore` excludes it from Git, and the example server does not serve it.

The exact model ID, including `:free`, is already in `server.mjs`. This example does not silently switch to paid models. The selected endpoint currently lists free token pricing, with availability and request limits. Do not share a single projected API key with the class.

## Slide 3 — The first real reply, 5:00–9:00

1. Select **Terminal > New Terminal** in the editor. Check that you are inside `ai-sidequest/project`.
2. Run:

   ```sh
   node --env-file=.env server.mjs
   ```

3. Keep the terminal open and visit **http://127.0.0.1:4320**.
4. Click **Ask Sidequest**. Check that the badge says **LIVE MODE**.
5. Type the sample question and click **Send**. Wait for the reply.
6. Open `server.mjs` and find `MODEL`, `SYSTEM_PROMPT`, and `fetch(ENDPOINT, ...)`.

The server sends a POST request to `https://openrouter.ai/api/v1/chat/completions`. `Authorization: Bearer ...` carries the key. The JSON body specifies the model and messages. A `system` message describes the bot's job; a `user` message contains the current question. The server reads `data.choices[0].message.content` and returns `{reply, demo}`.

`max_tokens: 2048` bounds the output token budget, including any reasoning tokens. The prompt asks for an answer under 100 words. Some reasoning requests may still need more budget or time.

No install command is needed after Node.js is installed. Use **Ctrl+C** to stop. Restart after changing `server.mjs` or `.env`.

## Slide 4 — Your existing website, 9:00–13:00

Use a copy of your earlier **single-file** website. Keep your original safe in your project folder.

1. In the supplied `project/index.html`, find the three marked sections.
2. Copy the complete **BOT CSS** `<style>` block into your existing page's `<head>`.
3. Copy **BOT HTML**, then **BOT SCRIPT**, immediately before `</body>`.
4. Save the combined page as `project/index.html`. The backend will serve it automatically.
5. Refresh **http://127.0.0.1:4320**. Click the floating button and send a message again.

`position: fixed` plus `bottom` and `right` anchors the widget to the browser corner. The form submits this request:

```js
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message })
});
const data = await response.json();
// Display data.reply as text. The supplied script also checks errors.
```

All the client HTML, CSS, and JavaScript stay in one file. There is no key in it. The current page and API share one origin, so no cross-origin setup is required.

**Standalone option:** open **http://127.0.0.1:4320/bot**. The same file displays the bot as a full page. `/bot` serves a page; `/api/chat` returns data. Typing `/api/chat` in the address bar sends GET, so its 405 response is expected; the form sends POST.

The teaching server deliberately serves only its HTML routes. For a site with separate stylesheets, scripts or images, a later extension must serve an explicit `public` directory or use the host's static-file handling. Do not serve the whole project directory, which contains `.env`.

Each request starts a new conversation. The visible history stays only in the current browser tab and is not resent to the model. Refreshing clears it.

## Slide 5 — A five-minute challenge, 13:00–18:00

One partner edits and the other tests. Swap roles halfway through.

1. Choose a role: Sidequest Bot, study coach, or website guide.
2. Predict what a better answer would look like.
3. Change `SYSTEM_PROMPT` at the top of `server.mjs`. Include a role, an answer format, and one boundary. For example:

   ```text
   You are a friendly study coach.
   Give one 15-minute plan with three short steps and one self-check question.
   Ask which topic if it is missing. Do not invent assignment requirements.
   ```

4. Save, press Ctrl+C in the terminal, and run the same startup command again.
5. In `index.html`, edit the title, button label, and welcome message to match your bot. Refresh the browser.
6. Try the same question before and after your change. Then try a vague question.
7. Explain one observed difference. Prompt instructions guide behavior but do not guarantee correctness.

A website bot knows only the facts you explicitly supply in its prompt. It does not automatically read your site or browse the internet. In demo mode, the response stays fixed regardless of prompt edits. Evaluate prompt changes in live mode.

## Slide 6 — Check and share, 18:00–20:00

Confirm that the button opens, Send produces a reply, and a vague prompt gives a useful answer or clarification. Show one answer and explain one edit.

| Symptom | What to do |
| --- | --- |
| `node` is not recognized | Install Node.js LTS and reopen the terminal. |
| `.env` cannot be found | Check the terminal folder and exact filename. |
| Port 4320 is busy | Stop the earlier server or change `PORT` in `.env`, then use that port in the URL. |
| Missing key / 401 | Correct the key in `.env` and restart. |
| 402 | Check OpenRouter balance and per-key limits. |
| 403 | Check model access and OpenRouter privacy settings. |
| 429 | Wait or inspect account quota. Free providers can be busy. Avoid repeated clicks. |
| Timeout / no text | Try later, use a shorter question, or inspect the model's output budget. |
| Chat stays in demo mode | Change `DEMO_MODE=false` and restart. |
| Opening the HTML directly does not work | Open the local server URL instead. The real app needs its backend. |

**Offline fallback:** change `DEMO_MODE=true` in `.env`, restart the server, and refresh. No key or network call is required. The reply and badge explicitly identify the fixed demo response.

## GitHub preview and later deployment

`ai-sidequest/index.html` is a public static preview. Open it directly or serve it with the existing static host. It makes no AI API requests and contains no key. `ai-sidequest/project/index.html` is the live app frontend used with `server.mjs`.

GitHub Pages serves static HTML/CSS/JavaScript and cannot execute this Node backend. To make the AI bot public later, choose a backend or serverless host, serve the frontend and `/api/chat` on the same origin, put the key in the host's secret environment variables, and add user authentication and per-user request limits. This workshop server binds only to `127.0.0.1` and is a local teaching example, not a public deployment configuration. Hosting is outside the 20-minute activity.

## Official references

- [Selected NVIDIA free model and its data-use disclosure](https://openrouter.ai/nvidia/nemotron-3-ultra-550b-a55b:free?view=api)
- [OpenRouter API quickstart](https://openrouter.ai/docs/quickstart)
- [Request limits](https://openrouter.ai/docs/api_reference/limits)
- [Error handling](https://openrouter.ai/docs/api-reference/errors)
- [Node.js installation](https://nodejs.org/en/download)
- [GitHub Pages hosting model](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

Sources checked September 30, 2026. Model availability, interface labels, and free quotas can change.
