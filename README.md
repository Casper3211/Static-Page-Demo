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

[Open the Sidequest workshop guide](ai-sidequest/README.md) or try `ai-sidequest/index.html` in a browser. The new section includes a six-slide, 20-minute workshop, a floating chat widget, a full-page bot layout, and a dependency-free Node.js backend using OpenRouter's NVIDIA Nemotron 3 Ultra free model.

The public static preview returns a clearly labeled fixed example. For real AI responses, run the files in `ai-sidequest/project` locally and put your own key in a private `.env` file. Existing static hosting settings stay the same. A public live AI service would require a separate backend deployment.
