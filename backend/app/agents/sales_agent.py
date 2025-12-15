from app.models.session import LoanApplicationState, AgentRole
from app.core.llm import generate_text
from app.core.state_manager import StateManager
from app.core.mock_data import PRODUCT_CATALOG
import json

class SalesAgent:
    def __init__(self):
        self.products = PRODUCT_CATALOG

    def process(self, state: LoanApplicationState, user_message: str) -> str:
        # 1. Analyze Core Intent & Extract Entities (Amount, Tenure)
        prompt = f"""
        You are a Sales Agent for Hive Capital. You are negotiating a personal loan.
        Current State:
        - Loan Amount: {state.loan_amount}
        - Tenure: {state.loan_tenure}
        
        Product Rules:
        - Min Amount: {self.products['personal_loan']['min_amount']}
        - Max Amount: {self.products['personal_loan']['max_amount']}
        - Interest Rate starts at {self.products['personal_loan']['base_interest_rate']}%
        
        User Message: "{user_message}"
        
        Task:
        1. Extract loan amount and tenure if mentioned.
        2. If user agrees to proceed/apply, output tag <ACTION:AGREE>.
        3. If user has questions, answer them based on product rules.
        4. Be persuasive but polite.
        
        Output Format (JSON-like for system parsing at end, but natural language first):
        [Natural Language Response]
        <JSON>
        {{
            "amount": number or null, 
            "tenure": number or null,
            "action": "CONTINUE" or "AGREE"
        }}
        </JSON>
        """
        
        llm_response = generate_text(prompt)
        
        # 2. Parse Component
        response_text = llm_response
        extracted_data = {}
        
        if "<JSON>" in llm_response:
            parts = llm_response.split("<JSON>")
            response_text = parts[0].strip()
            try:
                json_str = parts[1].replace("</JSON>", "").strip()
                extracted_data = json.loads(json_str)
            except:
                pass

        # 3. Update State
        if extracted_data.get("amount"):
            state.loan_amount = float(extracted_data["amount"])
        if extracted_data.get("tenure"):
            state.loan_tenure = int(extracted_data["tenure"])
            
        # 4. Handle Transitions
        if extracted_data.get("action") == "AGREE":
            # Handoff to Verification
            state.current_agent = AgentRole.VERIFICATION
            response_text += "\n\n(System: Transferring to Verification Agent...)"
        
        # Explicitly save state changes (amount, tenure, agent role)
        
        manager = StateManager()
        manager.save_state(state)
        
        return response_text
