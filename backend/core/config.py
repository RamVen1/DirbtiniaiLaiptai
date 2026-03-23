import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Dirbtiniai Laiptai"
    DB_NAME: str = "database.db"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    PORT: int = int(os.getenv("PORT", 8000))
    
settings = Settings()