from fastapi import FastAPI
from pydantic import BaseModel
from src.agents.data_processor import DataProcessorAgent
from src.agents.embedding_generator import EmbeddingGeneratorAgent
from src.agents.recommendation_engine import RecommendationEngineAgent
from src.utils.context_store import ContextStore

app = FastAPI()
data_processor = DataProcessorAgent()
embedding_generator = EmbeddingGeneratorAgent()
recommendation_engine = RecommendationEngineAgent()
context_store = ContextStore()

class RecommendationRequest(BaseModel):
    user_id: str
    query: str

class FeedbackRequest(BaseModel):
    user_id: str
    product_name: str
    rating: int

@app.post("/recommend")
async def get_recommendations(request: RecommendationRequest):
    # Process input
    processed_data = data_processor.process_input(request.user_id, request.query)
    
    # Generate recommendations
    recommendations = await recommendation_engine.get_recommendations(processed_data["query"])
    
    return {"recommendations": [r["name"] for r in recommendations]}

@app.post("/feedback")
async def submit_feedback(request: FeedbackRequest):
    # Store feedback
    context_store.store_feedback(request.user_id, request.product_name, request.rating)
    
    # Placeholder for fine-tuning
    # embedding_generator.fine_tune(context_store.get_context(request.user_id)["feedback"])
    
    return {"status": "Feedback recorded"}
