import json
import os
from app.models.session import LoanApplicationState, AgentRole

# In-memory store for quick access
# In a real app, this would be Redis/Postgres.
# For this prototype, we'll back it with a JSON file.

STATE_FILE = "session_store.json"

class StateManager:
    def __init__(self):
        self._ensure_file()

    def _ensure_file(self):
        if not os.path.exists(STATE_FILE):
             with open(STATE_FILE, "w") as f:
                 json.dump({}, f)

    def _load_all(self):
        try:
            with open(STATE_FILE, "r") as f:
                return json.load(f)
        except:
            return {}

    def _save_all(self, data):
        with open(STATE_FILE, "w") as f:
            json.dump(data, f, indent=2)

    def get_state(self, session_id: str) -> LoanApplicationState:
        all_data = self._load_all()
        if session_id in all_data:
            return LoanApplicationState(**all_data[session_id])
        return self.create_session(session_id)

    def create_session(self, session_id: str, user_id: str = "guest") -> LoanApplicationState:
        new_state = LoanApplicationState(
            user_id=user_id,
            session_id=session_id
        )
        self.save_state(new_state)
        return new_state

    def save_state(self, state: LoanApplicationState):
        all_data = self._load_all()
        # Custom encoder usage by converting to dict first using pydantic
        all_data[state.session_id] = json.loads(state.json())
        self._save_all(all_data)

    def update_agent(self, session_id: str, new_agent: AgentRole):
        state = self.get_state(session_id)
        state.current_agent = new_agent
        self.save_state(state)

    def add_message(self, session_id: str, role: str, message: str):
        state = self.get_state(session_id)
        state.conversation_history.append({"role": role, "content": message})
        self.save_state(state)
