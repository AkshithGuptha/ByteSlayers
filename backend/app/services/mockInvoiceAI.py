"""Mock AI Invoice Extractor Service for demo purposes"""
import random
from datetime import datetime

gst_states = ["27", "36", "29", "33", "07"]  # MH, TS, KA, TN, DL

def random_gstin():
    """Generate a random valid-format GSTIN"""
    state = random.choice(gst_states)
    num = random.randint(100000000, 999999999)
    return f"{state}ABCDE{num}Z5"

def random_invoice():
    """Generate a realistic mock invoice extraction"""
    items_catalog = [
        "Rice Bags",
        "Cooking Oil",
        "Sugar Packets",
        "Tea Powder",
        "Wheat Flour",
        "Detergent",
        "Soap Bars",
        "Biscuits",
        "Milk Powder",
        "Spices"
    ]
    
    amount = random.randint(5000, 55000)
    gst = round(amount * 0.18, 2)
    
    # Pick 1-3 random items
    num_items = random.randint(1, 3)
    selected_items = random.sample(items_catalog, num_items)
    
    invoice_items = []
    for desc in selected_items:
        qty = random.randint(1, 20)
        rate = random.randint(50, 500)
        invoice_items.append({
            "description": desc,
            "quantity": qty,
            "rate": rate,
            "amount": qty * rate,
            "hsn_code": random.choice(["1901", "3401", "3304", "2106", "0902"])
        })
    
    return {
        "invoiceNumber": f"INV-{random.randint(10000, 99999)}",
        "sellerGSTIN": random_gstin(),
        "buyerGSTIN": random_gstin(),
        "invoiceDate": datetime.now().strftime("%Y-%m-%d"),
        "taxableValue": amount,
        "cgst": round(gst / 2, 2),
        "sgst": round(gst / 2, 2),
        "igst": 0,
        "totalTax": gst,
        "totalAmount": round(amount + gst, 2),
        "items": invoice_items,
        "placeOfSupply": random.choice(["Maharashtra", "Telangana", "Karnataka", "Tamil Nadu", "Delhi"]),
        "confidenceScore": round(random.uniform(0.92, 0.99), 2),
        "status": random.choice(["valid", "valid", "valid", "warning"]),  # Mostly valid
        "warnings": random.choice([[], [], [], ["Low confidence on HSN code"]]) if random.random() > 0.8 else [],
        "extractedAt": datetime.now().isoformat()
    }

def process_invoice_mock(file_name: str = None) -> dict:
    """
    Mock AI invoice processing.
    Simulates realistic processing time and returns generated invoice data.
    """
    import time
    # Simulate processing delay (0.5-1.5 seconds)
    time.sleep(random.uniform(0.5, 1.5))
    
    return random_invoice()
