import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Copy, Loader2, Wand2, ChevronDown, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { planTasks } from "@/lib/ai.functions";
import { buildPlanPrompt } from "@/lib/ai-prompts";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workplace AI" },
      {
        name: "description",
        content:
          "Turn a task list into a prioritised daily or weekly schedule with a rationale for each block.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "Prioritised, editable time blocks generated from your task list.",
      },
    ],
  }),
  component: PlannerPage,
});

type Block = { slot: string; task: string; priority: string; rationale: string };

function PlannerPage() {
  const run = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [view, setView] = useState<"daily" | "weekly">("daily");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  async function plan() {
    if (!tasks.trim()) {
      toast.error("Add at least one task.");
      return;
    }
    setLoading(true);
    try {
      const result = await run({ data: { tasks, view } });
      setBlocks(result.blocks);
      setSummary(result.summary);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function update(index: number, field: keyof Block, value: string) {
    setBlocks(blocks.map((b, i) => (i === index ? { ...b, [field]: value } : b)));
  }

  function copyPlan() {
    const md = [
      `# ${view === "daily" ? "Daily" : "Weekly"} plan`,
      "",
      ...blocks.map((b) => `- **${b.slot}** — ${b.task} (${b.priority}) — ${b.rationale}`),
      "",
      summary,
    ].join("\n");
    navigator.clipboard.writeText(md);
    toast.success("Plan copied");
  }

  return (
    <div>
      <PageHeader
        title="AI Task Planner"
        description="One task per line. Add deadlines or priority notes inline for a sharper schedule."
      />
      <div className="space-y-4">
        <Card className="rounded-2xl shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="text-base">Your tasks</CardTitle>
            <CardDescription>e.g. “Board deck — due Thursday, high priority”.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              rows={8}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder={"Finish Q3 report — due Friday\nReview design feedback\n1:1 with Sam"}
            />
            <div className="grid gap-3 sm:flex sm:items-center sm:justify-between">
              <div className="space-y-2">
                <Label>View</Label>
                <Tabs value={view} onValueChange={(v) => setView(v as "daily" | "weekly")}>
                  <TabsList>
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <Button onClick={plan} disabled={loading} className="gap-2 sm:self-end">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
                {loading ? "Planning…" : "Build schedule"}
              </Button>
            </div>
            <Collapsible>
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted/60 px-3 py-2 text-xs font-medium text-muted-foreground">
                AI prompt used
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                  {buildPlanPrompt({ tasks: tasks || "<your tasks>", view })}
                </pre>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {loading ? (
          <Card className="rounded-2xl shadow-[var(--shadow-card)]">
            <CardContent className="space-y-3 pt-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </CardContent>
          </Card>
        ) : blocks.length ? (
          <Card className="rounded-2xl shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="text-base">
                {view === "daily" ? "Time blocks" : "Weekly plan"}
              </CardTitle>
              <CardDescription>Every field is editable.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="hidden grid-cols-[8rem_1fr_7rem_1fr_2rem] gap-2 px-1 text-xs font-medium text-muted-foreground md:grid">
                <span>{view === "daily" ? "Time" : "Day"}</span>
                <span>Task</span>
                <span>Priority</span>
                <span>Why here</span>
                <span />
              </div>
              {blocks.map((b, i) => (
                <div
                  key={i}
                  className="grid gap-2 rounded-xl border border-border p-3 md:grid-cols-[8rem_1fr_7rem_1fr_2rem] md:items-center md:border-0 md:p-1"
                >
                  <Input value={b.slot} onChange={(e) => update(i, "slot", e.target.value)} />
                  <Input value={b.task} onChange={(e) => update(i, "task", e.target.value)} />
                  <Input
                    value={b.priority}
                    onChange={(e) => update(i, "priority", e.target.value)}
                  />
                  <Input
                    value={b.rationale}
                    onChange={(e) => update(i, "rationale", e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Remove block"
                    onClick={() => setBlocks(blocks.filter((_, j) => j !== i))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="space-y-2 pt-2">
                <Label>Prioritisation rationale</Label>
                <Textarea rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} />
              </div>
              <Button variant="secondary" className="gap-2" onClick={copyPlan}>
                <Copy className="h-4 w-4" /> Copy plan
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
