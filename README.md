# AI-Driven Product Recommendation Platform

## Project Overview

This project develops a SaaS platform that leverages a Multi-AI-Agent architecture using LlamaIndex to deliver personalized product recommendations for B2B and technical B2C e-commerce markets. The system uses user behavior, preferences, and contextual data to guide users to optimal product choices, improving conversion rates and user experience.

**Use Case**:
- **B2B**: A buyer searching for industrial machinery receives tailored recommendations based on industry, budget, and technical requirements.
- **B2C**: A consumer shopping for high-tech gadgets gets suggestions based on past searches, preferences, and product compatibility.

### Key Features
1. **Personalized Recommendations**: AI agents analyze user data to suggest relevant products.
2. **Context-Aware Conversations**: Maintain user context across sessions using Mem0.
3. **Scalable API**: FastAPI endpoints for real-time recommendation queries and data management.
4. **Secure Data Handling**: Input validation and PII protection for compliance.
5. **Vector Search**: Postgres VectorDB for efficient similarity-based product matching.
6. **Feedback Loop**: User ratings refine recommendations via context updates and model fine-tuning.

## Tech Stack
- **Python 3.10**: Core language for AI and API logic.
- **LlamaIndex SDK**: Open-source framework for indexing and querying, no API keys needed.
- **FastAPI**: Scalable RESTful APIs for recommendations.
- **Streamlit**: Interactive UI for user interaction.
- **Mem0**: Context retention for personalized experiences.
- **Postgres VectorDB**: Efficient similarity searches (requires pgvector extension).
- **Pydantic**: Data validation for secure inputs.
- **Pytest**: Automated testing for reliability.

## Repository Structure
```
AI-Driven-Product-Recommendation-Platform/
├── src/
│   ├── api/                    # FastAPI endpoints
│   │   ├── __init__.py
│   │   └── main.py            # Main API application
│   ├── agents/                # LlamaIndex logic and workflows
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
├── config/                    # Configuration files
├── requirements.txt           # Python dependencies
├── .gitignore                 # Git ignore file
├── .env                       # Environment variables
└── README.md                  # Project documentation
```

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/victordeman/AI-Driven-Product-Recommendation-Platform.git
   cd AI-Driven-Product-Recommendation-Platform
   ```

2. **Install PostgreSQL and pgvector**:
   - Install PostgreSQL 16 and development libraries:
     ```bash
     sudo dnf install -y postgresql16 postgresql16-server postgresql16-devel
     ```
   - Initialize PostgreSQL (if not already initialized):
     ```bash
     sudo /usr/pgsql-16/bin/postgresql-16-setup initdb
     sudo systemctl enable postgresql-16
     sudo systemctl start postgresql-16
     ```
   - Install pgvector:
     ```bash
     cd /tmp
     git clone --branch v0.8.0 https://github.com/pgvector/pgvector.git
     cd pgvector
     make
     sudo make install
     ```
   - Set up the database:
     ```bash
     sudo -u postgres psql -c "CREATE DATABASE recommendation_db;"
     sudo -u postgres psql -d recommendation_db -c "CREATE EXTENSION vector;"
     sudo -u postgres psql -c "CREATE USER user WITH PASSWORD 'pass';"
     sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE recommendation_db TO user;"
     ```

3. **Set Up Python Environment**:
   ```bash
   python3.10 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

4. **Set Up Environment**:
   - Edit `.env` with your PostgreSQL credentials:
     ```
     DATABASE_URL=postgresql://user:pass@localhost:5432/recommendation_db
     ```

5. **Initialize the Database**:
   ```bash
   python scripts/setup_db.py
   ```

6. **Run FastAPI Server**:
   ```bash
   uvicorn src.api.main:app --host 0.0.0.0 --port 8000
   ```

7. **Run Streamlit Interface**:
   ```bash
   streamlit run streamlit/app.py
   ```

8. **Run Tests**:
   ```bash
   pytest tests/
   ```

## System Workflow
```
[User Input] --> [Streamlit UI]
                     |
                     v
[FastAPI Endpoint] --> [LlamaIndex: Data Processor]
                                  |
                                  v
[Mem0: Context Storage] <--> [LlamaIndex: Embedding Generator]
                                  |
                                  v
[Postgres VectorDB: Product Embeddings] --> [LlamaIndex: Query Engine]
                                  |
                                  v
[Recommendation Output] --> [Streamlit UI]
                                  |
                                  v
[User Feedback: Ratings/Selections] --> [Feedback Loop: Update Mem0 & Fine-Tune Embeddings]
                                  |
                                  v
[Back to LlamaIndex: Embedding Generator]
```

## Development Workflow
- **LlamaIndex Development**: Implement indexing and querying in `src/agents/`.
- **API Development**: Add endpoints in `src/api/main.py` using FastAPI.
- **Data Models**: Define Pydantic models in `src/models/`.
- **Testing**: Write tests in `tests/` using Pytest.
- **Database**: Use `scripts/setup_db.py` to initialize Postgres VectorDB.

## Future Enhancements
- Real-time analytics dashboard in Streamlit.
- Multimodal recommendations (e.g., image-based matching).
- A/B testing for recommendation algorithms.

## Contributing
- Follow Scrum methodology with daily stand-ups and weekly sprints.
- Use Git for version control and submit pull requests.
- Ensure code is tested with Pytest and adheres to security standards.

**License**: MIT  
**Repository**: https://github.com/victordeman/AI-Driven-Product-Recommendation-Platform.git
