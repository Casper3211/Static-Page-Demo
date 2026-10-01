# Static Page Demo

A beginner-friendly AI Club hosting example. All HTML, CSS, and JavaScript live in `index.html`. No dependencies, installation, or build step are required.

## Preview locally

Open `index.html` in your browser. Click **Say hello** to try the JavaScript interaction.

## Host the page

Connect this repository to a host that supports **static sites** and use these settings:

| Setting | Value |
| --- | --- |
| Branch | `main` |
| Project root | Repository root |
| Framework | None / Other |
| Build command | Leave empty |
| Publish / output directory | `.` (repository root) |
| Entry page | `index.html` |

Choose a **Static Site** service when your provider offers that option. This sample does not include a server process or require a start command. If your provider requires a running Web Service, use its static-site option instead or configure a separate static file server.

After deployment, open the host's provided URL and click the button to confirm the page works. Hosting configuration and domain setup are separate from this repository.

## Make it yours

Edit the heading and paragraphs in `index.html`, change the colors in its `<style>` block, then commit and push. Hosts with automatic deployment enabled will publish the new version.

The click counter lives only in your browser and resets when the page reloads. This demo has no backend or database.

## Next project: OpenRouter chatbot

[Open the Would You Rather workshop](ai-would-you-rather/README.md). Participants edit `ai-would-you-rather/index.html` directly on GitHub, commit their changes, and refresh the published page. The six-slide workshop uses no terminal, installation, or backend.

Each visitor can enter their own OpenRouter key on the live page. The key stays only in page memory and clears on refresh; never put a key in the GitHub code. Try demo works without a key. Existing static hosting settings stay the same.
