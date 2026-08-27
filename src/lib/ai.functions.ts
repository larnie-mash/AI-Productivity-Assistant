import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callGateway, parsePlan } from "./ai-gateway.server";
import { buildEmailPrompt, buildNotesPrompt, buildPlanPrompt } from "./ai-prompts";

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        context: z.string().min(1),
        keyPoints: z.string().min(1),
        tone: z.string().min(1),
        purpose: z.string().min(1),
      })
      .parse(input),
  )
  .handler(async ({ data }) =>
    callGateway(
      "You are an expert business communication assistant. You write clear, professional emails.",
      buildEmailPrompt(data),
    ),
  );

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ notes: z.string().min(1) }).parse(input))
  .handler(async ({ data }) =>
    callGateway(
      "You are a meticulous meeting-notes analyst. You never invent information.",
      buildNotesPrompt(data.notes),
    ),
  );

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ tasks: z.string().min(1), view: z.enum(["daily", "weekly"]) }).parse(input),
  )
  .handler(async ({ data }) =>
    parsePlan(
      await callGateway(
        "You are a productivity coach who builds realistic, prioritised schedules. You reply with valid JSON only.",
        buildPlanPrompt(data),
      ),
    ),
  );
