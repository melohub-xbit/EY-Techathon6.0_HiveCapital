import json
import os
from app.models.session import LoanApplicationState, AgentRole

# In-memory store for Cloud Run
# Since Cloud Run is stateless, this data resets on restart.
# For production, use Firestore, Redis, or a SQL DB.
GLOBAL_STATE_STORE = {}

class StateManager:
    def __init__(self):
        pass

    def get_state(self, session_id: str) -> LoanApplicationState:
        if session_id in GLOBAL_STATE_STORE:
            # Return a copy or re-instantiate to avoid direct mutable reference issues if needed
            return LoanApplicationState(**GLOBAL_STATE_STORE[session_id])
        return self.create_session(session_id)

    def create_session(self, session_id: str, user_id: str = "guest") -> LoanApplicationState:
        new_state = LoanApplicationState(
            user_id=user_id,
            session_id=session_id
        )
        self.save_state(new_state)
        return new_state

    def save_state(self, state: LoanApplicationState):
        try:
             # Store as dict to simulate serialization and ensure clean state
            GLOBAL_STATE_STORE[state.session_id] = json.loads(state.json())
        except Exception as e:
            print(f"Error saving state: {e}")

    def update_agent(self, session_id: str, new_agent: AgentRole):
        state = self.get_state(session_id)
        state.current_agent = new_agent
        self.save_state(state)

    def add_message(self, session_id: str, role: str, message: str):
        state = self.get_state(session_id)
        state.conversation_history.append({"role": role, "content": message})
        self.save_state(state)
