"""Simple in-memory invoice storage for demo purposes"""
from typing import List, Dict, Optional
from datetime import datetime

# In-memory storage - in production, use MongoDB/PostgreSQL
_invoices_db: List[Dict] = []

def add_invoice(invoice: Dict) -> Dict:
    """Add invoice to storage with generated ID"""
    invoice_with_id = {
        "_id": f"inv_{datetime.now().strftime('%Y%m%d%H%M%S')}_{len(_invoices_db)}",
        **invoice
    }
    _invoices_db.insert(0, invoice_with_id)  # Newest first
    return invoice_with_id

def get_all_invoices() -> List[Dict]:
    """Get all stored invoices"""
    return _invoices_db.copy()

def get_invoice_by_id(invoice_id: str) -> Optional[Dict]:
    """Get specific invoice by ID"""
    for inv in _invoices_db:
        if inv.get("_id") == invoice_id or inv.get("invoiceNumber") == invoice_id:
            return inv
    return None

def get_stats() -> Dict:
    """Get dashboard statistics"""
    total = len(_invoices_db)
    if total == 0:
        return {
            "totalInvoices": 0,
            "totalTaxableValue": 0,
            "totalTax": 0,
            "avgConfidence": 0,
            "validCount": 0,
            "warningCount": 0
        }
    
    total_value = sum(inv.get("taxableValue", 0) for inv in _invoices_db)
    total_tax = sum(inv.get("totalTax", 0) for inv in _invoices_db)
    avg_conf = sum(inv.get("confidenceScore", 0) for inv in _invoices_db) / total
    valid = sum(1 for inv in _invoices_db if inv.get("status") == "valid")
    warnings = sum(1 for inv in _invoices_db if inv.get("status") == "warning")
    
    return {
        "totalInvoices": total,
        "totalTaxableValue": total_value,
        "totalTax": total_tax,
        "avgConfidence": round(avg_conf, 2),
        "validCount": valid,
        "warningCount": warnings
    }

def clear_all():
    """Clear all invoices - for testing only"""
    _invoices_db.clear()
