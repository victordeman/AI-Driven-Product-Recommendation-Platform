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
            rating = st.slider(f"Rate {product}", 1, 5, 3, key=product)
            if st.button(f"Submit Rating for {product}", key=f"submit_{product}"):
                requests.post("http://localhost:8000/feedback", json={"user_id": user_id, "product_name": product, "rating": rating})
                st.success(f"Feedback submitted for {product}")
    else:
        st.error("Error fetching recommendations")
