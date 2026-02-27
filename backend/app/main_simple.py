from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import shutil
import traceback

from .ocr_engine import extract_text
from .extractor import extract_invoice_data, validate_invoice_data

app = FastAPI(title="GST OCR API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "GST AI Backend Running"}


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/upload-invoice/")
async def upload_invoice(file: UploadFile = File(...)):
    """Upload an invoice image and extract GST data using OCR."""
    try:
        file_path = f"uploads/{file.filename}"

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Extract raw text using OCR
        extracted_text = extract_text(file_path)
        
        # Extract structured GST invoice data
        invoice_data = extract_invoice_data(extracted_text)
        
        # Validate the extracted data
        validation = validate_invoice_data(invoice_data)

        return {
            "raw_text": extracted_text,
            "extracted_data": invoice_data,
            "validation": validation
        }
    except Exception as e:
        error_detail = traceback.format_exc()
        print(f"Error: {error_detail}")
        return {
            "error": str(e),
            "detail": error_detail
        }
