# Project Setup Plan, Risks & Timeline

## 1. Step-by-Step Initialization

### 1.1 Repo Initialization
1.  **Initialize Monorepo**: `npx create-next-app@canary --typescript --tailwind --eslint apps/web`.
2.  **Setup Workspaces**: Configure `package.json` with `"workspaces": ["apps/*", "packages/*"]`.
3.  **Install Dependencies**: `pnpm add -w drizzle-orm pg neo4j-driver @ai-sdk/openai ai zod clerk-react`.

### 1.2 Local Development Environment
Create a `docker-compose.yml` for local services:
```yaml
services:
  postgres:
    image: ankane/pgvector:latest
    ports: ["5432:5432"]
    environment:
      POSTGRES_PASSWORD: password
  neo4j:
    image: neo4j:5.12
    ports: ["7474:7474", "7687:7687"]
    environment:
      NEO4J_AUTH: neo4j/password
```

### 1.3 CI/CD & Config
1.  **Environment Variables**: Setup `.env.example` with keys for OpenAI, Neo4j, Postgres, and Clerk.
2.  **Linting/Formatting**: Setup Prettier and ESLint rules at the root.
3.  **GitHub Actions**: Basic workflow for `pnpm install`, `pnpm build`, and `pnpm test`.

## 2. Project Board Template (Phases)

| Phase | Milestone | Tickets |
| :--- | :--- | :--- |
| **Phase 2** | Infrastructure | Setup DB schemas, Drizzle migrations, Neo4j connection pool. |
| **Phase 3** | Core AI | Implement LlamaIndex.TS RAG pipeline, Tool calling logic. |
| **Phase 4** | Chat UI | Build persistent widget, product card components, streaming hooks. |
| **Phase 5** | Multi-Vendor | Implement Inngest sync jobs, Vendor adapter logic. |
| **Phase 6** | Launch | Analytics, performance tuning, final Vercel deployment. |

## 3. Timeline (1–2 Weeks Refinement)

- **Week 1: Foundations & Agent Logic**
    - Day 1-2: Monorepo setup, DB schemas, Docker config.
    - Day 3-4: Core AI pipeline (Graph + Vector retrieval).
    - Day 5: Multi-vendor ingestion (Inngest basic flow).
- **Week 2: UI & Integration**
    - Day 6-7: Persistent Chat Widget & UI library (shadcn).
    - Day 8-9: Preference reasoning feedback loop implementation.
    - Day 10: Testing, Documentation, and Final Handover.

## 4. Risks & Dependencies

- **Graph Complexity**: Maintaining high performance for multi-hop Cypher queries as the graph grows. *Mitigation*: Proper indexing and query optimization.
- **LLM Latency**: Multi-stage retrieval (Graph + Vector) may slow down response times. *Mitigation*: Aggressive caching and streaming responses.
- **Vendor API Reliability**: Third-party APIs may be slow or unstable. *Mitigation*: Robust error handling and stale-while-revalidate strategy in background jobs.
- **Dependency**: Neo4j and PostgreSQL are both required for core functionality. *Dependency*: Requires reliable hosting (e.g., Neo4j Aura + Neon/Supabase).

## 5. Open Questions
- Do we need support for image-based product search in Phase 1? (Assumption: No, focus on text/attribute reasoning).
- What is the expected initial scale of products (10k vs 1M+)? (Assumption: ~50k for Phase 1).
