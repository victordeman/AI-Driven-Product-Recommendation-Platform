from src.utils.context_store import ContextStore
from typing import Dict, List
import re

class DataProcessorAgent:
    def __init__(self):
        self.context_store = ContextStore()

    def clean_query(self, query: str) -> str:
        # Basic cleaning: lowercase and remove special characters
        cleaned = re.sub(r'[^\w\s]', '', query.lower())
        return cleaned

    def process_input(self, user_id: str, query: str) -> Dict:
        try:
            cleaned_query = self.clean_query(query)
            user_context = self.context_store.get_context(user_id)
            # Ensure search_history exists
            if 'search_history' not in user_context:
                user_context['search_history'] = []
            user_context['search_history'].append(cleaned_query)
            # Save updated context
            self.context_store.save_context(
                user_id,
                user_context.get('preferences', {}),
                user_context['search_history']
            )
            return {
                'user_id': user_id,
                'cleaned_query': cleaned_query,
                'context': user_context
            }
        except Exception as e:
            raise RuntimeError(f"Error processing input: {str(e)}")