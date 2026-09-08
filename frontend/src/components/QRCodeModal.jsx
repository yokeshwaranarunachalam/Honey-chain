import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, ExternalLink, Copy, Check, ShieldCheck, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function QRCodeModal({ batch, isOpen, onClose }) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !batch) return null;

  const publicUrl = `${window.location.origin}/consumer/${batch.batchId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-amber-950/60 backdrop-blur-xs p-4">
      <div className="bg-[#fffdf8] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-amber-300 relative animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-700 hover:text-amber-950 hover:bg-amber-100 p-1.5 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 text-amber-700 mb-1">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-amber-950">Digital Passport QR Code</h3>
          <p className="text-xs text-amber-700 font-mono font-semibold">Batch ID: {batch.batchId}</p>
        </div>

        {/* QR Code Container */}
        <div className="my-6 flex flex-col items-center justify-center p-6 bg-amber-50 rounded-2xl border-2 border-dashed border-amber-300 relative">
          <div className="bg-white p-4 rounded-xl shadow-md border border-amber-200">
            <QRCodeSVG
              value={publicUrl}
              size={180}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐝</text></svg>",
                x: undefined,
                y: undefined,
                height: 36,
                width: 36,
                excavate: true,
              }}
            />
          </div>
          <p className="mt-3 text-[11px] font-medium text-amber-800 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cryptographically Bound SHA-256 Ledger</span>
          </p>
        </div>

        {/* Batch Info Summary */}
        <div className="bg-amber-100/60 p-3 rounded-xl text-xs space-y-1 mb-5">
          <div className="flex justify-between">
            <span className="text-amber-800">Beekeeper:</span>
            <strong className="text-amber-950">{batch.beekeeperName}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-amber-800">Flora Source:</span>
            <strong className="text-amber-950">{batch.floraType}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-amber-800">Status:</span>
            <strong className={batch.status === 'VERIFIED' ? 'text-emerald-700' : batch.status === 'FLAGGED' ? 'text-red-700' : 'text-amber-700'}>
              {batch.status}
            </strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <Link
            to={`/consumer/${batch.batchId}`}
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-semibold shadow-md hover:from-amber-700 hover:to-amber-800 transition-all text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Simulate Consumer Scan Page</span>
          </Link>

          <button
            onClick={copyToClipboard}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-amber-100 text-amber-900 rounded-xl font-medium hover:bg-amber-200 transition-colors text-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-amber-700" />}
            <span>{copied ? 'URL Copied to Clipboard!' : 'Copy Verification Web Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
