import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield, Zap, CheckCircle, ChevronRight, Star, BarChart3,
  Upload, FileCheck, Brain, Lock, Clock, Users, ArrowRight,
  Phone, Mail, MapPin, ChevronDown, Menu, X, Sparkles,
  TrendingUp, AlertCircle, IndianRupee, Check, Play
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const HERO_IMAGE = "https://images.unsplash.com/photo-1616434234269-f1a22c0f523e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW50ZWNoJTIwZGFzaGJvYXJkJTIwU2FhUyUyMG1vZGVybiUyMFVJfGVufDF8fHx8MTc3MjE3MzcyNnww&ixlib=rb-4.1.0&q=80&w=1080";
const TESTIMONIAL_1 = "https://images.unsplash.com/photo-1671450960874-0903baf942c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBidXNpbmVzc21hbiUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MjE3MzcyOHww&ixlib=rb-4.1.0&q=80&w=400";
const TESTIMONIAL_2 = "https://images.unsplash.com/photo-1607868431640-8540f29f7d29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjB3b21hbiUyMGVudHJlcHJlbmV1ciUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjA4NjIwNnww&ixlib=rb-4.1.0&q=80&w=400";
const TESTIMONIAL_3 = "https://images.unsplash.com/photo-1739066598279-1297113f5c6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBzbWFsbCUyMGJ1c2luZXNzJTIwa2lyYW5hJTIwc3RvcmUlMjBvd25lciUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzcyMTczNzI2fDA&ixlib=rb-4.1.0&q=80&w=400";

const FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Invoice Extraction",
    desc: "Upload photos or PDFs of invoices — our AI extracts GSTIN, HSN codes, tax rates, and amounts with 99.2% accuracy.",
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    icon: Shield,
    title: "Real-Time Compliance Scoring",
    desc: "Get a live compliance score with actionable insights. Catch GSTIN mismatches and ITC discrepancies before filing.",
    color: "#10B981",
    bg: "#ECFDF5",
  },
  {
    icon: Zap,
    title: "One-Click GSTR-1 Filing",
    desc: "Auto-populate GSTR-1 from validated invoices. Review, edit, and file directly on the GST portal with a single click.",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    icon: TrendingUp,
    title: "ITC Reconciliation Engine",
    desc: "Automatically match your purchase invoices with GSTR-2A data. Maximize input tax credit claims every month.",
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
  {
    icon: AlertCircle,
    title: "Smart Tax Alerts",
    desc: "Get WhatsApp & email alerts for filing deadlines, rate changes, and compliance issues before they become penalties.",
    color: "#EF4444",
    bg: "#FEF2F2",
  },
  {
    icon: FileCheck,
    title: "Multi-Business Support",
    desc: "Manage multiple GSTINs under one account. Perfect for CA firms managing multiple MSME clients.",
    color: "#06B6D4",
    bg: "#ECFEFF",
  },
];

const STEPS = [
  { step: "01", title: "Upload Your Invoices", desc: "Snap a photo or upload PDF/Excel invoices. Our AI processes them instantly.", icon: Upload, color: "#2563EB" },
  { step: "02", title: "AI Validates & Reviews", desc: "Automated GSTIN verification, HSN code validation, and tax rate checks in seconds.", icon: Brain, color: "#10B981" },
  { step: "03", title: "File GST Returns", desc: "One-click GSTR-1 filing directly to GST portal with complete audit trail.", icon: FileCheck, color: "#7C3AED" },
];

const PRICING = [
  {
    name: "Starter",
    price: "₹499",
    period: "/month",
    desc: "Perfect for single GST registration",
    features: ["1 GSTIN", "Up to 100 invoices/month", "GSTR-1 filing", "Email alerts", "Basic compliance score"],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "₹1,299",
    period: "/month",
    desc: "For growing businesses",
    features: ["3 GSTINs", "Unlimited invoices", "GSTR-1 + GSTR-3B filing", "ITC reconciliation", "WhatsApp alerts", "AI invoice extraction", "Priority support"],
    cta: "Start Free Trial",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "₹3,999",
    period: "/month",
    desc: "For CA firms & large businesses",
    features: ["Unlimited GSTINs", "Unlimited invoices", "All GST returns", "E-invoice generation", "Dedicated CA support", "API access", "Custom integrations"],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const TESTIMONIALS = [
  {
    name: "Rajesh Kumar",
    role: "Owner, Rajesh General Stores",
    city: "Mumbai, Maharashtra",
    text: "Before GSTAgent, I used to spend 2 days every month on GST filing. Now it takes 20 minutes. The AI extraction is incredibly accurate for my purchase invoices.",
    rating: 5,
    img: TESTIMONIAL_1,
    savings: "₹8,400 saved in accountant fees",
  },
  {
    name: "Priya Sharma",
    role: "Proprietor, Shree Enterprises",
    city: "Ahmedabad, Gujarat",
    text: "The ITC reconciliation feature alone saved me ₹45,000 in one quarter. I had no idea how much ITC I was missing. GSTAgent is a game-changer for small businesses.",
    rating: 5,
    img: TESTIMONIAL_2,
    savings: "₹45,000 ITC recovered",
  },
  {
    name: "Suresh Patel",
    role: "CA & Partner, Patel Associates",
    city: "Surat, Gujarat",
    text: "We manage 47 MSME clients using GSTAgent. The multi-GSTIN dashboard and automated alerts have transformed our practice. Filing accuracy is near 100%.",
    rating: 5,
    img: TESTIMONIAL_3,
    savings: "47 clients managed",
  },
];

const STATS = [
  { value: "12,400+", label: "MSMEs Trust Us" },
  { value: "₹340Cr+", label: "Tax Filed Successfully" },
  { value: "99.2%", label: "AI Accuracy Rate" },
  { value: "₹18Cr+", label: "ITC Recovered for Users" },
];

export function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const FAQS = [
    { q: "Is GSTAgent approved/compliant with GST portal?", a: "Yes, GSTAgent uses the official GST Suvidha Provider (GSP) API to file returns directly on the GSTN portal. All filings are fully compliant with CBIC guidelines." },
    { q: "Can I upload invoices in any format?", a: "Yes! GSTAgent accepts PDF, JPG/PNG (photos), Excel (.xlsx), and Tally XML exports. Our AI handles all formats automatically." },
    { q: "How accurate is the AI invoice extraction?", a: "Our AI achieves 99.2% accuracy on standard printed invoices and 96.8% on handwritten or low-quality scans. You can always review and correct before filing." },
    { q: "Is my financial data secure?", a: "Absolutely. We use bank-grade 256-bit AES encryption, store data on Indian servers, and are ISO 27001 certified. We never share your data with third parties." },
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}>
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '18px' }}>GSTAgent</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: '#ECFDF5', color: '#10B981' }}>AI</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["Features", "How It Works", "Pricing", "Testimonials", "FAQs"].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">{item}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg hover:bg-slate-50">
              Login
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition-all hover:shadow-lg active:scale-95"
              style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}
            >
              Start Free Trial
            </button>
          </div>
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-4">
            {["Features", "Pricing", "Testimonials"].map(i => (
              <a key={i} href="#" className="block text-sm font-medium text-slate-700">{i}</a>
            ))}
            <button onClick={() => navigate('/login')} className="block w-full text-center py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700">Login</button>
            <button onClick={() => navigate('/dashboard')} className="block w-full text-center py-2 rounded-lg text-sm font-semibold text-white" style={{ background: '#2563EB' }}>Start Free Trial</button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-6" style={{ background: 'linear-gradient(180deg, #F0F7FF 0%, #FFFFFF 60%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE' }}>
              <Sparkles className="w-4 h-4" />
              AI-Powered GST Filing — Built for India's Kirana Stores
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.03em' }}>
              File GST Returns in <span style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>20 Minutes</span>,<br />Not 2 Days
            </h1>
            <p className="text-xl text-slate-500 mb-8 leading-relaxed max-w-2xl mx-auto">
              India's smartest GST filing agent for small businesses. Upload invoices, let AI extract & validate, then file directly to the GST portal — zero CA fees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white transition-all hover:shadow-xl active:scale-95"
                style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}
              >
                Start Free Trial — No Credit Card
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 transition-all">
                <Play className="w-4 h-4" />
                Watch Demo (3 min)
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
              {["✅ GSP Certified", "✅ Bank-Grade Security", "✅ 14-day Free Trial", "✅ No Setup Fee"].map(t => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200" style={{ background: '#0F172A' }}>
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <div className="flex-1 mx-4 h-6 rounded bg-white/5 flex items-center px-3">
                  <span className="text-xs text-slate-500">app.gstagent.in/dashboard</span>
                </div>
              </div>
              <ImageWithFallback src={HERO_IMAGE} alt="GSTAgent Dashboard" className="w-full object-cover" style={{ height: 400 }} />
            </div>
            {/* Floating badges */}
            <div className="absolute -left-4 top-1/3 bg-white rounded-xl px-4 py-2.5 shadow-xl border border-slate-100 hidden lg:block">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-50">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">GSTR-1 Filed</div>
                  <div className="text-xs text-slate-400">Dec 2025 — ₹1,84,230</div>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 top-1/2 bg-white rounded-xl px-4 py-2.5 shadow-xl border border-slate-100 hidden lg:block">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50">
                  <Brain className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">AI Extracted</div>
                  <div className="text-xs text-slate-400">47 invoices · 99.2% accuracy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>{s.value}</div>
                <div className="text-sm text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wider">Features</div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Everything You Need to Stay GST Compliant</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">From invoice upload to GST filing — GSTAgent handles the entire compliance workflow so you can focus on growing your business.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all cursor-pointer group">
                <div className="p-3 rounded-xl w-fit mb-4" style={{ background: f.bg }}>
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6" style={{ background: '#F8FAFC' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wider">How It Works</div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>File GST in 3 Simple Steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={s.step} className="relative text-center">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-px z-10" style={{ background: 'linear-gradient(90deg, #CBD5E1, transparent)' }}></div>
                )}
                <div className="relative z-20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md" style={{ background: `linear-gradient(135deg, ${s.color}20, ${s.color}10)`, border: `2px solid ${s.color}30` }}>
                  <s.icon className="w-8 h-8" style={{ color: s.color }} />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: s.color }}>{s.step}</div>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wider">Pricing</div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Simple, Transparent Pricing</h2>
            <p className="text-lg text-slate-500">All plans include a 14-day free trial. No credit card required.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING.map((p) => (
              <div
                key={p.name}
                className={`relative rounded-2xl p-7 border transition-all hover:shadow-xl ${p.highlighted ? 'text-white shadow-2xl' : 'bg-white border-slate-200 hover:border-blue-200'}`}
                style={p.highlighted ? { background: 'linear-gradient(135deg, #2563EB, #1E40AF)', border: 'none' } : {}}
              >
                {p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white" style={{ background: '#10B981' }}>{p.badge}</div>
                )}
                <div className="mb-5">
                  <div className={`text-sm font-semibold mb-1 ${p.highlighted ? 'text-blue-100' : 'text-slate-500'}`}>{p.name}</div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold" style={{ fontFamily: 'Poppins', color: p.highlighted ? '#fff' : '#0F172A' }}>{p.price}</span>
                    <span className={`text-sm ${p.highlighted ? 'text-blue-200' : 'text-slate-400'}`}>{p.period}</span>
                  </div>
                  <div className={`text-sm ${p.highlighted ? 'text-blue-100' : 'text-slate-500'}`}>{p.desc}</div>
                </div>
                <div className="space-y-3 mb-8">
                  {p.features.map(f => (
                    <div key={f} className="flex items-start gap-2.5">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${p.highlighted ? 'bg-white/20' : 'bg-emerald-50'}`}>
                        <Check className={`w-2.5 h-2.5 ${p.highlighted ? 'text-white' : 'text-emerald-600'}`} />
                      </div>
                      <span className={`text-sm ${p.highlighted ? 'text-blue-50' : 'text-slate-600'}`}>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 ${p.highlighted ? 'bg-white text-blue-600 hover:bg-blue-50' : 'border border-blue-600 text-blue-600 hover:bg-blue-50'}`}
                >
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6" style={{ background: '#F8FAFC' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wider">Testimonials</div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Loved by 12,400+ Indian Businesses</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="pt-4 border-t border-slate-50">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: '#ECFDF5', color: '#10B981' }}>
                    ✓ {t.savings}
                  </div>
                  <div className="flex items-center gap-3">
                    <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{t.name}</div>
                      <div className="text-xs text-slate-400">{t.role}</div>
                      <div className="text-xs text-slate-400">{t.city}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faqs" className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-slate-800">{f.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 ml-4 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === i && (
                  <div className="px-6 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(135deg, #0F172A, #1E3A5F)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-sm font-semibold text-blue-400 mb-4 uppercase tracking-wider">Get Started Today</div>
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Ready to Simplify Your GST Filing?</h2>
          <p className="text-lg text-slate-300 mb-8">Join 12,400+ Indian MSMEs who file GST in minutes, not days.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 rounded-xl text-base font-semibold text-white transition-all hover:shadow-lg active:scale-95"
              style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}
            >
              Start Free 14-Day Trial
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 rounded-xl text-base font-semibold text-white border border-white/20 hover:bg-white/10 transition-all"
            >
              Login to Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#2563EB' }}>
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white text-lg" style={{ fontFamily: 'Poppins' }}>GSTAgent</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">India's most trusted AI-powered GST filing platform for small businesses and Kirana stores.</p>
              <div className="flex gap-3">
                {["📧", "📱", "💬"].map((i, n) => (
                  <div key={n} className="w-9 h-9 rounded-lg border border-slate-700 flex items-center justify-center hover:border-slate-500 cursor-pointer transition-colors">{i}</div>
                ))}
              </div>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "API Docs", "Integrations", "Security"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Press", "Contact"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Use", "Refund Policy", "GSP License"] },
            ].map(col => (
              <div key={col.title}>
                <div className="text-sm font-semibold text-white mb-4">{col.title}</div>
                <div className="space-y-2.5">
                  {col.links.map(l => <a key={l} href="#" className="block text-sm text-slate-500 hover:text-slate-300 transition-colors">{l}</a>)}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">© 2026 GSTAgent Technologies Pvt Ltd. All rights reserved. CIN: U72900MH2023PTC123456</p>
            <div className="flex gap-4 text-xs text-slate-600">
              <span>🏦 GSP Certified</span>
              <span>🔒 ISO 27001</span>
              <span>🇮🇳 Made in India</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
