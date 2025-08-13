import streamlit as st
import pandas as pd
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

st.title("AI-Driven Product Recommendation Platform")

# Mock data for testing
mock_products = [
    {"id": 1, "name": "Laptop X"},
    {"id": 2, "name": "Laptop Y"},
    {"id": 3, "name": "Smartphone Z"},
    {"id": 4, "name": "Tablet A"},
    {"id": 5, "name": "Headphones B"},
    {"id": 6, "name": "Smartwatch C"},
]
mock_vendors = ["vendor1", "vendor2", "vendor3"]
mock_vendor_products = {
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

# Initialize session state
if "recommendations" not in st.session_state:
    st.session_state.recommendations = []
if "narrative" not in st.session_state:
    st.session_state.narrative = ""

# Display available products
st.subheader("Available Products")
st.table(pd.DataFrame(mock_products))

# Vendor selection
vendor_id = st.selectbox("Select Vendor ID", [""] + mock_vendors)

if vendor_id and vendor_id != "":
    # Display vendor-specific products
    st.subheader(f"Products Available for {vendor_id}")
    vendor_product_table = [
        {"Number": i + 1, "Product ID": p["id"], "Name": p["name"], "Quantity": p["quantity"]}
        for i, p in enumerate(mock_vendor_products[vendor_id])
    ]
    st.table(pd.DataFrame(vendor_product_table))

    # Product selection
    product_options = [p["name"] for p in mock_vendor_products[vendor_id]]
    selected_product = st.selectbox("Select Product", [""] + product_options)

    if selected_product and selected_product != "":
        # Mock recommendations
        if st.button("Get Recommendations"):
            st.session_state.recommendations = [
                {"id": 1, "name": "Mock Product A"},
                {"id": 2, "name": "Mock Product B"},
                {"id": 3, "name": "Mock Product C"}
            ]
            st.session_state.narrative = (
                f"Based on your selection of '{selected_product}', we recommend: "
                f"{', '.join([r['name'] for r in st.session_state.recommendations])}. "
                f"These items are closely related to your choice (mock data)."
            )
            logger.info(f"Mock recommendations generated for {selected_product}")

        # Display recommendations
        if st.session_state.recommendations:
            st.subheader("Recommendations")
            st.write(st.session_state.narrative)
            recommendation_table = [
                {"Number": i + 1, "Product ID": r["id"], "Name": r["name"]}
                for i, r in enumerate(st.session_state.recommendations)
            ]
            st.table(pd.DataFrame(recommendation_table))

        # Feedback section
        st.subheader("Submit Feedback")
        feedback_options = [r["name"] for r in st.session_state.recommendations] or product_options
        feedback_product = st.selectbox("Select Product for Feedback", [""] + feedback_options)
        rating = st.slider("Rating", 1, 5, 3)
        if st.button("Submit Feedback"):
            if not feedback_product or feedback_product == "":
                st.error("Please select a product to provide feedback.")
            else:
                st.success(f"Feedback submitted for {feedback_product} with rating {rating} (mock).")
                logger.info(f"Mock feedback submitted: {feedback_product}, rating: {rating}")
else:
    st.info("Please select a Vendor ID to proceed.")
