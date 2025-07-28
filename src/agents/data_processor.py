import logging
from typing import Dict, List
from src.utils.context_store import ContextStore

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class DataProcessorAgent:
    def __init__(self):
        self.context_store = ContextStore()

    def process_input(self, vendor_id: str, query: str) -> Dict:
        try:
            cleaned_query = query.strip().lower()
            context = self.context_store.get_context(vendor_id)
            self.context_store.save_context(
                vendor_id,
                context.get("preferences", {}),
                context.get("search_history", []) + [cleaned_query]
            )
            return {"cleaned_query": cleaned_query}
        except Exception as e:
            logger.error(f"Error processing input: {str(e)}")
            raise
