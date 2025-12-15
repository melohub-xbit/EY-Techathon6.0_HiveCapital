# HiveCapital 🐝  
### *Orchestrating the Future of Personal Loans*

**HiveCapital** is a state-of-the-art **Agentic AI** solution designed to revolutionize the loan application process for **Hive Capital**. By simulating a human-like sales experience, an intelligent "Master Agent" orchestrates a swarm of specialized "Worker Agents" to handle everything from negotiation and KYC verification to underwriting and sanction letter generation.

---

## 🚀 Key Features

*   **🤖 Master Agent Orchestrator**: A central intelligence that manages the conversation flow, understands user intent, and delegates tasks to specialized agents.
*   **💼 Sales Worker Agent**: Engaging and persuasive, this agent negotiates loan terms, discusses amounts, tenure, and interest rates.
*   **🔍 Verification Worker Agent**: seamlessly verifies KYC details (phone, address) against a simulated CRM.
*   **⚖️ Underwriting Worker Agent**: Performs real-time credit analysis, fetching dummy credit scores and validating eligibility based on salary and pre-approved limits.
*   **📄 Sanction Letter Generator**: Automatically generates and presents a professional PDF sanction letter upon approval.
*   **✨ Stunning UI**: A modern, responsive interface built with the latest design trends (Glassmorphism, TailwindCSS) for a premium user experience.

---

## 🛠️ Technology Stack

### **Frontend**
*   **Framework**: React (Vite)
*   **Styling**: TailwindCSS, Shadcn/UI
*   **Key Libraries**: Framer Motion (Animations)

### **Backend**
*   **Framework**: FastAPI
*   **AI/LLM**: Google Gemini 2.5 Flash
*   **Orchestration**: Custom Agentic Workflow (LangGraph/LangChain concepts)
*   **Tools**: PDF Generation, Mock CRM/Credit APIs

---

## 🏗️ Architecture

The system follows a **Hub-and-Spoke** agentic architecture:

1.  **User** interacts with the Chat Interface.
2.  **Master Agent** receives the message, analyzes context, and decides the next step.
3.  **Routing**:
    *   If the user has questions -> **Sales Agent** responds.
    *   If the user agrees to proceed -> **Verification Agent** checks KYC.
    *   Once verified -> **Underwriting Agent** assesses risk.
    *   If approved -> **Sanction Agent** issues the letter.
4.  The **Master Agent** synthesizes the responses and communicates back to the user.

---

## ⚡ Getting Started

### Prerequisites
*   Node.js & npm
*   Python 3.10+

### 1. Clone the Repository
```bash
git clone https://github.com/melohub-xbit/Techathon6.0_HiveCapital.git
cd Techathon6.0_HiveCapital
```

### 2. Backend Setup
```bash
cd backend
# Create a virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# Create a .env file
echo "VITE_API_URL=http://localhost:8000" > .env

# Run the development server
npm run dev
```

---

## 📸 Usage
1.  Open the frontend application (usually `http://localhost:5173`).
2.  Start chatting with the AI Assistant.
3.  Simulate a loan application by providing details.
4.  Watch the agents collaborate to process your request in real-time!

---

## 📄 License
This project is developed for **EY Techathon 6.0**.
