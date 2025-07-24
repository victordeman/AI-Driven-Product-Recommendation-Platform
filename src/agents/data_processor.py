from pydantic import BaseModel
from typing import Dict, List
from src.utils.context_store import ContextStore

class DataProcessorAgent:
    def __init__(self):
        self.context_store = ContextStore()

    def process_input(self, user_id: str, query: str) -> Dict:
        # Clean and preprocess query
        cleaned_query = query.strip().lower()
        
        # Retrieve or initialize user context
        user_context = self.context_store.get_context(user_id)
        if not user_context:
            user_context = {"budget": 1000, "category": "electronics", "search_history": []}
            self.context_store.update_context(user_id, user_context)
        
        # Update search history
        user_context["search_history"].append(cleaned_query)
        self.context_store.update_context(user_id, user_context)
        
        return {"user_id": user_id, "query": cleaned_query, "context": user_context}
