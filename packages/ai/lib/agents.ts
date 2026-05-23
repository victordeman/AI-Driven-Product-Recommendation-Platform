import { OpenAI, FunctionTool, ReActAgent } from "llamaindex";
import { updateUserPreference } from "./graph";
import { hybridSearch } from "./retrieval";
import { generateEmbedding } from "./embeddings";

const updatePreferenceTool = FunctionTool.from(
  async ({ type, name, isNegative }: { type: string, name: string, isNegative: boolean }) => {
    const userId = "current_user";
    await updateUserPreference(userId, type as any, name, 1.0, isNegative);
    return `Updated preference: ${isNegative ? "Dislikes" : "Prefers"} ${name} (${type})`;
  },
  {
    name: "updatePreference",
    description: "Updates user preferences (Brand, Category, Attribute) in the knowledge graph.",
    parameters: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["Brand", "PreferenceCategory", "ProductAttribute"] },
        name: { type: "string" },
        isNegative: { type: "boolean" },
      },
      required: ["type", "name", "isNegative"],
    },
  }
);

const recommendProductsTool = FunctionTool.from(
  async ({ query }: { query: string }) => {
    const userId = "current_user";
    const queryEmbedding = await generateEmbedding(query);
    const results = await hybridSearch(userId, queryEmbedding);
    return JSON.stringify(results);
  },
  {
    name: "recommendProducts",
    description: "Recommends products based on a natural language query and user preferences.",
    parameters: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
    },
  }
);

export const createMarketplaceAgent = (userId: string) => {
  return new ReActAgent({
    tools: [updatePreferenceTool, recommendProductsTool],
    llm: new OpenAI({ model: "gpt-4-turbo" }),
    systemPrompt: `You are an AI Shopping Assistant. Personalize results via the Knowledge Graph.`
  });
};
