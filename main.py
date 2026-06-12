# -*- coding: utf-8 -*-
import io
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from agent import DukaanDostAgent

app = FastAPI(
    title="DukaanDost AI Backend",
    description="Agentic Legal & Contract Auditor for Bharat's merchants",
    version="1.0.0"
)

# Enable CORS for frontend integration (React app normally runs on port 5173 or 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon ease, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Agent
agent = DukaanDostAgent()

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": "DukaanDost AI",
        "author": "Rafia Minhaj",
        "hackathon": "Meesho ScriptedBy{Her} 2.0"
    }

@app.post("/upload-contract")
async def upload_contract(file: UploadFile = File(...)):
    filename = file.filename.lower()
    content = await file.read()
    
    contract_text = ""
    
    if filename.endswith(".pdf"):
        # Parse PDF using pdfplumber with fallback check
        try:
            import pdfplumber
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        contract_text += page_text + "\n"
            print("✅ Successfully extracted text from PDF using pdfplumber.")
        except ImportError:
            # If pdfplumber is not installed, raise an error indicating packages to install
            raise HTTPException(
                status_code=500,
                detail="pdfplumber is not installed. Please run: pip install pdfplumber"
            )
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to parse PDF document: {str(e)}"
            )
            
    elif filename.endswith(".txt"):
        try:
            contract_text = content.decode("utf-8")
            print("✅ Successfully read TXT contract file.")
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to read TXT file: {str(e)}"
            )
            
    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Please upload a PDF or TXT file."
        )
        
    if not contract_text.strip():
        raise HTTPException(
            status_code=400,
            detail="The uploaded contract contains no extractable text."
        )
        
    # Run the Agentic RAG audit pipeline
    try:
        report = agent.audit_contract(contract_text)
        return {
            "success": True,
            "filename": file.filename,
            "extracted_length": len(contract_text),
            "report": report
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error running contract audit pipeline: {str(e)}"
        )

# For running locally
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
