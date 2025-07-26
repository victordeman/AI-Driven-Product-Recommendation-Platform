import sqlite3
import os
from typing import List, Dict
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class ContextStore:
    def __init__(self, db_path: str = "config/context.db"):
        self.db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", db_path)
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self._initialize_db()

    def _initialize_db(self):
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS context (
                        user_id TEXT PRIMARY KEY,
                        preferences TEXT,
                        history TEXT
                    )
                """)
                conn.commit()
        except sqlite3.OperationalError as e:
            logger.error(f"Failed to initialize SQLite database: {str(e)}")
            raise RuntimeError(f"Failed to initialize SQLite database: {str(e)}")

    def save_context(self, user_id: str, preferences: Dict, history: List[str]) -> None:
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                preferences_str = str(preferences)
                history_str = str(history)
                cursor.execute("""
                    INSERT OR REPLACE INTO context (user_id, preferences, history)
                    VALUES (?, ?, ?)
                """, (user_id, preferences_str, history_str))
                conn.commit()
        except sqlite3.OperationalError as e:
            logger.error(f"Error saving context: {str(e)}")
            raise RuntimeError(f"Error saving context: {str(e)}")

    def get_context(self, user_id: str) -> Dict:
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT preferences, history FROM context WHERE user_id = ?", (user_id,))
                result = cursor.fetchone()
                if result:
                    return {
                        "preferences": eval(result[0]) if result[0] else {},
                        "search_history": eval(result[1]) if result[1] else []
                    }
                return {"preferences": {}, "search_history": []}
        except sqlite3.OperationalError as e:
            logger.error(f"Error getting context: {str(e)}")
            raise RuntimeError(f"Error getting context: {str(e)}")