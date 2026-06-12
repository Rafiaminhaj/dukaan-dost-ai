# -*- coding: utf-8 -*-
import json
from agent import DukaanDostAgent

# A sample distributor agreement containing typical high-risk clauses for a local shopkeeper
MOCK_MERCHANT_CONTRACT = """
DISTRIBUTORSHIP AND MERCHANDISING AGREEMENT

This Agreement is entered into on this 15th day of June 2026, by and between:
ABC Wholesale Logistics Pvt Ltd (hereinafter referred to as the "Company") and 
Minhaj Retail Stores, Ranchi (hereinafter referred to as the "Merchant").

TERMS AND CONDITIONS:

1. COMMISSION AND LISTING STRUCTURE
The Company reserves the right to alter the commission percentages, listing fees, and shipping charges 
at any time without any prior written notification or consultation with the Merchant.

2. SETTLEMENT OF PAYMENTS
All settled sales figures will be deposited into the Merchant's registered bank account. In case of any 
delay in payments by the Merchant for logistics costs, the Merchant shall pay an interest rate of 36% per annum 
compounded monthly to the Company.

3. TERM AND TERMINATION
This agreement shall remain in effect for 12 months. However, the Company reserves the right to terminate 
this agreement immediately at its sole discretion without any notice period and without assigning any reasons.

4. DISPUTE RESOLUTION AND JURISDICTION
In the event of any disputes, claims, or legal proceedings arising out of or in connection with this agreement, 
the parties agree that all legal proceedings shall be subject to the exclusive jurisdiction of the courts located 
in New Delhi only.

IN WITNESS WHEREOF, the parties hereto have signed this Agreement.
"""

def main():
    print("[START] Starting DukaanDost AI Backend Local Test...")
    
    # Initialize the Agentic auditor
    agent = DukaanDostAgent()
    
    print("\n[INFO] Auditing Sample Merchant Contract...")
    print("-" * 50)
    print(MOCK_MERCHANT_CONTRACT.strip()[:300] + "\n...")
    print("-" * 50)
    
    # Run the audit
    report = agent.audit_contract(MOCK_MERCHANT_CONTRACT)
    
    # Print the report
    print("\n[INFO] AUDIT REPORT GENERATED:")
    print(json.dumps(report, indent=2))
    print("\n[SUCCESS] Test completed successfully!")

if __name__ == "__main__":
    main()
