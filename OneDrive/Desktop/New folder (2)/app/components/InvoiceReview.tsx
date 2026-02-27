import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle, AlertTriangle, XCircle, ChevronRight, Filter,
  Download, Search, Edit3, Check, X, Eye, ChevronDown,
  ArrowUpRight, Zap, FileText, RotateCcw
} from "lucide-react";
import { Fragment } from "react";

type InvoiceStatus = "Validated" | "Warning" | "Error";

interface Invoice {
  id: string;
  invoiceNo: string;
  date: string;
  party: string;
  gstin: string;
  gstinValid: boolean;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  total: number;
  rate: string;
  hsn: string;
  type: "B2B" | "B2CS" | "B2CL" | "IGST";
  status: InvoiceStatus;
  issues: string[];
  confidence: number;
}

const INVOICES: Invoice[] = [
  { id: "1", invoiceNo: "INV-2026-001", date: "15 Jan 2026", party: "Parle Products Pvt Ltd", gstin: "27AADCP8635H1Z8", gstinValid: true, taxableAmount: 105509, cgst: 9496, sgst: 9496, igst: 0, totalTax: 18991, total: 124500, rate: "18%", hsn: "1901", type: "B2B", status: "Validated", issues: [], confidence: 99 },
  { id: "2", invoiceNo: "INV-2026-002", date: "18 Jan 2026", party: "HUL Distribution Pvt Ltd", gstin: "27AABCH9486B1ZU", gstinValid: true, taxableAmount: 77946, cgst: 4677, sgst: 4677, igst: 0, totalTax: 9354, total: 87300, rate: "12%", hsn: "3401", type: "B2B", status: "Validated", issues: [], confidence: 97 },
  { id: "3", invoiceNo: "INV-2026-003", date: "20 Jan 2026", party: "ITC Limited Foods", gstin: "19AAACI4078D1Z3", gstinValid: true, taxableAmount: 54095, cgst: 1352, sgst: 1352, igst: 0, totalTax: 2704, total: 56800, rate: "5%", hsn: "2106", type: "B2B", status: "Warning", issues: ["HSN code 2106 may require 18% GST — verify product category", "Consider using HSN 1904 for processed cereals"], confidence: 91 },
  { id: "4", invoiceNo: "INV-2026-004", date: "22 Jan 2026", party: "Nestle India Ltd", gstin: "27AAACN0600P1ZM", gstinValid: true, taxableAmount: 95296, cgst: 8577, sgst: 8577, igst: 0, totalTax: 17154, total: 112450, rate: "18%", hsn: "1901", type: "B2B", status: "Validated", issues: [], confidence: 99 },
  { id: "5", invoiceNo: "INV-2026-005", date: "25 Jan 2026", party: "Dabur India Ltd", gstin: "07AAACH6796N1ZK", gstinValid: false, taxableAmount: 38571, cgst: 2314, sgst: 2314, igst: 0, totalTax: 4629, total: 43200, rate: "12%", hsn: "3304", type: "B2B", status: "Error", issues: ["GSTIN verification failed — GSTIN not found in GSTN database", "Invoice may be fraudulent — do not claim ITC"], confidence: 78 },
  { id: "6", invoiceNo: "INV-2026-006", date: "28 Jan 2026", party: "Marico Ltd", gstin: "27AAACM4082C1Z4", gstinValid: true, taxableAmount: 58390, cgst: 0, sgst: 0, igst: 10510, totalTax: 10510, total: 68900, rate: "18%", hsn: "3305", type: "IGST", status: "Validated", issues: [], confidence: 98 },
  { id: "7", invoiceNo: "INV-2026-007", date: "29 Jan 2026", party: "Britannia Industries Ltd", gstin: "19AAACB1681F1ZG", gstinValid: true, taxableAmount: 62400, cgst: 3120, sgst: 3120, igst: 0, totalTax: 6240, total: 68640, rate: "5%", hsn: "1905", type: "B2B", status: "Validated", issues: [], confidence: 96 },
  { id: "8", invoiceNo: "INV-2026-008", date: "30 Jan 2026", party: "Godrej Consumer Products", gstin: "27AAACG0634A1ZY", gstinValid: true, taxableAmount: 49200, cgst: 4428, sgst: 4428, igst: 0, totalTax: 8856, total: 58056, rate: "18%", hsn: "3401", type: "B2B", status: "Warning", issues: ["Tax amount computed by AI (₹8,856) differs from invoice (₹8,600) by ₹256"], confidence: 87 },
];

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const StatusBadge = ({ status }: { status: InvoiceStatus }) => {
  const cfg = {
    Validated: { icon: CheckCircle, class: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
    Warning: { icon: AlertTriangle, class: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
    Error: { icon: XCircle, class: "bg-red-50 text-red-700", dot: "bg-red-500" },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.class}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
      {status}
    </span>
  );
};

const ConfidenceBar = ({ value }: { value: number }) => {
  const color = value >= 95 ? '#10B981' : value >= 85 ? '#F59E0B' : '#EF4444';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-slate-100">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-xs font-medium" style={{ color }}>{value}%</span>
    </div>
  );
};

export function InvoiceReview() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState<"All" | InvoiceStatus>("All");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = INVOICES.filter(inv => {
    if (filter !== "All" && inv.status !== filter) return false;
    if (search && !inv.party.toLowerCase().includes(search.toLowerCase()) && !inv.invoiceNo.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const allSelected = filtered.length > 0 && filtered.every(i => selected.includes(i.id));

  const toggleAll = () => {
    if (allSelected) setSelected([]);
    else setSelected(filtered.map(i => i.id));
  };

  const toggleOne = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const summary = {
    taxable: INVOICES.reduce((s, i) => s + i.taxableAmount, 0),
    cgst: INVOICES.reduce((s, i) => s + i.cgst, 0),
    sgst: INVOICES.reduce((s, i) => s + i.sgst, 0),
    igst: INVOICES.reduce((s, i) => s + i.igst, 0),
    total: INVOICES.reduce((s, i) => s + i.totalTax, 0),
  };

  return (
    <div className="p-6 space-y-5 min-h-full" style={{ background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Invoices</span><ChevronRight className="w-3 h-3" /><span className="text-slate-600">Review & Validate</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Invoice Review</h1>
          <p className="text-sm text-slate-500 mt-0.5">January 2026 · AI-validated invoice data ready for GSTR-1 filing</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => navigate('/gstr1')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-md active:scale-95"
            style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}
          >
            <FileText className="w-4 h-4" />
            Generate GSTR-1
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Taxable Amount", value: fmt(summary.taxable), color: "#2563EB" },
          { label: "CGST", value: fmt(summary.cgst), color: "#7C3AED" },
          { label: "SGST", value: fmt(summary.sgst), color: "#7C3AED" },
          { label: "IGST", value: fmt(summary.igst), color: "#06B6D4" },
          { label: "Total Tax", value: fmt(summary.total), color: "#10B981" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <div className="text-xs text-slate-500 mb-1">{s.label}</div>
            <div className="font-bold text-slate-800" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Validation Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { status: "Validated" as InvoiceStatus, count: INVOICES.filter(i => i.status === "Validated").length, desc: "Ready to file", color: "#10B981", bg: "#ECFDF5", icon: CheckCircle },
          { status: "Warning" as InvoiceStatus, count: INVOICES.filter(i => i.status === "Warning").length, desc: "Review recommended", color: "#F59E0B", bg: "#FFFBEB", icon: AlertTriangle },
          { status: "Error" as InvoiceStatus, count: INVOICES.filter(i => i.status === "Error").length, desc: "Cannot file — action needed", color: "#EF4444", bg: "#FEF2F2", icon: XCircle },
        ].map(v => (
          <button
            key={v.status}
            onClick={() => setFilter(filter === v.status ? "All" : v.status)}
            className="flex items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-md"
            style={{ background: filter === v.status ? v.bg : 'white', borderColor: filter === v.status ? v.color + '40' : '#F1F5F9' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: v.bg }}>
              <v.icon className="w-5 h-5" style={{ color: v.color }} />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold" style={{ color: v.color, fontFamily: 'Poppins' }}>{v.count}</div>
              <div className="text-xs font-semibold text-slate-700">{v.status}</div>
              <div className="text-xs text-slate-400">{v.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-100 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search party, invoice no..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg text-sm border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 w-64 transition-all"
              />
            </div>
            <div className="flex items-center gap-1 p-1 rounded-lg border border-slate-200 bg-slate-50">
              {(["All", "Validated", "Warning", "Error"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
                  style={filter === f ? { background: 'white', color: '#0F172A', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : { color: '#94A3B8' }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          {selected.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">{selected.length} selected</span>
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">Approve Selected</button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">Ignore</button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                <th className="pl-5 pr-2 py-3">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                </th>
                {["Invoice No.", "Party Name", "GSTIN", "Taxable", "CGST", "SGST", "IGST", "HSN", "Type", "AI Score", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-3 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <Fragment key={inv.id}>
                  <tr
                    className={`border-t border-slate-50 transition-colors ${expandedId === inv.id ? 'bg-blue-50/20' : 'hover:bg-slate-50/60'}`}
                  >
                    <td className="pl-5 pr-2 py-3.5">
                      <input type="checkbox" checked={selected.includes(inv.id)} onChange={() => toggleOne(inv.id)} className="w-4 h-4 rounded border-slate-300" />
                    </td>
                    <td className="px-3 py-3.5">
                      <button
                        onClick={() => setExpandedId(expandedId === inv.id ? null : inv.id)}
                        className="flex items-center gap-1.5 text-blue-600 font-semibold font-mono text-xs hover:text-blue-700 transition-colors"
                      >
                        <ChevronDown className={`w-3 h-3 transition-transform ${expandedId === inv.id ? 'rotate-180' : ''}`} />
                        {inv.invoiceNo}
                      </button>
                      <div className="text-xs text-slate-400 mt-0.5 ml-4">{inv.date}</div>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: `hsl(${parseInt(inv.id) * 60 + 200}, 60%, 50%)` }}>
                          {inv.party.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-700 text-xs whitespace-nowrap">{inv.party}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-1">
                        <span className={`font-mono text-xs ${inv.gstinValid ? 'text-slate-600' : 'text-red-500 line-through'}`}>{inv.gstin}</span>
                        {inv.gstinValid
                          ? <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                          : <XCircle className="w-3 h-3 text-red-500 flex-shrink-0" />}
                      </div>
                    </td>
                    <td className="px-3 py-3.5 font-medium text-slate-700 text-xs">{fmt(inv.taxableAmount)}</td>
                    <td className="px-3 py-3.5 text-xs text-slate-600">{fmt(inv.cgst)}</td>
                    <td className="px-3 py-3.5 text-xs text-slate-600">{fmt(inv.sgst)}</td>
                    <td className="px-3 py-3.5 text-xs text-slate-600">{inv.igst > 0 ? fmt(inv.igst) : <span className="text-slate-300">—</span>}</td>
                    <td className="px-3 py-3.5">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-mono text-xs">{inv.hsn}</span>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${inv.type === 'IGST' ? 'bg-violet-50 text-violet-700' : 'bg-blue-50 text-blue-700'}`}>
                        {inv.type}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <ConfidenceBar value={inv.confidence} />
                    </td>
                    <td className="px-3 py-3.5"><StatusBadge status={inv.status} /></td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingId(editingId === inv.id ? null : inv.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {inv.status !== "Validated" && (
                          <button className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="Approve">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded issues row */}
                  {expandedId === inv.id && (
                    <tr className="border-t border-blue-100">
                      <td colSpan={13} className="px-5 py-3" style={{ background: '#F0F7FF' }}>
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            {inv.issues.length > 0 ? (
                              <div>
                                <div className="text-xs font-semibold text-amber-700 mb-1.5 flex items-center gap-1.5">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  Validation Issues
                                </div>
                                <div className="space-y-1">
                                  {inv.issues.map((issue, i) => (
                                    <div key={i} className="flex items-start gap-2 text-xs text-amber-700">
                                      <span className="flex-shrink-0">⚠</span>
                                      {issue}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-xs text-emerald-700">
                                <CheckCircle className="w-3.5 h-3.5" />
                                All validations passed. Invoice is ready for GSTR-1 filing.
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">
                            <div><span className="font-semibold">Invoice Date:</span> {inv.date}</div>
                            <div><span className="font-semibold">GST Rate:</span> {inv.rate}</div>
                            <div><span className="font-semibold">Total Amount:</span> {fmt(inv.total)}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-400">Showing {filtered.length} of {INVOICES.length} invoices</div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">Total Tax: <span className="text-slate-800 font-bold">{fmt(summary.total)}</span></span>
            <button
              onClick={() => navigate('/gstr1')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:shadow-md active:scale-95"
              style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}
            >
              Proceed to GSTR-1
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}