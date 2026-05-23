import { FunctionTool, ReActAgent } from "llamaindex";
import { OpenAI } from "@llamaindex/openai";
import { updateUserPreference } from "./graph";
import { hybridSearch } from "./retrieval";
import { generateEmbedding } from "./embeddings";

const createUpdatePreferenceTool = (userId: string) => FunctionTool.from(
  async ({ type, name, isNegative }: { type: string, name: string, isNegative: boolean }) => {
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

const createRecommendProductsTool = (userId: string) => FunctionTool.from(
  async ({ query }: { query: string }) => {
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
    tools: [createUpdatePreferenceTool(userId), createRecommendProductsTool(userId)],
    llm: new OpenAI({ model: "gpt-4-turbo", temperature: 0.1 }),
    systemPrompt: `You are an AI Shopping Assistant.
    Your goal is to help users find products and refine their preferences.
    Use the 'updatePreference' tool whenever a user explicitly states a like or dislike for a brand, category, or attribute.
    Use the 'recommendProducts' tool to search for products. The results will be biased based on the user's Knowledge Graph.
    Always be helpful, concise, and professional.`
  });
};
