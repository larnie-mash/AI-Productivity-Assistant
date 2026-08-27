import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Copy, RefreshCw, Loader2, ChevronDown, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { generateEmail } from "@/lib/ai.functions";
import { buildEmailPrompt } from "@/lib/ai-prompts";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      {
        name: "description",
        content:
          "Generate professional workplace emails from key points, with tone and purpose controls.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Turn bullet points into a polished, editable email draft.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [context, setContext] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState("Formal");
  const [purpose, setPurpose] = useState("Request");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const prompt = buildEmailPrompt({ context, keyPoints, tone, purpose });

  async function generate() {
    if (!context.trim() || !keyPoints.trim()) {
      toast.error("Add the recipient context and your key points first.");
      return;
    }
    setLoading(true);
    try {
      const result = await run({ data: { context, keyPoints, tone, purpose } });
      setOutput(result);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Smart Email Generator"
        description="Describe the recipient and your key points. Review and edit the draft before sending."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="text-base">Email brief</CardTitle>
            <CardDescription>Keep it factual — the AI will not invent details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="context">Recipient / context</Label>
              <Input
                id="context"
                placeholder="Priya, our supplier account manager"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Key points</Label>
              <Textarea
                id="points"
                rows={7}
                placeholder={"- Delivery was two days late\n- Need a revised schedule by Friday"}
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Formal", "Friendly", "Persuasive"].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Purpose</Label>
                <Select value={purpose} onValueChange={setPurpose}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Request", "Follow-up", "Apology", "Announcement", "Other"].map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={generate} disabled={loading} className="w-full gap-2">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              {loading ? "Writing…" : "Generate email"}
            </Button>

            <Collapsible>
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted/60 px-3 py-2 text-xs font-medium text-muted-foreground">
                AI prompt used
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                  {prompt}
                </pre>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="text-base">Draft</CardTitle>
            <CardDescription>Fully editable before you copy it.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            ) : (
              <Textarea
                rows={18}
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                placeholder="Your generated email will appear here."
              />
            )}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                className="gap-2"
                disabled={!output}
                onClick={() => {
                  navigator.clipboard.writeText(output);
                  toast.success("Email copied");
                }}
              >
                <Copy className="h-4 w-4" /> Copy
              </Button>
              <Button variant="outline" className="gap-2" disabled={loading} onClick={generate}>
                <RefreshCw className="h-4 w-4" /> Regenerate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
