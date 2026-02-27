# Backend (OCR + GST extraction + CSV export)

This folder contains a small Python API that:

- Accepts an **invoice photo (JPG/PNG)** for OCR
- Extracts **GSTIN** and key **amounts** (total/taxable/CGST/SGST/IGST when present)
- Exports a **GSTR-1 B2B CSV** (initial template)

## Prerequisites

- **Python 3.11 recommended**
  - This backend uses `rapidocr-onnxruntime` which requires **Python < 3.13**
  - On your machine, use the Windows launcher: `py -3.11`

## Run locally

```bash
cd backend
py -3.11 -m venv .venv

# Windows PowerShell
.\.venv\Scripts\Activate.ps1

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Health check: `http://localhost:8000/health`

## API (current)

- `POST /api/invoices/extract` (multipart form-data: `file`)
- `POST /api/gstr1/b2b.csv` (JSON body: extracted invoices)

