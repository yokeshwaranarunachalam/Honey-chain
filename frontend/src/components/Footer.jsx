import React from 'react';
import { Shield, Hexagon, Database, Code, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-amber-950 text-amber-100 border-t border-amber-800/60 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-amber-950 font-bold">
                🐝
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Honey Chain</span>
            </div>
            <p className="text-amber-300/80 text-xs leading-relaxed">
              Blockchain-based Honey Traceability & Smart Beekeeping Management Platform for Smart India Hackathon 2026.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>FSSAI Compliant Smart Contracts</span>
            </div>
          </div>

          {/* Col 2: Hackathon Details */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-amber-400">SIH 2026 Details</h4>
            <ul className="text-xs text-amber-200/80 space-y-1.5">
              <li><strong className="text-amber-100">Problem Statement:</strong> SIH26021</li>
              <li><strong className="text-amber-100">Team Name:</strong> Hive and seek</li>
              <li><strong className="text-amber-100">Theme:</strong> Agriculture & FoodTech</li>
              <li><strong className="text-amber-100">Target Standard:</strong> FSSAI Honey Regulation 2020</li>
            </ul>
          </div>

          {/* Col 3: Architecture Stack */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-amber-400">Architecture Engine</h4>
            <ul className="text-xs text-amber-200/80 space-y-1.5">
              <li className="flex items-center gap-1.5"><Hexagon className="w-3.5 h-3.5 text-amber-400" /> Hyperledger Fabric / Polygon Simulation</li>
              <li className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-amber-400" /> Simulated IPFS Content Addressing (CID)</li>
              <li className="flex items-center gap-1.5"><Code className="w-3.5 h-3.5 text-amber-400" /> FSSAI Automated Quality Engine</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Dynamic SHA-256 Block Chaining</li>
            </ul>
          </div>

          {/* Col 4: Quick Roles */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-amber-400">Demo Walkthrough</h4>
            <div className="flex flex-col text-xs text-amber-200 space-y-1.5">
              <span className="text-amber-300 font-semibold">1. Beekeeper → Register & Log Harvest</span>
              <span className="text-amber-300 font-semibold">2. Lab → Submit FSSAI Tests</span>
              <span className="text-amber-300 font-semibold">3. Passport → View SHA-256 Ledger</span>
              <span className="text-amber-300 font-semibold">4. Consumer → Scan Mobile QR</span>
              <span className="text-amber-300 font-semibold">5. Regulator → Flag & Inspect</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-amber-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-amber-400/80">
          <p>© 2026 Honey Chain. Smart India Hackathon Prototype (Team "Hive and seek").</p>
          <p className="mt-2 sm:mt-0 italic">"From Hive to Home — Verified"</p>
        </div>
      </div>
    </footer>
  );
}
