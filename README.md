# AI-Driven Product Recommendation Platform (Next.js 15 Monorepo)

This repository contains the ported and enhanced implementation of the AI-Driven Product Recommendation Platform, transitioning from the original Python/Streamlit stack to a modern Next.js 15, TypeScript, Neo4j, and pgvector architecture.

## Phase 3 & 4 Highlights
- **Hybrid Retrieval**: Combines PostgreSQL `pgvector` similarity search with Neo4j Knowledge Graph preference reranking.
- **Knowledge GraphRAG**: Uses multi-hop reasoning in Neo4j to influence recommendations based on user history and explicit preferences.
- **Agentic Workflows**: Ported original logic to LlamaIndex.TS using ReAct agents and functional tools.
- **Persistent Memory**: Replaced Mem0 with a native Property Graph (Neo4j) for long-term user context.

## Setup Instructions

### 1. Database Setup
Ensure PostgreSQL (with pgvector) and Neo4j are running.
```bash
# Initialize PostgreSQL Extensions
DATABASE_URL=... npx tsx scripts/setup-db.ts

# Push Drizzle Schema
DATABASE_URL=... npx drizzle-kit push

# Initialize Neo4j Constraints & Indexes
NEO4J_URI=... NEO4J_USERNAME=... NEO4J_PASSWORD=... npx tsx scripts/setup-graph-indexes.ts
```

### 2. Seeding Sample Data
```bash
DATABASE_URL=... NEO4J_URI=... NEO4J_USERNAME=... NEO4J_PASSWORD=... npx tsx scripts/seed-products.ts
```

### 3. Running AI Tests
```bash
# Test Hybrid Retrieval logic
DATABASE_URL=... NEO4J_URI=... npx tsx scripts/test-retrieval.ts

# Test Knowledge Graph Reasoning
NEO4J_URI=... npx tsx scripts/test-graph-reasoning.ts

# Test Real-time Feedback Loop
DATABASE_URL=... NEO4J_URI=... npx tsx scripts/test-feedback-loop.ts

# Test LlamaIndex RAG Integration
DATABASE_URL=... NEO4J_URI=... npx tsx scripts/test-llama-rag.ts
```

## Architecture
- `apps/web`: Next.js 15 App Router.
- `packages/ai`: Core AI logic, agents, and retrieval strategies.
- `packages/database`: Drizzle schema and database clients.
- `scripts`: Utility scripts for setup, seeding, and testing.
