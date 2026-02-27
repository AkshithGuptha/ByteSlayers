import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FileText, Upload, CheckSquare, BarChart3, FileCheck,
  Settings, HelpCircle, Bell, Search, ChevronDown, ChevronRight, LogOut,
  Zap, BookOpen, PieChart, Menu, X, ChevronLeft, Building2, Shield,
  AlertCircle, CheckCircle2, Clock, User
} from "lucide-react";

const NOTIFICATIONS = [
  { id: 1, type: "warning", icon: Clock, text: "GSTR-1 due in 3 days for Jan 2026", time: "2 hrs ago" },
  { id: 2, type: "alert", icon: AlertCircle, text: "5 invoices flagged for review", time: "4 hrs ago" },
  { id: 3, type: "info", icon: CheckCircle2, text: "GSTR-3B filed successfully for Dec 2025", time: "1 day ago" },
  { id: 4, type: "warning", icon: AlertCircle, text: "ITC mismatch in 2 purchase invoices", time: "1 day ago" },
];

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    exact: true,
  },
  {
    label: "Invoices",
    icon: FileText,
    children: [
      { label: "Upload Invoices", icon: Upload, path: "/invoices/upload" },
      { label: "Review & Validate", icon: CheckSquare, path: "/invoices/review" },
      { label: "Invoice History", icon: BookOpen, path: "/invoices/history" },
    ],
  },
  {
    label: "GST Returns",
    icon: FileCheck,
    children: [
      { label: "GSTR-1", icon: BarChart3, path: "/gstr1" },
      { label: "GSTR-3B", icon: BarChart3, path: "/gstr3b" },
      { label: "GSTR-9 Annual", icon: BarChart3, path: "/gstr9" },
    ],
  },
  { label: "E-Invoice", icon: Zap, path: "/einvoice" },
  { label: "Ledger", icon: BookOpen, path: "/ledger" },
  { label: "Reports", icon: PieChart, path: "/reports" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Invoices", "GST Returns"]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev =>
      prev.includes(label) ? prev.filter(m => m !== label) : [...prev, label]
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col transition-all duration-300 ease-in-out flex-shrink-0"
        style={{
          width: sidebarOpen ? 240 : 64,
          background: '#0F172A',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}>
            <Shield className="w-4 h-4 text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <div className="text-white font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em' }}>GSTAgent</div>
              <div className="text-xs" style={{ color: '#64748B' }}>AI-Powered Filing</div>
            </div>
          )}
        </div>

        {/* GSTIN badge */}
        {sidebarOpen && (
          <div className="mx-3 mt-3 px-3 py-2 rounded-lg" style={{ background: 'rgba(37, 99, 235, 0.15)', border: '1px solid rgba(37, 99, 235, 0.3)' }}>
            <div className="flex items-center gap-2">
              <Building2 className="w-3 h-3 flex-shrink-0" style={{ color: '#60A5FA' }} />
              <div>
                <div className="text-xs font-medium" style={{ color: '#93C5FD' }}>Ramesh General Stores</div>
                <div className="text-xs font-mono" style={{ color: '#60A5FA', fontSize: '10px' }}>27AABCU9603R1ZX</div>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            if (item.children) {
              const isExpanded = expandedMenus.includes(item.label);
              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-150 group"
                    style={{ color: '#94A3B8' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = '#E2E8F0'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#94A3B8'; }}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="flex-1 text-sm">{item.label}</span>
                        {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      </>
                    )}
                  </button>
                  {sidebarOpen && isExpanded && (
                    <div className="ml-4 mt-0.5 space-y-0.5 border-l pl-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      {item.children.map(child => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            `flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs transition-all duration-150 ${isActive ? 'text-white' : ''}`
                          }
                          style={({ isActive }) => ({
                            color: isActive ? '#fff' : '#94A3B8',
                            background: isActive ? 'rgba(37, 99, 235, 0.25)' : 'transparent',
                          })}
                          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; if (!el.getAttribute('data-active')) { el.style.color = '#E2E8F0'; el.style.background = 'rgba(255,255,255,0.05)'; } }}
                          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; if (el.getAttribute('aria-current') !== 'page') { el.style.color = '#94A3B8'; el.style.background = 'transparent'; } }}
                        >
                          <child.icon className="w-3 h-3 flex-shrink-0" />
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <NavLink
                key={item.path}
                to={item.path!}
                end={item.exact}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150"
                style={({ isActive }) => ({
                  color: isActive ? '#fff' : '#94A3B8',
                  background: isActive ? 'rgba(37, 99, 235, 0.25)' : 'transparent',
                  borderLeft: isActive ? '3px solid #2563EB' : '3px solid transparent',
                })}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-white/5 space-y-1">
          <button
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
            style={{ color: '#64748B' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#94A3B8'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#64748B'; }}
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span>Help & Support</span>}
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
            style={{ color: '#64748B' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#EF4444'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#64748B'; }}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
          {sidebarOpen && (
            <div className="flex items-center gap-2 px-3 py-2 mt-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#fff' }}>RG</div>
              <div>
                <div className="text-xs text-white font-medium">Ramesh Gupta</div>
                <div className="text-xs" style={{ color: '#64748B', fontSize: '10px' }}>Business Owner</div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-100 flex items-center justify-between px-6 py-3 flex-shrink-0" style={{ height: 60 }}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search invoices, GSTIN, HSN..."
                className="pl-9 pr-4 py-2 rounded-lg text-sm bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 w-72 text-slate-600 placeholder-slate-400 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Filing Period */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-medium text-slate-600">Jan 2026</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border border-white"></span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-10 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <span className="font-semibold text-sm text-slate-800">Notifications</span>
                    <span className="text-xs text-blue-600 font-medium cursor-pointer">Mark all read</span>
                  </div>
                  {NOTIFICATIONS.map(n => (
                    <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 border-b border-slate-50 cursor-pointer">
                      <div className={`p-1.5 rounded-full flex-shrink-0 mt-0.5 ${n.type === 'warning' ? 'bg-amber-50' : n.type === 'alert' ? 'bg-red-50' : 'bg-emerald-50'}`}>
                        <n.icon className={`w-3 h-3 ${n.type === 'warning' ? 'text-amber-500' : n.type === 'alert' ? 'text-red-500' : 'text-emerald-500'}`} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-700">{n.text}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>RG</div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-semibold text-slate-700">Ramesh Gupta</div>
                  <div className="text-xs text-slate-400">Business Owner</div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden md:block" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Overlay for notifications */}
      {(showNotifications || showProfile) && (
        <div className="fixed inset-0 z-40" onClick={() => { setShowNotifications(false); setShowProfile(false); }} />
      )}
    </div>
  );
}
