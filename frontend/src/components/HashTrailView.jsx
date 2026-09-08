import React from 'react';
import { Lock, FileText, CheckCircle2, ShieldCheck, Database, ArrowDown } from 'lucide-react';

export default function HashTrailView({ blocks, chainIntegrity }) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-amber-700 bg-amber-50 rounded-xl">
        No cryptographic blocks recorded yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Integrity Header Badge */}
      <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm font-semibold ${
        chainIntegrity?.isValid
          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
          : 'bg-red-50 border-red-300 text-red-900'
      }`}>
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-5 h-5 ${chainIntegrity?.isValid ? 'text-emerald-600' : 'text-red-600'}`} />
          <span>
            {chainIntegrity?.isValid
              ? 'Blockchain Hash Chain Integrity: VERIFIED (0 Tampering Detected)'
              : `Tamper Alert: Block #${chainIntegrity?.tamperedIndex} Hash Mismatch!`}
          </span>
        </div>
        <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-200">
          SHA-256 Chained
        </span>
      </div>

      {/* Block List */}
      <div className="relative pl-6 border-l-2 border-amber-300 space-y-6 my-4">
        {blocks.map((block, idx) => {
          const isGenesis = block.index === 0;
          const isVerifiedBlock = block.eventType === 'SMART_CONTRACT_VERIFIED';

          return (
            <div key={block.hash || idx} className="relative group">
              {/* Timeline Bullet */}
              <div className={`absolute -left-[31px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                isGenesis
                  ? 'bg-amber-800 text-amber-100 ring-4 ring-amber-100'
                  : isVerifiedBlock
                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                  : 'bg-amber-500 text-white ring-4 ring-amber-100'
              }`}>
                {block.index}
              </div>

              {/* Block Card */}
              <div className="bg-amber-950/90 text-amber-50 rounded-xl p-4 shadow-md border border-amber-800/80 space-y-2">
                <div className="flex items-center justify-between border-b border-amber-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-800 text-amber-200 font-mono text-[10px] font-bold uppercase">
                      Block #{block.index}
                    </span>
                    <span className="text-xs font-bold text-amber-300">
                      {block.eventType.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono">
                    {new Date(block.timestamp).toLocaleString()}
                  </span>
                </div>

                {/* Hashes */}
                <div className="grid grid-cols-1 gap-1.5 font-mono text-[11px]">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 bg-amber-900/60 p-2 rounded border border-amber-800">
                    <span className="text-amber-400 font-semibold min-w-[100px]">Previous Hash:</span>
                    <span className="text-amber-300 truncate">{block.previousHash}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 bg-amber-900/90 p-2 rounded border border-amber-700">
                    <span className="text-emerald-400 font-semibold min-w-[100px]">Block Hash:</span>
                    <span className="text-emerald-300 font-bold truncate">{block.hash}</span>
                  </div>
                </div>

                {/* Event Data Payload */}
                <div className="bg-amber-900/30 p-2.5 rounded text-[11px] font-mono text-amber-200/90 space-y-1">
                  <div className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">
                    Payload Data:
                  </div>
                  <pre className="whitespace-pre-wrap text-[10px] text-amber-300 max-h-28 overflow-y-auto">
                    {JSON.stringify(block.data, null, 2)}
                  </pre>
                </div>

                {/* Simulated IPFS CID badge if present */}
                {block.data?.ipfsCid && (
                  <div className="flex items-center justify-between bg-amber-900/80 px-2.5 py-1.5 rounded text-[10px]">
                    <div className="flex items-center gap-1.5 text-amber-300">
                      <Database className="w-3.5 h-3.5 text-amber-400" />
                      <span>IPFS Off-chain CID:</span>
                    </div>
                    <span className="font-mono text-amber-200 font-bold">{block.data.ipfsCid}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
