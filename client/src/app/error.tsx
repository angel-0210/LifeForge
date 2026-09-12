'use client';

import React from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error?: Error & { digest?: string };
  reset?: () => void;
}) {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center text-on-surface">
      <div className="max-w-md w-full rounded-2xl bg-surface-container-low p-8 border border-surface-container-high shadow-2xl flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-error/10 border border-error/30 flex items-center justify-center text-error">
          <span className="material-symbols-outlined text-[36px]">warning</span>
        </div>
        <span className="font-label-telemetry text-[11px] text-error uppercase tracking-widest font-bold">
          ANOMALY DETECTED // APPLICATION ERROR
        </span>
        <h2 className="font-headline-sm text-headline-sm uppercase font-headline font-bold">
          Matrix Operation Interrupted
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {error?.message || 'An unexpected error occurred during page execution.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
          <button
            onClick={() => reset?.()}
            className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-on-primary font-label-telemetry text-[11px] uppercase tracking-wider font-bold shadow-[0_0_16px_rgba(245,158,11,0.4)] hover:bg-primary-fixed transition-all cursor-pointer"
          >
            Re-Initialize State
          </button>
          <Link
            href="/"
            className="flex-1 px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-label-telemetry text-[11px] uppercase tracking-wider hover:bg-surface-container-highest transition-all flex items-center justify-center"
          >
            Return to Base
          </Link>
        </div>
      </div>
    </div>
  );
}
