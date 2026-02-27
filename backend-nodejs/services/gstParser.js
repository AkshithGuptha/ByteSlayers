function findMatch(regex, text) {
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

function findAllMatches(regex, text) {
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1] || match[0]);
  }
  return matches;
}

function parseGST(text) {
  // GSTIN pattern: 2 digits + 5 letters + 4 digits + 1 letter + 1 letter/number + 1 letter/number + 1 letter
  const gstinRegex = /[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}/g;
  const gstinMatches = text.match(gstinRegex) || [];

  // Invoice Number patterns
  const invoiceNumber = 
    findMatch(/Invoice\s*No[.:\s]*(\S+)/i, text) ||
    findMatch(/Invoice\s*Number[.:\s]*(\S+)/i, text) ||
    findMatch(/Bill\s*No[.:\s]*(\S+)/i, text) ||
    findMatch(/INV[.:\s-]*(\w+)/i, text) ||
    "";

  // Date patterns
  const invoiceDate = 
    findMatch(/Date[.:\s]*([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})/i, text) ||
    findMatch(/Invoice\s*Date[.:\s]*([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})/i, text) ||
    findMatch(/([0-9]{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*[0-9]{2,4})/i, text) ||
    "";

  // Amount extraction - look for decimal numbers
  const amountRegex = /\d{1,3}(?:,\d{3})*\.\d{2}/g;
  const amounts = text.match(amountRegex) || [];
  
  // Convert to numbers and find the largest (likely total)
  const numericAmounts = amounts
    .map(a => parseFloat(a.replace(/,/g, "")))
    .filter(a => !isNaN(a));
  
  const totalAmount = numericAmounts.length > 0 
    ? Math.max(...numericAmounts) 
    : 0;

  // Calculate tax breakdown (assuming 18% GST - 9% CGST + 9% SGST)
  const taxableValue = totalAmount > 0 ? totalAmount / 1.18 : 0;
  const cgst = taxableValue * 0.09;
  const sgst = taxableValue * 0.09;
  const igst = 0; // Intrastate assumption

  // Calculate confidence based on how many fields we found
  let foundFields = 0;
  if (invoiceNumber) foundFields++;
  if (invoiceDate) foundFields++;
  if (gstinMatches.length > 0) foundFields++;
  if (totalAmount > 0) foundFields++;
  
  const confidenceScore = Math.min(0.95, 0.5 + (foundFields * 0.1));

  return {
    invoiceNumber,
    invoiceDate,
    sellerGSTIN: gstinMatches[0] || "",
    buyerGSTIN: gstinMatches[1] || "",
    taxableValue: Math.round(taxableValue * 100) / 100,
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100,
    igst: Math.round(igst * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    confidenceScore: Math.round(confidenceScore * 100) / 100,
    rawText: text.substring(0, 500) // First 500 chars for preview
  };
}

module.exports = parseGST;
