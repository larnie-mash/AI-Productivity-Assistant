const MODEL = "google/gemini-3.7-flash";

export async function callGateway(system: string, user: string): Promise<string> {
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
    if (res.status === 429)
      throw new Error("Too many requests right now — please retry in a moment.");
    if (res.status === 402)
      throw new Error("AI credits are exhausted. Please add credits to continue.");
    if (res.status === 403) throw new Error("AI access is blocked for this workspace.");
    throw new Error(`AI request failed (${res.status}). ${text.slice(0, 200)}`);
  }

  const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = json.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("The AI returned an empty response. Try again.");
  return content;
}

export function parsePlan(raw: string) {
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
}
