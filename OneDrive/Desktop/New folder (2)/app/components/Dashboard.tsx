import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  TrendingUp, Upload, FileCheck, AlertTriangle, CheckCircle,
  Clock, ArrowRight, ChevronRight, Eye, Download, RefreshCw,
  IndianRupee, FileText, Shield, ArrowUpRight
} from "lucide-react";

const MONTHLY_DATA = [
  { month: "Aug", taxable: 845000, tax: 112000, itc: 58000, net: 54000 },
  { month: "Sep", taxable: 912000, tax: 124000, itc: 61000, net: 63000 },
  { month: "Oct", taxable: 1087000, tax: 148000, itc: 72000, net: 76000 },
  { month: "Nov", taxable: 1123000, tax: 156000, itc: 78000, net: 78000 },
  { month: "Dec", taxable: 1245000, tax: 184000, itc: 96000, net: 88000 },
  { month: "Jan", taxable: 1321000, tax: 194000, itc: 102000, net: 92000 },
];

const INVOICES = [
  { id: "INV-2026-001", party: "Parle Products Pvt Ltd", gstin: "27AADCP8635H1Z8", amount: 124500, tax: 22410, type: "B2B", rate: "18%", status: "Validated", date: "15 Jan 2026", hsn: "1901" },
  { id: "INV-2026-002", party: "HUL Distribution Pvt Ltd", gstin: "27AABCH9486B1ZU", amount: 87300, tax: 9492, type: "B2B", rate: "12%", status: "Validated", date: "18 Jan 2026", hsn: "3401" },
  { id: "INV-2026-003", party: "ITC Limited Foods", gstin: "19AAACI4078D1Z3", amount: 56800, tax: 2840, type: "B2B", rate: "5%", status: "Warning", date: "20 Jan 2026", hsn: "2106" },
  { id: "INV-2026-004", party: "Nestle India Ltd", gstin: "27AAACN0600P1ZM", amount: 112450, tax: 20241, type: "B2B", rate: "18%", status: "Validated", date: "22 Jan 2026", hsn: "1901" },
  { id: "INV-2026-005", party: "Dabur India Ltd", gstin: "07AAACH6796N1ZK", amount: 43200, tax: 5184, type: "B2B", rate: "12%", status: "Error", date: "25 Jan 2026", hsn: "3304" },
  { id: "INV-2026-006", party: "Marico Ltd", gstin: "27AAACM4082C1Z4", amount: 68900, tax: 12402, type: "IGST", rate: "18%", status: "Validated", date: "28 Jan 2026", hsn: "3305" },
];

const COMPLIANCE_BREAKDOWN = [
  { name: "Invoice Completeness", value: 98, color: "#10B981" },
  { name: "Tax Rate Accuracy", value: 96, color: "#2563EB" },
  { name: "GSTIN Validation", value: 100, color: "#7C3AED" },
  { name: "Filing Timeliness", value: 88, color: "#F59E0B" },
];

const ALERTS = [
  { type: "critical", icon: AlertTriangle, title: "GSTR-1 Due in 3 Days", desc: "Jan 2026 return must be filed by Feb 11, 2026. 234 invoices ready.", action: "File Now", color: "#EF4444", bg: "#FEF2F2" },
  { type: "warning", icon: AlertTriangle, title: "ITC Mismatch Detected", desc: "GSTR-2A mismatch found in 3 invoices totaling ₹18,450 ITC at risk.", action: "Review", color: "#F59E0B", bg: "#FFFBEB" },
  { type: "info", icon: CheckCircle, title: "AI Extraction Complete", desc: "47 new invoices processed with 97.3% accuracy. Ready for review.", action: "View", color: "#2563EB", bg: "#EFF6FF" },
];

const fmt = (n: number) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
};

const fmtFull = (n: number) => `₹${n.toLocaleString('en-IN')}`;

function ComplianceRing({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 90 ? '#10B981' : score >= 75 ? '#F59E0B' : '#EF4444';
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 120" className="w-32 h-32">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#F1F5F9" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x="60" y="55" textAnchor="middle" fill="#0F172A" fontSize="22" fontWeight="700" fontFamily="Inter">{score}</text>
        <text x="60" y="72" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="Inter">/100</text>
      </svg>
      <div className="text-center">
        <div className="text-sm font-semibold" style={{ color }}>
          {score >= 90 ? 'Excellent' : score >= 75 ? 'Good' : 'Needs Attention'}
        </div>
        <div className="text-xs text-slate-400 mt-0.5">Compliance Score</div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="font-medium text-slate-700">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export function Dashboard() {
  const navigate = useNavigate();
  const [activeInvoices, setActiveInvoices] = useState<string[]>([]);

  const KPI = [
    {
      title: "Tax Liability (Jan)",
      value: "₹1,94,230",
      sub: "+5.5% vs Dec",
      trend: "up",
      icon: IndianRupee,
      color: "#2563EB",
      bg: "#EFF6FF",
    },
    {
      title: "Input Tax Credit",
      value: "₹1,02,450",
      sub: "+6.7% vs Dec",
      trend: "up",
      icon: TrendingUp,
      color: "#10B981",
      bg: "#ECFDF5",
    },
    {
      title: "Net Tax Payable",
      value: "₹91,780",
      sub: "After ITC setoff",
      trend: "neutral",
      icon: FileCheck,
      color: "#7C3AED",
      bg: "#F5F3FF",
    },
    {
      title: "Invoices Processed",
      value: "234",
      sub: "47 pending review",
      trend: "neutral",
      icon: FileText,
      color: "#F59E0B",
      bg: "#FFFBEB",
    },
  ];

  return (
    <div className="p-6 space-y-6 min-h-full" style={{ background: '#F8FAFC' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Good morning, Ramesh! 👋</h1>
          <p className="text-sm text-slate-500 mt-0.5">GSTR-1 for January 2026 is due in <span className="text-red-500 font-semibold">3 days</span>. 234 invoices are ready.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/invoices/upload')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-md active:scale-95"
            style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}
          >
            <Upload className="w-4 h-4" />
            Upload Invoices
          </button>
          <button
            onClick={() => navigate('/gstr1')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
          >
            <FileCheck className="w-4 h-4" />
            File GSTR-1
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI.map((k) => (
          <div key={k.title} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl" style={{ background: k.bg }}>
                <k.icon className="w-5 h-5" style={{ color: k.color }} />
              </div>
              {k.trend === 'up' && <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"><TrendingUp className="w-3 h-3" />{k.sub.split(' ')[0]}</div>}
            </div>
            <div className="text-2xl font-bold text-slate-900" style={{ letterSpacing: '-0.02em' }}>{k.value}</div>
            <div className="text-xs text-slate-500 mt-1">{k.sub}</div>
            <div className="text-xs font-medium text-slate-600 mt-2 group-hover:text-blue-600 flex items-center gap-1 transition-colors">{k.title}<ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue & Tax Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-slate-800">Revenue & Tax Trend</h2>
              <p className="text-xs text-slate-400 mt-0.5">Last 6 months — Aug 2025 to Jan 2026</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div><span className="text-slate-500">Tax Liability</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div><span className="text-slate-500">ITC Available</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-violet-400"></div><span className="text-slate-500">Net Tax</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gTax" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gItc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'Inter' }} axisLine={false} tickLine={false} tickFormatter={(v) => fmt(v)} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="tax" name="Tax Liability" stroke="#2563EB" strokeWidth={2} fill="url(#gTax)" dot={false} activeDot={{ r: 5, fill: '#2563EB' }} />
              <Area type="monotone" dataKey="itc" name="ITC Available" stroke="#10B981" strokeWidth={2} fill="url(#gItc)" dot={false} activeDot={{ r: 5, fill: '#10B981' }} />
              <Area type="monotone" dataKey="net" name="Net Tax" stroke="#7C3AED" strokeWidth={2} fill="url(#gNet)" dot={false} activeDot={{ r: 5, fill: '#7C3AED' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Compliance Panel */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-slate-800">Compliance Score</h2>
            <Shield className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex justify-center mb-4">
            <ComplianceRing score={94} />
          </div>
          <div className="space-y-2.5">
            {COMPLIANCE_BREAKDOWN.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-600">{c.name}</span>
                  <span className="text-xs font-semibold" style={{ color: c.color }}>{c.value}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100">
                  <div className="h-full rounded-full transition-all" style={{ width: `${c.value}%`, background: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Alerts */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-800">Active Alerts</h2>
            <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">View all</span>
          </div>
          {ALERTS.map((a, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-start gap-3 hover:shadow-md transition-shadow">
              <div className="p-2 rounded-lg flex-shrink-0" style={{ background: a.bg }}>
                <a.icon className="w-4 h-4" style={{ color: a.color }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-800">{a.title}</span>
                  <button
                    className="text-xs font-semibold px-3 py-1 rounded-lg transition-colors"
                    style={{ color: a.color, background: a.bg }}
                  >
                    {a.action} →
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions + Deadline */}
        <div className="space-y-4">
          {/* Deadline Countdown */}
          <div className="bg-white rounded-xl p-4 border border-red-100 shadow-sm" style={{ background: 'linear-gradient(135deg, #FFF8F8, #FFF0F0)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold text-red-700">GSTR-1 Deadline</span>
            </div>
            <div className="flex gap-2 mb-2">
              {['02', '19', '46'].map((n, i) => (
                <div key={i} className="flex-1 text-center">
                  <div className="text-2xl font-bold text-red-600" style={{ fontFamily: 'Poppins' }}>{n}</div>
                  <div className="text-xs text-red-400">{['Days', 'Hrs', 'Min'][i]}</div>
                </div>
              ))}
            </div>
            <div className="h-1.5 rounded-full bg-red-100 mb-2">
              <div className="h-full rounded-full bg-red-500" style={{ width: '78%' }} />
            </div>
            <button
              onClick={() => navigate('/gstr1')}
              className="w-full py-2 rounded-lg text-sm font-semibold text-white transition-all active:scale-95"
              style={{ background: '#EF4444' }}
            >
              File GSTR-1 Now
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { icon: Upload, label: "Upload New Invoices", color: "#2563EB", path: "/invoices/upload" },
                { icon: Eye, label: "Review 47 Pending", color: "#7C3AED", path: "/invoices/review" },
                { icon: Download, label: "Download GSTR-2A", color: "#10B981", path: "#" },
                { icon: RefreshCw, label: "Reconcile ITC", color: "#F59E0B", path: "#" },
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => q.path !== '#' && navigate(q.path)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left hover:bg-slate-50 transition-colors group"
                >
                  <div className="p-1.5 rounded-md" style={{ background: q.color + '15' }}>
                    <q.icon className="w-3.5 h-3.5" style={{ color: q.color }} />
                  </div>
                  <span className="text-slate-700 font-medium">{q.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 ml-auto group-hover:text-slate-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-800">Recent Invoices</h2>
            <p className="text-xs text-slate-400 mt-0.5">January 2026 — Showing latest 6</p>
          </div>
          <button
            onClick={() => navigate('/invoices/review')}
            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            View All <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {["Invoice No.", "Party Name", "GSTIN", "Amount", "Tax", "Type", "Date", "Status"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv, i) => (
                <tr
                  key={inv.id}
                  className="border-t border-slate-50 hover:bg-blue-50/30 cursor-pointer transition-colors group"
                  onClick={() => navigate('/invoices/review')}
                >
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold text-blue-600 font-mono">{inv.id}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: `hsl(${i * 47 + 180}, 60%, 50%)` }}>
                        {inv.party.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-slate-700 whitespace-nowrap">{inv.party}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-mono text-slate-500">{inv.gstin}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold text-slate-800">{fmtFull(inv.amount)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-slate-600">{fmtFull(inv.tax)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${inv.type === 'IGST' ? 'bg-violet-50 text-violet-700' : 'bg-blue-50 text-blue-700'}`}>
                      {inv.type} · {inv.rate}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-slate-500">{inv.date}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      inv.status === 'Validated' ? 'bg-emerald-50 text-emerald-700' :
                      inv.status === 'Warning' ? 'bg-amber-50 text-amber-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {inv.status === 'Validated' ? <CheckCircle className="w-3 h-3" /> :
                       inv.status === 'Warning' ? <AlertTriangle className="w-3 h-3" /> :
                       <AlertTriangle className="w-3 h-3" />}
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}