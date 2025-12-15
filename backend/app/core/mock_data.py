from typing import Dict, Any
from app.mock.data_generator import mock_db

# Mock Product Catalog (Static)
PRODUCT_CATALOG = {
    "personal_loan": {
        "name": "Hive Capital Personal Loan",
        "min_amount": 50000,
        "max_amount": 2500000,
        "min_tenure_months": 12,
        "max_tenure_months": 72,
        "base_interest_rate": 10.99,
        "features": [
            "Instant Approval",
            "Minimal Documentation",
            "Flexible Repayment"
        ]
    }
}

# Transform MockDataManager data to match existing structure

# CRM_DATABASE: Key = Phone, Value = Dict
CRM_DATABASE = {}
customers = mock_db.get_all_customers()
for c in customers:
    # We assign kyc_status based on something? Let's say random or fixed.
    # History: "is_existing_customer": True, "kyc_status": "VERIFIED"
    
    # Simple logic: If they have a score, they are existing customer?
    score = mock_db.get_credit_score(c["id"])
    has_score = score is not None and score > 0
    
    CRM_DATABASE[c["phone"]] = {
        "name": c["name"],
        "pan": c["pan"],
        "email": c["email"],
        "is_existing_customer": has_score,
        "kyc_status": "VERIFIED" if has_score else "PENDING",
        "pre_approved_limit": float(mock_db.get_offer(c["id"])["pre_approved_limit"]) if mock_db.get_offer(c["id"]) else 0.0,
        "current_salary": float(c["monthly_income"])
    }

# CREDIT_SCORES: Key = PAN, Value = Int
CREDIT_SCORES = {}
for c in customers:
    score = mock_db.get_credit_score(c["id"])
    if score is not None:
        CREDIT_SCORES[c["pan"]] = score

