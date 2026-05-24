from fastapi import FastAPI
from pydantic import BaseModel
from src.agents.data_processor import DataProcessorAgent
from src.agents.recommendation_engine import RecommendationEngineAgent
from src.utils.context_store import ContextStore
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

# Use lazy initialization for agents that require external services or heavy setup
data_processor = None
recommendation_engine = None
context_store = None

def get_data_processor():
    global data_processor
    if data_processor is None:
        data_processor = DataProcessorAgent()
    return data_processor

def get_recommendation_engine():
    global recommendation_engine
    if recommendation_engine is None:
        recommendation_engine = RecommendationEngineAgent()
    return recommendation_engine

def get_context_store():
    global context_store
    if context_store is None:
        context_store = ContextStore()
    return context_store

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
        processor = get_data_processor()
        engine = get_recommendation_engine()
        processed_data = processor.process_input(request.vendor_id, request.query)
        result = engine.recommend(processed_data['cleaned_query'], request.vendor_id)
        return result  # Returns {"recommendations": [...], "narrative": "..."}
    except Exception as e:
        logger.error(f"Error in recommendation endpoint: {str(e)}")
        raise RuntimeError(f"Error in recommendation endpoint: {str(e)}")

@app.post("/feedback")
async def submit_feedback(request: FeedbackRequest):
    try:
        store = get_context_store()
        store.save_feedback(request.vendor_id, request.product_name, request.rating)
        return {"message": f"Feedback saved for vendor {request.vendor_id} on {request.product_name} with rating {request.rating}"}
    except Exception as e:
        logger.error(f"Error in feedback endpoint: {str(e)}")
        raise RuntimeError(f"Error in feedback endpoint: {str(e)}")
