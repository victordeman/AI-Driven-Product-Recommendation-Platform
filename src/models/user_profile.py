from pydantic import BaseModel, validator

class UserProfile(BaseModel):
    user_id: str
    preferences: dict
    search_history: list[str]

    @validator("preferences")
    def validate_preferences(cls, v):
        if not v.get("budget") or not v.get("category"):
            raise ValueError("Budget and category are required")
        return v
