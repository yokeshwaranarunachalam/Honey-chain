import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Calendar, Beaker, Hexagon, Lock, AlertTriangle, ExternalLink, CheckCircle2, ArrowLeft, Award, Sparkles, QrCode } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function ConsumerScanPage() {
  const { batchId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConsumerData();
  }, [batchId]);

  const fetchConsumerData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/batches/${batchId}`).then(r => r.json());
      if (res.success) {
        setData(res.batch);
      } else {
        setError('Honey batch record not found on blockchain');
      }
    } catch (err) {
      setError('Unable to connect to verification server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffdf8] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-amber-900 font-bold text-sm">Verifying Jar Cryptographic Hash...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#fffdf8] p-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-red-50 border border-red-300 rounded-3xl p-6 text-center space-y-4 shadow-xl">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto" />
          <h2 className="text-xl font-bold text-red-950">Verification Warning</h2>
          <p className="text-xs text-red-800">{error}</p>
          <Link to="/" className="inline-block py-2.5 px-6 bg-red-600 text-white font-bold rounded-xl text-xs">
            Return to Home Page
          </Link>
        </div>
      </div>
    );
  }

  const { labReport } = data;
  const isVerified = data.status === 'VERIFIED';
  const isFlagged = data.status === 'FLAGGED';

  return (
    <div className="min-h-screen bg-[#f7f3e9] py-6 px-4 flex justify-center items-start">
      {/* Mobile-first simulated phone width container */}
      <div className="max-w-md w-full bg-[#fffdf8] rounded-3xl shadow-2xl border border-amber-300 overflow-hidden space-y-6 pb-8">
        
        {/* Top Header Banner */}
        <div className={`p-6 text-white text-center space-y-3 relative overflow-hidden ${
          isVerified
            ? 'bg-gradient-to-b from-emerald-900 via-emerald-950 to-emerald-900'
            : isFlagged
            ? 'bg-gradient-to-b from-red-900 via-red-950 to-red-900'
            : 'bg-gradient-to-b from-amber-900 via-amber-950 to-amber-900'
        }`}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold tracking-wider uppercase border border-white/20">
            <QrCode className="w-3.5 h-3.5" />
            <span>Jar QR Scan Provenance</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight">{data.floraType}</h1>
            <p className="text-xs text-white/80 font-mono">Batch ID: {data.batchId}</p>
          </div>

          {/* Large Result Shield */}
          <div className="pt-2">
            {isVerified && (
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-emerald-500 text-emerald-950 font-black text-sm shadow-lg">
                <CheckCircle2 className="w-5 h-5" />
                <span>100% VERIFIED PURE HONEY</span>
              </div>
            )}
            {isFlagged && (
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-red-600 text-white font-black text-sm shadow-lg">
                <AlertTriangle className="w-5 h-5" />
                <span>🚩 ADULTERATION ALERT / FLAGGED</span>
              </div>
            )}
            {!isVerified && !isFlagged && (
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-amber-400 text-amber-950 font-black text-sm shadow-lg">
                <span>TESTING IN PROGRESS</span>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 space-y-6">
          {/* Beekeeper & Origin Card */}
          <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200 space-y-3">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <span className="text-xs uppercase font-extrabold text-amber-900 tracking-wider flex items-center gap-1.5">
                <Hexagon className="w-4 h-4 text-amber-600" />
                <span>Apiary & Beekeeper Origin</span>
              </span>
              <span className="text-[10px] bg-amber-200 px-2 py-0.5 rounded-full font-bold text-amber-900">
                {data.stateCode}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-amber-800 font-medium">Beekeeper:</span>
                <strong className="text-amber-950 font-bold">{data.beekeeperName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-800 font-medium">Apiary Farm:</span>
                <strong className="text-amber-950 font-bold">{data.apiaryName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-800 font-medium">Location:</span>
                <strong className="text-amber-950 font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-600" />
                  <span>{data.location}</span>
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-800 font-medium">Harvest Date:</span>
                <strong className="text-amber-950 font-mono">{data.harvestDate}</strong>
              </div>
            </div>
          </div>

          {/* FSSAI Lab Quality Card */}
          {labReport && (
            <div className="bg-[#fffdf8] p-5 rounded-2xl border border-amber-300 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <span className="text-xs uppercase font-extrabold text-amber-900 tracking-wider flex items-center gap-1.5">
                  <Beaker className="w-4 h-4 text-amber-600" />
                  <span>FSSAI Laboratory Purity Score</span>
                </span>
                <span className="text-xs font-black text-amber-700 font-mono">
                  {labReport.validation?.fssaiComplianceScore || 100}/100
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="block text-[10px] text-amber-700 uppercase font-semibold">Moisture</span>
                  <span className={`font-bold font-mono text-sm ${labReport.moisture > 20 ? 'text-red-600' : 'text-amber-950'}`}>
                    {labReport.moisture}%
                  </span>
                </div>
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="block text-[10px] text-amber-700 uppercase font-semibold">HMF</span>
                  <span className={`font-bold font-mono text-sm ${labReport.hmf > 80 ? 'text-red-600' : 'text-amber-950'}`}>
                    {labReport.hmf} mg/kg
                  </span>
                </div>
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="block text-[10px] text-amber-700 uppercase font-semibold">C4 Sugars</span>
                  <span className={`font-bold font-mono text-sm ${labReport.c4Sugars > 7 ? 'text-red-600' : 'text-amber-950'}`}>
                    {labReport.c4Sugars}%
                  </span>
                </div>
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="block text-[10px] text-amber-700 uppercase font-semibold">F/G Ratio</span>
                  <span className={`font-bold font-mono text-sm ${labReport.fgRatio < 1 ? 'text-red-600' : 'text-amber-950'}`}>
                    {labReport.fgRatio}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-amber-800 italic text-center">
                Tested by: {labReport.testedBy} ({labReport.labName})
              </p>
            </div>
          )}

          {/* Blockchain & IPFS Cryptographic Proof */}
          <div className="bg-amber-950 text-amber-50 p-5 rounded-2xl border border-amber-800 space-y-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-amber-400 font-bold border-b border-amber-800 pb-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] uppercase tracking-wider">Blockchain Ledger Proof</span>
            </div>

            <div className="space-y-1.5">
              <div className="text-[10px] text-amber-400 uppercase">SHA-256 Latest Block Hash:</div>
              <p className="text-emerald-300 font-bold break-all bg-amber-900/60 p-2 rounded border border-amber-800">
                {data.latestBlockHash}
              </p>
            </div>

            {data.ipfsCid && (
              <div className="space-y-1">
                <div className="text-[10px] text-amber-400 uppercase">IPFS Off-Chain CID:</div>
                <p className="text-amber-300 font-bold truncate bg-amber-900/60 p-2 rounded border border-amber-800">
                  {data.ipfsCid}
                </p>
              </div>
            )}
          </div>

          {/* Link back to full dashboard */}
          <div className="pt-2 text-center">
            <Link
              to={`/passport/${data.batchId}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 underline"
            >
              <span>View Technical Full Audit Passport & Block Chaining</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
