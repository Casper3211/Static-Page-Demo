# UConn AI Club static website

Three static pages, no dependencies or API keys:

- `index.html` — homepage and click counter.
- `game/index.html` — Would You Rather game.
- `ai-would-you-rather/index.html` — floating chat demo; `?view=bot` opens the full-page view. Replies are built-in, not AI-generated.

The homepage links to both examples, and both link back home. Their URLs are your site base URL followed by `game/` or `ai-would-you-rather/`.

The existing GitHub **pages build and deployment** workflow publishes updates automatically. Keep **Settings → Pages → Deploy from a branch → main → /(root)**. GitHub manages this publishing workflow; no extra workflow file or credentials are needed.

To add a route, create `my-page/index.html` and link to `my-page/` from the homepage. Use `../` to link home from that page. Keep relative links so the site works under a GitHub Pages repository path.

