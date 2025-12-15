from app.models.session import LoanApplicationState, AgentRole
from app.core.state_manager import StateManager
from app.core.mock_data import CRM_DATABASE, CREDIT_SCORES, PRODUCT_CATALOG

class UnderwritingAgent:
    def process(self, state: LoanApplicationState, user_message: str) -> str:
        manager = StateManager()
        response_text = ""
        
        # 0. Recover State Context
        # Check if we have PAN. If not, we can't do anything (Verification should have ensured this).
        pan = "XYZ" # Default
        if state.phone and state.phone in CRM_DATABASE:
            pan = CRM_DATABASE[state.phone]["pan"]
        
        # 1. Fetch Credit Score
        score = CREDIT_SCORES.get(pan, 720) # Default to 720 if not found
        state.credit_score = score
        
        # 2. Fetch Pre-approved Mock Data
        pre_approved_limit = 0.0
        reported_salary = 0.0
        if state.phone and state.phone in CRM_DATABASE:
            pre_approved_limit = CRM_DATABASE[state.phone]["pre_approved_limit"]
            reported_salary = CRM_DATABASE[state.phone]["current_salary"]
        
        # If no pre-approved limit exists, calculate a dynamic limit based on income and score
        if pre_approved_limit == 0.0 and reported_salary > 0:
            # Income-based calculation with credit score multiplier
            if score >= 800:
                pre_approved_limit = reported_salary * 10
            elif score >= 750:
                pre_approved_limit = reported_salary * 8
            elif score >= 700:
                pre_approved_limit = reported_salary * 5
            else:
                # Below 700, still calculate a limit for display purposes
                # (rejection will happen at Rule 1 anyway)
                pre_approved_limit = reported_salary * 3
        
        # Fallback: If still 0 (user not in CRM at all), use a base limit
        # This prevents offering "₹0" which is a poor user experience
        if pre_approved_limit == 0.0:
            # Use a conservative base limit for unknown users
            base_income_assumption = 50000.0  # Assume average income
            if score >= 750:
                pre_approved_limit = base_income_assumption * 5  # 2.5 Lakhs
            elif score >= 700:
                pre_approved_limit = base_income_assumption * 3  # 1.5 Lakhs
            else:
                pre_approved_limit = base_income_assumption * 2  # 1 Lakh base
            reported_salary = base_income_assumption  # Set for EMI calculation
        
        state.pre_approved_limit = pre_approved_limit
        state.income = reported_salary # Sync
        
        # 3. Decision Logic
        loan_amt = state.loan_amount or 0.0
        
        # Rule 1: Credit Score Floor
        if score < 700:
            state.is_approved = False
            state.rejection_reason = f"Credit Score {score} is below the minimum requirement of 700."
            state.current_agent = AgentRole.MASTER # Return to master to break news? Or Agent handles it?
            # Let's handle it here
            response_text = f"I have analyzed your profile. Unfortunately, we cannot proceed with the application at this time as your credit score ({score}) does not meet our minimum criteria."
            state.current_agent = AgentRole.MASTER # End of line
            manager.save_state(state)
            return response_text

        # Rule 2: Amount Limits
        if loan_amt == 0:
             # Should not happen if Sales did job, but robust handling
             loan_amt = 100000.0 # Default fallback
             state.loan_amount = loan_amt

        if loan_amt <= pre_approved_limit:
            # INSTANT APPROVAL
            state.is_approved = True
            state.current_agent = AgentRole.SANCTION
            response_text = f"Great news! Your loan application for ₹{loan_amt} is approved based on your pre-qualified offer."
            response_text += "\n\n(System: Generating Sanction Letter...)"

        elif loan_amt <= (2 * pre_approved_limit):
            # CONDITIONAL APPROVAL - Check Salary Slip
            if not state.salary_slip_uploaded:
                # Check if user just uploaded it
                if "upload" in user_message.lower() or "attached" in user_message.lower() or "here" in user_message.lower():
                     state.salary_slip_uploaded = True
                     # Re-evaluate recursively or fall through
                else:
                    return f"Your requested amount ₹{loan_amt} is higher than your pre-approved limit. To proceed, please upload your latest salary slip to verify income."
            
            if state.salary_slip_uploaded:
                # Check EMI Affordability
                # EMI = P * r * (1+r)^n / ((1+r)^n - 1)
                r = (state.interest_rate or 10.99) / 12 / 100
                n = state.loan_tenure or 12
                emi = loan_amt * r * ((1+r)**n) / (((1+r)**n) - 1)
                
                if emi <= (0.5 * reported_salary):
                    state.is_approved = True
                    state.current_agent = AgentRole.SANCTION
                    response_text = "Thank you for the document. Your salary validation is successful, and the loan is approved!"
                    response_text += "\n\n(System: Transferring to Sanction Letter Agent...)"
                else:
                    state.is_approved = False
                    state.rejection_reason = "EMI exceeds 50% of verified monthly salary."
                    response_text = "I have reviewed your document. Unfortunately, the estimated EMI exceeds 50% of your monthly income, which is our policy limit. We can offer a lower amount."
                    state.current_agent = AgentRole.SALES # Send back to renegotiate?
        
        else:
            # REJECT (> 2x limit)
            state.is_approved = False
            state.rejection_reason = f"Loan amount ₹{loan_amt} exceeds 2x the pre-approved limit (₹{pre_approved_limit})."
            response_text = f"The requested amount ₹{loan_amt} is significantly higher than your eligibility limit. We can offer up to ₹{2*pre_approved_limit}."
            state.current_agent = AgentRole.SALES # Send back to sales

        manager.save_state(state)
        return response_text
