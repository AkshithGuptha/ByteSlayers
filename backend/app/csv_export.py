from __future__ import annotations

import csv
import io
from typing import Iterable

from .models import Gstr1B2BRow


GSTR1_B2B_HEADERS = [
    "GSTIN/UIN of Recipient",
    "Receiver Name",
    "Invoice Number",
    "Invoice date",
    "Invoice Value",
    "Place Of Supply",
    "Reverse Charge",
    "Applicable % of Tax Rate",
    "Invoice Type",
    "E-Commerce GSTIN",
    "Rate",
    "Taxable Value",
    "Cess Amount",
]


def rows_to_gstr1_b2b_csv(rows: Iterable[Gstr1B2BRow]) -> str:
    buf = io.StringIO()
    w = csv.writer(buf, lineterminator="\n")
    w.writerow(GSTR1_B2B_HEADERS)
    for r in rows:
        w.writerow(
            [
                r.gstin_uin_of_recipient,
                r.receiver_name or "",
                r.invoice_number or "",
                r.invoice_date or "",
                r.invoice_value if r.invoice_value is not None else "",
                r.place_of_supply or "",
                r.reverse_charge,
                r.applicable_tax_rate or "",
                r.invoice_type,
                r.ecommerce_gstin or "",
                r.rate if r.rate is not None else "",
                r.taxable_value if r.taxable_value is not None else "",
                r.cess_amount,
            ]
        )
    return buf.getvalue()

