import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are CareerConnect's AI Career Coach. You help students with:
- Career guidance and choosing job roles aligned with their skills
- Resume review with a 0–100 score, strengths, weaknesses, and concrete fixes
- Skill gap analysis for target roles, with a focused 4-week learning plan
- Interview preparation: technical, HR, and behavioral questions with model answers
- Job and internship recommendations

Be encouraging, concise, and practical. Format with markdown headings, bullet lists, and short paragraphs.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const { messages } = (await request.json()) as { messages: UIMessage[] };
        const gateway = createLovableAiGatewayProvider(key);

        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse();
      },
    },
  },
});