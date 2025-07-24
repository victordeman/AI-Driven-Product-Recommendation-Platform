from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Document
from llama_index.vector_stores.postgres import PostgresVectorStore
import asyncpg
from pgvector.asyncpg import register_vector

app = FastAPI()
model = SentenceTransformer('all-MiniLM-L6-v2')

# Initialize LlamaIndex with Postgres VectorDB
vector_store = PostgresVectorStore.from_params(
    database="recommendation_db",
    host="localhost",
    password="pass",
    port=5432,
    user="user",
    table_name="products",
    embed_dim=384
)
# Mock product documents (load from Postgres in production)
documents = [Document(text="High-performance laptop", metadata={"name": "Laptop X"}),
             Document(text="Budget-friendly laptop", metadata={"name": "Laptop Y"})]
index = VectorStoreIndex.from_documents(documents, vector_store=vector_store)

class RecommendationRequest(BaseModel):
    user_id: str
    query: str

class FeedbackRequest(BaseModel):
    user_id: str
    product_name: str
    rating: int

@app.post("/recommend")
async def get_recommendations(request: RecommendationRequest):
    # Mock Mem0 context
    user_context = {"budget": 1000, "category": "electronics"}
    
    # Generate query embedding and use LlamaIndex to query
    query_engine = index.as_query_engine(similarity_top_k=2)
    response = query_engine.query(request.query)
    
    # Extract recommendations
    recommendations = [node.metadata["name"] for node in response.source_nodes]
    
    return {"recommendations": recommendations}

@app.post("/feedback")
async def submit_feedback(request: FeedbackRequest):
    # Mock Mem0 update
    user_context = {"user_id": request.user_id, "preferred_product": request.product_name, "rating": request.rating}
    # TODO: Update Mem0 or fine-tune sentence-transformers model
    return {"status": "Feedback recorded"}
