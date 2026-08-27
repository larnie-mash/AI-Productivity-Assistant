# AI Workplace Hub

Build a modern, responsive web application called AI Workplace Productivity Assistant a single dashboard-style platform that helps professionals automate everyday workplace tasks using AI.

Overall structure:

A persistent sidebar with navigation icons/labels for: Dashboard (home), Email Generator, Meeting Notes Summarizer, Task Planner, and Settings.

A top header bar with the app name/logo and a "Responsible AI" info icon that opens a short disclaimer modal.

A dashboard/home view showing quick-access cards to each of the three tools plus a short usage tip for each.

Fully responsive: sidebar collapses into a bottom nav or hamburger menu on mobile.

Design style: Clean, modern SaaS aesthetic generous white space, a single accent color (soft blue or teal), rounded cards, subtle shadows, sans-serif typography (Inter or similar). Should feel like Notion or Linear, not like a generic AI chatbot wrapper.

Feature 1 — Smart Email Generator

Input fields: recipient/context, key points (textarea), tone selector (Formal / Friendly / Persuasive), purpose (Request / Follow-up / Apology / Announcement / Other).

Output: a generated email in an editable text box with a "Copy" and "Regenerate" button.

Show a small "AI Prompt Used" collapsible section so the underlying prompt is visible (good for demonstrating prompt engineering).

Feature 2 — Meeting Notes Summarizer

Input: large textarea (or paste) for raw meeting notes/transcript.

Output: three clearly separated sections  Summary, Action Items (with owner if mentioned), Decisions Made, and Deadlines/Dates mentioned.

Editable output, with a "Copy as Markdown" button.

Feature 3 — AI Task Planner / Scheduler

Input: a list of tasks (one per line) with optional deadlines/priority notes, plus a toggle for Daily vs Weekly view.

Output: a prioritized schedule broken into time blocks or days, with a short rationale for the prioritization order.

Display as an editable list/table, not just plain text.

Cross-cutting requirements:

Every AI output must be editable before the user copies/uses it.

A persistent, non-intrusive Responsible AI disclaimer (footer or modal): AI-generated content may be inaccurate and should be reviewed before use; no confidential/personal data should be entered.

Loading states while AI responses generate.

Consistent card-based layout across all three feature pages.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://mind-work-suite.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/79526a06-1dcb-4a76-86b2-33fabedc46a7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
