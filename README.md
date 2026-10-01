# UConn AI Club — Static Page Demo

A small website you can edit and publish using GitHub alone. No terminal, API key, or Cloudflare account is needed for the main workshop.

## Three pages to explore

| File | URL after your website's base URL | What works immediately |
| --- | --- | --- |
| `index.html` | `/` | Original Hello World page and click counter |
| `game/index.html` | `/game/` | Would You Rather game with built-in questions and voting |
| `ai-would-you-rather/index.html` | `/ai-would-you-rather/` | Advanced floating chatbot and full-page layout; fixed demo |

For a project site, the base URL includes the repository name, such as `https://YOUR-USERNAME.github.io/Static-Page-Demo/`. The original page links to both examples. Keep relative links so they work in forks and under repository subpaths.

## Publish on GitHub

1. Fork this repository into your account (or keep using your existing copy).
2. Settings → Pages → Source: **Deploy from a branch**.
3. Choose **main** and **/(root)** → Save.
4. Wait for publication → Visit site. Test Say hello, then Play the simple game.

## Edit on GitHub

Open `index.html` → pencil → change the heading → **Commit changes**. Wait for Pages to publish, then refresh the website.

For the game, open `game/index.html`. Change the pairs in `questions`, keeping quotes, commas, and brackets. Save a pair of your own, commit, and test it on the published page.

## Add another page (a static route)

Choose **Add file → Create new file**. Name it `my-page/index.html`. Paste a copy of the original HTML, change its heading, and commit. Add `<a href="my-page/">My new page</a>` to the root `index.html` and commit. The page is available at `YOUR-SITE-BASE/my-page/`. Inside the new page use `<a href="../">Home</a>` to return. A folder containing `index.html` is enough; no router library is required. Use lowercase names without spaces. Copying the root page's other relative links into a subfolder requires adjusting them with `../`.

## Or edit in a local folder

In GitHub Desktop: **File → Clone repository** → select your fork and local folder. Open that folder in an editor, save changes, then return to GitHub Desktop: review changes → enter summary → **Commit to main → Push origin**. Fetch/Pull first if you have also edited on GitHub. Wait for Pages and refresh. Double-click HTML to preview the layout; use the published page to test directory links.

For an existing folder: **File → Add local repository**; if it is not a repository, choose **create a repository here**. Put the website files inside that repository folder, commit, and **Publish repository**. Enable Pages as above.

## Optional: connect real AI later

The advanced example opens in demo mode until configured. Its **Full-page game** link uses `?view=bot`. Live AI requires a private backend; GitHub Pages cannot run a server or privately read GitHub Secrets when a visitor sends a message. Never put a key in HTML or generate public JavaScript from a secret.

Any suitable HTTPS backend can implement the example's request/response format. [The optional backend guide](ai-would-you-rather/README.md) includes one Cloudflare implementation and GitHub Secrets setup. The **Deploy AI bot** workflow is manual only, so ordinary static edits require no provider setup. This optional route shares its owner's API quota when connected.

[Download the six workshop slides](ai-would-you-rather/slides/Would-You-Rather-Workshop.pptx).
