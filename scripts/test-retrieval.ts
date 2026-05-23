import { hybridSearch } from "../packages/ai/lib/retrieval";

async function testRetrieval() {
  const userId = "user_" + Date.now();
  const dummyEmbedding = new Array(1536).fill(0);
  try {
    const results = await hybridSearch(userId, dummyEmbedding);
    console.log("Results:", results.map(r => ({ name: r.name, score: r.score })));
  } catch (err) {
    console.error("Retrieval test error:", err);
  } finally {
    process.exit(0);
  }
}

testRetrieval();
