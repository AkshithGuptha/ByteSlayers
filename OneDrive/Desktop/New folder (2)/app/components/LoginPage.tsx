import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, ChevronRight, CheckCircle, Lock, ArrowLeft, Smartphone, Mail } from "lucide-react";

const FEATURES_LIST = [
  "AI-powered invoice extraction with 99.2% accuracy",
  "One-click GSTR-1, GSTR-3B filing",
  "Real-time ITC reconciliation",
  "Compliance score & smart alerts",
  "GSP certified — direct GSTN filing",
];

export function LoginPage() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [form, setForm] = useState({ gstin: "", email: "", password: "", otp: "", mobile: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateGSTIN = (gstin: string) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin);

  const handleLogin = () => {
    const newErrors: Record<string, string> = {};
    if (loginMethod === "password") {
      if (!form.gstin) newErrors.gstin = "GSTIN is required";
      else if (!validateGSTIN(form.gstin)) newErrors.gstin = "Invalid GSTIN format";
      if (!form.password) newErrors.password = "Password is required";
    } else {
      if (!form.mobile) newErrors.mobile = "Mobile number is required";
      if (otpSent && !form.otp) newErrors.otp = "Enter the OTP";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const handleSendOtp = () => {
    if (!form.mobile || form.mobile.length < 10) {
      setErrors({ mobile: "Enter valid 10-digit mobile number" });
      return;
    }
    setErrors({});
    setOtpSent(true);
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #1E1B4B 100%)' }}>
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-5" style={{ background: '#2563EB', filter: 'blur(60px)' }}></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full opacity-5" style={{ background: '#7C3AED', filter: 'blur(80px)' }}></div>
          {/* Grid pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}></div>
        </div>

        <div className="relative z-10">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-12">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-white text-xl" style={{ fontFamily: 'Poppins' }}>GSTAgent</div>
              <div className="text-xs text-slate-400">AI-Powered Filing Platform</div>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins', lineHeight: 1.2 }}>
            GST Filing Made<br /><span style={{ color: '#60A5FA' }}>Effortlessly Simple</span>
          </h2>
          <p className="text-slate-400 text-base mb-10 leading-relaxed">
            Trusted by 12,400+ Indian MSMEs to file GST returns accurately and on time. Join the revolution in business compliance.
          </p>

          <div className="space-y-4">
            {FEATURES_LIST.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-sm text-slate-300">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          {/* Mock stat cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Invoices Filed", value: "3.2M+" },
              { label: "Tax Accuracy", value: "99.2%" },
              { label: "MSMEs Trust Us", value: "12,400+" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="font-bold text-white mb-0.5" style={{ fontFamily: 'Poppins' }}>{s.value}</div>
                <div className="text-xs text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-5">
            <div className="text-xs text-slate-500">🔒 256-bit AES Encrypted</div>
            <div className="text-xs text-slate-500">🏛️ GSP Certified</div>
            <div className="text-xs text-slate-500">🇮🇳 Data Stored in India</div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#2563EB' }}>
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900" style={{ fontFamily: 'Poppins' }}>GSTAgent</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Poppins' }}>Welcome back</h1>
            <p className="text-slate-500 text-sm">Sign in to your GSTAgent account to continue filing.</p>
          </div>

          {/* Login method toggle */}
          <div className="flex rounded-xl overflow-hidden border border-slate-200 mb-6 p-1 bg-slate-50 gap-1">
            {[
              { id: "password" as const, label: "GSTIN & Password", icon: Lock },
              { id: "otp" as const, label: "Mobile OTP", icon: Smartphone },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => { setLoginMethod(m.id); setErrors({}); setOtpSent(false); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={loginMethod === m.id ? { background: '#fff', color: '#2563EB', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : { color: '#94A3B8' }}
              >
                <m.icon className="w-3.5 h-3.5" />
                {m.label}
              </button>
            ))}
          </div>

          {loginMethod === "password" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">GSTIN <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. 27AABCU9603R1ZX"
                  maxLength={15}
                  value={form.gstin}
                  onChange={e => setForm({ ...form, gstin: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 rounded-xl border text-sm font-mono transition-all focus:outline-none focus:ring-2 focus:ring-blue-100"
                  style={{ borderColor: errors.gstin ? '#EF4444' : form.gstin && validateGSTIN(form.gstin) ? '#10B981' : '#E2E8F0', background: '#F8FAFC' }}
                />
                {errors.gstin && <p className="text-xs text-red-500 mt-1">{errors.gstin}</p>}
                {form.gstin && validateGSTIN(form.gstin) && <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Valid GSTIN</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password <span className="text-red-400">*</span></label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-3 pr-12 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-100"
                    style={{ borderColor: errors.password ? '#EF4444' : '#E2E8F0', background: '#F8FAFC' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">Forgot password?</button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mobile Number <span className="text-red-400">*</span></label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1 px-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600">
                    🇮🇳 +91
                  </div>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                    value={form.mobile}
                    onChange={e => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') })}
                    className="flex-1 px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-100"
                    style={{ borderColor: errors.mobile ? '#EF4444' : '#E2E8F0', background: '#F8FAFC' }}
                  />
                </div>
                {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
              </div>
              {!otpSent ? (
                <button onClick={handleSendOtp} className="w-full py-3 rounded-xl text-sm font-semibold border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all">
                  Send OTP via SMS
                </button>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Enter OTP</label>
                  <div className="flex gap-2">
                    {[...Array(6)].map((_, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        className="w-full aspect-square text-center rounded-lg border border-slate-200 bg-slate-50 text-lg font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">OTP sent to +91 {form.mobile} · <button className="text-blue-600 font-medium hover:underline">Resend in 30s</button></p>
                </div>
              )}
            </div>
          )}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-6 py-3.5 rounded-xl text-base font-semibold text-white transition-all hover:shadow-lg active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </>
            ) : (
              <>Sign In to GSTAgent <ChevronRight className="w-4 h-4" /></>
            )}
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-xs text-slate-400">or continue with</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <button className="w-full py-3 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <button className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">Create free account</button>
          </p>

          <p className="text-center text-xs text-slate-400 mt-4">
            By signing in, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
