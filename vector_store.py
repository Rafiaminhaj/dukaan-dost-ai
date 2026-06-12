# -*- coding: utf-8 -*-
import os
import re
import numpy as np

# Try importing standard RAG libraries, otherwise fallback to lightweight TF-IDF
USE_FAISS = True
try:
    import faiss
    from sentence_transformers import SentenceTransformer
    print("[SUCCESS] FAISS and SentenceTransformer imported successfully.")
except ImportError:
    USE_FAISS = False
    print("[WARNING] FAISS or SentenceTransformers not found. Falling back to TF-IDF retrieval.")

# Reference Legal Knowledge Base (Indian Contract Act 1872, Consumer Protection, and Standard Policies)
LEGAL_KNOWLEDGE_BASE = [
    # Indian Contract Act, 1872
    "Indian Contract Act 1872 - Section 10: All agreements are contracts if they are made by the free consent of parties competent to contract, for a lawful consideration and with a lawful object.",
    "Indian Contract Act 1872 - Section 23: The consideration or object of an agreement is lawful unless it is forbidden by law, fraudulent, involves injury to person/property, or is immoral/opposed to public policy.",
    "Indian Contract Act 1872 - Section 27: Every agreement by which any one is restrained from exercising a lawful profession, trade or business of any kind, is to that extent void. (Restraint of Trade)",
    "Indian Contract Act 1872 - Section 28: Every agreement by which any party is restricted absolutely from enforcing their rights under or in respect of any contract, by the usual legal proceedings in the ordinary tribunals, is void. (Restraint of Legal Proceedings)",
    "Indian Contract Act 1872 - Section 73: When a contract has been broken, the party who suffers by such breach is entitled to receive, from the party who has broken the contract, compensation for any loss or damage caused to them thereby.",
    "Indian Contract Act 1872 - Section 74: If a sum is named in the contract as the amount to be paid in case of breach, or if the contract contains any other stipulation by way of penalty, reasonable compensation not exceeding the amount named is allowed.",
    
    # Consumer Protection (E-Commerce) Rules, 2020
    "Consumer Protection Rules 2020: E-commerce entities and sellers must provide clear information about refund, return, exchange, warranty, delivery & shipment, modes of payment, and grievance redressal mechanisms.",
    "Consumer Protection Rules 2020: No seller or e-commerce entity shall adopt any unfair trade practice, including manipulating price, false reviews, or misleading advertisements.",
    
    # Standard Merchant & Supplier Policies
    "Standard Merchant Policy: Payment settlement terms for e-commerce suppliers typically range between 7 to 15 days from the date of successful delivery of goods to the customer.",
    "Standard Merchant Policy: Unilateral price changes or commission adjustments by the platform or distributor without a written notice of at least 15 days are considered unfair trade terms.",
    "Standard Merchant Policy: Standard contract termination requires at least 30 days of written notice by either party. Immediate termination without cause is considered a high-risk clause.",
    "Standard Merchant Policy: Late payment interest rates for outstanding business invoices should range between 12% to 18% per annum. Any interest rate above 24% per annum is considered usurious and unfair."
]

class LocalVectorStore:
    def __init__(self):
        self.use_faiss = USE_FAISS
        self.kb = LEGAL_KNOWLEDGE_BASE
        
        if self.use_faiss:
            try:
                # Initialize local sentence encoder
                self.model = SentenceTransformer('all-MiniLM-L6-v2')
                self.dimension = 384  # MiniLM dimension
                self.index = faiss.IndexFlatL2(self.dimension)
                
                # Encode knowledge base
                embeddings = self.model.encode(self.kb)
                self.index.add(np.array(embeddings).astype('float32'))
                print("[SUCCESS] FAISS local index built successfully.")
            except Exception as e:
                print(f"[WARNING] Failed to build FAISS index: {e}. Switching to TF-IDF.")
                self.use_faiss = False

        if not self.use_faiss:
            # Build basic TF-IDF index
            self.vocabulary = set()
            self.doc_tokens = []
            for doc in self.kb:
                tokens = self._tokenize(doc)
                self.vocabulary.update(tokens)
                self.doc_tokens.append(tokens)
            
            self.vocab_list = list(self.vocabulary)
            self.doc_vectors = [self._to_vector(tokens) for tokens in self.doc_tokens]

    def _tokenize(self, text):
        # Normalize and split into alphanumeric tokens
        return re.findall(r'\w+', text.lower())

    def _to_vector(self, tokens):
        # Create a term frequency vector
        vec = np.zeros(len(self.vocab_list))
        for t in tokens:
            if t in self.vocabulary:
                idx = self.vocab_list.index(t)
                vec[idx] += 1
        # Normalize vector
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec

    def query(self, query_text, top_k=2):
        """
        Retrieves the top_k most relevant legal guidelines for a given query text.
        """
        if self.use_faiss:
            try:
                query_embedding = self.model.encode([query_text])
                distances, indices = self.index.search(np.array(query_embedding).astype('float32'), top_k)
                results = []
                for idx in indices[0]:
                    if 0 <= idx < len(self.kb):
                        results.append(self.kb[idx])
                return results
            except Exception as e:
                print(f"[WARNING] FAISS search failed: {e}. Trying fallback TF-IDF search.")
        
        # TF-IDF Fallback search
        query_tokens = self._tokenize(query_text)
        query_vec = self._to_vector(query_tokens)
        
        scores = []
        for doc_vec in self.doc_vectors:
            # Cosine similarity (since vectors are normalized, it is just dot product)
            similarity = np.dot(query_vec, doc_vec)
            scores.append(similarity)
            
        top_indices = np.argsort(scores)[::-1][:top_k]
        return [self.kb[idx] for idx in top_indices if scores[idx] > 0.0]

# Self-test code
if __name__ == "__main__":
    store = LocalVectorStore()
    test_query = "The distributor will charge 36% annual interest for late payment and can terminate immediately without any notice."
    retrieved = store.query(test_query, top_k=2)
    print("\n[QUERY] Test Query:", test_query)
    print("[RESULTS] Retrieved Legal Contexts:")
    for doc in retrieved:
        print(f" - {doc}")
