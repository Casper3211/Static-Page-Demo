> Start with the [simple GitHub workshop](../README.md). This page is optional. Cloudflare is one example backend provider, not a requirement for the static website. You may connect another HTTPS backend that accepts `{ "message": "..." }` and returns `{ "reply": "..." }`, handles CORS for your site, and keeps the OpenRouter key server-side.

# Optional advanced example: a private AI API

Build a silly question game with a floating chat button or a full-page message view. Participants use browser buttons or GitHub Desktop; no terminal commands.

## 1. Get the website

Open https://github.com/Casper3211/Static-Page-Demo and click **Fork → Create fork**. Your copy includes the HTML, API function, deployment workflow, and slides. If your existing site is in another repository, copy `ai-would-you-rather/` and `.github/workflows/deploy-bot.yml` into that repository, preserving these paths. In GitHub's browser editor, **Add file → Create new file** lets you create the workflow using that full path (the `.github` folder can be hidden in desktop file browsers).

If Pages is not already enabled, open **Settings → Pages → Deploy from a branch → main → /(root) → Save**. Wait for publication, then **Visit site**. Open `ai-would-you-rather/` after your site's base URL. Keep the actual hostname: `https://YOUR-USERNAME.github.io` (or your custom domain).

## 2. Get the accounts and save three secrets

1. Create/sign in to an OpenRouter account. Open https://openrouter.ai/settings/keys → **Create Key**. Name it `AI Club workshop` and copy the key privately.
2. Create/sign in to Cloudflare. Open **Workers & Pages** and complete any first-time Workers setup, including choosing a workers.dev subdomain when prompted. Copy your **Account ID** from the account dashboard.
3. In Cloudflare **My Profile → API Tokens → Create Token**, use **Edit Cloudflare Workers**. Scope the account resources to your account; this project uses workers.dev and needs no custom-domain zone. Create the token and copy it privately. This token authorizes deployment; it is different from the OpenRouter key.
4. In **your GitHub repository → Settings → Secrets and variables → Actions → New repository secret**, add these exact names:

| Name | Value |
| --- | --- |
| `OPENROUTER_API_KEY` | OpenRouter key |
| `CLOUDFLARE_API_TOKEN` | Cloudflare deployment token |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |

Use **repository secrets** for this provided workflow. If you choose environment secrets instead, the workflow job must name that environment. Forks do not inherit secrets. Never put keys in HTML, a committed `.env`, screenshots, or chat messages.

## 3. Deploy the API

1. Open `ai-would-you-rather/api/wrangler.jsonc` → pencil. Replace `https://YOUR-USERNAME.github.io` with your published site's **origin**: scheme and hostname only, no repository path or trailing slash. Commit changes. If an unrelated Worker already uses `ai-club-game` in your account, change `name` to a unique name before deploying.
2. Open **Actions**. If a fork asks, enable workflows. Choose **Deploy AI bot → Run workflow → main → Run workflow**. Wait for a green result. After later API edits, run this workflow again manually. It never runs automatically for the simple workshop.
3. In Cloudflare **Workers & Pages → ai-club-game**, copy its `https://…workers.dev` URL. GitHub Actions deploys the code and copies the OpenRouter secret into the Worker's private environment. No secret is copied into Pages.
4. Open `ai-would-you-rather/index.html` → pencil. Find `const API_URL` and replace its placeholder with your Worker URL **plus `/api/chat`**, keeping the quotes. Commit changes. Wait for the Pages publication to finish.

## 4. Play and change it

Open the published game → **Give me a dilemma** → type `superpowers` → **Send**. Choose A or B and defend your answer. **Full-page game** opens the same bot with `?view=bot`. Both layouts call the same Worker. **Try demo** is a clearly labeled fixed example that works before setup and sends no AI request; **Use AI** returns to live mode.

Change the visible title in `ai-would-you-rather/index.html`. To change the AI's behavior, edit the text inside `INSTRUCTIONS` in `ai-would-you-rather/api/worker.mjs`; keep its backticks. Try “Only use food themes. Make both choices ridiculous.” Commit, wait for **Deploy AI bot**, then ask the same theme again. Each message is a fresh question; conversation history is not sent.

## Choose your editing route

- **GitHub browser:** open the file → pencil → edit → **Commit changes**.
- **Local folder, no terminal:** install/sign in to GitHub Desktop → **File → Clone repository** → choose your fork and a local folder. Open the folder in your editor and save changes. Return to GitHub Desktop → review Changes → enter a summary → **Commit to main → Push origin**. Wait for deployment, then refresh your published page. Use **Fetch origin / Pull origin** before editing if you also changed files on GitHub.
- **Starting with an existing local website:** GitHub Desktop → **File → Add local repository**. If the folder is not a repository, choose **create a repository here**, then add the website and demo files to that repository folder. Review and commit, then **Publish repository** (public for the usual free Pages flow). Enable Pages and add secrets as above. Ensure the hidden `.github/workflows/` folder is included. Never copy keys into the folder.

Double-clicking HTML can preview the layout and fixed demo. Test live AI on the published HTTPS site; a local file's origin is not allowed by the Worker.

## How the key stays private

`GitHub Secret → GitHub Actions → private Worker environment`

`GitHub Pages HTML → Worker /api/chat → OpenRouter → reply`

GitHub Pages serves public files; it cannot read GitHub Secrets at request time. Cloudflare provides that private runtime. The Worker fixes the model to `nvidia/nemotron-3-ultra-550b-a55b:free`, limits input and output size, and returns friendly errors instead of raw provider responses. It does not log prompts or keys. CORS restricts browser origins, but is not authentication: other clients can call a public endpoint. This is a small classroom demo using the owner's shared quota, not a protected production service. Revoke the workshop key or remove the Worker after use; add authentication and rate limiting before a broad public launch. Use fictional themes; provider data policies and free-model availability apply.

## If something does not work

- **Check setup** fails in Actions: add all three repository secrets, then rerun.
- Deployment token rejected: check token account scope and the Account ID.
- Can't reach API: check `API_URL` ends in `/api/chat`, the Worker deployed, and `ALLOWED_ORIGIN` matches the exact Pages hostname.
- Free model busy/quota exhausted: wait or use **Try demo**. There is no paid fallback.
- Old content: wait for the relevant deployment, then refresh the published site.
- API key/model error: check the OpenRouter key and model access, update the secret and rerun **Deploy AI bot**.

The six slides are in [slides/Would-You-Rather-Workshop.pptx](slides/Would-You-Rather-Workshop.pptx). Plan roughly 20 minutes with account sign-ins and initial Pages publication prepared; new-account verification or provider deployment queues can take longer.

Implementation references: [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [Cloudflare's deployment action and secret support](https://github.com/cloudflare/wrangler-action), [Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/), [OpenRouter model](https://openrouter.ai/nvidia/nemotron-3-ultra-550b-a55b:free?view=api).
