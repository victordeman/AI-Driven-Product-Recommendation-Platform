# Knowledge Graph Schema Design: Neo4j Property Graph

## 1. Schema Overview
The Knowledge Graph (KG) serves as the "brain" for the recommendation engine, storing multi-dimensional user preferences and product relationships that are difficult to capture in a flat vector space.

### 1.1 Node Labels
- **User**: Represents a platform user. Properties: `id`, `email`, `name`, `createdAt`.
- **PreferenceCategory**: High-level categories (e.g., "Performance", "Budget", "Sustainability").
- **Brand**: Product manufacturers (e.g., "Sony", "Dell", "Patagonia").
- **Vendor**: Platform sellers (e.g., "VendorA", "Amazon", "LocalStore").
- **ProductAttribute**: Specific technical or qualitative traits (e.g., "4K", "Noise-Cancelling", "Leather-Free").
- **Product**: Specific items (linked to PostgreSQL via `productId`). Properties: `id`, `name`, `price`.

### 1.2 Relationship Types
- **(User)-[:PREFERS]->(PreferenceCategory | Brand | ProductAttribute)**: Positive preference. Properties: `weight` (0.0 to 1.0), `lastUpdated`.
- **(User)-[:DISLIKES]->(PreferenceCategory | Brand | ProductAttribute)**: Explicit negative feedback.
- **(User)-[:PURCHASED]->(Product)**: Conversion history.
- **(Product)-[:HAS_ATTRIBUTE]->(ProductAttribute)**: Product metadata.
- **(Product)-[:BELONGS_TO]->(Brand)**: Brand relationship.
- **(Product)-[:SOLD_BY]->(Vendor)**: Multi-vendor mapping. Properties: `price`, `stock`.

## 2. Cypher Query Examples

### 2.1 Creating User Preference Sub-graphs
When a user expresses a preference in chat (e.g., "I love Sony headphones with noise cancelling"):
```cypher
MERGE (u:User {id: $userId})
MERGE (b:Brand {name: "Sony"})
MERGE (a:ProductAttribute {name: "Noise-Cancelling"})
MERGE (c:PreferenceCategory {name: "Audio"})
MERGE (u)-[r1:PREFERS]->(b) SET r1.weight = 0.9, r1.lastUpdated = timestamp()
MERGE (u)-[r2:PREFERS]->(a) SET r2.weight = 1.0, r2.lastUpdated = timestamp()
MERGE (u)-[r3:PREFERS]->(c) SET r3.weight = 0.8, r3.lastUpdated = timestamp()
```

### 2.2 Updating from Chat Feedback (Refining Preferences)
If a user says "Actually, Sony is too expensive":
```cypher
MATCH (u:User {id: $userId})-[r:PREFERS]->(b:Brand {name: "Sony"})
DELETE r
MERGE (u)-[d:DISLIKES]->(b)
SET d.reason = "Price", d.timestamp = timestamp()
```

### 2.3 Multi-hop Reasoning for Recommendations
Find products from brands the user prefers that have attributes the user also prefers:
```cypher
MATCH (u:User {id: $userId})-[:PREFERS]->(b:Brand)<-[:BELONGS_TO]-(p:Product)
MATCH (p)-[:HAS_ATTRIBUTE]->(a:ProductAttribute)<-[:PREFERS]-(u)
WHERE NOT (u)-[:DISLIKES]->(p)
RETURN p.id, p.name, count(a) as score
ORDER BY score DESC
LIMIT 10
```

## 3. Hybrid Retrieval Strategy (Graph + pgvector)

To provide "Global + Local" context, the recommendation engine follows this flow:

1.  **Step 1: Graph Expansion (The "Why")**: Query Neo4j for the user's top 5 preferred `Brands` and `Attributes`.
2.  **Step 2: Vector Search (The "Similarity")**: Generate a query embedding from the user's current chat message. Perform a `pgvector` search in PostgreSQL, filtered by the Brands found in Step 1.
3.  **Step 3: Graph Reranking (The "Context")**: Take the top 50 vector results. For each product, check its `ProductAttribute` nodes in Neo4j. Increase the rank of products that have attributes the user has previously liked (`PREFERS`).
4.  **Step 4: LLM Generation**: Send the final top 5 products + their "reasoning" (e.g., "We chose this because you like Sony and value Noise-Cancelling") to the Vercel AI SDK.

## 4. Constraints & Indexes
```cypher
CREATE CONSTRAINT user_id FOR (u:User) REQUIRE u.id IS UNIQUE;
CREATE CONSTRAINT product_id FOR (p:Product) REQUIRE p.id IS UNIQUE;
CREATE INDEX brand_name FOR (b:Brand) ON (b.name);
CREATE INDEX attr_name FOR (a:ProductAttribute) ON (a.name);
```
