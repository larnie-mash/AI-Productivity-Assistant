import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Set your default tone, signature and responsible-AI preferences.",
      },
      { property: "og:title", content: "Settings — Workplace AI" },
      {
        property: "og:description",
        content: "Personalise defaults for the AI workplace productivity assistant.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [name, setName] = useState("");
  const [signature, setSignature] = useState("");
  const [tone, setTone] = useState("Formal");
  const [showPrompts, setShowPrompts] = useState(true);
  const [confirmReview, setConfirmReview] = useState(true);

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Preferences apply to this browser session only — nothing you type is stored on a server."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="text-base">Profile defaults</CardTitle>
            <CardDescription>Used as a starting point in the email generator.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sig">Email signature</Label>
              <Input
                id="sig"
                placeholder="Best regards, …"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Default tone</Label>
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
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="text-base">Responsible AI</CardTitle>
            <CardDescription>Transparency and review controls.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">Show AI prompts</p>
                <p className="text-xs text-muted-foreground">
                  Display the exact prompt sent to the model.
                </p>
              </div>
              <Switch checked={showPrompts} onCheckedChange={setShowPrompts} />
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">Review reminders</p>
                <p className="text-xs text-muted-foreground">
                  Keep the review-before-use disclaimer visible.
                </p>
              </div>
              <Switch checked={confirmReview} onCheckedChange={setConfirmReview} />
            </div>
            <p className="rounded-lg bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
              AI-generated content may be inaccurate. Never enter confidential, personal or
              regulated data into these tools.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
