import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    print("WARNING: GEMINI_API_KEY is not set in environment variables.")

# Lazy or safe client initialization
try:
    if API_KEY:
        client = genai.Client(api_key=API_KEY)
    else:
        # Create a dummy client or leave None, handled in generate_text
        client = None
except Exception as e:
    print(f"Error initializing Gemini client: {e}")
    client = None

# Using a standard robust model.
MODEL_NAME = "gemini-2.5-flash" 

def generate_text(prompt: str) -> str:
    """Simple wrapper for text generation."""
    if not client:
        return "System Error: LLM Client not initialized (Missing API Key)."
        
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )
        return response.text
    except Exception as e:
        print(f"LLM Generation Error: {e}")
        return "I apologize, but I am having trouble connecting to my brain right now. Please try again later."
