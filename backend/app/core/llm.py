import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    print("WARNING: GEMINI_API_KEY is not set in environment variables.")

genai.configure(api_key=API_KEY)

# Using a standard robust model. User mentioned 'Gemini 2.5' which might mean the latest.
# We'll default to the latest stable flash model for speed and performance.
MODEL_NAME = "gemini-2.5-flash" 

def get_llm():
    """Returns the configured GenerativeModel instance."""
    return genai.GenerativeModel(MODEL_NAME)

def generate_text(prompt: str) -> str:
    """Simple wrapper for text generation."""
    model = get_llm()
    response = model.generate_content(prompt)
    return response.text
