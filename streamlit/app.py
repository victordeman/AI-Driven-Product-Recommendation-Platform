import streamlit as st
import requests

st.title("AI-Driven Product Recommendation Platform")

user_id = st.text_input("User ID", "123")
query = st.text_input("Search Query", "laptop")

if st.button("Get Recommendations"):
    response = requests.post("http://localhost:8000/recommend", json={"user_id": user_id, "query": query})
    if response.status_code == 200:
        recommendations = response.json().get("recommendations", [])
        st.write("### Recommended Products")
        for product in recommendations:
            st.write(f"- {product}")
    else:
        st.error("Error fetching recommendations")
