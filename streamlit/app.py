import streamlit as st
import requests
import logging
import pandas as pd

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

st.title("AI-Driven Product Recommendation Platform")

# All available products
products = [
    {"id": 1, "name": "Laptop X"},
    {"id": 2, "name": "Laptop Y"},
    {"id": 3, "name": "Smartphone Z"},
    {"id": 4, "name": "Tablet A"},
    {"id": 5, "name": "Headphones B"},
    {"id": 6, "name": "Smartwatch C"},
]
st.subheader("Available Products")
st.table(pd.DataFrame(products))

# Vendor product quantities
vendor_products = {
    "vendor1": [
        {"id": 1, "name": "Laptop X", "quantity": 5},
        {"id": 3, "name": "Smartphone Z", "quantity": 3},
        {"id": 5, "name": "Headphones B", "quantity": 10},
    ],
    "vendor2": [
        {"id": 2, "name": "Laptop Y", "quantity": 4},
        {"id": 4, "name": "Tablet A", "quantity": 6},
        {"id": 6, "name": "Smartwatch C", "quantity": 2},
    ],
    "vendor3": [
        {"id": 1, "name": "Laptop X", "quantity": 2},
        {"id": 3, "name": "Smartphone Z", "quantity": 7},
        {"id": 4, "name": "Tablet A", "quantity": 4},
    ],
}

# Vendor ID dropdown
vendor_ids = ["vendor1", "vendor2", "vendor3"]
vendor_id = st.selectbox("Select Vendor ID", [""] + vendor_ids)

# Store recommendations in session state
if "recommendations" not in st.session_state:
    st.session_state.recommendations = []

# Show vendor products and product selection if vendor_id is selected
if vendor_id and vendor_id != "":
    st.subheader(f"Products Available for {vendor_id}")
    vendor_product_table = [
        {"Number": i + 1, "Product ID": p["id"], "Name": p["name"], "Quantity": p["quantity"]}
        for i, p in enumerate(vendor_products[vendor_id])
    ]
    st.table(pd.DataFrame(vendor_product_table))

    product_options = [p["name"] for p in vendor_products[vendor_id]]
    selected_product = st.selectbox("Select Product", [""] + product_options)

    if selected_product and selected_product != "":
        if st.button("Get Recommendations"):
            try:
                response = requests.post(
                    "http://localhost:8000/recommend",
                    json={"vendor_id": vendor_id, "query": selected_product}
                )
                logger.debug(f"Response status: {response.status_code}, content: {response.text}")
                if response.status_code == 200:
                    data = response.json()
                    st.session_state.recommendations = data.get("recommendations", [])
                    narrative = data.get("narrative", "No recommendation narrative available.")
                    if st.session_state.recommendations:
                        st.subheader("Recommendations")
                        st.write(narrative)
                        for rec in st.session_state.recommendations:
                            st.write(f"- {rec.get('name', 'Unknown')} (ID: {rec.get('id', 'N/A')})")
                    else:
                        st.write("No recommendations found.")
                else:
                    st.error(f"Error: {response.text}")
            except Exception as e:
                st.error(f"Failed to fetch recommendations: {str(e)}")
                logger.error(f"Error in request: {str(e)}")

        st.subheader("Submit Feedback")
        feedback_options = [rec.get('name', 'Unknown') for rec in st.session_state.recommendations]
        feedback_product = st.selectbox("Select Product for Feedback", [""] + feedback_options)
        rating = st.slider("Rating", 1, 5, 3)
        if st.button("Submit Feedback"):
            if not feedback_product or feedback_product == "":
                st.error("Please select a product to provide feedback.")
            else:
                try:
                    response = requests.post(
                        "http://localhost:8000/feedback",
                        json={"vendor_id": vendor_id, "product_name": feedback_product, "rating": rating}
                    )
                    logger.debug(f"Feedback response: {response.status_code}, content: {response.text}")
                    if response.status_code == 200:
                        st.success(response.json().get("message", "Feedback submitted successfully"))
                    else:
                        st.error(f"Error: {response.text}")
                except Exception as e:
                    st.error(f"Failed to submit feedback: {str(e)}")
                    logger.error(f"Error in feedback request: {str(e)}")
else:
    st.info("Please select a Vendor ID to proceed.")