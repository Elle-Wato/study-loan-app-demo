import os
from dotenv import load_dotenv

load_dotenv()  # Load .env

class Config:
    SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'fallback_secret')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'fallback_jwt')
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')

    # Add this to catch issues early
    if not SQLALCHEMY_DATABASE_URI:
        raise ValueError(f"DATABASE_URL not found in .env. Loaded value: {os.getenv('DATABASE_URL')}. Check .env file.")