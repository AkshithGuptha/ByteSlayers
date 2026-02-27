import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload, FileText, X, CheckCircle, AlertCircle, Loader2,
  Eye, Zap, Image, FileSpreadsheet, Camera, ChevronRight,
  Info, File, Trash2, RefreshCw
} from "lucide-react";

type FileStatus = "uploading" | "processing" | "done" | "error";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  status: FileStatus;
  progress: number;
  invoices?: number;
  confidence?: number;
  errorMsg?: string;
}

const MOCK_FILES: UploadedFile[] = [
  { id: "1", name: "Purchase_Invoice_Jan2026_Parle.pdf", size: "2.4 MB", type: "PDF", status: "done", progress: 100, invoices: 1, confidence: 99 },
  { id: "2", name: "HUL_Invoices_Batch.xlsx", size: "1.1 MB", type: "Excel", status: "done", progress: 100, invoices: 12, confidence: 97 },
  { id: "3", name: "Invoice_Photo_20260118.jpg", size: "3.8 MB", type: "Image", status: "done", progress: 100, invoices: 1, confidence: 94 },
  { id: "4", name: "Nestle_Invoice_Jan.pdf", size: "890 KB", type: "PDF", status: "processing", progress: 67, invoices: undefined, confidence: undefined },
  { id: "5", name: "Damaged_Invoice_scan.jpg", size: "5.2 MB", type: "Image", status: "error", progress: 45, errorMsg: "Low image quality — confidence below threshold" },
];

const STATS = [
  { label: "Files Uploaded", value: "47", color: "#2563EB", bg: "#EFF6FF" },
  { label: "Invoices Extracted", value: "234", color: "#10B981", bg: "#ECFDF5" },
  { label: "Avg. Accuracy", value: "97.3%", color: "#7C3AED", bg: "#F5F3FF" },
  { label: "Ready to File", value: "218", color: "#F59E0B", bg: "#FFFBEB" },
];

const SUPPORTED_FORMATS = [
  { icon: FileText, label: "PDF", desc: "Scanned or digital invoices", color: "#EF4444" },
  { icon: Image, label: "JPG/PNG", desc: "Invoice photos", color: "#F59E0B" },
  { icon: FileSpreadsheet, label: "Excel", desc: "Batch invoice sheets", color: "#10B981" },
  { icon: File, label: "Tally XML", desc: "Tally ERP exports", color: "#2563EB" },
];

export function InvoiceUpload() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>(MOCK_FILES);
  const [showTips, setShowTips] = useState(true);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    simulateUpload(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    simulateUpload(selected);
  };

  const simulateUpload = (newFiles: File[]) => {
    const newEntries: UploadedFile[] = newFiles.map(f => ({
      id: Date.now().toString() + Math.random(),
      name: f.name,
      size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
      type: f.name.endsWith('.pdf') ? 'PDF' : f.name.endsWith('.xlsx') ? 'Excel' : 'Image',
      status: "uploading",
      progress: 0,
    }));
    setFiles(prev => [...newEntries, ...prev]);

    newEntries.forEach(entry => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 25;
        if (progress >= 100) {
          clearInterval(interval);
          setFiles(prev => prev.map(f =>
            f.id === entry.id
              ? { ...f, progress: 100, status: "processing" }
              : f
          ));
          setTimeout(() => {
            setFiles(prev => prev.map(f =>
              f.id === entry.id
                ? { ...f, status: "done", invoices: 1, confidence: Math.floor(Math.random() * 8 + 92) }
                : f
            ));
          }, 1500);
        } else {
          setFiles(prev => prev.map(f =>
            f.id === entry.id ? { ...f, progress: Math.min(progress, 95), status: "uploading" } : f
          ));
        }
      }, 300);
    });
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const getStatusIcon = (file: UploadedFile) => {
    if (file.status === "done") return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    if (file.status === "error") return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (file.status === "processing") return <Zap className="w-4 h-4 text-blue-500 animate-pulse" />;
    return <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />;
  };

  const doneCount = files.filter(f => f.status === "done").length;
  const processingCount = files.filter(f => f.status === "processing" || f.status === "uploading").length;
  const errorCount = files.filter(f => f.status === "error").length;

  return (
    <div className="p-6 space-y-6 min-h-full" style={{ background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Invoices</span><ChevronRight className="w-3 h-3" /><span className="text-slate-600">Upload Invoices</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Upload Invoices</h1>
          <p className="text-sm text-slate-500 mt-0.5">AI will automatically extract and validate GST data from your invoices</p>
        </div>
        {doneCount > 0 && (
          <button
            onClick={() => navigate('/invoices/review')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-md active:scale-95"
            style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}
          >
            Review {doneCount} Invoices
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <div className="text-2xl font-bold mb-1" style={{ color: s.color, fontFamily: 'Poppins' }}>{s.value}</div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200"
            style={{
              borderColor: isDragging ? '#2563EB' : '#CBD5E1',
              background: isDragging ? '#EFF6FF' : '#FAFAFA',
              minHeight: 200,
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.xml"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${isDragging ? 'scale-110' : ''}`} style={{ background: isDragging ? '#DBEAFE' : '#F1F5F9' }}>
                <Upload className={`w-7 h-7 transition-colors ${isDragging ? 'text-blue-600' : 'text-slate-400'}`} />
              </div>
              <div className={`text-base font-semibold mb-1 transition-colors ${isDragging ? 'text-blue-600' : 'text-slate-700'}`}>
                {isDragging ? "Release to upload files" : "Drag & drop invoices here"}
              </div>
              <div className="text-sm text-slate-400 mb-5">or click to browse files</div>
              <div className="flex flex-wrap gap-2 justify-center">
                {["PDF", "JPG/PNG", "Excel (.xlsx)", "Tally XML"].map(f => (
                  <span key={f} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: '#E2E8F0', color: '#64748B' }}>{f}</span>
                ))}
              </div>
              <div className="text-xs text-slate-400 mt-3">Max file size: 25MB · Batch upload supported</div>
            </div>
          </div>

          {/* Or take photo */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all">
              <Camera className="w-4 h-4 text-slate-500" />
              Capture Invoice Photo
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all">
              <FileSpreadsheet className="w-4 h-4 text-slate-500" />
              Import from Tally
            </button>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-800">Uploaded Files</span>
                  <div className="flex items-center gap-2">
                    {doneCount > 0 && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">{doneCount} done</span>}
                    {processingCount > 0 && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">{processingCount} processing</span>}
                    {errorCount > 0 && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600">{errorCount} errors</span>}
                  </div>
                </div>
                <button onClick={() => setFiles([])} className="text-xs text-slate-400 hover:text-red-500 transition-colors">Clear all</button>
              </div>
              <div className="divide-y divide-slate-50">
                {files.map((file) => (
                  <div key={file.id} className="px-5 py-3.5 hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${file.type === 'PDF' ? 'bg-red-50' : file.type === 'Excel' ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                        {file.type === 'PDF' ? <FileText className={`w-4 h-4 text-red-500`} /> :
                         file.type === 'Excel' ? <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> :
                         <Image className="w-4 h-4 text-amber-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-medium text-slate-700 truncate">{file.name}</span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {getStatusIcon(file)}
                            <button
                              onClick={() => removeFile(file.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-400"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>{file.size}</span>
                          <span>·</span>
                          <span>{file.type}</span>
                          {file.status === "done" && (
                            <>
                              <span>·</span>
                              <span className="text-emerald-600 font-medium">{file.invoices} invoice{file.invoices !== 1 ? 's' : ''} extracted</span>
                              <span>·</span>
                              <span style={{ color: (file.confidence ?? 0) >= 95 ? '#10B981' : '#F59E0B' }}>
                                {file.confidence}% accuracy
                              </span>
                            </>
                          )}
                          {file.status === "error" && <span className="text-red-500">{file.errorMsg}</span>}
                          {file.status === "processing" && <span className="text-blue-500 flex items-center gap-1"><Zap className="w-3 h-3" />AI extracting data...</span>}
                        </div>
                        {(file.status === "uploading" || file.status === "processing") && (
                          <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${file.progress}%`,
                                background: file.status === "processing" ? 'linear-gradient(90deg, #2563EB, #7C3AED)' : '#94A3B8',
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* AI Processing Status */}
          {processingCount > 0 && (
            <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50">
                  <Zap className="w-4 h-4 text-blue-600 animate-pulse" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">AI Processing</div>
                  <div className="text-xs text-slate-400">{processingCount} file{processingCount > 1 ? 's' : ''} in queue</div>
                </div>
              </div>
              <div className="space-y-2.5 text-xs text-slate-600">
                {["Detecting invoice layout", "Extracting GSTIN & amounts", "Validating HSN codes", "Calculating tax totals"].map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${i <= 1 ? 'bg-emerald-100' : i === 2 ? 'bg-blue-100' : 'bg-slate-100'}`}>
                      {i <= 1 ? <CheckCircle className="w-2.5 h-2.5 text-emerald-500" /> :
                       i === 2 ? <Loader2 className="w-2.5 h-2.5 text-blue-500 animate-spin" /> :
                       <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                    </div>
                    <span className={i <= 1 ? 'line-through text-slate-400' : i === 2 ? 'text-blue-600 font-medium' : 'text-slate-400'}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Supported Formats */}
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <div className="text-sm font-semibold text-slate-700 mb-3">Supported Formats</div>
            <div className="space-y-2.5">
              {SUPPORTED_FORMATS.map(f => (
                <div key={f.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: f.color + '15' }}>
                    <f.icon className="w-4 h-4" style={{ color: f.color }} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-700">{f.label}</div>
                    <div className="text-xs text-slate-400">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          {showTips && (
            <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm" style={{ background: '#FFFBEB' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                  <Info className="w-4 h-4 text-amber-500" />
                  Tips for Best Accuracy
                </div>
                <button onClick={() => setShowTips(false)} className="text-amber-400 hover:text-amber-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <ul className="space-y-2 text-xs text-amber-700">
                <li className="flex items-start gap-1.5"><span>•</span>Ensure invoices are clearly visible and not blurry</li>
                <li className="flex items-start gap-1.5"><span>•</span>For photos, use good lighting and capture the full invoice</li>
                <li className="flex items-start gap-1.5"><span>•</span>PDF invoices yield highest accuracy (99%+)</li>
                <li className="flex items-start gap-1.5"><span>•</span>Use Excel template for bulk invoice data entry</li>
              </ul>
            </div>
          )}

          {/* Monthly Summary */}
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <div className="text-sm font-semibold text-slate-700 mb-3">January 2026 Summary</div>
            <div className="space-y-2.5">
              {[
                { label: "Purchase Invoices", value: "234", color: "text-blue-600" },
                { label: "Total Taxable Value", value: "₹13,21,450", color: "text-slate-700" },
                { label: "Total GST Amount", value: "₹1,94,230", color: "text-emerald-600" },
                { label: "ITC Eligible", value: "₹1,02,450", color: "text-violet-600" },
              ].map(i => (
                <div key={i.label} className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">{i.label}</span>
                  <span className={`text-xs font-semibold ${i.color}`}>{i.value}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/invoices/review')}
              className="w-full mt-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}
            >
              Review All Invoices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
