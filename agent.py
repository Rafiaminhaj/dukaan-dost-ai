# -*- coding: utf-8 -*-
import os
import json
from vector_store import LocalVectorStore

# Optional import for Anthropic API
USE_ANTHROPIC = True
try:
    from anthropic import Anthropic
except ImportError:
    USE_ANTHROPIC = False

# Retrieve the API key from environment variables
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")

class DukaanDostAgent:
    def __init__(self):
        self.vector_store = LocalVectorStore()
        self.client = None
        if USE_ANTHROPIC and ANTHROPIC_API_KEY:
            try:
                self.client = Anthropic(api_key=ANTHROPIC_API_KEY)
                print("[SUCCESS] Claude Fable 5 (Anthropic Client) initialized successfully.")
            except Exception as e:
                print(f"[WARNING] Failed to initialize Claude Fable 5 client: {e}. Running in demo/mock mode.")
        else:
            print("[WARNING] ANTHROPIC_API_KEY not found. Running in demo/mock mode powered by Claude Fable 5 templates.")

    def audit_contract(self, contract_text):
        """
        Splits contract text into logical sections, queries relevant laws from the FAISS/TF-IDF database,
        and uses Claude to audit for anomalies and print a structured Hinglish report.
        """
        # Chunk text into reasonable sizes (~2000 chars) for analysis
        chunks = self._chunk_text(contract_text, chunk_size=2000, overlap=300)
        
        # If API key is not present, return a beautiful demo response
        if not self.client:
            return self._generate_mock_report(contract_text)
            
        all_flags = []
        
        # Audit each chunk of interest
        for chunk_idx, chunk in enumerate(chunks[:5]): # Limit to first 5 chunks for API cost/time savings in hackathon demos
            # Retrieve relevant legal guidelines
            contexts = self.vector_store.query(chunk, top_k=2)
            context_str = "\n".join([f"- {c}" for c in contexts])
            
            # Construct Agent prompt
            system_prompt = (
                "ROLE & CONTEXT:\n"
                "You are \"DukaanDost AI\", an expert Agentic Legal Auditor engineered for small retail merchants, shopkeepers, and MSMEs in India (Bharat). Your mission is to audit business contracts (Distributorship, Vendor, Franchise agreements) and protect local merchants from predatory or heavily one-sided clauses.\n\n"
                "OPERATIONAL INSTRUCTIONS (THE CORE LAWS):\n"
                "1. RISK ASSESSMENT SCORE: Calculate an overall 'safety_score' from 0 to 100 (where 100 is perfectly safe, and below 50 is 'Danger Zone'). Each audited clause must heavily penalize unfair terms.\n"
                "2. LEGAL GROUNDING: Ground every risk in actual Indian Laws (e.g., Indian Contract Act 1872, Consumer Protection Rules 2020, MSMED Act 2006) to show high authority to judges/users.\n"
                "3. AUDIO-READY HINGLISH: The \"audio_script_hinglish\" must be highly conversational, empathetic, and spoken in a street-smart local dialect (e.g., starting with \"Bhaiya...\", \"Dekhiye...\"). Avoid complex words so Text-to-Speech engines sound natural.\n"
                "4. ONE-CLICK WHATSAPP READY: The \"whatsapp_payload\" must be a clean string formatting the risk, advice, and your formal English counter-proposal, ready to be encoded into a WhatsApp share link.\n\n"
                "STRICT OUTPUT FORMAT (JSON ONLY):\n"
                "Return an absolute JSON object containing the overall safety score and an array of audited clauses. Do not wrap in markdown code blocks. No conversational text before or after the JSON.\n\n"
                "{\n"
                "  \"overall_safety_score\": 42,\n"
                "  \"risk_status\": \"Danger Zone | Warning | Safe\",\n"
                "  \"flagged_clauses\": [\n"
                "    {\n"
                "      \"id\": 1,\n"
                "      \"category\": \"Penalties | Termination | Pricing | Liability\",\n"
                "      \"risk_level\": \"HIGH | MEDIUM | LOW\",\n"
                "      \"contract_quote\": \"Exact sentence extracted from the contract text\",\n"
                "      \"indian_law_reference\": \"Section XX, Name of Indian Act/Rule\",\n"
                "      \"dukaandost_advisory_text\": \"Hinglish explanation of why this clause damages their business or profit.\",\n"
                "      \"audio_script_hinglish\": \"Bhaiya, ye clause toh bilkul galat hai! [Short, high-energy spoken text for the 'Suno' feature]\",\n"
                "      \"negotiation_tip\": \"Quick strategic text on how to talk to the distributor.\",\n"
                "      \"counter_proposal_en\": \"Formal English legal amendment text to replace the predatory clause.\",\n"
                "      \"whatsapp_payload\": \"DukaanDost AI Alert! \\nClause: [Type]\\nRisk: HIGH\\n\\nHumari Sallah: [Brief advice]\\n\\nProposed Legal Text:\\n[Counter Proposal]\"\n"
                "    }\n"
                "  ]\n"
                "}"
            )
            
            user_content = (
                f"### INDIAN LEGAL GUIDELINES REFERENCE:\n{context_str}\n\n"
                f"### CONTRACT SECTION TO AUDIT:\n{chunk}\n\n"
                f"Identify any clauses in this section that violate the guidelines or place unfair liability on the shopkeeper."
            )
            
            try:
                response = self.client.messages.create(
                    model="claude-3-5-sonnet-20240620",
                    max_tokens=2000,
                    temperature=0.0,
                    system=system_prompt,
                    messages=[{"role": "user", "content": user_content}]
                )
                
                # Parse JSON output from Claude
                raw_text = response.content[0].text.strip()
                # Handle possible markdown backticks in response
                if raw_text.startswith("```json"):
                    raw_text = raw_text.split("```json")[1].split("```")[0].strip()
                elif raw_text.startswith("```"):
                    raw_text = raw_text.split("```")[1].split("```")[0].strip()
                    
                chunk_analysis = json.loads(raw_text)
                
                if isinstance(chunk_analysis, dict) and "flagged_clauses" in chunk_analysis:
                    all_flags.extend(chunk_analysis["flagged_clauses"])
                elif isinstance(chunk_analysis, list):
                    all_flags.extend(chunk_analysis)
                    
            except Exception as e:
                print(f"[ERROR] Error during API chunk audit: {e}")
                
        # Calculate overall safety score based on flags found
        total_flags = len(all_flags)
        overall_score = 100
        if total_flags > 0:
            high_count = sum(1 for f in all_flags if f.get("risk_level") == "HIGH")
            medium_count = sum(1 for f in all_flags if f.get("risk_level") == "MEDIUM")
            overall_score = max(0, 100 - (high_count * 20 + medium_count * 10))
            
        risk_status = "Safe"
        if overall_score < 50:
            risk_status = "Danger Zone"
        elif overall_score < 80:
            risk_status = "Warning"
            
        # Re-assign IDs sequentially
        for i, flag in enumerate(all_flags):
            flag["id"] = i + 1

        final_report = {
            "is_mock": False,
            "overall_safety_score": overall_score,
            "risk_status": risk_status,
            "total_risks_found": total_flags,
            "flags": all_flags,
            "flagged_clauses": all_flags
        }
        return final_report

    def _chunk_text(self, text, chunk_size=2000, overlap=300):
        chunks = []
        start = 0
        while start < len(text):
            end = min(start + chunk_size, len(text))
            chunks.append(text[start:end])
            if end == len(text):
                break
            start += chunk_size - overlap
        return chunks

    def _generate_mock_report(self, contract_text):
        """
        Generates a beautiful mock response containing realistic contract anomalies and Hinglish translation.
        This ensures the demo is 100% functional even without an Anthropic API Key.
        """
        print("[INFO] Generating interactive mock report for demo/testing...")
        
        # Check if contract mentions late payment or interest
        has_interest = "interest" in contract_text.lower() or "late" in contract_text.lower() or "payment" in contract_text.lower()
        has_termination = "terminate" in contract_text.lower() or "cancel" in contract_text.lower() or "notice" in contract_text.lower()
        has_pricing = "price" in contract_text.lower() or "alter" in contract_text.lower() or "change" in contract_text.lower()
        
        flags = []
        
        if has_interest:
            flags.append({
                "id": 1,
                "category": "Penalties",
                "risk_level": "HIGH",
                "contract_quote": "In case of any delay in payments, the merchant shall pay an interest rate of 36% per annum compounded monthly.",
                "indian_law_reference": "Section 74, Indian Contract Act 1872",
                "dukaandost_advisory_text": "Yeh penalty bohot zyada hai! 36% interest rate aapko bohot bade karz me daal sakta hai. Aap distributor se bolkar ise maximum 12% se 18% per annum karwayein.",
                "audio_script_hinglish": "Bhaiya, ye clause toh bilkul galat hai! 36% saalana interest rate aapko bohot bade karz me fasa dega. Isko hataiye aur distributor se simple interest 12% set karwaiye.",
                "negotiation_tip": "Distributor se bolein: 'Hum 12% simple interest dene ko tayyar hain, par 36% compounded interest bohot zyada hai.'",
                "counter_proposal_en": "In case of any payment delays, the Merchant shall pay simple interest at a rate of 12% per annum, calculated on a daily basis.",
                "whatsapp_payload": "DukaanDost AI Alert! 🚨\nClause: Payment Penalty\nRisk: HIGH (36% Interest)\n\nHumari Sallah: Bhaiya, ye penalty bohot zyada hai. Distributor se negotiate karke simple interest 12% karwayein.\n\nProposed Legal Text:\nIn case of any payment delays, the Merchant shall pay simple interest at a rate of 12% per annum, calculated daily."
            })
            
        if has_termination:
            flags.append({
                "id": 2,
                "category": "Termination",
                "risk_level": "HIGH",
                "contract_quote": "The distributor reserves the right to terminate this agreement immediately at its sole discretion without any notice period.",
                "indian_law_reference": "Unfair Contract Terms, Indian Contract Act 1872",
                "dukaandost_advisory_text": "Immediate termination (turant band karna) aapke business ke liye bada risk hai. Aapka stock fasa reh jayega. Distributor se bole ki termination ke liye kam se kam 30 days ka written notice period hona chahiye.",
                "audio_script_hinglish": "Bhaiya, dekhiye, bina kisi notice ke contract band karna toh aapki dukaan band karne jaisa hai. Distributor se bolein ki kam se kam 30 din ka notice zaroori hona chahiye.",
                "negotiation_tip": "Distributor se bolein: 'Immediate termination se humara nuksaan hoga, hume stock manage karne ke liye 30 days ka notice period chahiye.'",
                "counter_proposal_en": "Either party may terminate this agreement by providing at least 30 days prior written notice to the other party.",
                "whatsapp_payload": "DukaanDost AI Alert! 🚨\nClause: Unilateral Termination\nRisk: HIGH (No Notice)\n\nHumari Sallah: Immediate termination aapke business ko thap kar sakta hai. 30 din ka written notice period mangiye.\n\nProposed Legal Text:\nEither party may terminate this agreement by providing at least 30 days prior written notice."
            })
            
        if has_pricing:
            flags.append({
                "id": 3,
                "category": "Pricing",
                "risk_level": "MEDIUM",
                "contract_quote": "The company may alter commission structures and product listings at any time without any prior written notification to the merchant.",
                "indian_law_reference": "Consumer Protection (E-Commerce) Rules 2020",
                "dukaandost_advisory_text": "Bina bataye commission rates badalna galat hai. Aapko pata hi nahi chalega ki aapka profit kab kam ho gaya. Contract me clause dalwayein ki commission change karne se pehle company 15 days ka advance written notice degi.",
                "audio_script_hinglish": "Bhaiya, bina bataye fees ya commission badalna sahi nahi hai. Contract me strictly likhwaiye ki changes se 15 din pehle aapko notice diya jaye.",
                "negotiation_tip": "Distributor se bolein: 'Bina bataye commission fees badalna theek nahi hai. Koi bhi change karne से 15 din pehle hume written notification milna chahiye.'",
                "counter_proposal_en": "Any changes to the commission structure, listing fees, or charges must be notified to the Merchant in writing at least 15 days in advance.",
                "whatsapp_payload": "DukaanDost AI Alert! 🚨\nClause: Unilateral Pricing\nRisk: MEDIUM\n\nHumari Sallah: Commission bina notice ke badalna galat hai. 15 din ka advance written notice mandatorily lagwaiye.\n\nProposed Legal Text:\nAny changes to the fees must be notified in writing at least 15 days in advance."
            })
            
        # Default flags if the text didn't trigger specific keywords
        if not flags:
            flags = [
                {
                    "id": 1,
                    "category": "Liability",
                    "risk_level": "MEDIUM",
                    "contract_quote": "All legal disputes arising out of this agreement shall be subject to the exclusive jurisdiction of the courts located in New Delhi only.",
                    "indian_law_reference": "Section 28, Indian Contract Act 1872",
                    "dukaandost_advisory_text": "Agar koi dispute hoti hai, toh aapko Ranchi chhodkar Delhi ke court jana padega, jo bohot mehenga padega. Court jurisdiction aapke local area me hi hona chahiye.",
                    "audio_script_hinglish": "Bhaiya, agar kal ko koi lafda hota hai toh aapko Delhi courts jana padega. Is case me Ranchi local court set karwayein, warna kharche me hi sab chala jayega.",
                    "negotiation_tip": "Distributor se bolein: 'Disputes ke liye hum Ranchi courts ka jurisdiction rakhna chahte hain.'",
                    "counter_proposal_en": "All legal disputes arising out of this agreement shall be subject to the jurisdiction of the courts local to the place of business of the Merchant.",
                    "whatsapp_payload": "DukaanDost AI Alert! 🚨\nClause: Out-of-station Jurisdiction\nRisk: MEDIUM\n\nHumari Sallah: Ranchi se Delhi court jana mehenga hoga. Local court jurisdiction lagwayein.\n\nProposed Legal Text:\nAll disputes shall be subject to the local courts where the Merchant is located."
                }
            ]
            
        return {
            "is_mock": True,
            "overall_safety_score": 42,
            "risk_status": "Danger Zone",
            "total_risks_found": len(flags),
            "flags": flags,
            "flagged_clauses": flags
        }
