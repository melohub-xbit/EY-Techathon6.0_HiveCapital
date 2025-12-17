from app.models.session import LoanApplicationState, AgentRole
from app.core.llm import generate_text
from app.core.state_manager import StateManager
from app.core.mock_data import CRM_DATABASE
import json
import re

def normalize_phone(phone: str) -> str:
    """Extract just the digits from a phone number for comparison."""
    return re.sub(r'\D', '', phone)

def find_phone_in_crm(phone: str) -> str | None:
    """Find a phone number in CRM database, handling various formats."""
    normalized_input = normalize_phone(phone)
    
    for crm_phone in CRM_DATABASE.keys():
        normalized_crm = normalize_phone(crm_phone)
        # Match if the digits match (ignoring country code variations)
        if normalized_input == normalized_crm:
            return crm_phone
        # Also match if one is a suffix of the other (handles 10-digit vs 12-digit)
        if normalized_input.endswith(normalized_crm[-10:]) or normalized_crm.endswith(normalized_input[-10:]):
            return crm_phone
    return None

class VerificationAgent:
    def process(self, state: LoanApplicationState, user_message: str) -> str:
        manager = StateManager()
        print("VerificationAgent: ")
        
        # 1. Check what we need
        if not state.phone:
            # We need to ask for phone number
            # Simple heuristic: Check if user provided it in this message
            # For robustness, use LLM to extract
            prompt = f"""
            Extract phone number from user message: "{user_message}".
            Return ONLY the digits if found, else return "NOT_FOUND".
            """
            phone_extraction = generate_text(prompt).strip()
            
            # Clean up the extraction - remove any non-digit characters
            phone_digits = re.sub(r'\D', '', phone_extraction)
            
            if len(phone_digits) >= 10:
                state.phone = phone_digits
                
                # Check CRM with normalized phone lookup
                crm_phone_key = find_phone_in_crm(phone_digits)
                if crm_phone_key:
                    user_data = CRM_DATABASE[crm_phone_key]
                    state.name = user_data["name"]
                    state.email = user_data["email"]
                    state.kyc_verified = (user_data["kyc_status"] == "VERIFIED")
                    response_text = f"Thank you, {state.name}. I found your details in our system."
                    
                    if state.kyc_verified:
                        response_text += " Your KYC is already verified."
                        state.current_agent = AgentRole.UNDERWRITING
                        response_text += "\n\n(System: Transferring to Underwriting Agent...)"
                    else:
                        response_text += " However, we need to verify your PAN. Please provide your PAN number."
                else:
                    response_text = "I couldn't find your records. Could you please share your full name?"
                    # For this demo, we might just assume success after name is given or loop.
                    # Let's keep it simple: any phone number not in DB -> treat as new -> ask Name -> ask PAN.
            
            else:
                if "new" in user_message.lower():
                     return "Welcome! To set up your new account and proceed with the application, please share your mobile number."
                return "To proceed, I need to verify your identity. Please share your Mobile Number."
        
        elif not state.name:
            # If phone was known but not in DB, we end up here (conceptually, though logic above handles it partially)
            state.name = user_message # Naive assignment
            manager.save_state(state)
            return "Thank you. Now, please provide your PAN number for KYC verification."

        elif not state.kyc_verified:
            # We have phone and name, need PAN or checking PAN
            prompt = f"""
            Extract the 10-character alphanumeric PAN number/ID from this message: "{user_message}".
            It allows any combination of letters and numbers (10 chars).
            If found, return ONLY the ID.
            If not found, return EXACTLY "NOT_FOUND".
            """
            pan = generate_text(prompt).strip().upper()
            
            print(f"[VerificationAgent] User Message: '{user_message}' | Extracted PAN: '{pan}'")
            
            # Relaxed validation for demo: Any 10 alphanumeric characters
            pan_match = re.search(r'[A-Z0-9]{10}', pan)
            if pan_match:
                pan = pan_match.group(0)
            
            if "NOT_FOUND" not in pan and len(pan) >= 10:
                # Mock Verification Success
                state.kyc_verified = True
                state.current_agent = AgentRole.UNDERWRITING
                response_text = "Thanks! Your PAN has been verified successfully. Moving to credit assessment."
                response_text += "\n\n(System: Transferring to Underwriting Agent...)"
            else:
                manager.save_state(state)
                return "Please provide a valid PAN number (e.g., ABCDE1234F) to complete verification."

        else:
            # Already verified
            state.current_agent = AgentRole.UNDERWRITING
            response_text = "KYC is complete. Checking customized offers for you..."

        manager.save_state(state)
        return response_text

