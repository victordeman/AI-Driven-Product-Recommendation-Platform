# AI-Driven Product Recommendation Platform

## Project Overview

This project develops a SaaS platform that leverages a Multi-AI-Agent architecture to deliver personalized product recommendations for B2B and technical B2C e-commerce markets. The system uses user behavior, preferences, and contextual data to guide users to optimal product choices, improving conversion rates and user experience.

**Use Case**:
- **B2B**: A buyer searching for industrial machinery receives tailored recommendations based on industry, budget, and technical requirements.
- **B2C**: A consumer shopping for high-tech gadgets gets suggestions based on past searches, preferences, and product compatibility.

### Key Features
1. **Personalized Recommendations**: AI agents analyze user data to suggest relevant products.
2. **Context-Aware Conversations**: Maintain user context across sessions using Mem0.
3. **Scalable API**: FastAPI endpoints for real-time recommendation queries and data management.
4. **Secure Data Handling**: Input validation and PII protection for compliance.
5. **Vector Search**: Postgres VectorDB for efficient similarity-based product matching.

## Tech Stack
- **Python**: Core programming language for AI logic and API development.
- **AI Agents SDK**: OpenAI Agents SDK for Multi-AI-Agent orchestration.
- **Docker**: Containerization for development and deployment.
- **FastAPI**: RESTful APIs for user interaction and recommendation delivery.
- **Mem0**: Memory-augmented AI agents for context retention.
- **Postgres VectorDB**: Store and query product embeddings for similarity searches.
- **Pytest**: Automated testing for reliability.
- **Pydantic**: Data validation for user inputs and API responses.
- **Streamlit**: Interactive web interface for user interaction and analytics.

## Repository Structure
```
AI-Driven-Product-Recommendation-Platform/
├── src/
│   ├── api/                    # FastAPI endpoints
│   │   ├── __init__.py
│   │   └── main.py            # Main API application
│   ├── agents/                # AI agent logic and workflows
│   │   ├── __init__.py
│   ├── models/                # Pydantic data models
│   │   ├── __init__.py
│   │   └── user_profile.py    # User profile model
│   ├── utils/                 # Utility functions (e.g., data preprocessing)
│   │   ├── __init__.py
├── tests/                     # Pytest test scripts
│   ├── __init__.py
│   └── test_api.py            # API endpoint tests
├── streamlit/                 # Streamlit interface
│   └── app.py                 # Streamlit application
├── scripts/                   # Utility scripts (e.g., database setup)
│   └── setup_db.py
├── docker/                    # Docker configurations
├── Dockerfile                 # Docker image configuration
├── docker-compose.yml         # Docker Compose for multi-container setup
├── requirements.txt           # Python dependencies
├── .gitignore                 # Git ignore file
└── README.md                  # Project documentation
```

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/victordeman/AI-Driven-Product-Recommendation-Platform.git
   cd AI-Driven-Product-Recommendation-Platform
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set Up Environment**:
   - Create a `.env` file with database credentials and API keys:
     ```
     DATABASE_URL=postgresql://user:pass@localhost:5432/db
     ```

4. **Run Postgres VectorDB**:
   ```bash
   docker-compose up -d
   ```

5. **Run FastAPI Server**:
   ```bash
   uvicorn src.api.main:app --host 0.0.0.0 --port 8000
   ```

6. **Run Streamlit Interface**:
   ```bash
   streamlit run streamlit/app.py
   ```

7. **Run Tests**:
   ```bash
   pytest tests/
   ```

## Development Workflow
- **AI Agent Development**: Implement agents in `src/agents/` using OpenAI Agents SDK.
- **API Development**: Add endpoints in `src/api/main.py` using FastAPI.
- **Data Models**: Define Pydantic models in `src/models/`.
- **Testing**: Write tests in `tests/` using Pytest.
- **Database**: Use `scripts/setup_db.py` to initialize Postgres VectorDB.

## Future Enhancements
- Real-time analytics dashboard in Streamlit.
- Multimodal recommendations (e.g., image-based product matching).
- A/B testing for recommendation algorithms.

## Contributing
- Follow the Scrum methodology with daily stand-ups and weekly sprints.
- Use Git for version control and submit pull requests for review.
- Ensure all code is tested with Pytest and adheres to security standards (e.g., PII protection).

---

**License**: MIT  
**Contact**: [Your Name/Email]  
**Repository**: https://github.com/victordeman/AI-Driven-Product-Recommendation-Platform.git
