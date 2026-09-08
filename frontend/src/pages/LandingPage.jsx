import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Hexagon, Beaker, QrCode, LayoutDashboard, AlertTriangle, CheckCircle2, ArrowRight, Award, Lock, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-16 py-6">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 text-amber-50 p-8 sm:p-14 border border-amber-800/80 shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Smart India Hackathon 2026 • SIH26021 • Team Hive and seek</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-none">
            From Hive to Home — <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">Verified.</span>
          </h1>

          <p className="text-amber-200/90 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
            Honey Chain provides immutable, QR-coded blockchain traceability and smart contract quality enforcement for Indian honey producers, testing labs, regulators, and consumers.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/beekeeper"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
            >
              <Hexagon className="w-4 h-4" />
              <span>Log Honey Harvest</span>
            </Link>

            <Link
              to="/lab"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-900/80 hover:bg-amber-800 text-amber-100 border border-amber-700/80 font-semibold text-sm hover:scale-105 transition-all"
            >
              <Beaker className="w-4 h-4 text-amber-400" />
              <span>Submit FSSAI Lab Test</span>
            </Link>

            <Link
              to="/consumer/HC-2026-KA-00417"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-xs border border-white/20 hover:scale-105 transition-all"
            >
              <QrCode className="w-4 h-4 text-amber-300" />
              <span>Consumer QR Scan Demo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* PROBLEM CALLOUT BANNER (CSE 2020 STATS) */}
      <section className="bg-amber-100/80 rounded-2xl p-6 sm:p-8 border border-amber-300 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-red-700">The Honey Adulteration Crisis</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-amber-950">
                68% of Major Indian Honey Brands Failed Purity & C4 Sugar Tests
              </h3>
              <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                Investigation by the Centre for Science and Environment (CSE 2020) revealed widespread adulteration with imported Chinese C4 invert sugar syrups that bypass basic laboratory checks.
              </p>
            </div>
          </div>
          <div className="shrink-0 bg-white p-4 rounded-xl border border-amber-300 shadow-sm text-center">
            <span className="block text-3xl font-black text-red-600">68%</span>
            <span className="text-[11px] font-bold text-amber-900 uppercase">Failed CSE Purity Test</span>
          </div>
        </div>
      </section>

      {/* HOW HONEY CHAIN SOLVES IT - 4 ROLE CARDS */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-amber-950">End-to-End Stakeholder Architecture</h2>
          <p className="text-sm text-amber-800">
            A unified, multi-role platform that locks every step of honey production onto an unalterable ledger.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Beekeeper */}
          <div className="bg-[#fffdf8] rounded-2xl p-6 border border-amber-200 shadow-md hover:shadow-xl transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Hexagon className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-950">1. Beekeeper Portal</h3>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Registers hives, logs floral sources, harvest dates, and location coordinates to mint a unique Batch ID.
              </p>
            </div>
            <Link
              to="/beekeeper"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-950 group-hover:translate-x-1 transition-transform"
            >
              <span>Register & Log Harvest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Lab */}
          <div className="bg-[#fffdf8] rounded-2xl p-6 border border-amber-200 shadow-md hover:shadow-xl transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Beaker className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-950">2. Lab Testing & Smart Contract</h3>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Uploads Moisture, HMF, and C4 sugar test results. Smart Contract auto-evaluates against FSSAI limits.
              </p>
            </div>
            <Link
              to="/lab"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-950 group-hover:translate-x-1 transition-transform"
            >
              <span>Submit Lab Results</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Consumer */}
          <div className="bg-[#fffdf8] rounded-2xl p-6 border border-amber-200 shadow-md hover:shadow-xl transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <QrCode className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-950">3. Consumer QR Verification</h3>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Shoppers scan jar QR codes to view beekeeper details, lab test scores, and cryptographically verified hashes.
              </p>
            </div>
            <Link
              to="/consumer/HC-2026-KA-00417"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-950 group-hover:translate-x-1 transition-transform"
            >
              <span>View Consumer Passport</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4: Regulator */}
          <div className="bg-[#fffdf8] rounded-2xl p-6 border border-amber-200 shadow-md hover:shadow-xl transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <LayoutDashboard className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-950">4. Regulator Dashboard</h3>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                FSSAI officers monitor batch purity trends, pinpoint adulteration spikes, and flag suspect producers.
              </p>
            </div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-950 group-hover:translate-x-1 transition-transform"
            >
              <span>Open Regulator Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FSSAI THRESHOLD COMPLIANCE BANNER */}
      <section className="bg-amber-950 text-amber-50 rounded-3xl p-8 border border-amber-800 shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-amber-800 pb-4">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
          <div>
            <h3 className="text-xl font-bold text-white">Smart Contract Regulatory Rules (FSSAI 2020 Standard)</h3>
            <p className="text-xs text-amber-300">Automated validation code executing on-chain per lab upload</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-amber-900/60 p-4 rounded-xl border border-amber-800 space-y-1">
            <span className="text-xs text-amber-400 font-semibold uppercase">Max Moisture</span>
            <div className="text-2xl font-black text-white">≤ 20.0 %</div>
            <p className="text-[11px] text-amber-300/80">Prevents premature harvesting & yeast fermentation</p>
          </div>

          <div className="bg-amber-900/60 p-4 rounded-xl border border-amber-800 space-y-1">
            <span className="text-xs text-amber-400 font-semibold uppercase">Max HMF Content</span>
            <div className="text-2xl font-black text-white">≤ 80.0 mg/kg</div>
            <p className="text-[11px] text-amber-300/80">Detects over-heating & degraded thermal processing</p>
          </div>

          <div className="bg-amber-900/60 p-4 rounded-xl border border-amber-800 space-y-1">
            <span className="text-xs text-amber-400 font-semibold uppercase">Max C4 Sugars</span>
            <div className="text-2xl font-black text-white">≤ 7.0 %</div>
            <p className="text-[11px] text-amber-300/80">Flags synthetic cane & corn sugar syrup blending</p>
          </div>

          <div className="bg-amber-900/60 p-4 rounded-xl border border-amber-800 space-y-1">
            <span className="text-xs text-amber-400 font-semibold uppercase">Min F/G Ratio</span>
            <div className="text-2xl font-black text-white">≥ 1.0</div>
            <p className="text-[11px] text-amber-300/80">Ensures natural floral fructose-glucose balance</p>
          </div>
        </div>
      </section>
    </div>
  );
}
