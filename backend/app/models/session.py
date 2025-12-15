from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum
from datetime import datetime

class AgentRole(str, Enum):
    MASTER = "MASTER"
    SALES = "SALES"
    VERIFICATION = "VERIFICATION"
    UNDERWRITING = "UNDERWRITING"
    SANCTION = "SANCTION"

class LoanApplicationState(BaseModel):
    user_id: str
    session_id: str
    current_agent: AgentRole = AgentRole.MASTER
    
    # Customer Details
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    income: Optional[float] = None
    
    # Loan Details
    loan_amount: Optional[float] = None
    loan_tenure: Optional[int] = None # Months
    interest_rate: Optional[float] = None
    
    # Processing Status
    kyc_verified: bool = False
    credit_score: Optional[int] = None
    pre_approved_limit: Optional[float] = None
    salary_slip_uploaded: bool = False
    is_approved: bool = False
    rejection_reason: Optional[str] = None
    sanction_letter_url: Optional[str] = None  # URL to download sanction letter
    
    # Audit Trail
    conversation_history: List[Dict[str, str]] = [] # Role: User/Agent, Content: Message
    audit_log: List[str] = []
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class ChatRequest(BaseModel):
    session_id: str
    user_message: str

class ChatResponse(BaseModel):
    session_id: str
    agent_name: str
    message: str
    state_snapshot: Optional[Dict[str, Any]] = None
