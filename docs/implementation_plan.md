# Implementation Plan: Agentic AI Sales Assistant

## 1. Core Philosophy
*   **Backend**: "Supervisor-Worker" Architecture (Hub & Spoke). The Master Agent (Supervisor) retains control and delegates specific tasks to specialized "Worker" agents.
*   **Frontend**: "Generative UI". The chat isn't just text; it's a canvas for interactive widgets (Sliders, Uploaders, Approval Cards) generated in real-time.

## 2. Advanced Tech Stack
### Backend (The Brain)
*   **Framework**: FastAPI (Python 3.10+) - Async, robust.
*   **Orchestration**: **LangGraph** (or Custom State Machine) - To manage cyclic workflows and state persistence.
*   **LLM Integration**: OpenAI (GPT-4o/mini) or Llama via Groq (Fast inference).
*   **Data Models**: Pydantic for strict type validation between agents.

### Frontend (The Face)
*   **Framework**: React (Vite).
*   **Styling**: **TailwindCSS** + **Shadcn/UI** (Clean, Premium, Accessible).
*   **Animations**: **Framer Motion** (Fluid layout changes, entry animations).
*   **Streaming**: **Vercel AI SDK (Core)** - To handle streaming text and tool calls seamlessly from Python.
*   **Icons**: Lucide React.

## 3. Backend Agent Architecture (Hub-and-Spoke)
**Shared State**: `messages`, `user_profile` (name, phone, income), `loan_details` (amount, tenure), `current_stage`.

### The Agents
1.  **Master Agent (Supervisor)**:
    *   **Role**: The "Brain". Parses user intent. Routing logic.
    *   **Capabilities**: Decides *who* speaks next. Can speak to User OR delegate to Workers.
2.  **Sales Agent**:
    *   **Role**: Persuasion & Negotiation.
    *   **Tools**: `calculate_emi(amount, tenure)`, `get_interest_rates()`.
3.  **Verification Agent**:
    *   **Role**: KYC & Anti-Fraud.
    *   **Tools**: `verify_phone_crm(number)`, `analyze_document(file_id)`.
4.  **Underwriting Agent**:
    *   **Role**: Risk Analysis.
    *   **Tools**: `fetch_credit_score(pan)`, `calculate_debt_to_income()`.
    *   **Logic**: Strict rules (Score > 700 checks).
5.  **Sanction Agent**:
    *   **Role**: Closer.
    *   **Tools**: `generate_sanction_letter(details)`.

## 4. Workflows (The "Happy Path")
1.  **Onboarding**: Master Agent greets -> User replies.
2.  **Delegation (KYC)**: User provides phone -> Master delegates to *Verification Agent* -> Checks CRM -> Returns data -> Master confirms to User.
3.  **Negotiation**: User asks for 5 Lakhs -> Master delegates to *Sales Agent* -> Sales Agent calls `calculate_emi` -> Returns formatted math -> Master presents offer.
4.  **Approval**: User accepts -> Master delegates to *Underwriting* -> Checks Score -> Returns "Approved" -> Master delegates to *Sanction*.

## 5. Development Steps
### Phase 1: Backend Core (Day 1)
*   [ ] Setup FastAPI + Virtual Environment.
*   [ ] Create `AgentState` Pydantic models.
*   [ ] Implement Mock Tools (CRM, Credit Bureau).
*   [ ] Build the **Supervisor Node** (Master).
*   [ ] Build Worker Nodes (Sales, KYC, Underwriting).
*   [ ] Connect via LangGraph/Router.

### Phase 2: Frontend "Wow" (Day 2)
*   [ ] Initialize Vite + Tailwind + Shadcn.
*   [ ] Build `ChatInterface` component (streaming support).
*   [ ] Create Custom UI Widgets (EMI Slider, Salary Upload Card).
*   [ ] Integrate backend API.
