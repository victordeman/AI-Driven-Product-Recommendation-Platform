# Codebase Audit Report: AI-Driven Product Recommendation Platform

## 1. Executive Summary
The original repository is a Python-based prototype using FastAPI, Streamlit, and LlamaIndex. It focuses on personalized product recommendations using vector search (pgvector) and a basic context retention system (SQLite + Mem0 concept). The migration will transition this to a Next.js 15 App Router monorepo, replacing the Python stack with TypeScript and enhancing the data model with a Neo4j knowledge graph.

## 2. Review of Original Artifacts

### 2.1 Agents & Workflows (`src/agents/`)
- **`DataProcessorAgent`**: 
    - *Logic*: Cleans user queries (regex) and manages search history.
    - *Context*: Interacts with `ContextStore` to persist search history.
    - *Porting Strategy*: Re-implement as a TypeScript utility or a LlamaIndex.TS `DataProcessor` class.
- **`EmbeddingGeneratorAgent`**:
    - *Logic*: Uses `sentence-transformers` (`all-MiniLM-L6-v2`) to generate 384-dimensional vectors.
    - *Porting Strategy*: Switch to OpenAI's `text-embedding-3-small` (1536d) via LlamaIndex.TS or Vercel AI SDK for production-grade quality.
- **`RecommendationEngineAgent`**:
    - *Logic*: Performs vector similarity search (`<->` operator) in PostgreSQL. Generates a "narrative" description of recommendations.
    - *Porting Strategy*: Re-implement using Drizzle ORM with `pgvector` support and LlamaIndex.TS `VectorStoreIndex`.

### 2.2 API & Data Models (`src/api/`, `src/models/`)
- **`FastAPI` App**: Simple endpoints for `/recommend` and `/feedback`.
- **`UserProfile` (Pydantic)**: Basic schema for `user_id`, `preferences` (budget, category), and `search_history`.
- **Porting Strategy**: Replace with Next.js Server Actions and API Routes. Use Zod for validation and Drizzle schemas for data modeling.

### 2.3 Storage & Utilities (`src/utils/`, `config/`)
- **`ContextStore` (SQLite)**: Manages three tables: `context`, `feedback`, and `vendor_inventory`.
- **`pgvector`**: Used for product similarity.
- **Porting Strategy**: 
    - Move `context` and `feedback` to **Neo4j** (for KG-driven preferences).
    - Move `vendor_inventory` and `products` to **PostgreSQL** (via Drizzle).

### 2.4 Frontend (`streamlit/`)
- **Streamlit**: Basic interactive UI for inputting queries and viewing recommendations.
- **Porting Strategy**: Full rebuild in **Next.js 15** with **Tailwind CSS** and **shadcn/ui**. Implement the floating chat widget as a persistent client-side component.

## 3. Key Artifacts to Port/Re-implement
| Artifact | Original (Python) | New (TypeScript/TSX) |
| :--- | :--- | :--- |
| **API Framework** | FastAPI | Next.js 15 (App Router) |
| **Agent Orchestration** | LlamaIndex Python | LlamaIndex.TS / Vercel AI SDK |
| **User Context** | SQLite (JSON fields) | Neo4j (Property Graph) |
| **Product Search** | psycopg2 + SQL | Drizzle ORM + pgvector |
| **Embeddings** | sentence-transformers | OpenAI / LangChain.js |
| **Validation** | Pydantic | Zod |
| **UI** | Streamlit | React + Tailwind + shadcn/ui |
| **Feedback Loop** | SQLite + Mem0 logic | Neo4j Real-time graph updates |

## 4. Observations & Recommendations
- **Mem0 Usage**: The original repo references Mem0 in the README but the implementation in `ContextStore` is a custom SQLite wrapper. We should use a proper Graph-based approach for long-term memory.
- **Product Schema**: Currently very basic (id, name, description, embedding). We need to expand this for multi-vendor support (vendor_id, price, availability, attributes).
- **Prompt Logic**: The narrative generation is hardcoded. We should move this to LLM-based generation using Vercel AI SDK's `streamText`.
