# AI-Driven Product Recommendation Platform (Next.js 15 Monorepo)

This repository contains the ported and enhanced implementation of the AI-Driven Product Recommendation Platform, transitioning from the original Python/Streamlit stack to a modern Next.js 15, TypeScript, Neo4j, and pgvector architecture.

## Phase 5 & 6 Highlights
- **Persistent Chat Agent**: A floating AI concierge available on every page, with session persistence and multi-turn conversation memory.
- **Context-Aware Suggestions**: AI quick actions that dynamically update based on the user's current route.
- **Interactive Graph Visualization**: Real-time visualization of the user's preference knowledge graph on the profile page using React Flow.
- **Modern UI/UX**: Fully responsive design built with Tailwind CSS and shadcn/ui components.
- **GraphRAG Data Binding**: Personalized recommendation pages that consume real-time reasoning from the Neo4j knowledge graph.

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
DATABASE_URL=... NEO4J_URI=... NEO4J_USERNAME=... npx tsx scripts/seed-products.ts
```

### 3. Running the Application
```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Run in development mode
pnpm dev
```

### 4. Application Routes
- `/`: Homepage with hero and feature highlights.
- `/products`: Complete product catalog with multi-vendor sourcing.
- `/recommendations`: Personalized matches powered by GraphRAG.
- `/profile`: User account, preferences, and interactive knowledge graph.
- `/api/chat`: Streaming endpoint for the persistent AI agent.

## Architecture
- `apps/web`: Next.js 15 App Router frontend.
- `packages/ai`: Core AI logic, LlamaIndex agents, and hybrid retrieval.
- `packages/database`: Drizzle ORM, schema, and pgvector client.
- `scripts`: Utility scripts for setup, seeding, and testing.
