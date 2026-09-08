import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShieldCheck, AlertTriangle, Clock, Search, Filter, ArrowRight, Scale, CheckCircle2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, batchesRes] = await Promise.all([
        fetch('/api/admin/stats').then(r => r.json()),
        fetch('/api/batches').then(r => r.json())
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (batchesRes.success) setBatches(batchesRes.batches);
    } catch (err) {
      console.error('Error loading regulator dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBatches = batches.filter(b => {
    const matchesFilter = statusFilter === 'ALL' || b.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !searchQuery ||
      b.batchId.toLowerCase().includes(q) ||
      b.beekeeperName.toLowerCase().includes(q) ||
      b.location.toLowerCase().includes(q) ||
      (b.stateCode && b.stateCode.toLowerCase().includes(q));

    return matchesFilter && matchesQuery;
  });

  return (
    <div className="space-y-8 py-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-amber-950 text-amber-50 p-6 sm:p-8 rounded-3xl border border-amber-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <LayoutDashboard className="w-4 h-4" />
            <span>FSSAI Regulatory Oversight Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">National Honey Quality Monitor</h1>
          <p className="text-xs sm:text-sm text-amber-300/90 max-w-2xl">
            Real-time regulatory analytics across Indian honey producers, automated adulteration alerts, and cryptographic batch audit logs.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-amber-200 border border-amber-700 rounded-xl text-xs font-bold flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* METRICS CARDS (Total, Verified %, Flagged %, Volume) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Batches */}
        <div className="bg-[#fffdf8] p-5 rounded-2xl border border-amber-200 shadow-md space-y-1">
          <span className="text-xs uppercase font-extrabold text-amber-700">Total Monitored Batches</span>
          <div className="text-3xl font-black text-amber-950">
            {stats?.totalBatches || batches.length}
          </div>
          <p className="text-[11px] text-amber-700 font-medium">Across {stats?.totalHives || 6} Registered Apiaries</p>
        </div>

        {/* Card 2: Verified % */}
        <div className="bg-[#fffdf8] p-5 rounded-2xl border border-emerald-300 shadow-md space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold text-emerald-800">FSSAI Verified Pure</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-700">
            {stats?.verifiedPercent || 0}%
          </div>
          <p className="text-[11px] text-emerald-800 font-medium">
            {stats?.verifiedCount || 0} Batches Met Purity Standards
          </p>
        </div>

        {/* Card 3: Flagged % */}
        <div className="bg-[#fffdf8] p-5 rounded-2xl border border-red-300 shadow-md space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold text-red-800">🚩 Adulteration Flagged</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-3xl font-black text-red-700">
            {stats?.flaggedPercent || 0}%
          </div>
          <p className="text-[11px] text-red-800 font-medium">
            {stats?.flaggedCount || 0} Batches Failed C4/HMF Limits
          </p>
        </div>

        {/* Card 4: Volume */}
        <div className="bg-[#fffdf8] p-5 rounded-2xl border border-amber-200 shadow-md space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold text-amber-700">Total Tracked Volume</span>
            <Scale className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-amber-950">
            {stats?.totalVolumeKg?.toLocaleString() || 0} kg
          </div>
          <p className="text-[11px] text-amber-700 font-medium">Avg Lab Turnaround: 18.5 Hrs</p>
        </div>
      </div>

      {/* ADULTERATION ALERT SUMMARY BANNER (IF FLAGGED BATCHES EXIST) */}
      {stats?.flaggedCount > 0 && (
        <div className="bg-red-950 text-red-50 p-6 rounded-2xl border border-red-800 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span>FSSAI Regulatory Alert: {stats.flaggedCount} Non-Compliant Batches Detected</span>
          </div>
          <p className="text-xs text-red-200 leading-relaxed">
            The automated smart contract engine detected C4 sugar adulteration or elevated HMF levels exceeding FSSAI threshold values in the following batches:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {stats.flaggedBatchesList?.map(fb => (
              <Link
                key={fb.batchId}
                to={`/passport/${fb.batchId}`}
                className="px-3 py-1 bg-red-900 hover:bg-red-800 border border-red-700 rounded-lg text-xs font-mono font-bold text-red-200 flex items-center gap-1 transition-colors"
              >
                <span>{fb.batchId} ({fb.beekeeperName})</span>
                <ArrowRight className="w-3 h-3 text-red-400" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* BATCH TABLE & FILTERS */}
      <div className="bg-[#fffdf8] rounded-2xl border border-amber-200 shadow-md space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200 pb-4">
          <h3 className="font-bold text-amber-950 text-base">National Honey Batch Master Registry</h3>

          {/* Controls: Search + Status Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-amber-600 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Batch ID / Beekeeper..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 rounded-xl border border-amber-300 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 bg-amber-100 p-1 rounded-xl border border-amber-300 text-xs font-bold">
              {['ALL', 'VERIFIED', 'FLAGGED', 'PENDING'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    statusFilter === st
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-amber-900 hover:bg-amber-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-amber-100/60 text-amber-900 font-semibold uppercase text-[11px] border-b border-amber-200">
              <tr>
                <th className="p-3">Batch ID</th>
                <th className="p-3">Beekeeper / State</th>
                <th className="p-3">Flora Nectar</th>
                <th className="p-3">Harvest Date</th>
                <th className="p-3">Moisture</th>
                <th className="p-3">HMF</th>
                <th className="p-3">C4 Sugar</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-200/60 text-amber-950">
              {filteredBatches.map(batch => (
                <tr key={batch.batchId} className="hover:bg-amber-50/80 transition-colors">
                  <td className="p-3 font-mono font-bold text-amber-900">
                    <Link to={`/passport/${batch.batchId}`} className="hover:underline">
                      {batch.batchId}
                    </Link>
                  </td>
                  <td className="p-3">
                    <div className="font-bold">{batch.beekeeperName}</div>
                    <div className="text-[11px] text-amber-700">{batch.location}</div>
                  </td>
                  <td className="p-3 text-xs text-amber-900 font-medium">{batch.floraType}</td>
                  <td className="p-3 text-xs font-mono text-amber-800">{batch.harvestDate}</td>
                  <td className="p-3 font-mono">
                    {batch.labValidation ? `${batch.labValidation.moisture || '--'}%` : '--'}
                  </td>
                  <td className="p-3 font-mono">
                    {batch.labValidation ? `${batch.labValidation.hmf || '--'}` : '--'}
                  </td>
                  <td className="p-3 font-mono">
                    {batch.labValidation ? `${batch.labValidation.c4Sugars || '--'}%` : '--'}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={batch.status} size="small" />
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      to={`/passport/${batch.batchId}`}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors"
                    >
                      <span>Drill Down</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
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
