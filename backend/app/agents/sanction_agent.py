from app.models.session import LoanApplicationState
from app.core.state_manager import StateManager
from datetime import datetime
import os

class SanctionAgent:
    def process(self, state: LoanApplicationState, user_message: str) -> str:
        manager = StateManager()
        
        if not state.is_approved:
            return "Cannot generate sanction letter for unapproved loan."

        # Generate "PDF" (Simulated)
        # In a real app, use reportlab or fpdf
        # Here we create a formatted text block and simulated download link
        
        sanction_content = f"""
        ╔══════════════════════════════════════════════════════════════╗
        ║          HIVE CAPITAL - PERSONAL LOAN SANCTION LETTER        ║
        ╚══════════════════════════════════════════════════════════════╝
        
        Date: {datetime.now().strftime("%Y-%m-%d")}
        Reference No: HC/{state.session_id[:8].upper()}/{datetime.now().strftime("%Y%m%d")}
        
        Dear {state.name},
        
        Congratulations! We are pleased to inform you that your Personal Loan 
        application has been approved.
        
        ┌─────────────────────────────────────────────────────────────┐
        │                      LOAN DETAILS                          │
        ├─────────────────────────────────────────────────────────────┤
        │  Sanctioned Amount    :  ₹ {state.loan_amount:,.2f}                      
        │  Loan Tenure          :  {state.loan_tenure} Months                          
        │  Interest Rate        :  {state.interest_rate or 10.99}% per annum              
        │  Processing Fee       :  ₹ {(state.loan_amount or 0) * 0.01:,.2f} (1%)                   
        └─────────────────────────────────────────────────────────────┘
        
        TERMS & CONDITIONS:
        1. This sanction is valid for 30 days from the date of issue.
        2. Disbursement is subject to completion of documentation.
        3. EMI will commence from the next month of disbursement.
        4. Prepayment charges may apply as per bank policy.
        
        For any queries, please contact our customer support.
        
        ──────────────────────────────────────────────────────────────
        Authorized Signatory
        HIVE CAPITAL FINANCIAL SERVICES
        (This is a digitally signed document)
        ──────────────────────────────────────────────────────────────
        """
        
        # Save to a file - ensure the static directory exists (relative to where uvicorn runs)
        static_dir = "static"
        os.makedirs(static_dir, exist_ok=True)
        
        filename = f"Sanction_Letter_{state.session_id}.txt"
        filepath = os.path.join(static_dir, filename)
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(sanction_content)
        
        # Store the download URL in state
        download_url = f"/download/{filename}"
        state.sanction_letter_url = download_url
            
        response_text = f"🎉 Congratulations {state.name}! Your Personal Loan of ₹{state.loan_amount:,.2f} has been officially sanctioned!\n\n"
        response_text += "Your Sanction Letter has been generated and will be downloaded automatically.\n\n"
        response_text += "Thank you for choosing Hive Capital! 🙏"
        
        # Log final success
        state.audit_log.append(f"Sanction Letter Generated for ₹{state.loan_amount:,.2f}")
        
        manager.save_state(state)
        return response_text

