# Multi-Vendor Ingestion Strategy

## 1. Architecture for Vendor Onboarding
The platform aims to scale by aggregating products from multiple vendors. This requires a robust system for ingestion and synchronization.

### 1.1 Vendor Registry
- **Database Table (`vendors`)**: `id`, `name`, `apiUrl`, `apiKeyEncrypted`, `syncFrequency`.
- **Onboarding**: A dedicated Admin Dashboard allows for manual or API-based vendor registration.

### 1.2 Multi-Format Adaptors
Since different vendors provide data in different formats (JSON, XML, CSV), we use an **Adapter Pattern**:
- **BaseAdapter**: Defines `fetch()`, `transform()`, and `validate()`.
- **VendorSpecificAdapter**: Extends BaseAdapter to handle unique API quirks.

## 2. Product Sync Jobs
To keep inventory and pricing up to date, we implement background sync jobs.

- **Infrastructure**: **Inngest** or **Vercel Background Functions** (with Cron).
- **Process**:
    1.  **Extract**: Pull product data from Vendor API.
    2.  **Transform**: Map vendor fields to our standardized `Product` schema.
    3.  **Validate**: Use **Zod** to ensure required fields (price, name, etc.) are present and valid.
    4.  **Embed**: Generate vector embeddings for product name + description.
    5.  **Load (Atomic Upsert)**:
        - Update PostgreSQL (Drizzle) with product details and embeddings.
        - Update Neo4j with `(Product)-[:SOLD_BY]->(Vendor)` and `(Product)-[:HAS_ATTRIBUTE]->(Attribute)` relationships.

## 3. Preference-Based Dynamic Sourcing & Ranking
When a user asks for a recommendation, the system performs a multi-stage sourcing process.

### 3.1 Stage 1: Broad Retrieval (PostgreSQL)
Search `products` table using `pgvector` for similarity to user query.
*Constraint*: Limit to products currently in stock across all vendors.

### 3.2 Stage 2: Knowledge Graph Filtering (Neo4j)
Filter results based on user preferences stored in the graph.
*Logic*: If the user has a `DISLIKES` relationship with `VendorX`, remove all products from that vendor. If the user `PREFERS` `BrandY`, prioritize those.

### 3.3 Stage 3: Dynamic Ranking
Combine scores from:
1.  **Vector Similarity** (Semantic relevance) - 40% weight.
2.  **Graph Score** (Preference alignment) - 40% weight.
3.  **Business Logic** (Price, Availability, Vendor Rating) - 20% weight.

## 4. Scalability & API Management
- **Rate Limiting**: Implement per-vendor rate limiting during sync jobs to avoid API bans.
- **Key Rotation**: Securely store API keys in **Vercel Environment Variables** or **Azure/AWS Key Vault**, with automated rotation schedules.
- **Webhook Support**: Allow premium vendors to "push" updates to our platform (e.g., price drops) for real-time synchronization.
