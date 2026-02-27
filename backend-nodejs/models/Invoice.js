const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  fileName: String,
  fileUrl: String,
  rawText: String,

  invoiceNumber: String,
  invoiceDate: String,
  sellerGSTIN: String,
  buyerGSTIN: String,

  taxableValue: Number,
  cgst: Number,
  sgst: Number,
  igst: Number,
  totalAmount: Number,

  status: { type: String, default: "pending" },
  confidenceScore: Number

}, { timestamps: true });

module.exports = mongoose.model("Invoice", invoiceSchema);
