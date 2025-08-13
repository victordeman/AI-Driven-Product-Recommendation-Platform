import sqlite3
import json
import logging
from typing import Dict, List

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class ContextStore:
    def __init__(self, db_path: str = "config/context.db"):
        self.db_path = db_path
        self._initialize_db()

    def _initialize_db(self):
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS context (
                        vendor_id TEXT PRIMARY KEY,
                        preferences TEXT,
                        search_history TEXT
                    )
                """)
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS feedback (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        vendor_id TEXT,
                        product_name TEXT,
                        rating INTEGER,
                        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS vendor_inventory (
                        vendor_id TEXT,
                        product_id INTEGER,
                        quantity INTEGER,
                        PRIMARY KEY (vendor_id, product_id)
                    )
                """)
                # Populate vendor_inventory with sample data
                cursor.execute("DELETE FROM vendor_inventory")
                sample_inventory = [
                    ("vendor1", 1, 10), ("vendor1", 3, 5), ("vendor1", 5, 8),
                    ("vendor2", 2, 15), ("vendor2", 4, 7), ("vendor2", 6, 3),
                    ("vendor3", 1, 4), ("vendor3", 2, 6), ("vendor3", 5, 12)
                ]
                cursor.executemany(
                    "INSERT INTO vendor_inventory (vendor_id, product_id, quantity) VALUES (?, ?, ?)",
                    sample_inventory
                )
                conn.commit()
        except Exception as e:
            logger.error(f"Error initializing database: {str(e)}")
            raise

    def save_context(self, vendor_id: str, preferences: Dict, search_history: List[str]):
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT OR REPLACE INTO context (vendor_id, preferences, search_history) VALUES (?, ?, ?)",
                    (vendor_id, json.dumps(preferences), json.dumps(search_history))
                )
                conn.commit()
        except Exception as e:
            logger.error(f"Error saving context: {str(e)}")
            raise

    def get_context(self, vendor_id: str) -> Dict:
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT preferences, search_history FROM context WHERE vendor_id = ?",
                    (vendor_id,)
                )
                result = cursor.fetchone()
                if result:
                    return {
                        "preferences": json.loads(result[0]) if result[0] else {},
                        "search_history": json.loads(result[1]) if result[1] else []
                    }
                return {"preferences": {}, "search_history": []}
        except Exception as e:
            logger.error(f"Error getting context: {str(e)}")
            raise

    def save_feedback(self, vendor_id: str, product_name: str, rating: int):
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO feedback (vendor_id, product_name, rating) VALUES (?, ?, ?)",
                    (vendor_id, product_name, rating)
                )
                conn.commit()
        except Exception as e:
            logger.error(f"Error saving feedback: {str(e)}")
            raise

    def get_feedback(self, vendor_id: str) -> List[Dict]:
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT vendor_id, product_name, rating, timestamp FROM feedback WHERE vendor_id = ?",
                    (vendor_id,)
                )
                results = cursor.fetchall()
                return [
                    {"vendor_id": row[0], "product_name": row[1], "rating": row[2], "timestamp": row[3]}
                    for row in results
                ]
        except Exception as e:
            logger.error(f"Error getting feedback: {str(e)}")
            raise

    def get_vendor_inventory(self, vendor_id: str) -> List[Dict]:
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT product_id, quantity FROM vendor_inventory WHERE vendor_id = ?",
                    (vendor_id,)
                )
                results = cursor.fetchall()
                return [{"product_id": row[0], "quantity": row[1]} for row in results]
        except Exception as e:
            logger.error(f"Error getting vendor inventory: {str(e)}")
            raise