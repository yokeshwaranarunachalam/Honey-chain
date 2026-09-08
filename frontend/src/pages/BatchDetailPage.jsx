import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QrCode, ShieldCheck, MapPin, Calendar, Beaker, Hexagon, Database, Lock, ArrowLeft, ExternalLink, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import HashTrailView from '../components/HashTrailView';
import QRCodeModal from '../components/QRCodeModal';

export default function BatchDetailPage() {
  const { batchId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  useEffect(() => {
    fetchBatchDetail();
  }, [batchId]);

  const fetchBatchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/batches/${batchId}`).then(r => r.json());
      if (res.success) {
        setData(res.batch);
      } else {
        setError(res.message || 'Batch not found');
      }
    } catch (err) {
      setError('Error connecting to backend API');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-amber-800 text-sm font-semibold">Loading Blockchain Digital Passport for {batchId}...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-12 max-w-xl mx-auto text-center space-y-4">
        <div className="p-6 bg-red-100 border border-red-300 text-red-950 rounded-2xl">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <h3 className="text-lg font-bold">Batch Not Found</h3>
          <p className="text-xs text-red-800 mt-1">{error}</p>
        </div>
        <Link to="/beekeeper" className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-950">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Beekeeper Dashboard</span>
        </Link>
      </div>
    );
  }

  const { hive, labReport, blocks, chainIntegrity } = data;

  return (
    <div className="space-y-8 py-4 max-w-6xl mx-auto">
      {/* Top Nav Breadcrumb */}
      <div className="flex items-center justify-between text-xs">
        <Link to="/beekeeper" className="inline-flex items-center gap-1.5 font-bold text-amber-800 hover:text-amber-950">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Batches</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-xl shadow-md hover:from-amber-700 hover:to-amber-800 flex items-center gap-1.5 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Generate QR Passport</span>
          </button>
          <Link
            to={`/consumer/${data.batchId}`}
            className="px-4 py-2 bg-amber-100 text-amber-950 font-bold rounded-xl hover:bg-amber-200 border border-amber-300 flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4 text-amber-700" />
            <span>Consumer View</span>
          </Link>
        </div>
      </div>

      {/* Main Passport Header Card */}
      <div className="bg-gradient-to-br from-amber-950 via-amber-900 to-amber-950 text-amber-50 p-6 sm:p-10 rounded-3xl border border-amber-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-400/30">
                DIGITAL PASSPORT
              </span>
              <StatusBadge status={data.status} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">{data.batchId}</h1>
            <p className="text-amber-200/90 text-xs sm:text-sm font-medium">
              {data.floraType} • Harvested in {data.location}
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="bg-white/10 p-4 rounded-2xl border border-white/15 backdrop-blur-md space-y-2 min-w-[240px]">
            <div className="flex justify-between text-xs border-b border-white/10 pb-1.5">
              <span className="text-amber-300">Harvest Quantity:</span>
              <strong className="text-white font-mono">{data.quantityKg} kg</strong>
            </div>
            <div className="flex justify-between text-xs border-b border-white/10 pb-1.5">
              <span className="text-amber-300">Harvest Date:</span>
              <strong className="text-white font-mono">{data.harvestDate}</strong>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-amber-300">FSSAI Status:</span>
              <strong className={data.status === 'VERIFIED' ? 'text-emerald-400 font-bold' : data.status === 'FLAGGED' ? 'text-red-400 font-bold' : 'text-amber-300'}>
                {data.status}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* EVENT TIMELINE PROGRESS (Hive -> Harvest -> Lab -> Verification -> Passport) */}
      <section className="bg-[#fffdf8] rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-md space-y-6">
        <h3 className="text-lg font-bold text-amber-950 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-600" />
          <span>Full Product Lifecycle Provenance</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Step 1: Hive */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-amber-700 font-bold">
              <span>STEP 1</span>
              <Hexagon className="w-4 h-4 text-amber-600" />
            </div>
            <h4 className="font-extrabold text-amber-950 text-sm">Apiary & Hive Origin</h4>
            <p className="text-xs text-amber-800">{data.beekeeperName} ({data.apiaryName})</p>
            <p className="text-[11px] text-amber-700 font-mono">{data.gpsCoords}</p>
          </div>

          {/* Step 2: Harvest */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-amber-700 font-bold">
              <span>STEP 2</span>
              <Calendar className="w-4 h-4 text-amber-600" />
            </div>
            <h4 className="font-extrabold text-amber-950 text-sm">Harvest Logged</h4>
            <p className="text-xs text-amber-800">{data.harvestDate} • {data.quantityKg} kg</p>
            <p className="text-[11px] text-amber-700 italic truncate">{data.notes}</p>
          </div>

          {/* Step 3: Lab Test */}
          <div className={`p-4 rounded-xl border space-y-2 ${
            labReport ? 'bg-amber-50 border-amber-200' : 'bg-amber-100/50 border-amber-300 opacity-60'
          }`}>
            <div className="flex items-center justify-between text-xs text-amber-700 font-bold">
              <span>STEP 3</span>
              <Beaker className="w-4 h-4 text-amber-600" />
            </div>
            <h4 className="font-extrabold text-amber-950 text-sm">Physicochemical Test</h4>
            <p className="text-xs text-amber-800">
              {labReport ? labReport.labName : 'Awaiting Lab Submission'}
            </p>
            {labReport && (
              <p className="text-[11px] text-amber-700 font-mono">Tested: {labReport.testDate}</p>
            )}
          </div>

          {/* Step 4: Verification */}
          <div className={`p-4 rounded-xl border space-y-2 ${
            data.status === 'VERIFIED'
              ? 'bg-emerald-50 border-emerald-300'
              : data.status === 'FLAGGED'
              ? 'bg-red-50 border-red-300'
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-center justify-between text-xs text-amber-700 font-bold">
              <span>STEP 4</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="font-extrabold text-amber-950 text-sm">Smart Contract Rule</h4>
            <p className="text-xs font-bold">
              {data.status === 'VERIFIED' && <span className="text-emerald-800">✅ FSSAI Certified Pure</span>}
              {data.status === 'FLAGGED' && <span className="text-red-800">🚩 Flagged Adulterated</span>}
              {data.status === 'PENDING' && <span className="text-amber-800">⏳ Validation Pending</span>}
            </p>
            {data.ipfsCid && (
              <p className="text-[10px] text-amber-700 font-mono truncate">IPFS: {data.ipfsCid}</p>
            )}
          </div>
        </div>
      </section>

      {/* LAB REPORT DETAILS (If Available) */}
      {labReport && (
        <section className="bg-[#fffdf8] rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200 pb-3">
            <div className="flex items-center gap-2">
              <Beaker className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-amber-950">FSSAI Laboratory Certificate of Analysis</h3>
            </div>
            <span className="text-xs font-mono font-bold text-amber-700">{labReport.labName}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-center">
              <span className="block text-[11px] text-amber-800 font-semibold uppercase">Moisture %</span>
              <span className={`text-2xl font-black ${labReport.moisture > 20 ? 'text-red-600' : 'text-amber-950'}`}>
                {labReport.moisture}%
              </span>
              <span className="block text-[10px] text-amber-700">FSSAI Limit ≤ 20%</span>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-center">
              <span className="block text-[11px] text-amber-800 font-semibold uppercase">HMF (mg/kg)</span>
              <span className={`text-2xl font-black ${labReport.hmf > 80 ? 'text-red-600' : 'text-amber-950'}`}>
                {labReport.hmf}
              </span>
              <span className="block text-[10px] text-amber-700">FSSAI Limit ≤ 80</span>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-center">
              <span className="block text-[11px] text-amber-800 font-semibold uppercase">C4 Sugar %</span>
              <span className={`text-2xl font-black ${labReport.c4Sugars > 7 ? 'text-red-600' : 'text-amber-950'}`}>
                {labReport.c4Sugars}%
              </span>
              <span className="block text-[10px] text-amber-700">FSSAI Limit ≤ 7%</span>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-center">
              <span className="block text-[11px] text-amber-800 font-semibold uppercase">F/G Ratio</span>
              <span className={`text-2xl font-black ${labReport.fgRatio < 1 ? 'text-red-600' : 'text-amber-950'}`}>
                {labReport.fgRatio}
              </span>
              <span className="block text-[10px] text-amber-700">FSSAI Min ≥ 1.0</span>
            </div>
          </div>

          {labReport.validation?.violationReasons?.length > 0 && (
            <div className="p-4 bg-red-100 border border-red-300 rounded-xl space-y-1 text-xs text-red-950">
              <strong className="font-bold uppercase text-red-700">Adulteration / Quality Failure Reasons:</strong>
              <ul className="list-disc pl-4 space-y-0.5">
                {labReport.validation.violationReasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* BLOCKCHAIN SHA-256 HASH TRAIL */}
      <section className="bg-[#fffdf8] rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-200 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-lg font-bold text-amber-950">Cryptographic Blockchain Ledger Trail</h3>
              <p className="text-xs text-amber-700">SHA-256 Hash Chain verification for batch {data.batchId}</p>
            </div>
          </div>
          <span className="text-xs font-mono bg-amber-100 px-3 py-1 rounded-full text-amber-900 font-bold border border-amber-300">
            {blocks?.length || 0} Ledger Blocks Linked
          </span>
        </div>

        <HashTrailView blocks={blocks} chainIntegrity={chainIntegrity} />
      </section>

      {/* QR Code Popup */}
      <QRCodeModal
        batch={data}
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />
    </div>
  );
}
