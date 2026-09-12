'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LandingNavbar() {
  const pathname = usePathname();
  const isLandingPage = pathname === '/' || pathname === '/welcome';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-surface-container-lowest/80 backdrop-blur-xl border-b border-surface-container-high/60 shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
      <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg h-16 flex items-center justify-between">
        {/* Brand & Realm Identifier */}
        <div className="flex items-center gap-space-md">
          <Link href="/" className="flex items-center gap-space-xs group">
            <div className="w-3 h-3 rotate-45 bg-primary shadow-[0_0_12px_rgba(255,193,116,0.8)] group-hover:scale-110 transition-transform"></div>
            <span className="font-headline-sm text-headline-sm uppercase text-primary tracking-widest font-bold">
              LIFE FORGE
            </span>

          </Link>

          
        </div>

        {/* Public Navigation Links */}
        {isLandingPage && (
          <nav className="hidden md:flex items-center gap-space-lg font-title-md text-[14px]">
            <Link href="#overview" className="text-on-surface-variant hover:text-on-surface transition-colors">
              Overview
            </Link>
            <Link href="#features" className="text-on-surface-variant hover:text-on-surface transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-on-surface-variant hover:text-on-surface transition-colors">
              How It Works
            </Link>
          </nav>
        )}

        {/* Public Action CTAs */}
        <div className="flex items-center gap-space-sm">
          {pathname !== '/login' && (
            <Link
              href="/login"
              className="px-space-md py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-telemetry text-[11px] uppercase tracking-wider transition-all"
            >
              Log In
            </Link>
          )}
          {pathname !== '/signup' && pathname !== '/register' && (
            <Link
              href="/signup"
              className="px-space-md py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-fixed font-label-telemetry text-[11px] uppercase tracking-wider font-bold shadow-[0_0_14px_rgba(245,158,11,0.4)] transition-all"
            >
              Start Your Journey
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
