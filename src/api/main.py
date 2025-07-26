from fastapi import FastAPI
from pydantic import BaseModel
from src.agents.embedding_generator import EmbeddingGeneratorAgent
from src.agents.recommendation_engine import RecommendationEngineAgent
from src.agents.data_processor import DataProcessorAgent
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI-Driven Product Recommendation Platform")
data_processor = DataProcessorAgent()
recommendation_engine = RecommendationEngineAgent()

class RecommendationRequest(BaseModel):
    user_id: str
    query: str

class FeedbackRequest(BaseModel):
    user_id: str
    product_name: str
    rating: int

@app.get("/")
async def root():
    return {"message": "Welcome to the AI-Driven Product Recommendation Platform. Use POST /recommend to get recommendations."}

@app.post("/recommend")
async def get_recommendations(request: RecommendationRequest):
    try:
        processed_data = data_processor.process_input(request.user_id, request.query)
        recommendations = recommendation_engine.recommend(processed_data['cleaned_query'], request.user_id)
        return {"recommendations": recommendations}
    except Exception as e:
        logger.error(f"Error in recommendation endpoint: {str(e)}")
        raise RuntimeError(f"Error in recommendation endpoint: {str(e)}")

@app.post("/feedback")
async def submit_feedback(request: FeedbackRequest):
    try:
        logger.debug(f"Received feedback: {request}")
        # Placeholder: Store feedback (e.g., in SQLite or PostgreSQL)
        return {"message": f"Feedback received for user {request.user_id} on {request.product_name} with rating {request.rating}"}
    except Exception as e:
        logger.error(f"Error in feedback endpoint: {str(e)}")
        raise RuntimeError(f"Error in feedback endpoint: {str(e)}")