# UConn AI Club website

The homepage has two direct AI chat links:

- `chat/` — full-page AI chat.
- `ai-would-you-rather/` — floating AI chat, opened automatically.

Both show the OpenRouter key field at the top. Paste your own key, click **Use / update key**, and send a theme. **Clear key / demo** or refreshing clears the key from page memory. Navigating to the other route also starts a new session. Never commit a key into the source.

The original homepage and `game/` remain available. The game and built-in chat replies need no key.

## Files

- `index.html` — homepage and direct chat links.
- `game/index.html` — built-in Would You Rather game.
- `chat/index.html` and `ai-would-you-rather/index.html` — the two chat layouts.
- `assets/chat.js` — shared chat behavior and OpenRouter request.
- `assets/chat.css` — shared chat styling.
- `assets/markdown.js` — lightweight Markdown rendering: bold, emphasis, lists, headings, links, quotes and code. Raw HTML stays literal text. This is a common Markdown subset, not full CommonMark.

The existing GitHub **pages build and deployment** workflow publishes pushes. Keep **Settings → Pages → Deploy from a branch → main → /(root)**.

To add a route, create `my-page/index.html` and link to `my-page/` from the homepage. Use `../` to return home from a child page. Keep relative links for GitHub Pages repository paths.
