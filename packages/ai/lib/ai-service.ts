import { createMarketplaceAgent } from "./agents";
import { updateUserPreference, getGraphContext } from "./graph";
import { ChatMessage } from "llamaindex";
import { hybridSearch, SearchResult } from "./retrieval";
import { generateEmbedding } from "./embeddings";

export class AIService {
  private userId: string;
  constructor(userId: string) { this.userId = userId; }

  async chat(message: string, history: ChatMessage[] = []) {
    const agent = createMarketplaceAgent(this.userId);
    return await agent.chat({ message, chatHistory: history });
  }

  async chatStream(message: string, history: ChatMessage[] = []) {
    const agent = createMarketplaceAgent(this.userId);
    return await agent.chat({ message, chatHistory: history, stream: true });
  }

  async recordFeedback(type: "Brand" | "PreferenceCategory" | "ProductAttribute", name: string, isNegative: boolean) {
    await updateUserPreference(this.userId, type, name, 1.0, isNegative);
    return { success: true };
  }

  async getUserKnowledge() {
    return await getGraphContext(this.userId);
  }

  async getRecommendedProducts(limit: number = 8): Promise<SearchResult[]> {
    // Generate a generic "personalized" query based on knowledge graph context
    const knowledge = await this.getUserKnowledge();
    const prefString = knowledge.explicitPreferences.map((p: any) => p.name).join(", ");
    const attrString = knowledge.impliedAttributes.join(", ");

    const query = `Top products for someone who likes ${prefString || 'high quality items'} and is interested in ${attrString || 'various categories'}`;
    const queryEmbedding = await generateEmbedding(query);

    return await hybridSearch(this.userId, queryEmbedding, limit);
  }
}
