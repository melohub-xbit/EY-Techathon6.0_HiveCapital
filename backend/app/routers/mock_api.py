from fastapi import APIRouter, HTTPException, UploadFile, File
from app.mock.data_generator import mock_db
from pydantic import BaseModel
from typing import List, Optional, Any
import shutil
import os
import uuid

router = APIRouter()

# Models for response documentation
class Loan(BaseModel):
    type: str
    emi: int

class Customer(BaseModel):
    id: str
    name: str
    age: int
    city: str
    email: str
    phone: str
    pan: str
    monthly_income: int
    existing_loans: List[Loan]

class CreditScore(BaseModel):
    customer_id: str
    score: int

class Offer(BaseModel):
    pre_approved_limit: int
    interest_rate: float
    validity: str

# CRM Endpoints
@router.get("/crm/customers", response_model=List[Customer])
def get_all_customers():
    """Get list of all mock customers to simulate CRM/Admin view or for testing"""
    return mock_db.get_all_customers()

@router.get("/crm/customers/{customer_id}", response_model=Customer)
def get_customer_details(customer_id: str):
    """Get KYC details for a specific customer"""
    customer = mock_db.get_customer(customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

# Credit Bureau Endpoints
@router.get("/bureau/score/{customer_id}", response_model=CreditScore)
def get_credit_score(customer_id: str):
    """Fetch credit score from mock bureau"""
    score = mock_db.get_credit_score(customer_id)
    if score is None:
        raise HTTPException(status_code=404, detail="Score not found for user")
    return {"customer_id": customer_id, "score": score}

# Offer Mart Endpoints
@router.get("/offers/{customer_id}", response_model=Offer)
def get_customer_offers(customer_id: str):
    """Fetch pre-approved offers"""
    offer = mock_db.get_offer(customer_id)
    if not offer:
        # Return a "no offer" response instead of 404 - customer exists but has no pre-approved offers
        return {
            "pre_approved_limit": 0,
            "interest_rate": 0.0,
            "validity": "N/A"
        }
    return offer

# File Upload Endpoint
@router.post("/upload/salary-slip")
async def upload_salary_slip(file: UploadFile = File(...)):
    """Mock upload specific for salary slips"""
    
    # Save file to static/uploads just to demonstrate it works
    upload_dir = "static/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_id = str(uuid.uuid4())
    extension = file.filename.split(".")[-1]
    file_path = f"{upload_dir}/{file_id}.{extension}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {
        "status": "success",
        "file_id": file_id,
        "filename": file.filename,
        "message": "Salary slip verified successfully (Mock)",
        "extracted_data": {
            "employer": "Mock Corp Pvt Ltd",
            "net_pay": 85000,
            "month": "November 2024"
        }
    }
