from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Optional, Tuple


GSTIN_RE = re.compile(r"\b\d{2}[A-Z]{5}\d{4}[A-Z]\d[Z][A-Z0-9]\b")


def normalize_text(text: str) -> str:
    # Normalize common OCR artifacts
    t = text.replace("₹", "Rs ").replace("INR", "Rs ")
    t = re.sub(r"[ \t]+", " ", t)
    return t


def extract_gstin(text: str) -> Optional[str]:
    m = GSTIN_RE.search(text.upper())
    return m.group(0) if m else None


AMOUNT_TOKEN_RE = re.compile(r"(?P<num>\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)")


def _parse_amount_token(token: str) -> Optional[float]:
    try:
        cleaned = token.replace(",", "")
        return float(cleaned)
    except Exception:
        return None


def _best_amount_near_keyword(text: str, keyword_re: re.Pattern[str]) -> Optional[float]:
    """
    Find the first plausible amount on the same line (or close) as keyword.
    """
    lines = text.splitlines()
    for i, line in enumerate(lines):
        if not keyword_re.search(line):
            continue
        # Search current line first
        candidates = [m.group("num") for m in AMOUNT_TOKEN_RE.finditer(line)]
        # If none, peek next line (some invoices break lines)
        if not candidates and i + 1 < len(lines):
            candidates = [m.group("num") for m in AMOUNT_TOKEN_RE.finditer(lines[i + 1])]
        # Choose the last numeric token (often the amount)
        if candidates:
            for tok in reversed(candidates):
                val = _parse_amount_token(tok)
                if val is not None and val > 0:
                    return val
    return None


@dataclass
class Amounts:
    taxable_value: Optional[float] = None
    cgst: Optional[float] = None
    sgst: Optional[float] = None
    igst: Optional[float] = None
    total_tax: Optional[float] = None
    invoice_value: Optional[float] = None


def extract_amounts(text: str) -> Amounts:
    t = normalize_text(text)
    # Common keywords in Indian invoices
    invoice_value = _best_amount_near_keyword(
        t,
        re.compile(r"\b(grand\s*total|invoice\s*value|net\s*amount|total\s*amount|amount\s*payable)\b", re.I),
    )
    taxable = _best_amount_near_keyword(t, re.compile(r"\b(taxable\s*value|taxable\s*amount|sub\s*total)\b", re.I))
    cgst = _best_amount_near_keyword(t, re.compile(r"\bCGST\b", re.I))
    sgst = _best_amount_near_keyword(t, re.compile(r"\bSGST\b", re.I))
    igst = _best_amount_near_keyword(t, re.compile(r"\bIGST\b", re.I))
    total_tax = _best_amount_near_keyword(t, re.compile(r"\b(total\s*tax|gst\s*total|total\s*gst)\b", re.I))

    # If total_tax missing but components present
    if total_tax is None:
        parts = [x for x in (cgst, sgst, igst) if x is not None]
        if parts:
            total_tax = float(sum(parts))

    return Amounts(
        taxable_value=taxable,
        cgst=cgst,
        sgst=sgst,
        igst=igst,
        total_tax=total_tax,
        invoice_value=invoice_value,
    )


def extract_invoice_fields(raw_text: str) -> Tuple[Optional[str], Amounts, list[str]]:
    warnings: list[str] = []
    gstin = extract_gstin(raw_text)
    if gstin is None:
        warnings.append("GSTIN not found")

    amounts = extract_amounts(raw_text)
    if amounts.invoice_value is None:
        warnings.append("Invoice total not found")
    if amounts.taxable_value is None:
        warnings.append("Taxable value not found")

    return gstin, amounts, warnings

