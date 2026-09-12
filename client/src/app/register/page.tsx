'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LandingNavbar from '@/components/LandingNavbar';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const router = useRouter();
  const [characterName, setCharacterName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: characterName.trim(),
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      router.push('/home');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setErrorMsg(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between selection:bg-primary-container selection:text-on-primary-container">
      <LandingNavbar />

      <main className="w-full flex-1 pt-24 pb-space-xl bg-background flex items-center justify-center px-margin md:px-margin-md">
        <div className="relative w-full max-w-md rounded-2xl bg-surface-container-low p-space-xl shadow-2xl flex flex-col gap-space-lg border border-surface-container-high">
          <div className="flex flex-col text-center gap-space-xs">
            <span className="font-label-sigil text-[11px] text-primary uppercase tracking-widest font-bold">
              INITIATION PROTOCOL
            </span>
            <h1 className="font-headline-md text-headline-md text-on-surface font-headline uppercase font-bold">
              FORGE NEW PLAYER IDENTIFIER
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Begin your Life RPG adventure. Gamify habits, earn XP, and level up.
            </p>
          </div>

          {errorMsg && (
            <div className="p-space-sm rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-body-sm text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-space-md">
            <div className="flex flex-col gap-space-xs">
              <label className="font-label-telemetry text-[11px] text-outline uppercase tracking-wider">
                CHARACTER CODENAME
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kaelen"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                className="w-full bg-surface-container-lowest border border-surface-container-high focus:border-primary text-on-surface px-space-md py-space-sm rounded-lg outline-none font-body-md"
              />
            </div>

            <div className="flex flex-col gap-space-xs">
              <label className="font-label-telemetry text-[11px] text-outline uppercase tracking-wider">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                placeholder="kaelen@lifeforge.rpg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-lowest border border-surface-container-high focus:border-primary text-on-surface px-space-md py-space-sm rounded-lg outline-none font-body-md"
              />
            </div>

            <div className="flex flex-col gap-space-xs">
              <label className="font-label-telemetry text-[11px] text-outline uppercase tracking-wider">
                SECURITY PASSPHRASE
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-lowest border border-surface-container-high focus:border-primary text-on-surface px-space-md py-space-sm rounded-lg outline-none font-body-md"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-space-md rounded-lg bg-primary text-on-primary hover:bg-primary-fixed font-label-telemetry text-[12px] uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer mt-space-xs disabled:opacity-50"
            >
              {loading ? '[ FORGING CHARACTER... ]' : '[ PROCEED TO CHARACTER FORGE ]'}
            </button>
          </form>

          <div className="flex items-center justify-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant pt-space-xs border-t border-surface-container-high">
            <span>Already an Explorer?</span>
            <Link href="/login" className="text-primary hover:underline font-bold">
              Log In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

