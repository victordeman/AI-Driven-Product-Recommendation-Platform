import { AIService } from "@repo/ai";
import { auth } from "@clerk/nextjs/server";
import { chatSessions, chatMessages } from "@repo/database/schema";
import { db } from "@repo/database/db";
import { LlamaIndexAdapter } from "ai";
import { ChatMessage, MessageType } from "llamaindex";

export async function POST(req: Request) {
  const authData = await auth();
  const userId = authData.userId;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { messages, sessionId } = await req.json();
    const lastMessage = messages[messages.length - 1];

    // Convert Vercel AI SDK messages to LlamaIndex messages for history
    const history: ChatMessage[] = messages.slice(0, -1).map((m: any) => ({
      content: m.content,
      role: m.role as MessageType,
    }));

    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const [session] = await db.insert(chatSessions).values({ userId }).returning();
      currentSessionId = session.id;
    }

    // Save user message
    await db.insert(chatMessages).values({
      sessionId: currentSessionId,
      role: "user",
      content: lastMessage.content,
    });

    const aiService = new AIService(userId);
    const stream = await aiService.chatStream(lastMessage.content, history);

    return LlamaIndexAdapter.toDataStreamResponse(stream, {
      init: {
        headers: {
          "x-session-id": currentSessionId,
          "Access-Control-Expose-Headers": "x-session-id",
        },
      },
      callbacks: {
        onCompletion: async (completion: string) => {
          // Save assistant message
          await db.insert(chatMessages).values({
            sessionId: currentSessionId!,
            role: "assistant",
            content: completion,
          });
        },
      }
    });
  } catch (error) {
    console.error("Chat Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
