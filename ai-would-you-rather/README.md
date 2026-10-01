# Would You Rather? — GitHub browser workshop

One static HTML file. Edit on GitHub, commit, then play on the published website.

[Open the slides](slides/Would-You-Rather-Workshop.pptx)

## 1. Your website

If your copy is already published, keep using it. Otherwise:

1. Open [Static-Page-Demo](https://github.com/Casper3211/Static-Page-Demo) and click **Fork** to create a copy in your own account.
2. In your fork, open **Settings > Pages**.
3. Select **Deploy from a branch**, **main**, and **/(root)**. Click **Save**.
4. Wait for publication, click **Visit site**, and open the chatbot workshop from the homepage.

The default game address is `https://YOUR-USERNAME.github.io/Static-Page-Demo/ai-would-you-rather/`. Use the actual Visit site link if your repository name or domain is different. Prepare publication before the meeting because builds can take several minutes.

## 2. Edit the HTML on GitHub

1. In your repository, open **ai-would-you-rather/index.html**.
2. Click the **pencil icon**.
3. Find **EDIT 2** and change the heading text, keeping its HTML tags.
4. Click **Commit changes**, enter a short description, and commit directly to `main` in your own copy.
5. Wait for the publish/build status to succeed, then refresh the live site.

**EDIT 1** changes the accent color. **EDIT 3** changes the bot instructions. The app has no install step, environment file, or backend.

## 3. Connect OpenRouter on the live page

1. Create your own key at [OpenRouter API keys](https://openrouter.ai/settings/keys).
2. On the **published game**, click **Give me a dilemma**.
3. Paste your key into **Your OpenRouter key** and click **Use my key**.
4. Type a theme such as `superpowers`, then click **Send**.

Paste the key only into the live page's password field, never into the GitHub file. The page keeps it in a JavaScript variable and sends it only to OpenRouter. It writes no key to browser storage. **Refresh, leaving the page, Clear key, or Try demo clears it.** Only use your own key on a page whose code you trust: scripts running on that page can access the key while it is in use.

The model is `nvidia/nemotron-3-ultra-550b-a55b:free`. Each visitor uses their own key and quota. Use fictional or non-sensitive themes.

## 4. Make it fun

Back in GitHub, edit the same HTML file and find **EDIT 3**. Change the text inside `INSTRUCTIONS`, keeping the backticks and semicolon. Try:

- Only use food themes.
- Make both choices ridiculous.
- Keep each choice one sentence.

Commit, wait for publication, and refresh the live page. Paste your key again and try the same theme. Compare the questions and let the group vote.

## How it works

The floating widget, styling, and JavaScript all live in `index.html`. Its `fetch(API_URL, ...)` calls OpenRouter directly with a POST request. The Authorization header uses the visitor's runtime key. The JSON body contains `MODEL`, the system instructions, and the user's theme. The answer comes from `choices[0].message.content`.

The request uses the selected free model only. Every question starts a fresh conversation. The full-page layout is available through the **Full-page game** link (`?view=bot`). To add the widget to another single-file website, copy the marked BOT CSS block into the head, followed by BOT HTML and BOT SCRIPT before the closing body tag.

## If something fails

- **No key:** click **Try demo** for a labeled fixed example. Demo output does not change when you edit the prompt.
- **401:** paste a valid OpenRouter key.
- **429:** wait, inspect your quota, or use the demo.
- **Old website:** check your fork, published URL, and the latest Pages build under Actions.
- **After refresh:** paste your key again; it is intentionally not saved.
