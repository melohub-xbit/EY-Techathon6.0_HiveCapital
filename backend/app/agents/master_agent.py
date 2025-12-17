from app.core.llm import generate_text
from app.core.state_manager import StateManager
from app.models.session import LoanApplicationState, AgentRole
from app.agents.sales_agent import SalesAgent
from app.agents.verification_agent import VerificationAgent
from app.agents.underwriting_agent import UnderwritingAgent
from app.agents.sanction_agent import SanctionAgent

class MasterAgent:
    def __init__(self, state_manager: StateManager):
        self.state_manager = state_manager
        # Initialize sub-agents
        self.sales = SalesAgent()
        self.verification = VerificationAgent()
        self.underwriting = UnderwritingAgent()
        self.sanction = SanctionAgent()

    def process_request(self, session_id: str, user_message: str) -> str:
        # 1. Load State
        state = self.state_manager.get_state(session_id)
        
        # 2. Add User Message to History
        self.state_manager.add_message(session_id, "user", user_message)

        # 3. Determine Routing / Action
        response_message = ""
        
        # Simple State Machine Logic for Orchestration
        if state.current_agent == AgentRole.MASTER:
            # Initial Greeting or Handoff
            response_message = self._handle_master_logic(state, user_message)
        
        elif state.current_agent == AgentRole.SALES:
            response_message = self.sales.process(state, user_message)
            
        elif state.current_agent == AgentRole.VERIFICATION:
            response_message = self.verification.process(state, user_message)
            
        elif state.current_agent == AgentRole.UNDERWRITING:
            response_message = self.underwriting.process(state, user_message)
        
        elif state.current_agent == AgentRole.SANCTION:
            response_message = self.sanction.process(state, user_message)

        # Reload state to check if agent changed during processing
        state = self.state_manager.get_state(session_id)
        
        # Chain to next agent if handoff occurred (agent changed during processing)
        # This ensures the new agent immediately asks for what it needs
        response_message = self._chain_agent_if_needed(state, response_message)

        # 4. Add Agent Response to History
        self.state_manager.add_message(session_id, "agent", response_message)

        return response_message

    def _chain_agent_if_needed(self, state: LoanApplicationState, current_response: str) -> str:
        """
        If the current agent handed off to another, immediately trigger that agent
        to ask for what it needs, instead of waiting for the next user message.
        """
        # Reload fresh state
        state = self.state_manager.get_state(state.session_id)
        
        # Check if response contains handoff indicator
        if "(System:" in current_response:
            # Trigger the new agent with an intro prompt
            next_response = ""
            
            if state.current_agent == AgentRole.VERIFICATION:
                next_response = self.verification.process(state, "[HANDOFF] New user needs verification")
            elif state.current_agent == AgentRole.UNDERWRITING:
                next_response = self.underwriting.process(state, "[HANDOFF] User verified, needs underwriting")
            elif state.current_agent == AgentRole.SANCTION:
                next_response = self.sanction.process(state, "[HANDOFF] User approved, generate letter")
            
            if next_response:
                # Combine handoff message with next agent's prompt
                return current_response + "\n\n" + next_response
        
        return current_response

    def _handle_master_logic(self, state: LoanApplicationState, user_message: str) -> str:
        """
        Master Agent's own conversation logic:
        - Greet and understand intent.
        - Route to Sales Agent if user is interested.
        """
        prompt = f"""
        You are the Master Agent for Hive Capital Personal Loans.
        Your goal is to warmly greet the customer and identify if they are interested in a Personal Loan.
        
        Client Name: {state.name if state.name else 'Customer'}
        
        Current Conversation History:
        {[m['content'] for m in state.conversation_history[-5:]]}
        
        User's latest message: "{user_message}"
        
        Instructions:
        1. If the user is just saying hi, greet them back warmly and introduce Hive Capital Personal Loans.
        2. If the user expresses interest in a loan, say "That's great! My colleague from the Sales team will help you with the details." AND append the tag <ROUTING:SALES> at the end of your response.
        3. Keep it professional, empathetic, and persuasive.
        """
        
        response = generate_text(prompt)
        
        if "<ROUTING:SALES>" in response:
            response = response.replace("<ROUTING:SALES>", "").strip()
            self.state_manager.update_agent(state.session_id, AgentRole.SALES)
            # Immediately trigger the Sales agent
            state = self.state_manager.get_state(state.session_id)
            sales_intro = self.sales.process(state, "[HANDOFF] User interested in loan")
            response = response + "\n\n" + sales_intro
            
        return response

