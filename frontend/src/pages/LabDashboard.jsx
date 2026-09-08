import React, { useState, useEffect } from 'react';
import { Beaker, ShieldCheck, AlertTriangle, FileText, Database, Lock, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';

export default function LabDashboard() {
  const [searchParams] = useSearchParams();
  const initialBatchId = searchParams.get('batch') || '';

  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(initialBatchId);
  const [loading, setLoading] = useState(true);

  // Form parameters
  const [labForm, setLabForm] = useState({
    batchId: initialBatchId,
    moisture: '17.8',
    hmf: '22.0',
    c4Sugars: '1.4',
    fgRatio: '1.16',
    labName: 'Central Food Laboratory (NABL Accredited)',
    testedBy: 'Dr. S. K. Nair',
    testDate: new Date().toISOString().split('T')[0]
  });

  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const res = await fetch('/api/batches').then(r => r.json());
      if (res.success) {
        setBatches(res.batches);
        if (!selectedBatchId && res.batches.length > 0) {
          const pending = res.batches.find(b => b.status === 'PENDING') || res.batches[0];
          setSelectedBatchId(pending.batchId);
          setLabForm(prev => ({ ...prev, batchId: pending.batchId }));
        }
      }
    } catch (err) {
      console.error('Error fetching batches:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBatch = (id) => {
    setSelectedBatchId(id);
    setLabForm(prev => ({ ...prev, batchId: id }));
    setResult(null);
  };

  const handlePresetPass = () => {
    setLabForm(prev => ({
      ...prev,
      moisture: '17.2',
      hmf: '22.5',
      c4Sugars: '1.1',
      fgRatio: '1.18'
    }));
    setResult(null);
  };

  const handlePresetFail = () => {
    setLabForm(prev => ({
      ...prev,
      moisture: '22.8', // FAIL > 20%
      hmf: '115.0',    // FAIL > 80
      c4Sugars: '16.2', // FAIL > 7%
      fgRatio: '0.85'   // FAIL < 1.0
    }));
    setResult(null);
  };

  const handleSubmitTest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await fetch('/api/lab/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(labForm)
      }).then(r => r.json());

      if (res.success) {
        setResult(res);
        fetchBatches();
      } else {
        setErrorMsg(res.message || 'Validation failed');
      }
    } catch (err) {
      setErrorMsg('Server connection error during validation');
    } finally {
      setSubmitting(false);
    }
  };

  const currentBatchInfo = batches.find(b => b.batchId === selectedBatchId);

  return (
    <div className="space-y-8 py-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-amber-950 text-amber-50 p-6 sm:p-8 rounded-3xl border border-amber-800 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Beaker className="w-4 h-4" />
          <span>FSSAI Quality Assurance Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Smart Contract Lab Verification</h1>
        <p className="text-xs sm:text-sm text-amber-300/90 leading-relaxed max-w-3xl">
          Upload physicochemical purity parameters for batch validation. Smart contract logic executes on-chain, storing the certificate payload on IPFS and updating the SHA-256 block ledger.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Batch Selection & Quick Presets */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#fffdf8] rounded-2xl p-5 border border-amber-200 shadow-md space-y-4">
            <h3 className="font-bold text-amber-950 text-sm flex items-center justify-between">
              <span>Select Batch to Inspect</span>
              <span className="text-[10px] text-amber-700 font-mono">Total: {batches.length}</span>
            </h3>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {batches.map(b => (
                <button
                  key={b.batchId}
                  onClick={() => handleSelectBatch(b.batchId)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                    selectedBatchId === b.batchId
                      ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-400/40 font-bold'
                      : 'bg-white border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-amber-950 font-extrabold">{b.batchId}</span>
                    <StatusBadge status={b.status} size="small" />
                  </div>
                  <div className="text-amber-800 text-[11px] mt-1">
                    {b.beekeeperName} • {b.location}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Preset Buttons for Judging Demo */}
          <div className="bg-amber-100/70 p-5 rounded-2xl border border-amber-300 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Judge Quick Demo Presets</span>
            </div>
            <p className="text-[11px] text-amber-800">
              Test automated Smart Contract rules instantly with pre-loaded values:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handlePresetPass}
                className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all text-center"
              >
                ✅ Load Pure Sample
              </button>
              <button
                type="button"
                onClick={handlePresetFail}
                className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all text-center"
              >
                🚩 Load Adulterated Sample
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Lab Parameter Input & Validation Execution */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmitTest} className="bg-[#fffdf8] rounded-2xl p-6 sm:p-8 border border-amber-300 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-200 pb-4 gap-2">
              <div>
                <h2 className="text-xl font-bold text-amber-950">Laboratory Analysis & Certificate</h2>
                <p className="text-xs text-amber-700 font-mono">Selected Batch ID: {selectedBatchId}</p>
              </div>
              {currentBatchInfo && (
                <StatusBadge status={currentBatchInfo.status} />
              )}
            </div>

            {/* Test Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 space-y-1">
                <label className="block font-bold text-amber-950">Moisture Content (%) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={labForm.moisture}
                  onChange={e => setLabForm({ ...labForm, moisture: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-amber-300 bg-white font-mono font-bold text-amber-950"
                />
                <span className="text-[10px] text-amber-700 font-semibold">FSSAI Standard: ≤ 20.0%</span>
              </div>

              <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 space-y-1">
                <label className="block font-bold text-amber-950">HMF Content (mg/kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={labForm.hmf}
                  onChange={e => setLabForm({ ...labForm, hmf: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-amber-300 bg-white font-mono font-bold text-amber-950"
                />
                <span className="text-[10px] text-amber-700 font-semibold">FSSAI Standard: ≤ 80.0 mg/kg</span>
              </div>

              <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 space-y-1">
                <label className="block font-bold text-amber-950">C4 Sugar Adulteration (%) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={labForm.c4Sugars}
                  onChange={e => setLabForm({ ...labForm, c4Sugars: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-amber-300 bg-white font-mono font-bold text-amber-950"
                />
                <span className="text-[10px] text-amber-700 font-semibold">FSSAI Standard: ≤ 7.0%</span>
              </div>

              <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 space-y-1">
                <label className="block font-bold text-amber-950">Fructose / Glucose Ratio *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={labForm.fgRatio}
                  onChange={e => setLabForm({ ...labForm, fgRatio: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-amber-300 bg-white font-mono font-bold text-amber-950"
                />
                <span className="text-[10px] text-amber-700 font-semibold">FSSAI Standard: ≥ 1.0</span>
              </div>
            </div>

            {/* Inspector Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm pt-2">
              <div>
                <label className="block font-bold text-amber-900 mb-1">Analyst Name *</label>
                <input
                  type="text"
                  required
                  value={labForm.testedBy}
                  onChange={e => setLabForm({ ...labForm, testedBy: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-amber-300 bg-white"
                />
              </div>
              <div>
                <label className="block font-bold text-amber-900 mb-1">NABL Accredited Lab Name *</label>
                <input
                  type="text"
                  required
                  value={labForm.labName}
                  onChange={e => setLabForm({ ...labForm, labName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-amber-300 bg-white"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-100 text-red-900 rounded-xl text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !selectedBatchId}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-xl shadow-lg hover:from-amber-700 hover:to-amber-800 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Beaker className="w-5 h-5 text-amber-300" />
              <span>{submitting ? 'Running Smart Contract Validation...' : 'Execute On-Chain Validation & Issue Certificate'}</span>
            </button>
          </form>

          {/* Validation Result Modal / Card */}
          {result && (
            <div className={`p-6 rounded-2xl border shadow-xl space-y-4 animate-in fade-in duration-300 ${
              result.validation.isVerified
                ? 'bg-emerald-950 text-emerald-50 border-emerald-700'
                : 'bg-red-950 text-red-50 border-red-700'
            }`}>
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <div className="flex items-center gap-2">
                  {result.validation.isVerified ? (
                    <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-7 h-7 text-red-400" />
                  )}
                  <div>
                    <h3 className="text-xl font-extrabold text-white">
                      {result.validation.isVerified ? 'SMART CONTRACT PASSED ✅' : 'SMART CONTRACT FLAGGED 🚩'}
                    </h3>
                    <p className="text-xs text-white/80 font-mono">Batch: {result.batch.batchId}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-white">{result.validation.fssaiComplianceScore}/100</span>
                  <span className="block text-[10px] uppercase font-bold text-white/70">FSSAI Pure Score</span>
                </div>
              </div>

              {/* Violations if flagged */}
              {!result.validation.isVerified && result.validation.violationReasons?.length > 0 && (
                <div className="bg-red-900/80 p-4 rounded-xl border border-red-700 space-y-2 text-xs">
                  <span className="font-extrabold text-red-200 uppercase tracking-wider">Regulatory Violations Detected:</span>
                  <ul className="list-disc pl-4 space-y-1 text-red-100">
                    {result.validation.violationReasons.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* IPFS and Block details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-2">
                <div className="bg-white/10 p-3 rounded-xl border border-white/20 space-y-1">
                  <span className="text-[10px] text-white/70 uppercase">Simulated IPFS CID</span>
                  <p className="text-amber-300 font-bold truncate">{result.ipfs.cid}</p>
                </div>
                <div className="bg-white/10 p-3 rounded-xl border border-white/20 space-y-1">
                  <span className="text-[10px] text-white/70 uppercase">Latest Block SHA-256</span>
                  <p className="text-emerald-300 font-bold truncate">{result.batch.latestBlockHash}</p>
                </div>
              </div>

              <div className="pt-2 text-right">
                <Link
                  to={`/passport/${result.batch.batchId}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-amber-950 font-bold rounded-xl text-xs hover:bg-amber-100 transition-all shadow-md"
                >
                  <span>View Updated Batch Digital Passport</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
