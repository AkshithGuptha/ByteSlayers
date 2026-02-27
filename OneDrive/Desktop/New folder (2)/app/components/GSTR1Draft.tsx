import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle, AlertTriangle, XCircle, Download, Send, Eye,
  ChevronRight, FileCheck, Lock, Info, BarChart3, ArrowUpRight,
  Shield, Clock, ChevronDown
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

// B2B Invoices data
const B2B_DATA = [
  { gstin: "27AADCP8635H1Z8", party: "Parle Products Pvt Ltd", invoices: 3, taxable: 285000, cgst: 25650, sgst: 25650, igst: 0, total: 336300 },
  { gstin: "27AABCH9486B1ZU", party: "HUL Distribution Pvt Ltd", invoices: 5, taxable: 198000, cgst: 11880, sgst: 11880, igst: 0, total: 221760 },
  { gstin: "27AAACN0600P1ZM", party: "Nestle India Ltd", invoices: 2, taxable: 147500, cgst: 13275, sgst: 13275, igst: 0, total: 174050 },
  { gstin: "27AAACM4082C1Z4", party: "Marico Ltd", invoices: 4, taxable: 124600, cgst: 0, sgst: 0, igst: 22428, total: 147028 },
  { gstin: "19AAACB1681F1ZG", party: "Britannia Industries Ltd", invoices: 2, taxable: 98400, cgst: 4920, sgst: 4920, igst: 0, total: 108240 },
  { gstin: "27AAACG0634A1ZY", party: "Godrej Consumer Products", invoices: 3, taxable: 87600, cgst: 7884, sgst: 7884, igst: 0, total: 103368 },
];

const B2CS_DATA = [
  { state: "Maharashtra (27)", taxable: 245800, cgst: 22122, sgst: 22122, rate: "18%", total: 290044 },
  { state: "Maharashtra (27)", taxable: 124500, cgst: 7470, sgst: 7470, rate: "12%", total: 139440 },
  { state: "Maharashtra (27)", taxable: 89200, cgst: 4460, sgst: 4460, rate: "10%", total: 98120 },
];

const HSN_DATA = [
  { hsn: "1901", desc: "Malt extract & cereal preps", uom: "KGS", qty: 1240, taxable: 285000, cgst: 25650, sgst: 25650, igst: 0, total: 336300, rate: "18%" },
  { hsn: "3401", desc: "Soap & cleansing preparations", uom: "NOS", qty: 3450, taxable: 198000, cgst: 11880, sgst: 11880, igst: 0, total: 221760, rate: "12%" },
  { hsn: "2106", desc: "Food preparations NEC", uom: "KGS", qty: 890, taxable: 124500, cgst: 6225, sgst: 6225, igst: 0, total: 136950, rate: "10%" },
  { hsn: "3305", desc: "Hair preparations", uom: "NOS", qty: 2100, taxable: 124600, cgst: 0, sgst: 0, igst: 22428, total: 147028, rate: "18%" },
  { hsn: "1905", desc: "Bread, pastry & bakery prods", uom: "KGS", qty: 1560, taxable: 98400, cgst: 4920, sgst: 4920, igst: 0, total: 108240, rate: "10%" },
  { hsn: "3304", desc: "Beauty/skin-care preparations", uom: "NOS", qty: 780, taxable: 87600, cgst: 7884, sgst: 7884, igst: 0, total: 103368, rate: "18%" },
];

const TAX_SUMMARY_CHART = [
  { name: "B2B", amount: 174900, color: "#2563EB" },
  { name: "B2CS", amount: 63544, color: "#10B981" },
  { name: "IGST", amount: 22428, color: "#7C3AED" },
  { name: "Exports", amount: 0, color: "#F59E0B" },
];

const VALIDATION_CHECKS = [
  { id: 1, label: "GSTIN verified for all 6 B2B parties", status: "pass", detail: "100% GSTIN validation passed" },
  { id: 2, label: "Tax amount matches invoice total", status: "pass", detail: "0 discrepancies found" },
  { id: 3, label: "HSN codes validated against GST rate schedule", status: "warning", detail: "2 HSN codes flagged for rate review" },
  { id: 4, label: "Invoice serial numbers are sequential", status: "pass", detail: "234 invoices in correct sequence" },
  { id: 5, label: "B2CS threshold (₹2.5L) not exceeded", status: "pass", detail: "All B2CS invoices within threshold" },
  { id: 6, label: "ITC reconciled with GSTR-2A", status: "warning", detail: "3 invoices not found in GSTR-2A portal" },
  { id: 7, label: "E-invoice IRN generated for eligible invoices", status: "pass", detail: "47 IRNs generated successfully" },
  { id: 8, label: "No duplicate invoice numbers", status: "pass", detail: "Zero duplicates detected" },
];

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const TABS = ["B2B", "B2CS", "B2CL", "HSN Summary", "CDNR", "Amendments"];

export function GSTR1Draft() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("B2B");
  const [showConfirm, setShowConfirm] = useState(false);
  const [filed, setFiled] = useState(false);

  const totalTax = TAX_SUMMARY_CHART.reduce((s, t) => s + t.amount, 0);
  const passCount = VALIDATION_CHECKS.filter(v => v.status === "pass").length;
  const warnCount = VALIDATION_CHECKS.filter(v => v.status === "warning").length;

  const handleFiled = () => {
    setShowConfirm(false);
    setFiled(true);
  };

  if (filed) {
    return (
      <div className="flex items-center justify-center min-h-full p-10" style={{ background: '#F8FAFC' }}>
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)' }}>
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3" style={{ fontFamily: 'Poppins' }}>GSTR-1 Filed Successfully!</h2>
          <p className="text-slate-500 mb-2">Your GSTR-1 for January 2026 has been filed on the GSTN portal.</p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm"><span className="text-slate-600">ARN Number:</span><span className="font-mono font-semibold text-slate-800">AA2702260043924</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-600">Filing Date:</span><span className="font-semibold text-slate-800">08 Feb 2026, 14:23 IST</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-600">Total Tax:</span><span className="font-bold text-emerald-600">{fmt(totalTax)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-600">Status:</span><span className="font-semibold text-emerald-600">Filed & Acknowledged</span></div>
          </div>
          <div className="flex gap-3 justify-center">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all">
              <Download className="w-4 h-4" />
              Download Acknowledgement
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5 min-h-full" style={{ background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>GST Returns</span><ChevronRight className="w-3 h-3" /><span className="text-slate-600">GSTR-1 Draft</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Poppins, sans-serif' }}>GSTR-1 Draft</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Ramesh General Stores · GSTIN: 27AABCU9603R1ZX · January 2026
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">Draft — Not Filed</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all">
            <Download className="w-4 h-4" />
            Download JSON
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all">
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg active:scale-95"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
          >
            <Send className="w-4 h-4" />
            File GSTR-1
          </button>
        </div>
      </div>

      {/* Summary + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Tax Summary Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-slate-800">Tax Summary by Category</h2>
              <p className="text-xs text-slate-400 mt-0.5">Total outward tax: <span className="font-semibold text-slate-700">{fmt(totalTax)}</span></p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { label: "Total Taxable", value: "₹9,18,100", color: "#2563EB" },
              { label: "Total CGST", value: "₹58,559", color: "#7C3AED" },
              { label: "Total SGST", value: "₹58,559", color: "#7C3AED" },
              { label: "Total IGST", value: "₹22,428", color: "#06B6D4" },
            ].map(s => (
              <div key={s.label} className="text-center p-3 rounded-xl" style={{ background: '#F8FAFC' }}>
                <div className="font-bold text-sm" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={TAX_SUMMARY_CHART} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}K`} />
              <Tooltip formatter={(v: any) => [fmt(v), "Tax Amount"]} contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={60}>
                {TAX_SUMMARY_CHART.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Validation Panel */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-800">Validation Checks</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{passCount} Passed</span>
              {warnCount > 0 && <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{warnCount} Warnings</span>}
            </div>
          </div>
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {VALIDATION_CHECKS.map((check) => (
              <div key={check.id} className="flex items-start gap-2.5">
                {check.status === "pass" ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                ) : check.status === "warning" ? (
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-xs font-medium text-slate-700">{check.label}</p>
                  <p className="text-xs text-slate-400">{check.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="p-3 rounded-xl" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
              <div className="flex items-start gap-2 text-xs text-amber-700">
                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>2 warnings detected. You can still file, but review flagged items before submission.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section with Tabs */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-all border-b-2"
              style={{
                borderColor: activeTab === tab ? '#2563EB' : 'transparent',
                color: activeTab === tab ? '#2563EB' : '#94A3B8',
                background: activeTab === tab ? '#F0F7FF' : 'transparent',
              }}
            >
              {tab}
              {tab === "B2B" && <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">{B2B_DATA.length}</span>}
              {tab === "HSN Summary" && <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600">{HSN_DATA.length}</span>}
            </button>
          ))}
        </div>

        {/* B2B Table */}
        {activeTab === "B2B" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {["GSTIN of Recipient", "Party Name", "No. of Invoices", "Taxable Value", "CGST", "SGST", "IGST", "Invoice Value"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {B2B_DATA.map((row, i) => (
                  <tr key={row.gstin} className="border-t border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-600">{row.gstin}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: `hsl(${i * 50 + 180}, 55%, 50%)` }}>
                          {row.party.charAt(0)}
                        </div>
                        <span className="text-xs font-medium text-slate-700 whitespace-nowrap">{row.party}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">{row.invoices}</span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800 text-xs">{fmt(row.taxable)}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{row.cgst > 0 ? fmt(row.cgst) : <span className="text-slate-300">—</span>}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{row.sgst > 0 ? fmt(row.sgst) : <span className="text-slate-300">—</span>}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{row.igst > 0 ? fmt(row.igst) : <span className="text-slate-300">—</span>}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-800 text-xs">{fmt(row.total)}</td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="border-t-2 border-slate-200" style={{ background: '#F0F7FF' }}>
                  <td className="px-5 py-3 text-xs font-bold text-slate-700" colSpan={2}>Total</td>
                  <td className="px-5 py-3 text-center text-xs font-bold text-blue-700">{B2B_DATA.reduce((s, r) => s + r.invoices, 0)}</td>
                  <td className="px-5 py-3 text-xs font-bold text-slate-800">{fmt(B2B_DATA.reduce((s, r) => s + r.taxable, 0))}</td>
                  <td className="px-5 py-3 text-xs font-bold text-slate-800">{fmt(B2B_DATA.reduce((s, r) => s + r.cgst, 0))}</td>
                  <td className="px-5 py-3 text-xs font-bold text-slate-800">{fmt(B2B_DATA.reduce((s, r) => s + r.sgst, 0))}</td>
                  <td className="px-5 py-3 text-xs font-bold text-slate-800">{fmt(B2B_DATA.reduce((s, r) => s + r.igst, 0))}</td>
                  <td className="px-5 py-3 text-xs font-bold text-blue-700">{fmt(B2B_DATA.reduce((s, r) => s + r.total, 0))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* B2CS Table */}
        {activeTab === "B2CS" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {["State", "Rate", "Taxable Value", "CGST", "SGST", "Invoice Value"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {B2CS_DATA.map((row, i) => (
                  <tr key={i} className="border-t border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-xs text-slate-700">{row.state}</td>
                    <td className="px-5 py-3.5"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">{row.rate}</span></td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800 text-xs">{fmt(row.taxable)}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{fmt(row.cgst)}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{fmt(row.sgst)}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-800 text-xs">{fmt(row.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* HSN Summary */}
        {activeTab === "HSN Summary" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {["HSN Code", "Description", "UOM", "Qty", "Taxable Value", "Rate", "CGST", "SGST", "IGST", "Total"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HSN_DATA.map((row) => (
                  <tr key={row.hsn} className="border-t border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs font-bold text-blue-600">{row.hsn}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-700 max-w-40">{row.desc}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">{row.uom}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-700 font-medium">{row.qty.toLocaleString()}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800 text-xs">{fmt(row.taxable)}</td>
                    <td className="px-4 py-3.5"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">{row.rate}</span></td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">{row.cgst > 0 ? fmt(row.cgst) : <span className="text-slate-300">—</span>}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">{row.sgst > 0 ? fmt(row.sgst) : <span className="text-slate-300">—</span>}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">{row.igst > 0 ? fmt(row.igst) : <span className="text-slate-300">—</span>}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-800 text-xs">{fmt(row.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Other tabs placeholder */}
        {!["B2B", "B2CS", "HSN Summary"].includes(activeTab) && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-slate-100">
              <FileCheck className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600">{activeTab} section</p>
            <p className="text-xs text-slate-400 mt-1">No data for {activeTab} in January 2026</p>
          </div>
        )}
      </div>

      {/* File Button Bottom */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-semibold text-slate-700">Ready to File</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              Due: 11 Feb 2026 · <span className="text-red-500 font-semibold">3 days remaining</span>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-400">Total Tax Payable</div>
              <div className="font-bold text-slate-900" style={{ fontFamily: 'Poppins' }}>{fmt(totalTax)}</div>
            </div>
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg active:scale-95"
              style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
            >
              <Send className="w-4 h-4" />
              File GSTR-1 on GST Portal
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#ECFDF5' }}>
                <FileCheck className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Confirm GSTR-1 Filing</h3>
                <p className="text-xs text-slate-500 mt-0.5">This will file directly to the GSTN portal</p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 mb-5 space-y-2.5">
              {[
                { label: "GSTIN", value: "27AABCU9603R1ZX" },
                { label: "Filing Period", value: "January 2026" },
                { label: "Total Invoices", value: "234" },
                { label: "Total Tax Liability", value: fmt(totalTax) },
                { label: "Validation Status", value: `${passCount} passed, ${warnCount} warnings` },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">{r.label}</span>
                  <span className="font-semibold text-slate-800">{r.value}</span>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl mb-5" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
              <Lock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">By filing, you confirm that the information provided is true and correct. Once filed, this return cannot be revised for this period.</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
              >
                Review Again
              </button>
              <button
                onClick={handleFiled}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg active:scale-95"
                style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
              >
                Confirm & File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
