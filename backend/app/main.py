from __future__ import annotations

import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

from .csv_export import rows_to_gstr1_b2b_csv
from .extract import extract_invoice_fields
from .models import (
    ExtractInvoiceResponse,
    ExportGstr1B2BRequest,
    InvoiceExtraction,
    MoneyBreakdown,
)
from .ocr_engine import ocr_image

app = FastAPI(title="Invoice OCR API", version="0.1.0")

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


@app.get("/health")
def health() -> dict:
    return {"ok": True}


@app.post("/api/invoices/extract", response_model=ExtractInvoiceResponse)
async def extract_invoice(file: UploadFile = File(...)) -> ExtractInvoiceResponse:
    content = await file.read()
    nparr = np.frombuffer(content, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        return ExtractInvoiceResponse(
            invoices=[
                InvoiceExtraction(
                    raw_text="",
                    warnings=["Unsupported file or unreadable image"],
                )
            ]
        )

    raw_text, conf = ocr_image(img)
    gstin, amounts, warnings = extract_invoice_fields(raw_text)

    inv = InvoiceExtraction(
        gstin=gstin,
        money=MoneyBreakdown(
            taxable_value=amounts.taxable_value,
            cgst=amounts.cgst,
            sgst=amounts.sgst,
            igst=amounts.igst,
            total_tax=amounts.total_tax,
            invoice_value=amounts.invoice_value,
        ),
        ocr_confidence=conf,
        warnings=warnings,
        raw_text=raw_text,
    )
    return ExtractInvoiceResponse(invoices=[inv])


@app.post("/api/gstr1/b2b.csv")
async def export_gstr1_b2b_csv(payload: ExportGstr1B2BRequest) -> Response:
    csv_text = rows_to_gstr1_b2b_csv(payload.rows)
    return Response(
        content=csv_text,
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": 'attachment; filename="gstr1_b2b.csv"'},
    )

