import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Copy, Loader2, Wand2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { summarizeNotes } from "@/lib/ai.functions";
import { buildNotesPrompt } from "@/lib/ai-prompts";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into a summary, action items with owners, decisions and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Structured, editable meeting summaries you can copy as Markdown.",
      },
    ],
  }),
  component: NotesPage,
});

const SECTIONS = ["Summary", "Action Items", "Decisions Made", "Deadlines & Dates"] as const;

function splitSections(markdown: string) {
  const result: Record<string, string> = {};
  const parts = markdown.split(/^##\s+/m).filter(Boolean);
  for (const part of parts) {
    const [heading, ...rest] = part.split("\n");
    const key = SECTIONS.find((s) => heading.trim().toLowerCase().startsWith(s.split(" ")[0].toLowerCase()));
    if (key) result[key] = rest.join("\n").trim();
  }
  return result;
}

function NotesPage() {
  const run = useServerFn(summarizeNotes);
  const [notes, setNotes] = useState("");
  const [sections, setSections] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const hasOutput = Object.keys(sections).length > 0;

  async function summarize() {
    if (!notes.trim()) {
      toast.error("Paste your meeting notes first.");
      return;
    }
    setLoading(true);
    try {
      const markdown = await run({ data: { notes } });
      const parsed = splitSections(markdown);
      setSections(
        Object.keys(parsed).length ? parsed : { Summary: markdown },
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function copyMarkdown() {
    const md = SECTIONS.filter((s) => sections[s])
      .map((s) => `## ${s}\n\n${sections[s]}`)
      .join("\n\n");
    navigator.clipboard.writeText(md);
    toast.success("Copied as Markdown");
  }

  return (
    <div>
      <PageHeader
        title="Meeting Notes Summarizer"
        description="Paste a transcript or rough notes. Check every action item and date against the source before sharing."
      />
      <div className="space-y-4">
        <Card className="rounded-2xl shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="text-base">Raw notes</CardTitle>
            <CardDescription>Include names so owners can be attributed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes or transcript</Label>
              <Textarea
                id="notes"
                rows={12}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste your meeting notes here…"
              />
            </div>
            <Button onClick={summarize} disabled={loading} className="gap-2">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              {loading ? "Summarising…" : "Summarise notes"}
            </Button>
            <Collapsible>
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted/60 px-3 py-2 text-xs font-medium text-muted-foreground">
                AI prompt used
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                  {buildNotesPrompt(notes || "<your notes>")}
                </pre>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {SECTIONS.map((s) => (
              <Card key={s} className="rounded-2xl shadow-[var(--shadow-card)]">
                <CardHeader>
                  <CardTitle className="text-base">{s}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : hasOutput ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              {SECTIONS.map((s) => (
                <Card key={s} className="rounded-2xl shadow-[var(--shadow-card)]">
                  <CardHeader>
                    <CardTitle className="text-base">{s}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      rows={7}
                      value={sections[s] ?? ""}
                      onChange={(e) => setSections({ ...sections, [s]: e.target.value })}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button variant="secondary" className="gap-2" onClick={copyMarkdown}>
              <Copy className="h-4 w-4" /> Copy as Markdown
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}
