import { db } from "@repo/database/db";
import { products } from "@repo/database/schema";
import { cosineDistance, desc, sql } from "drizzle-orm";
import { getGraphRAGContext } from "./graph";

export interface SearchResult {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  score: number;
  reasoning: string[];
}

export async function hybridSearch(userId: string, queryEmbedding: number[], limit: number = 5): Promise<SearchResult[]> {
  const similarity = sql<number>`1 - (${cosineDistance(products.embedding, queryEmbedding)})`;
  const vectorResults = await db.select({
    id: products.id,
    name: products.name,
    description: products.description,
    price: products.price,
    metadata: products.metadata,
    vectorScore: similarity,
  })
  .from(products)
  .orderBy(desc(similarity))
  .limit(limit * 5);

  if (vectorResults.length === 0) return [];
  const productIds = vectorResults.map(p => p.id);
  const graphContext = await getGraphRAGContext(userId, productIds);

  const searchResults: SearchResult[] = vectorResults.map(prod => {
    const gCtx = graphContext.find(g => g.id === prod.id);
    let score = Number(prod.vectorScore) || 0;
    const reasoning: string[] = [`Matches your search query.`];
    if (gCtx) {
      if (gCtx.isDisliked) {
        score -= 100;
        reasoning.push(`Note: This matches your dislikes.`);
      } else if (gCtx.graphScore > 0) {
        score += (gCtx.graphScore * 0.1);
        reasoning.push(`Aligned with your stated preferences.`);
      }
    }
    return { id: prod.id, name: prod.name, description: prod.description, price: prod.price, score, reasoning };
  }).filter(res => res.score > -50);

  return searchResults.sort((a, b) => b.score - a.score).slice(0, limit);
}
