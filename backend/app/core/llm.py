import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    print("WARNING: GEMINI_API_KEY is not set in environment variables.")

client = genai.Client(api_key=API_KEY)

# Using a standard robust model.
MODEL_NAME = "gemini-2.5-flash" 

def generate_text(prompt: str) -> str:
    """Simple wrapper for text generation."""
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt
    )
    return response.text
