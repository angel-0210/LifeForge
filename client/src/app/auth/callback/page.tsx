'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          setError(sessionError.message);
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        if (session) {
          router.push('/home');
        } else {
          // Listen for session established via onAuthStateChange
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
            if (newSession || event === 'SIGNED_IN') {
              subscription.unsubscribe();
              router.push('/home');
            }
          });

          // Timeout fallback in case auth fails
          const timer = setTimeout(() => {
            subscription.unsubscribe();
            router.push('/home');
          }, 3000);

          return () => {
            subscription.unsubscribe();
            clearTimeout(timer);
          };
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Authentication callback failed';
        setError(msg);
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-on-surface px-margin">
      <div className="flex flex-col items-center gap-space-md max-w-sm text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="font-label-sigil text-[11px] text-primary uppercase tracking-widest font-bold">
          NEXUS OAUTH GATEWAY
        </span>
        <h2 className="font-headline-md text-headline-sm text-on-surface uppercase font-bold">
          {error ? 'AUTHENTICATION ERROR' : 'INITIALIZING SESSION'}
        </h2>
        <p className="font-body-sm text-on-surface-variant">
          {error
            ? `${error}. Redirecting to login...`
            : 'Establishing secure link with Google account...'}
        </p>
      </div>
    </div>
  );
}
