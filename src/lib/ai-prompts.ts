export type EmailInputData = {
  context: string;
  keyPoints: string;
  tone: string;
  purpose: string;
};

export function buildEmailPrompt(data: EmailInputData) {
  return `Write a workplace email.

Recipient / context: ${data.context}
Purpose of the email: ${data.purpose}
Desired tone: ${data.tone}

Key points to cover:
${data.keyPoints}

Requirements:
- Start with a "Subject:" line.
- Keep it concise, well structured and free of filler.
- Match the requested tone exactly.
- Do not invent facts, names, dates or commitments that were not provided.
- Return plain text only (no markdown code fences).`;
}

export function buildNotesPrompt(notes: string) {
  return `Analyse the following raw meeting notes / transcript and produce a structured summary.

Return markdown with exactly these four sections, in this order:

## Summary
A short paragraph (3-5 sentences).

## Action Items
Bulleted list. Include the owner in bold when a name is mentioned, otherwise write "Unassigned".

## Decisions Made
Bulleted list of decisions. Write "None recorded" if there are none.

## Deadlines & Dates
Bulleted list of every date or deadline mentioned, with what it relates to. Write "None mentioned" if there are none.

Do not invent information that is not in the notes.

RAW NOTES:
"""
${notes}
"""`;
}

export function buildPlanPrompt(data: { tasks: string; view: "daily" | "weekly" }) {
  return `Create a prioritised ${
    data.view === "daily"
      ? "one-day schedule broken into time blocks"
      : "one-week schedule broken into days"
  } for the tasks below.

Tasks (one per line, may include deadlines or priority notes):
${data.tasks}

Return ONLY a JSON object, no markdown fences, shaped like:
{
  "blocks": [
    { "slot": "${data.view === "daily" ? "09:00 - 10:30" : "Monday"}", "task": "short task name", "priority": "High | Medium | Low", "rationale": "one short sentence" }
  ],
  "summary": "2-3 sentences explaining the overall prioritisation order."
}

Rules:
- Respect any stated deadlines and priorities; urgent + important work goes first.
- Keep each rationale under 20 words.
- Include every task provided.`;
}
