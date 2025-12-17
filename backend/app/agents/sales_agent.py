from app.models.session import LoanApplicationState, AgentRole
from app.core.llm import generate_text
from app.core.state_manager import StateManager
from app.core.mock_data import PRODUCT_CATALOG
import json

class SalesAgent:
    def __init__(self):
        self.products = PRODUCT_CATALOG

    def process(self, state: LoanApplicationState, user_message: str) -> str:
        # 0. IDENTIFICATION PROTOCOL
        if not state.pre_approved_limit and not state.phone:
            # Check if user provided phone number
            # Simple regex for 10 digits
            import re
            phone_match = re.search(r'\b\d{10}\b', user_message)
            
            if phone_match:
                phone = phone_match.group(0)
                from app.mock.data_generator import mock_db
                customer = mock_db.get_customer_by_phone(phone)
                
                if customer:
                    # Hydrate State
                    state.user_id = customer["id"] # Link session to user
                    state.name = customer["name"]
                    state.phone = customer["phone"]
                    state.income = float(customer["monthly_income"])
                    state.email = customer["email"]
                    
                    # Fetch Offer
                    offer = mock_db.get_offer(customer["id"])
                    if offer:
                        state.pre_approved_limit = float(offer["pre_approved_limit"])
                        state.interest_rate = float(offer["interest_rate"])
                        
                        response_text = f"Thank you {state.name}. I've successfully verified your profile. Great news! You have a pre-approved offer up to ₹{state.pre_approved_limit:,.0f} with a special interest rate of {state.interest_rate}%."
                    else:
                        response_text = f"Thank you {state.name}. I've verified your profile. While I don't see a pre-approved offer at this moment, we can certainly proceed with a fresh application."
                    
                    # Save and return immediately to let user respond to the offer
                    from app.core.state_manager import StateManager
                    manager = StateManager()
                    manager.save_state(state)
                    return response_text
                else:
                    return "I couldn't find a customer record with that mobile number. Please check the number or we can proceed as a new customer."
            
            # If no phone number found and no offer, prompt for it
            # But only if we haven't asked recently (check history? or just rely on flow)
            # For simplicity, if we are in SALES and state has no identity, we prioritize identity.
            if "loan" in user_message.lower() or "hi" in user_message.lower() or "hello" in user_message.lower():
                 return "To provide you with the best personalized offers, could you please share your registered mobile number?"

        # 1. Analyze Core Intent & Extract Entities (Amount, Tenure)
        prompt = f"""
        You are a Sales Agent for Hive Capital. You are negotiating a personal loan.
        Current State:
        - Loan Amount: {state.loan_amount}
        - Tenure: {state.loan_tenure}
        
        Customer Context (Pre-approved Offer):
        - Name: {state.name if state.name else 'Unknown'}
        - Max Amount: {state.pre_approved_limit if state.pre_approved_limit else 'None'}
        - Special Interest Rate: {state.interest_rate if state.interest_rate else 'Standard'}%
        
        Product Rules:
        - Min Amount: {self.products['personal_loan']['min_amount']}
        - Max Amount: {self.products['personal_loan']['max_amount']}
        - Interest Rate starts at {self.products['personal_loan']['base_interest_rate']}%
        
        User Message: "{user_message}"
        
        Task:
        1. Extract loan amount and tenure if mentioned.
        2. IF Pre-approved Offer exists:
           - Emphasize it initially.
           - CRITICAL: If the user EXPLICITLY REJECTS the pre-approved amount or INSISTS on a higher amount (e.g., "go with 2 lakhs", "proceed with application for 2 lakhs"), ACCEPT their request.
           - In that case, output <ACTION:AGREE> and set "amount" to the USER'S requested value (not the pre-approved one). 
           - Do not keep pushing the pre-approved offer if they've already said "proceed" with the higher amount.
        3. If no offer, just negotiate standard terms.
        4. If user agrees to proceed/apply, output tag <ACTION:AGREE>.
        5. If user has questions, answer them based on product rules.
        6. Be persuasive but polite.
        7. EDGE CASE: If the user says they are a "New Customer" or don't have a registered number:
           - Acknowledge it warmly.
           - STOP asking for the phone number.
           - Immediately ask for their desired loan amount and tenure.
        
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
        
        from app.core.state_manager import StateManager
        manager = StateManager()
        manager.save_state(state)
        
        return response_text
