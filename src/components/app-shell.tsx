import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  ListChecks,
  Settings,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/meeting-notes", label: "Meeting Notes", icon: NotebookPen },
  { to: "/task-planner", label: "Task Planner", icon: ListChecks },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function ResponsibleAiDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Responsible AI</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Responsible AI use</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3 pt-2 text-left text-sm">
              <p>
                AI-generated content may be inaccurate, incomplete or biased. Always review and
                edit every output before you send, share or act on it.
              </p>
              <p>
                Do not enter confidential, personal or regulated data. Your input is sent to a
                third-party model provider for processing.
              </p>
              <p>You remain accountable for anything you publish from this assistant.</p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Sidebar - desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar px-3 py-4 md:flex">
        <div className="flex items-center gap-2 px-2 pb-6">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="min-w-0 truncate text-sm font-semibold text-sidebar-foreground">
            Workplace AI
          </span>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.to)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>
        <p className="px-3 pt-4 text-xs leading-relaxed text-muted-foreground">
          Review every AI output. Never paste confidential data.
        </p>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-20 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground md:hidden">
              <Sparkles className="h-4 w-4" />
            </span>
            <h2 className="truncate text-sm font-semibold tracking-tight md:text-base">
              AI Workplace Productivity Assistant
            </h2>
          </div>
          <ResponsibleAiDialog />
        </header>

        <main className="mx-auto w-full max-w-5xl px-4 pt-6 pb-28 md:px-8 md:pb-12">
          {children}
          <footer className="mt-10 rounded-xl border border-border bg-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
            AI-generated content may be inaccurate and should be reviewed before use. Do not enter
            confidential or personal data.
          </footer>
        </main>
      </div>

      {/* Bottom nav - mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-background/95 backdrop-blur md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex flex-col items-center gap-1 px-1 py-2 text-[10px] font-medium transition-colors",
              isActive(item.to) ? "text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span className="w-full truncate text-center">{item.label.split(" ")[0]}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
