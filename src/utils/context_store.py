import sqlite3
from typing import Dict, Optional

class ContextStore:
    def __init__(self):
        self.conn = sqlite3.connect("config/context.db")
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS user_context (
                user_id TEXT PRIMARY KEY,
                context TEXT
            )
        """)
        self.conn.commit()

    def get_context(self, user_id: str) -> Optional[Dict]:
        cursor = self.conn.cursor()
        cursor.execute("SELECT context FROM user_context WHERE user_id = ?", (user_id,))
        result = cursor.fetchone()
        return eval(result[0]) if result else None

    def update_context(self, user_id: str, context: Dict):
        cursor = self.conn.cursor()
        cursor.execute("INSERT OR REPLACE INTO user_context (user_id, context) VALUES (?, ?)",
                       (user_id, str(context)))
        self.conn.commit()

    def store_feedback(self, user_id: str, product_name: str, rating: int):
        context = self.get_context(user_id) or {"budget": 1000, "category": "electronics", "search_history": []}
        if "feedback" not in context:
            context["feedback"] = []
        context["feedback"].append({"product_name": product_name, "rating": rating})
        self.update_context(user_id, context)

    def __del__(self):
        self.conn.close()
