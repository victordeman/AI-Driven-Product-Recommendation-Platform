from fastapi.testclient import TestClient
from src.api.main import app
from src.utils.context_store import ContextStore

client = TestClient(app)

def test_recommendation_endpoint():
    response = client.post("/recommend", json={"vendor_id": "vendor1", "query": "Laptop X"})
    assert response.status_code == 200
    assert "recommendations" in response.json()
    assert "narrative" in response.json()
    assert len(response.json()["recommendations"]) > 0
    assert any(r["name"] in ["Laptop X", "Laptop Y"] for r in response.json()["recommendations"])

def test_feedback_endpoint():
    response = client.post("/feedback", json={"vendor_id": "vendor1", "product_name": "Laptop X", "rating": 4})
    assert response.status_code == 200
    assert "message" in response.json()

    context_store = ContextStore()
    feedback = context_store.get_feedback("vendor1")
    assert any(f["vendor_id"] == "vendor1" and f["product_name"] == "Laptop X" and f["rating"] == 4 for f in feedback)

def test_multi_user_recommendations():
    response1 = client.post("/recommend", json={"vendor_id": "vendor1", "query": "Smartphone Z"})
    response2 = client.post("/recommend", json={"vendor_id": "vendor2", "query": "Tablet A"})
    response3 = client.post("/recommend", json={"vendor_id": "vendor3", "query": "Smartwatch C"})
    assert response1.status_code == 200
    assert response2.status_code == 200
    assert response3.status_code == 200
    assert "narrative" in response1.json()
    assert "narrative" in response2.json()
    assert "narrative" in response3.json()
    assert any(r["name"] == "Smartphone Z" for r in response1.json()["recommendations"])
    assert any(r["name"] == "Tablet A" for r in response2.json()["recommendations"])
    assert any(r["name"] == "Smartwatch C" for r in response3.json()["recommendations"])

def test_new_products():
    response = client.post("/recommend", json={"vendor_id": "vendor1", "query": "Headphones B"})
    assert response.status_code == 200
    assert "narrative" in response.json()
    assert any(r["name"] == "Headphones B" for r in response.json()["recommendations"])