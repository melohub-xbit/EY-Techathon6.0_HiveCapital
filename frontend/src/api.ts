import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:8000');

export interface ChatResponse {
    session_id: string;
    agent_name: string;
    message: string;
    state_snapshot: Record<string, unknown>;
}

export const sendMessage = async (sessionId: string, message: string): Promise<ChatResponse> => {
    const response = await axios.post(`${API_BASE_URL}/chat`, {
        session_id: sessionId,
        user_message: message,
    });
    return response.data;
};

// --- Mock Data Interfaces ---

export interface Loan {
    type: string;
    emi: number;
}

export interface Customer {
    id: string;
    name: string;
    age: number;
    city: string;
    email: string;
    phone: string;
    pan: string;
    monthly_income: number;
    existing_loans: Loan[];
}

export interface CreditScore {
    customer_id: string;
    score: number;
}

export interface Offer {
    pre_approved_limit: number;
    interest_rate: number;
    validity: string;
}

// --- Mock API Calls ---

export const getCustomers = async (): Promise<Customer[]> => {
    const response = await axios.get(`${API_BASE_URL}/api/crm/customers`);
    return response.data;
};

export const getCustomer = async (id: string): Promise<Customer> => {
    const response = await axios.get(`${API_BASE_URL}/api/crm/customers/${id}`);
    return response.data;
};

export const getCreditScore = async (id: string): Promise<CreditScore> => {
    const response = await axios.get(`${API_BASE_URL}/api/bureau/score/${id}`);
    return response.data;
};

export const getOffers = async (id: string): Promise<Offer> => {
    const response = await axios.get(`${API_BASE_URL}/api/offers/${id}`);
    return response.data;
};

export const uploadSalarySlip = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_BASE_URL}/api/upload/salary-slip`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
