import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MODEL = "google/gemini-3.7-flash";

async function callGateway(system: string, user: string): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured for this app.");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("Too many requests right now — please retry in a moment.");
    if (res.status === 402) throw new Error("AI credits are exhausted. Please add credits to continue.");
    if (res.status === 403) throw new Error("AI access is blocked for this workspace.");
    throw new Error(`AI request failed (${res.status}). ${text.slice(0, 200)}`);
  }

  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = json.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("The AI returned an empty response. Try again.");
  return content;
}

/* ---------------- Email generator ---------------- */

const EmailInput = z.object({
  context: z.string().min(1),
  keyPoints: z.string().min(1),
  tone: z.string().min(1),
  purpose: z.string().min(1),
});

export function buildEmailPrompt(data: z.infer<typeof EmailInput>) {
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

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) =>
    callGateway(
      "You are an expert business communication assistant. You write clear, professional emails.",
      buildEmailPrompt(data),
    ),
  );

/* ---------------- Meeting notes summarizer ---------------- */

const NotesInput = z.object({ notes: z.string().min(1) });

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

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => NotesInput.parse(input))
  .handler(async ({ data }) =>
    callGateway(
      "You are a meticulous meeting-notes analyst. You never invent information.",
      buildNotesPrompt(data.notes),
    ),
  );

/* ---------------- Task planner ---------------- */

const PlanInput = z.object({
  tasks: z.string().min(1),
  view: z.enum(["daily", "weekly"]),
});

export function buildPlanPrompt(data: z.infer<typeof PlanInput>) {
  return `Create a prioritised ${data.view === "daily" ? "one-day schedule broken into time blocks" : "one-week schedule broken into days"} for the tasks below.

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

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlanInput.parse(input))
  .handler(async ({ data }) => {
    const raw = await callGateway(
      "You are a productivity coach who builds realistic, prioritised schedules. You reply with valid JSON only.",
      buildPlanPrompt(data),
    );
    const cleaned = raw
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();
    try {
      const parsed = JSON.parse(cleaned) as {
        blocks?: Array<{ slot?: string; task?: string; priority?: string; rationale?: string }>;
        summary?: string;
      };
      return {
        blocks: (parsed.blocks ?? []).map((b) => ({
          slot: b.slot ?? "",
          task: b.task ?? "",
          priority: b.priority ?? "Medium",
          rationale: b.rationale ?? "",
        })),
        summary: parsed.summary ?? "",
      };
    } catch {
      throw new Error("Could not read the AI schedule. Please try again.");
    }
  });
