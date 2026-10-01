# Would You Rather?

A small AI game: pick a theme, get two funny choices, and debate your answer.

[Workshop slides](slides/Would-You-Rather-Workshop.pptx)

## Setup

Have Node.js 22 or newer installed, sign in to OpenRouter, and download this repository before the workshop.

1. Open `ai-would-you-rather/project` in your editor.
2. Create a key at [OpenRouter API keys](https://openrouter.ai/settings/keys).
3. Copy `.env.example` to `.env` in that folder.
4. Replace `paste_your_key_here` with your key. Keep `DEMO_MODE=false`.
5. In the project terminal, run:

```sh
node --env-file=.env server.mjs
```

6. Open **http://127.0.0.1:4320**, click **Give me a dilemma**, and send a theme.

The model is already set to `nvidia/nemotron-3-ultra-550b-a55b:free`. The server keeps your key private and calls OpenRouter. The browser calls your server at `/api/chat`. Keep the terminal open. Stop with Ctrl+C.

## Add the game to your website

Work on a copy of your single-file website.

1. In the supplied `project/index.html`, copy the **BOT CSS** block into your page's `<head>`.
2. Copy **BOT HTML**, then **BOT SCRIPT**, before `</body>`.
3. Save the combined page as `project/index.html` and refresh the browser.

For a full-page game, open **http://127.0.0.1:4320/bot**. The example server serves its HTML routes only. Multi-file websites need explicit static-file serving for images, stylesheets and scripts.

## Make it fun

Edit `SYSTEM_PROMPT` in `server.mjs`. Try one change:

- Only food themes.
- Both choices must be ridiculous.
- Each choice must fit in one sentence.

Save, stop the server with Ctrl+C, and run the command again. Send the same theme and compare. You can also rename the button in `index.html`, then refresh. Each request starts fresh.

## If it does not work

- **401:** check the key and restart.
- **429:** wait or check your OpenRouter quota.
- **Port busy:** stop the earlier server or change `PORT` in `.env`.
- **Offline practice:** set `DEMO_MODE=true` and restart. The reply is a labeled fixed example.

Keep `.env` private. Use fictional or non-sensitive inputs with this free endpoint.

The public preview at `ai-would-you-rather/index.html` sends no AI request. Real AI responses require the local backend and your own key. Public live hosting needs a backend deployment; GitHub Pages alone serves only static files. This example server runs only on your own computer.
