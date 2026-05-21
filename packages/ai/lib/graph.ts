import { getNeo4jDriver } from "./neo4j-client";

export async function updateUserPreference(
  userId: string,
  type: "Brand" | "PreferenceCategory" | "ProductAttribute",
  name: string,
  weight: number = 1.0,
  isNegative: boolean = false
) {
  const driver = getNeo4jDriver();
  const session = driver.session();
  const relationship = isNegative ? "DISLIKES" : "PREFERS";
  try {
    await session.run(`
      MERGE (u:User {id: $userId})
      MERGE (p:${type} {name: $name})
      MERGE (u)-[r:${relationship}]->(p)
      SET r.weight = $weight, r.lastUpdated = timestamp()
      WITH u, p
      MATCH (u)-[old:${isNegative ? "PREFERS" : "DISLIKES"}]->(p)
      DELETE old
    `, { userId, name, weight });
  } finally {
    await session.close();
  }
}

export async function getGraphContext(userId: string) {
  const driver = getNeo4jDriver();
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (u:User {id: $userId})
      OPTIONAL MATCH (u)-[r:PREFERS]->(pref)
      WHERE NOT (u)-[:DISLIKES]->(pref)
      OPTIONAL MATCH (u)-[:PREFERS]->(b:Brand)<-[:BELONGS_TO]-(p:Product)-[:HAS_ATTRIBUTE]->(a:ProductAttribute)
      WHERE NOT (u)-[:DISLIKES]->(a)
      RETURN
        collect(distinct {type: labels(pref)[0], name: pref.name, weight: r.weight}) as explicitPrefs,
        collect(distinct a.name) as impliedAttributes
    `, { userId });
    const record = result.records[0];
    return {
      explicitPreferences: record.get("explicitPrefs"),
      impliedAttributes: record.get("impliedAttributes"),
    };
  } finally {
    await session.close();
  }
}

export async function getGraphRAGContext(userId: string, productIds: string[]) {
  const driver = getNeo4jDriver();
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (u:User {id: $userId})
      MATCH (p:Product) WHERE p.id IN $productIds
      OPTIONAL MATCH (p)-[:BELONGS_TO]->(b:Brand)<-[r1:PREFERS]-(u)
      OPTIONAL MATCH (p)-[:IN_CATEGORY]->(c:PreferenceCategory)<-[r2:PREFERS]-(u)
      OPTIONAL MATCH (p)-[:HAS_ATTRIBUTE]->(a:ProductAttribute)<-[r3:PREFERS]-(u)
      OPTIONAL MATCH (u)-[d:DISLIKES]->(p)
      OPTIONAL MATCH (u)-[d2:DISLIKES]->(b)
      RETURN p.id as id,
             (coalesce(r1.weight, 0) + coalesce(r2.weight, 0) + coalesce(r3.weight, 0)) as graphScore,
             (d IS NOT NULL OR d2 IS NOT NULL) as isDisliked
    `, { userId, productIds });
    return result.records.map(record => ({
      id: record.get("id"),
      graphScore: record.get("graphScore"),
      isDisliked: record.get("isDisliked"),
    }));
  } finally {
    await session.close();
  }
}
