import re


def extract_invoice_data(text: str) -> dict:
    """
    Extract GST invoice fields from OCR text.
    
    Args:
        text: Raw text extracted from invoice image
        
    Returns:
        Dictionary containing extracted fields
    """
    # GSTIN pattern: 2 digits + 5 uppercase letters + 4 digits + 1 uppercase + 1 digit + Z + 1 digit/letter
    gstin_pattern = r'\d{2}[A-Z]{5}\d{4}[A-Z]\dZ[\dA-Z]'
    gstin_list = re.findall(gstin_pattern, text)
    
    # Invoice number pattern
    invoice_no_pattern = r'Invoice\s*No[:\-]?\s*(\S+)'
    invoice_no_match = re.search(invoice_no_pattern, text, re.IGNORECASE)
    
    # Total amount pattern - look for various formats
    total_patterns = [
        r'Total[\s:]*(?:Amount)?[\s:]*(?:Rs\.?|INR)?[\s:]*(\d+(?:,\d{3})*(?:\.\d{2})?)',
        r'Grand\s*Total[\s:]*(\d+(?:,\d{3})*(?:\.\d{2})?)',
        r'Amount\s*Payable[\s:]*(\d+(?:,\d{3})*(?:\.\d{2})?)',
    ]
    
    total_amount = None
    for pattern in total_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            total_amount = match.group(1).replace(',', '')
            break
    
    # Date extraction
    date_patterns = [
        r'(?:Invoice\s*)?Date[\s:]*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
        r'(\d{1,2}[/-]\d{1,2}[/-]\d{4})',
    ]
    
    invoice_date = None
    for pattern in date_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            invoice_date = match.group(1)
            break
    
    return {
        "gstin_found": gstin_list,
        "invoice_number": invoice_no_match.group(1) if invoice_no_match else None,
        "invoice_date": invoice_date,
        "total_amount": total_amount
    }


def validate_gstin(gstin: str) -> bool:
    """
    Validate GSTIN format.
    
    Args:
        gstin: GSTIN string to validate
        
    Returns:
        True if valid, False otherwise
    """
    if not gstin:
        return False
    
    # Basic length check
    if len(gstin) != 15:
        return False
    
    # Pattern check: 2 digits + 5 letters + 4 digits + 1 letter + 1 digit + Z + 1 digit/letter
    pattern = r'^\d{2}[A-Z]{5}\d{4}[A-Z]\dZ[\dA-Z]$'
    if not re.match(pattern, gstin):
        return False
    
    return True


def validate_invoice_data(data: dict) -> dict:
    """
    Validate extracted invoice data.
    
    Args:
        data: Dictionary containing extracted invoice data
        
    Returns:
        Dictionary with validation results
    """
    validation_results = {
        "is_valid": True,
        "errors": [],
        "warnings": []
    }
    
    # Validate GSTINs
    if data.get("gstin_found"):
        valid_gstins = [g for g in data["gstin_found"] if validate_gstin(g)]
        invalid_gstins = [g for g in data["gstin_found"] if not validate_gstin(g)]
        
        if invalid_gstins:
            validation_results["warnings"].append(f"Invalid GSTIN format found: {invalid_gstins}")
        
        if not valid_gstins:
            validation_results["errors"].append("No valid GSTIN found")
            validation_results["is_valid"] = False
    else:
        validation_results["warnings"].append("No GSTIN found in invoice")
    
    # Check invoice number
    if not data.get("invoice_number"):
        validation_results["warnings"].append("Invoice number not found")
    
    # Check total amount
    if not data.get("total_amount"):
        validation_results["warnings"].append("Total amount not found")
    
    return validation_results
