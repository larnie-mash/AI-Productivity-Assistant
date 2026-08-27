import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookPen, ListChecks, ArrowRight, Lightbulb, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import heroImg from "@/assets/hero.jpg";
import emailImg from "@/assets/tool-email.jpg";
import notesImg from "@/assets/tool-notes.jpg";
import tasksImg from "@/assets/tool-tasks.jpg";

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
    image: emailImg,
    title: "Smart Email Generator",
    description: "Turn a few bullet points into a polished email with the right tone.",
    tip: "Add the recipient's role and your desired outcome for sharper drafts.",
  },
  {
    to: "/meeting-notes",
    icon: NotebookPen,
    image: notesImg,
    title: "Meeting Notes Summarizer",
    description: "Paste raw notes and get a summary, action items, decisions and deadlines.",
    tip: "Keep speaker names in the notes so action items get the right owner.",
  },
  {
    to: "/task-planner",
    icon: ListChecks,
    image: tasksImg,
    title: "AI Task Planner",
    description: "Turn a task list into a prioritised daily or weekly schedule.",
    tip: "Note deadlines inline, e.g. “Board deck — due Thursday, high priority”.",
  },
] as const;

function Dashboard() {
  return (
    <div>
      <section className="relative mb-8 overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-elevated)]">
        <img
          src={heroImg}
          alt="Abstract blue glass panels representing an AI-powered workspace"
          width={1600}
          height={912}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,oklch(0.24_0.09_262/0.92),oklch(0.32_0.12_255/0.7)_55%,oklch(0.45_0.14_240/0.35))]" />
        <div className="relative px-6 py-12 md:px-12 md:py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            AI-assisted workplace tools
          </span>
          <h1 className="mt-5 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-primary-foreground md:text-5xl">
            Your calm, focused AI workspace
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/80 md:text-base">
            Write emails, summarise meetings and plan your week in minutes. Every output stays
            fully editable before you use it.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/email"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-5 py-2.5 text-sm font-semibold text-primary shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5"
            >
              Draft an email <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/task-planner"
              className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/30 px-5 py-2.5 text-sm font-semibold text-primary-foreground backdrop-blur transition-colors hover:bg-primary-foreground/10"
            >
              Plan my day
            </Link>
          </div>
        </div>
      </section>

      <h2 className="mb-4 text-lg font-semibold tracking-tight">Tools</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.to} to={tool.to} className="group">
            <Card className="h-full overflow-hidden rounded-2xl border-border p-0 shadow-[var(--shadow-card)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-elevated)]">
              <div className="relative h-32 overflow-hidden">
                <img
                  src={tool.image}
                  alt=""
                  loading="lazy"
                  width={800}
                  height={512}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute bottom-3 left-3 grid h-9 w-9 place-items-center rounded-xl bg-card/90 text-primary shadow-[var(--shadow-card)] backdrop-blur">
                  <tool.icon className="h-4 w-4" />
                </span>
              </div>
              <CardHeader className="pt-4">
                <CardTitle className="text-base">{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pb-5">
                <p className="flex gap-2 rounded-lg bg-accent/50 p-3 text-xs leading-relaxed text-accent-foreground">
                  <Lightbulb className="h-4 w-4 shrink-0 text-primary" />
                  <span>{tool.tip}</span>
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open tool
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
