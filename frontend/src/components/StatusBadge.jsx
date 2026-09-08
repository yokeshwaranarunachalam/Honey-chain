import React from 'react';
import { CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export default function StatusBadge({ status, showIcon = true, size = 'normal' }) {
  const normalized = (status || 'PENDING').toUpperCase();

  const isSmall = size === 'small';
  const padding = isSmall ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs sm:text-sm font-bold';

  if (normalized === 'VERIFIED') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 ${padding}`}>
        {showIcon && <CheckCircle2 className={`${isSmall ? 'w-3 h-3' : 'w-4 h-4'} text-emerald-600`} />}
        <span>Verified Pure</span>
      </span>
    );
  }

  if (normalized === 'FLAGGED') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-red-100 text-red-800 border border-red-300 ${padding}`}>
        {showIcon && <AlertTriangle className={`${isSmall ? 'w-3 h-3' : 'w-4 h-4'} text-red-600`} />}
        <span>🚩 Flagged / Failed</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 ${padding}`}>
      {showIcon && <Clock className={`${isSmall ? 'w-3 h-3' : 'w-4 h-4'} text-amber-600 animate-pulse`} />}
      <span>Pending Testing</span>
    </span>
  );
}
