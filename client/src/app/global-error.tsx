'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b090e] text-white min-h-screen flex flex-col items-center justify-center p-6 text-center selection:bg-amber-500 selection:text-black">
        <div className="max-w-md w-full rounded-2xl bg-[#14121a] p-8 border border-red-500/30 shadow-2xl flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <span className="material-symbols-outlined text-[36px]">error</span>
          </div>
          <span className="text-[11px] text-red-400 uppercase tracking-widest font-bold">
            CRITICAL MATRIX ERROR
          </span>
          <h2 className="text-xl font-bold uppercase">
            Global Layout Exception
          </h2>
          <p className="text-sm text-gray-400">
            {error.message || 'A critical error prevented the application from rendering.'}
          </p>
          <button
            onClick={() => reset()}
            className="w-full mt-2 px-4 py-2.5 rounded-lg bg-amber-500 text-black font-bold uppercase text-[11px] tracking-wider hover:bg-amber-400 transition-all cursor-pointer"
          >
            Reboot Matrix System
          </button>
        </div>
      </body>
    </html>
  );
}
