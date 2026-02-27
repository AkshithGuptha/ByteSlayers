from __future__ import annotations

import shutil
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

from .csv_export import rows_to_gstr1_b2b_csv
from .services.mockInvoiceAI import process_invoice_mock
from .services.invoiceStore import add_invoice, get_all_invoices, get_stats
from .models import (
    ExportGstr1B2BRequest,
)

app = FastAPI(title="Invoice OCR API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:5176",
        "http://127.0.0.1:5176",
        "http://localhost:5177",
        "http://127.0.0.1:5177",
        "http://localhost:5178",
        "http://127.0.0.1:5178",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "GST AI Backend Running"}


@app.get("/health")
def health() -> dict:
    return {"ok": True}


@app.post("/api/invoices/extract")
async def extract_invoice(file: UploadFile = File(...)):
    """
    Upload an invoice and extract data using simulated AI.
    For demo: Uses mock extractor while OCR model is being trained.
    """
    # Save file for reference (optional)
    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Use mock AI extraction (simulated while OCR is being trained)
    extracted_data = process_invoice_mock(file.filename)
    
    # Save to storage
    saved_invoice = add_invoice(extracted_data)
    
    return {
        "message": "AI extracted successfully",
        "data": saved_invoice
    }


@app.get("/api/invoices")
async def list_invoices():
    """Get all extracted invoices"""
    return {
        "invoices": get_all_invoices(),
        "stats": get_stats()
    }


@app.get("/api/dashboard/stats")
async def dashboard_stats():
    """Get dashboard statistics"""
    return get_stats()


@app.post("/api/gstr1/b2b.csv")
async def export_gstr1_b2b_csv(payload: ExportGstr1B2BRequest) -> Response:
    csv_text = rows_to_gstr1_b2b_csv(payload.rows)
    return Response(
        content=csv_text,
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": 'attachment; filename="gstr1_b2b.csv"'},
    )

