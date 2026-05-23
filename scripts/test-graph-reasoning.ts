import { updateUserPreference, getGraphContext, getGraphRAGContext } from "../packages/ai/lib/graph";
import { getNeo4jDriver } from "../packages/ai/lib/neo4j-client";

async function testGraphReasoning() {
  const userId = "test_user_456";
  await updateUserPreference(userId, "Brand", "Sony", 0.9);
  const context = await getGraphContext(userId);
  console.log("Context:", JSON.stringify(context, null, 2));
  process.exit(0);
}

testGraphReasoning().catch(err => {
  console.error(err);
  process.exit(1);
});
