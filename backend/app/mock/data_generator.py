from faker import Faker
import random
from typing import List, Dict, Optional
import json
import os

fake = Faker('en_IN')  # Use Indian locale for names/cities since context implies India (Hive Capital mentioned in history)

class MockDataManager:
    def __init__(self):
        self.customers: List[Dict] = []
        self.credit_scores: Dict[str, int] = {}
        self.offers: Dict[str, Dict] = {}
        self._generate_data()

    def _generate_data(self):
        # Ensure we have consistent data for dev
        Faker.seed(42)
        random.seed(42)

        # Scenarios to cover:
        # 1. High score, High Income (Prime)
        # 2. Low score, High Income
        # 3. High score, Low Income
        # 4. Low score, Low Income
        # 5. No credit history (New to credit)
        # 6. Existing heavy loans (Overleveraged)
        
        cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune"]
        
        for i in range(30):
            customer_id = f"CUST{str(i+1).zfill(3)}"
            
            # Mix of profiles
            profile_type = i % 6
            
            # Base data
            name = fake.name()
            age = random.randint(21, 60)
            city = random.choice(cities)
            pan = fake.bothify(text='?????####?').upper()
            
            income = 0
            score = 0
            existing_loans = []
            
            if profile_type == 0: # Prime
                income = random.randint(80000, 200000)
                score = random.randint(750, 900)
                existing_loans = []
            elif profile_type == 1: # Low score, High Income
                income = random.randint(80000, 200000)
                score = random.randint(500, 650)
                existing_loans = [{"type": "Personal", "emi": 15000}]
            elif profile_type == 2: # High score, Low Income
                income = random.randint(20000, 40000)
                score = random.randint(750, 850)
            elif profile_type == 3: # Low score, Low Income
                income = random.randint(15000, 30000)
                score = random.randint(300, 600)
            elif profile_type == 4: # New credit
                income = random.randint(30000, 60000)
                score = -1 # No score
            elif profile_type == 5: # Overleveraged
                income = random.randint(50000, 80000)
                score = random.randint(650, 750)
                existing_loans = [
                    {"type": "Auto", "emi": 12000},
                    {"type": "Personal", "emi": 8000}, 
                    {"type": "CreditCard", "emi": 5000}
                ]

            # Generate User
            user = {
                "id": customer_id,
                "name": name,
                "age": age,
                "city": city,
                "email": f"{name.lower().replace(' ', '.')}@example.com",
                "phone": fake.phone_number(),
                "pan": pan,
                "monthly_income": income,
                "existing_loans": existing_loans
            }
            self.customers.append(user)
            
            # Store Credit Score
            self.credit_scores[customer_id] = score
            
            # Generate Pre-approved Offer
            offer_limit = 0
            if score >= 750:
                offer_limit = income * 10
            elif score >= 650:
                offer_limit = income * 5
            
            if offer_limit > 0:
                self.offers[customer_id] = {
                    "pre_approved_limit": offer_limit,
                    "interest_rate": 10.5 if score > 800 else 12.0,
                    "validity": "30 days"
                }

    def get_all_customers(self):
        return self.customers

    def get_customer(self, customer_id: str):
        return next((c for c in self.customers if c["id"] == customer_id), None)

    def get_credit_score(self, customer_id: str):
        return self.credit_scores.get(customer_id)

    def get_offer(self, customer_id: str):
        return self.offers.get(customer_id)

    def get_customer_by_phone(self, phone: str):
        # Normalize phone input (basic)
        phone_clean = phone.replace(" ", "").replace("-", "")[-10:]
        
        for customer in self.customers:
            c_phone = customer["phone"].replace(" ", "").replace("-", "")[-10:]
            if c_phone == phone_clean:
                return customer
        return None

# Singleton instance
mock_db = MockDataManager()
