import { AIService } from "../packages/ai/lib/ai-service";
import { hybridSearch } from "../packages/ai/lib/retrieval";

async function testFeedbackLoop() {
  const userId = "feedback_test_user_" + Date.now();
  const aiService = new AIService(userId);
  const dummyEmbedding = new Array(1536).fill(0);
  const results1 = await hybridSearch(userId, dummyEmbedding);
  console.log("Initial Top Result:", results1[0]?.name);
  await aiService.recordFeedback("Brand", "Dell", false);
  const results2 = await hybridSearch(userId, dummyEmbedding);
  console.log("Post-Feedback Top Result:", results2[0]?.name);
  process.exit(0);
}

testFeedbackLoop().catch(err => {
  console.error(err);
  process.exit(1);
});
