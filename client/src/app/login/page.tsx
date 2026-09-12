'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LandingNavbar from '@/components/LandingNavbar';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      router.push('/home');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setErrorMsg(msg);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google authentication failed';
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
              AUTHENTICATION GATEWAY
            </span>
            <h1 className="font-headline-md text-headline-md text-on-surface font-headline uppercase font-bold">
              ENTER NEXUS SANCTUM
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Access your LifeForge character stats and quest matrix.
            </p>
          </div>

          {errorMsg && (
            <div className="p-space-sm rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-body-sm text-center">
              {errorMsg}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-space-md px-space-md rounded-lg bg-surface-container-lowest border border-surface-container-high hover:bg-surface-container hover:border-primary text-on-surface font-label-telemetry text-[12px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-space-sm cursor-pointer disabled:opacity-50 shadow-md"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>[ CONTINUE WITH GOOGLE ]</span>
          </button>

          <div className="flex items-center">
            <div className="flex-1 border-t border-surface-container-high"></div>
            <span className="px-space-xs font-label-telemetry text-[10px] text-outline uppercase tracking-wider">
              OR USE EMAIL
            </span>
            <div className="flex-1 border-t border-surface-container-high"></div>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-space-md">
            <div className="flex flex-col gap-space-xs">
              <label className="font-label-telemetry text-[11px] text-outline uppercase tracking-wider">
                PLAYER IDENTIFIER
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

            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <label className="font-label-telemetry text-[11px] text-outline uppercase tracking-wider">
                  SECURITY KEY
                </label>
                <Link
                  href="/forgot-password"
                  className="font-label-telemetry text-[10px] text-primary hover:underline uppercase font-bold"
                >
                  Forgot Key?
                </Link>
              </div>
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
              {loading ? '[ AUTHENTICATING... ]' : '[ LOG IN TO LIFEFORGE ]'}
            </button>
          </form>

          <div className="flex items-center justify-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant pt-space-xs border-t border-surface-container-high">
            <span>New Explorer?</span>
            <Link href="/signup" className="text-primary hover:underline font-bold">
              Forge Character
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

