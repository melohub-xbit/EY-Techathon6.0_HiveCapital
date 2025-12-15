from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from dotenv import load_dotenv
from app.models.session import ChatRequest, ChatResponse
from app.core.state_manager import StateManager
from app.agents.master_agent import MasterAgent

load_dotenv()

app = FastAPI(title="BFSI Loan Sales Agent")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create static directory for sanction letters
STATIC_DIR = "backend/static"
os.makedirs(STATIC_DIR, exist_ok=True)

# Download endpoint with proper Content-Disposition header
@app.get("/download/{filename}")
async def download_file(filename: str):
    filepath = os.path.join(STATIC_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(
        path=filepath,
        filename=filename,
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

# Dependencies
state_manager = StateManager()
master_agent = MasterAgent(state_manager)

from app.routers import mock_api
app.include_router(mock_api.router, prefix="/api", tags=["Mock Services"])

@app.get("/")
def read_root():
    return {"message": "Agentic Sales Backend Operational", "status": "running"}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # Process via Master Agent
        response_text = master_agent.process_request(request.session_id, request.user_message)
        
        # Get latest state for UI updates (e.g., showing approval card)
        current_state = state_manager.get_state(request.session_id)
        
        # Serialize state safely
        state_dict = current_state.dict()
        
        return ChatResponse(
            session_id=request.session_id,
            agent_name=current_state.current_agent,
            message=response_text,
            state_snapshot=state_dict
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
