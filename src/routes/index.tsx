import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookPen, ListChecks, ArrowRight, Lightbulb } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Draft emails, summarise meeting notes and build prioritised task schedules with AI in one clean workspace.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Automate everyday workplace tasks: emails, meeting summaries and task planning.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    description: "Turn a few bullet points into a polished email with the right tone.",
    tip: "Add the recipient's role and your desired outcome for sharper drafts.",
  },
  {
    to: "/meeting-notes",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    description: "Paste raw notes and get a summary, action items, decisions and deadlines.",
    tip: "Keep speaker names in the notes so action items get the right owner.",
  },
  {
    to: "/task-planner",
    icon: ListChecks,
    title: "AI Task Planner",
    description: "Turn a task list into a prioritised daily or weekly schedule.",
    tip: "Note deadlines inline, e.g. “Board deck — due Thursday, high priority”.",
  },
] as const;

function Dashboard() {
  return (
    <div>
      <PageHeader
        title="Your AI workspace"
        description="Three focused tools for the writing, summarising and planning work that fills your day. Every output is editable before you use it."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.to} to={tool.to} className="group">
            <Card className="h-full rounded-2xl border-border shadow-[var(--shadow-card)] transition-transform group-hover:-translate-y-0.5">
              <CardHeader>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <tool.icon className="h-5 w-5" />
                </span>
                <CardTitle className="mt-3 text-base">{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="flex gap-2 rounded-lg bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
                  <Lightbulb className="h-4 w-4 shrink-0 text-primary" />
                  <span>{tool.tip}</span>
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open tool <ArrowRight className="h-4 w-4" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
