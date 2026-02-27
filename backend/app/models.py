from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class MoneyBreakdown(BaseModel):
    taxable_value: Optional[float] = None
    cgst: Optional[float] = None
    sgst: Optional[float] = None
    igst: Optional[float] = None
    total_tax: Optional[float] = None
    invoice_value: Optional[float] = None


class InvoiceExtraction(BaseModel):
    gstin: Optional[str] = None
    invoice_no: Optional[str] = None
    invoice_date: Optional[str] = None  # keep as string for now (OCR is messy)
    money: MoneyBreakdown = Field(default_factory=MoneyBreakdown)

    ocr_confidence: Optional[float] = None
    warnings: List[str] = Field(default_factory=list)
    raw_text: str


class ExtractInvoiceResponse(BaseModel):
    invoices: List[InvoiceExtraction]


class Gstr1B2BRow(BaseModel):
    gstin_uin_of_recipient: str
    receiver_name: Optional[str] = None
    invoice_number: Optional[str] = None
    invoice_date: Optional[str] = None
    invoice_value: Optional[float] = None
    place_of_supply: Optional[str] = None
    reverse_charge: str = "N"
    applicable_tax_rate: Optional[str] = None
    invoice_type: str = "Regular"
    ecommerce_gstin: Optional[str] = None
    rate: Optional[float] = None
    taxable_value: Optional[float] = None
    cess_amount: float = 0.0


class ExportGstr1B2BRequest(BaseModel):
    rows: List[Gstr1B2BRow]

