from fastapi import FastAPI
from pydantic import BaseModel
from src.agents.data_processor import DataProcessorAgent
from src.agents.recommendation_engine import RecommendationEngineAgent
from src.utils.context_store import ContextStore
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

data_processor = DataProcessorAgent()
recommendation_engine = RecommendationEngineAgent()
context_store = ContextStore()

class RecommendationRequest(BaseModel):
    vendor_id: str
    query: str

class FeedbackRequest(BaseModel):
    vendor_id: str
    product_name: str
    rating: int

@app.post("/recommend")
async def get_recommendations(request: RecommendationRequest):
    try:
        processed_data = data_processor.process_input(request.vendor_id, request.query)
        result = recommendation_engine.recommend(processed_data['cleaned_query'], request.vendor_id)
        return result  # Returns {"recommendations": [...], "narrative": "..."}
    except Exception as e:
        logger.error(f"Error in recommendation endpoint: {str(e)}")
        raise RuntimeError(f"Error in recommendation endpoint: {str(e)}")

@app.post("/feedback")
async def submit_feedback(request: FeedbackRequest):
    try:
        context_store.save_feedback(request.vendor_id, request.product_name, request.rating)
        return {"message": f"Feedback saved for vendor {request.vendor_id} on {request.product_name} with rating {request.rating}"}
    except Exception as e:
        logger.error(f"Error in feedback endpoint: {str(e)}")
        raise RuntimeError(f"Error in feedback endpoint: {str(e)}")