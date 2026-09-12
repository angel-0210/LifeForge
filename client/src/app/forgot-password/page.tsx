'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LandingNavbar from '@/components/LandingNavbar';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between selection:bg-primary-container selection:text-on-primary-container">
      <LandingNavbar />

      <main className="w-full flex-1 pt-24 pb-space-xl bg-background flex items-center justify-center px-margin md:px-margin-md">
        <div className="relative w-full max-w-md rounded-2xl bg-surface-container-low p-space-xl shadow-2xl flex flex-col gap-space-lg border border-surface-container-high">
          <div className="flex flex-col text-center gap-space-xs">
            <span className="font-label-sigil text-[11px] text-primary uppercase tracking-widest font-bold">
              SECURITY KEY RECOVERY
            </span>
            <h1 className="font-headline-md text-headline-md text-on-surface font-headline uppercase font-bold">
              RESET PASSPHRASE
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Enter your registered player email to transmit a runic reset token.
            </p>
          </div>

          {submitted ? (
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-tertiary/40 flex flex-col items-center text-center gap-space-sm">
              <span className="material-symbols-outlined text-[32px] text-tertiary">mark_email_read</span>
              <span className="font-title-md text-title-md text-on-surface font-bold">
                RECOVERY SIGNAL TRANSMITTED
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Check your inbox at <strong className="text-primary">{email}</strong> for instructions to restore your sanctum access.
              </p>
              <Link
                href="/login"
                className="mt-space-sm px-space-lg py-space-xs rounded bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-telemetry text-[11px] uppercase font-bold"
              >
                RETURN TO LOGIN
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-telemetry text-[11px] text-outline uppercase tracking-wider">
                  REGISTERED EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  placeholder="commander@lifeforge.rpg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-surface-container-high focus:border-primary text-on-surface px-space-md py-space-sm rounded-lg outline-none font-body-md"
                />
              </div>

              <button
                type="submit"
                className="w-full py-space-md rounded-lg bg-primary text-on-primary hover:bg-primary-fixed font-label-telemetry text-[12px] uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
              >
                [ TRANSMIT RESET KEY ]
              </button>
            </form>
          )}

          <div className="flex items-center justify-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant pt-space-xs border-t border-surface-container-high">
            <Link href="/login" className="text-primary hover:underline font-bold">
              ← Return to Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
