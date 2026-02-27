import { useNavigate, useLocation } from "react-router-dom";
import { Construction, ArrowLeft } from "lucide-react";

export function PlaceholderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const pageName = location.pathname.replace(/\//g, ' › ').replace(/^›\s*/, '').toUpperCase();

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-12 text-center" style={{ background: '#F8FAFC' }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: '#EFF6FF' }}>
        <Construction className="w-8 h-8 text-blue-500" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Poppins' }}>Coming Soon</h2>
      <p className="text-sm text-slate-500 mb-1">{pageName}</p>
      <p className="text-sm text-slate-400 mb-8 max-w-sm">This page is under development. Navigate to Dashboard, Invoices, or GSTR-1 to explore the full experience.</p>
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
        style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>
    </div>
  );
}
