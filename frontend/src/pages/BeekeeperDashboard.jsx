import React, { useState, useEffect } from 'react';
import { Hexagon, Plus, PackageCheck, QrCode, ArrowRight, ShieldCheck, MapPin, Calendar, Scale, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import QRCodeModal from '../components/QRCodeModal';

export default function BeekeeperDashboard() {
  const [hives, setHives] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('batches'); // 'batches' | 'new-hive' | 'new-harvest'

  const [selectedBatchForQR, setSelectedBatchForQR] = useState(null);

  // Form States
  const [hiveForm, setHiveForm] = useState({
    beekeeperName: 'Ramesh Gowda',
    apiaryName: 'Nilgiri Mountain Apiaries',
    location: 'Ooty, Nilgiris, Tamil Nadu',
    stateCode: 'TN',
    floraType: 'Wild Mountain Eucalyptus & Tea Nectar',
    gpsCoords: '11.4102° N, 76.6950° E',
    activeHives: 32
  });

  const [harvestForm, setHarvestForm] = useState({
    hiveId: '',
    harvestDate: new Date().toISOString().split('T')[0],
    quantityKg: 380,
    notes: 'Pure organic blossom harvest. High aromatic clarity.'
  });

  const [submitMessage, setSubmitMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [hivesRes, batchesRes] = await Promise.all([
        fetch('/api/hives').then(r => r.json()),
        fetch('/api/batches').then(r => r.json())
      ]);

      if (hivesRes.success) setHives(hivesRes.hives);
      if (batchesRes.success) setBatches(batchesRes.batches);

      if (hivesRes.hives?.length > 0 && !harvestForm.hiveId) {
        setHarvestForm(prev => ({ ...prev, hiveId: hivesRes.hives[0].id }));
      }
    } catch (err) {
      console.error('Error loading beekeeper data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHive = async (e) => {
    e.preventDefault();
    setSubmitMessage(null);
    try {
      const res = await fetch('/api/hives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hiveForm)
      }).then(r => r.json());

      if (res.success) {
        setSubmitMessage({ type: 'success', text: `Hive Registered Successfully! ID: ${res.hive.id}` });
        fetchData();
        setActiveTab('new-harvest');
        setHarvestForm(prev => ({ ...prev, hiveId: res.hive.id }));
      } else {
        setSubmitMessage({ type: 'error', text: res.message || 'Failed to create hive' });
      }
    } catch (err) {
      setSubmitMessage({ type: 'error', text: 'Server connection error' });
    }
  };

  const handleCreateHarvest = async (e) => {
    e.preventDefault();
    setSubmitMessage(null);
    try {
      const res = await fetch('/api/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(harvestForm)
      }).then(r => r.json());

      if (res.success) {
        setSubmitMessage({
          type: 'success',
          text: `Harvest Logged & Blockchain Genesis Created! Batch ID: ${res.batch.batchId}`
        });
        fetchData();
        setActiveTab('batches');
      } else {
        setSubmitMessage({ type: 'error', text: res.message || 'Failed to log harvest' });
      }
    } catch (err) {
      setSubmitMessage({ type: 'error', text: 'Server connection error' });
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-100/70 p-6 rounded-2xl border border-amber-300">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <Hexagon className="w-4 h-4 text-amber-600" />
            <span>Beekeeper Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-amber-950">Apiary & Harvest Management</h1>
          <p className="text-xs sm:text-sm text-amber-800">
            Register apiaries, log batch harvests, and initiate immutable cryptographic provenance chains.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setActiveTab('new-harvest'); setSubmitMessage(null); }}
            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md hover:from-amber-700 hover:to-amber-800 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Log Harvest</span>
          </button>
          <button
            onClick={() => { setActiveTab('new-hive'); setSubmitMessage(null); }}
            className="px-4 py-2 bg-amber-200 text-amber-950 font-semibold rounded-xl text-xs sm:text-sm hover:bg-amber-300 flex items-center gap-1.5 border border-amber-400"
          >
            <Hexagon className="w-4 h-4 text-amber-700" />
            <span>Register Hive</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-amber-300 gap-4 text-sm font-bold">
        <button
          onClick={() => setActiveTab('batches')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'batches'
              ? 'border-b-2 border-amber-600 text-amber-950'
              : 'text-amber-700 hover:text-amber-950'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>My Batches ({batches.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('new-harvest')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'new-harvest'
              ? 'border-b-2 border-amber-600 text-amber-950'
              : 'text-amber-700 hover:text-amber-950'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Log Harvest Batch</span>
        </button>
        <button
          onClick={() => setActiveTab('new-hive')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'new-hive'
              ? 'border-b-2 border-amber-600 text-amber-950'
              : 'text-amber-700 hover:text-amber-950'
          }`}
        >
          <Hexagon className="w-4 h-4" />
          <span>Register New Hive</span>
        </button>
      </div>

      {/* Submit Alert Banner */}
      {submitMessage && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between ${
            submitMessage.type === 'success'
              ? 'bg-emerald-100 border border-emerald-300 text-emerald-950'
              : 'bg-red-100 border border-red-300 text-red-950'
          }`}
        >
          <span>{submitMessage.text}</span>
          <button onClick={() => setSubmitMessage(null)} className="text-xs underline font-normal">
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: BATCHES LIST */}
      {activeTab === 'batches' && (
        <div className="space-y-4">
          <div className="bg-[#fffdf8] rounded-2xl border border-amber-200 shadow-md overflow-hidden">
            <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
              <h3 className="font-bold text-amber-950 text-sm sm:text-base">Logged Harvest Batches</h3>
              <span className="text-xs text-amber-700 font-medium">Click Batch ID for Digital Passport</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-amber-100/60 text-amber-900 font-semibold uppercase text-[11px] border-b border-amber-200">
                  <tr>
                    <th className="p-3.5">Batch ID</th>
                    <th className="p-3.5">Beekeeper / Apiary</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Flora Nectar</th>
                    <th className="p-3.5">Harvest Date</th>
                    <th className="p-3.5">Quantity</th>
                    <th className="p-3.5">Validation Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-200/60 text-amber-950">
                  {batches.map(batch => (
                    <tr key={batch.batchId} className="hover:bg-amber-50/80 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-amber-900">
                        <Link to={`/passport/${batch.batchId}`} className="hover:underline flex items-center gap-1">
                          <span>{batch.batchId}</span>
                        </Link>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold">{batch.beekeeperName}</div>
                        <div className="text-[11px] text-amber-700">{batch.apiaryName}</div>
                      </td>
                      <td className="p-3.5 text-xs">
                        <div className="flex items-center gap-1 text-amber-800">
                          <MapPin className="w-3 h-3 text-amber-600" />
                          <span>{batch.location}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-xs text-amber-900 font-medium">
                        {batch.floraType}
                      </td>
                      <td className="p-3.5 text-xs text-amber-800 font-mono">
                        {batch.harvestDate}
                      </td>
                      <td className="p-3.5 font-bold text-amber-900">
                        {batch.quantityKg} kg
                      </td>
                      <td className="p-3.5">
                        <StatusBadge status={batch.status} size="small" />
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => setSelectedBatchForQR(batch)}
                          className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors"
                          title="Generate QR Passport"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/passport/${batch.batchId}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors"
                        >
                          <span>Passport</span>
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
      )}

      {/* TAB 2: LOG HARVEST FORM */}
      {activeTab === 'new-harvest' && (
        <div className="max-w-2xl mx-auto bg-[#fffdf8] rounded-2xl p-6 sm:p-8 border border-amber-300 shadow-xl space-y-6">
          <div className="border-b border-amber-200 pb-4">
            <h2 className="text-xl font-bold text-amber-950 flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-amber-600" />
              <span>Log Honey Harvest Batch</span>
            </h2>
            <p className="text-xs text-amber-700">
              Creates Genesis & Harvest blocks on the SHA-256 ledger and assigns a sequence Batch ID.
            </p>
          </div>

          <form onSubmit={handleCreateHarvest} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-amber-900 mb-1">Select Apiary / Hive *</label>
              <select
                required
                value={harvestForm.hiveId}
                onChange={e => setHarvestForm({ ...harvestForm, hiveId: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-amber-950 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
              >
                {hives.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.apiaryName} ({h.beekeeperName}) — {h.location} [{h.stateCode}]
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-amber-900 mb-1">Harvest Date *</label>
                <input
                  type="date"
                  required
                  value={harvestForm.harvestDate}
                  onChange={e => setHarvestForm({ ...harvestForm, harvestDate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-amber-950 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-amber-900 mb-1">Harvest Quantity (kg) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={harvestForm.quantityKg}
                  onChange={e => setHarvestForm({ ...harvestForm, quantityKg: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-amber-950 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-amber-900 mb-1">Batch Notes / Extraction Details</label>
              <textarea
                rows="3"
                value={harvestForm.notes}
                onChange={e => setHarvestForm({ ...harvestForm, notes: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-amber-950 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                placeholder="e.g. Unheated, cold extracted raw forest nectar..."
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-xl shadow-lg hover:from-amber-700 hover:to-amber-800 transition-all text-sm flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <span>Submit & Mint Blockchain Batch</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: REGISTER HIVE FORM */}
      {activeTab === 'new-hive' && (
        <div className="max-w-2xl mx-auto bg-[#fffdf8] rounded-2xl p-6 sm:p-8 border border-amber-300 shadow-xl space-y-6">
          <div className="border-b border-amber-200 pb-4">
            <h2 className="text-xl font-bold text-amber-950 flex items-center gap-2">
              <Hexagon className="w-5 h-5 text-amber-600" />
              <span>Register New Apiary / Hive</span>
            </h2>
            <p className="text-xs text-amber-700">
              Registers apiary origin data for geo-tagging and state-level batch sequence allocation.
            </p>
          </div>

          <form onSubmit={handleCreateHive} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-amber-900 mb-1">Beekeeper Name *</label>
                <input
                  type="text"
                  required
                  value={hiveForm.beekeeperName}
                  onChange={e => setHiveForm({ ...hiveForm, beekeeperName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-amber-950 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block font-bold text-amber-900 mb-1">Apiary Name *</label>
                <input
                  type="text"
                  required
                  value={hiveForm.apiaryName}
                  onChange={e => setHiveForm({ ...hiveForm, apiaryName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-amber-950 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-bold text-amber-900 mb-1">Location / District *</label>
                <input
                  type="text"
                  required
                  value={hiveForm.location}
                  onChange={e => setHiveForm({ ...hiveForm, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-amber-950 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block font-bold text-amber-900 mb-1">State Code (2 Letters) *</label>
                <input
                  type="text"
                  required
                  maxLength="2"
                  value={hiveForm.stateCode}
                  onChange={e => setHiveForm({ ...hiveForm, stateCode: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-amber-950 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono font-bold uppercase"
                  placeholder="KA, TN, PB"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-amber-900 mb-1">Primary Floral Nectar Source *</label>
              <input
                type="text"
                required
                value={hiveForm.floraType}
                onChange={e => setHiveForm({ ...hiveForm, floraType: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-amber-950 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                placeholder="e.g. Wild Coorg Flora & Eucalyptus"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-amber-900 mb-1">GPS Coordinates</label>
                <input
                  type="text"
                  value={hiveForm.gpsCoords}
                  onChange={e => setHiveForm({ ...hiveForm, gpsCoords: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-amber-950 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-amber-900 mb-1">Number of Active Hive Boxes</label>
                <input
                  type="number"
                  value={hiveForm.activeHives}
                  onChange={e => setHiveForm({ ...hiveForm, activeHives: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-amber-950 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-bold"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-amber-900 text-white font-bold rounded-xl shadow-lg hover:bg-amber-950 transition-all text-sm flex items-center justify-center gap-2"
              >
                <Hexagon className="w-5 h-5 text-amber-400" />
                <span>Register Apiary Record</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* QR Code Modal Popup */}
      <QRCodeModal
        batch={selectedBatchForQR}
        isOpen={!!selectedBatchForQR}
        onClose={() => setSelectedBatchForQR(null)}
      />
    </div>
  );
}
