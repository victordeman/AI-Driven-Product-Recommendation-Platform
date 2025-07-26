import streamlit as st
import requests
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

st.title("AI-Driven Product Recommendation Platform")

user_id = st.text_input("Enter User ID", "123")
query = st.text_input("Enter Search Query", "laptop")

if st.button("Get Recommendations"):
    try:
        response = requests.post(
            "http://localhost:8000/recommend",
            json={"user_id": user_id, "query": query}
        )
        logger.debug(f"Response status: {response.status_code}, content: {response.text}")
        if response.status_code == 200:
            data = response.json()
            recommendations = data.get("recommendations", [])  # Extract recommendations list
            if recommendations:
                st.write("Recommendations:")
                for rec in recommendations:
                    st.write(f"- {rec.get('name', 'Unknown')} (ID: {rec.get('id', 'N/A')})")
            else:
                st.write("No recommendations found.")
        else:
            st.error(f"Error: {response.text}")
    except Exception as e:
        st.error(f"Failed to fetch recommendations: {str(e)}")
        logger.error(f"Error in request: {str(e)}")