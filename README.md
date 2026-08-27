AI Workplace Productivity Assistant

An AI-powered productivity dashboard that helps professionals automate common workplace tasks — drafting emails, summarizing meetings, planning schedules, researching topics, and getting quick help from an AI assistant — all in one integrated platform.

Live Demo

🔗 https://mind-work-suite.lovable.app

Project Overview

Built as part of the CAPACITI coursework project, this application demonstrates practical AI implementation, structured prompt engineering, and responsible AI usage within a modern, professional dashboard UI. Rather than three separate tools, this is a single platform where each feature is a tab/section sharing the same design system and navigation.

Features
Feature	Description
Smart Email Generator	Generates professional emails in Formal, Friendly, or Persuasive tones based on user-provided context and key points.
Meeting Notes Summarizer	Converts raw meeting notes into a structured summary, decisions list, action items (with owners), and deadlines.
AI Task Planner / Scheduler	Turns a raw task list into a prioritized daily or weekly schedule with a stated rationale for the ordering.

All AI outputs are editable before use, and the app includes a persistent Responsible AI disclaimer.

Tools Used
Lovable AI — application scaffolding and UI generation
[Anthropic Claude API / OpenAI API] — underlying AI model for feature responses (update with whichever you actually use)
React (via Lovable) — frontend framework
GitHub — version control and repository hosting
Prompt Engineering

Each feature is powered by a dedicated, structured system prompt (role + task + inputs + rules + output format) designed to keep outputs consistent and reduce hallucination. Full prompts are documented in /prompts (or link to your prompts file).

Responsible AI Practices
Every AI-generated output is clearly editable, not auto-submitted or auto-sent.
A visible disclaimer reminds users that AI-generated content may contain inaccuracies and should be reviewed before use.
Users are warned not to enter confidential or personal data into any of the tools.
Prompts constrain outputs to only what's explicitly stated in the user's input, reducing fabricated names, dates, or facts.
Setup Instructions
Clone the repository:
   git clone https://github.com/larnie-mash/AI-Productivity-Assistant.git
   cd AI-Productivity-Assistant
Install dependencies:
   npm install
Add your API key to a .env file (if calling the AI API directly rather than via Lovable's built-in integration):
   VITE_AI_API_KEY=your_api_key_here
Run the development server:
   npm run dev

This project was built using Lovable. You can also continue developing it directly in the Lovable editor, where changes sync automatically back to this repository.

Team Members
Rhulani "Lani" Mashele
License

This project was built for educational purposes as part of the CAPACITI program.
