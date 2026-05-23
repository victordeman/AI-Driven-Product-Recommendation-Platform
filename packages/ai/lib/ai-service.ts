import { createMarketplaceAgent } from "./agents";
import { updateUserPreference, getGraphContext } from "./graph";

export class AIService {
  private userId: string;
  constructor(userId: string) { this.userId = userId; }
  async chat(message: string) {
    const agent = createMarketplaceAgent(this.userId);
    return await agent.chat({ message });
  }
  async recordFeedback(type: "Brand" | "PreferenceCategory" | "ProductAttribute", name: string, isNegative: boolean) {
    await updateUserPreference(this.userId, type, name, 1.0, isNegative);
    return { success: true };
  }
  async getUserKnowledge() { return await getGraphContext(this.userId); }
}
