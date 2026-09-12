import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import LandingNavbar from '@/components/LandingNavbar';
import DynamicCharacter3DCanvas from '@/components/DynamicCharacter3DCanvas';

export const metadata: Metadata = {
  title: 'LifeForge | Gamified Life RPG & Productivity Engine',
  description: 'Convert real-world tasks, habits, and goals into RPG progression, character levels, attribute points, and rewards.',
  alternates: {
    canonical: 'https://lifeforge.app',
  },
  openGraph: {
    title: 'LifeForge | Turn Productivity into an RPG Adventure',
    description: 'Build real-world discipline with 3D avatars, RPG levels, streak bonuses, and tangible rewards.',
    url: 'https://lifeforge.app',
    siteName: 'LifeForge',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LifeForge | Gamified Life RPG',
    description: 'Transform daily routines into RPG character growth.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'LifeForge',
  url: 'https://lifeforge.app',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Any',
  description: 'Gamified life RPG web application converting real-world tasks into RPG progression, attributes, and rewards.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0b090e] text-on-surface flex flex-col justify-between selection:bg-primary-container selection:text-on-primary-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingNavbar />

      <main className="w-full flex-1 pt-16 bg-[#0b090e] relative text-on-surface">
        {/* Lightweight Gradient Background */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/10 via-primary-container/5 to-transparent rounded-full opacity-60"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-tertiary/5 rounded-full opacity-40"></div>
        </div>

        {/* HERO SECTION */}
        <section id="overview" className="relative z-10 w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-gutter md:px-margin-lg py-space-xl">
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-surface-container-high border border-primary/30 text-primary font-label-telemetry text-[11px] uppercase tracking-wider font-bold mb-space-md">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>Gamified Life RPG & Productivity System</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-tight font-headline">
                Turn Everyday Tasks Into <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                  RPG Progression
                </span>
              </h1>

              <p className="font-title-lg text-title-lg text-on-surface-variant max-w-xl my-space-md font-normal leading-relaxed">
                LifeForge transforms your real-world habits, daily goals, and tasks into an interactive RPG experience. Earn XP, level up your character, build attributes, and redeem gold rewards.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-space-md w-full max-w-md mt-space-sm">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-space-xs px-space-lg py-space-md rounded-lg bg-primary text-on-primary font-label-telemetry text-[12px] uppercase tracking-wider font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:bg-primary-fixed transition-all duration-200"
                >
                  <span>Start Free Journey</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-space-xs px-space-lg py-space-md rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-telemetry text-[12px] uppercase tracking-wider font-bold border border-surface-container-highest transition-all duration-200"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">key</span>
                  <span>Log In</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-space-md mt-space-lg text-on-surface-variant font-label-telemetry text-[11px]">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                  <span>Instant Habit Tracking</span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-[16px]">bolt</span>
                  <span>Real-Time XP Yield</span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-tertiary text-[16px]">shield</span>
                  <span>Streak Protection</span>
                </div>
              </div>
            </div>

            {/* 3D Character Viewport Showcase */}
            <div className="lg:col-span-5 relative w-full bg-surface-container-lowest/90 rounded-2xl p-space-xs border border-surface-container-high shadow-2xl overflow-hidden">
              <div className="absolute top-3 left-3 z-20 pointer-events-none flex items-center gap-space-xs opacity-75">
                <span className="font-label-sigil text-label-sigil text-primary">┌─</span>
                <span className="font-label-telemetry text-[10px] text-outline uppercase tracking-wider font-bold">
                  ACTIVE 3D AVATAR
                </span>
              </div>
              <div className="absolute top-3 right-3 z-20 pointer-events-none opacity-75 text-right">
                <span className="font-label-sigil text-label-sigil text-primary">─┐</span>
              </div>
              <DynamicCharacter3DCanvas height="h-[380px]" />
              <div className="absolute bottom-3 inset-x-0 mx-auto w-fit z-20 flex items-center gap-space-xs bg-surface-container-low/90 backdrop-blur-md px-space-md py-1 rounded-full border border-surface-container-high">
                <span className="material-symbols-outlined text-[14px] text-primary animate-pulse">3d_rotation</span>
                <span className="font-label-telemetry text-on-surface-variant text-[10px] uppercase tracking-wider font-bold">
                  Interactive 3D Character
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CORE FEATURES SECTION */}
        <section id="features" className="relative z-10 w-full px-gutter md:px-margin-lg py-space-xl border-t border-surface-container-high/50">
          <div className="max-w-6xl mx-auto flex flex-col gap-space-lg">
            <div className="flex flex-col items-center text-center gap-space-xs">
              <span className="font-label-telemetry text-[11px] text-primary uppercase tracking-widest font-bold">
                SYSTEM CORE FEATURES
              </span>
              <h2 className="font-headline-md text-headline-md uppercase text-on-surface font-bold">
                Everything You Need To Gamify Your Life
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                Convert your to-do list into a rewarding RPG journey with customized attributes, habit streaks, and inventory rewards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mt-space-md">
              {/* Feature 1: Quest Matrix */}
              <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col justify-between gap-space-md hover:border-primary/40 transition-colors">
                <div className="flex flex-col gap-space-sm">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[26px]">radar</span>
                  </div>
                  <h3 className="font-title-lg text-title-lg text-on-surface font-bold">Quest Matrix</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Create tasks, daily habits, and milestones categorized by difficulty tiers (Standard, Medium, Hard, Legendary) with automatic XP and Gold rewards.
                  </p>
                </div>
                <div className="font-label-telemetry text-[11px] text-primary uppercase font-bold flex items-center gap-1">
                  <span>QUEST SYSTEM</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </div>
              </div>

              {/* Feature 2: Character Attributes */}
              <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col justify-between gap-space-md hover:border-secondary/40 transition-colors">
                <div className="flex flex-col gap-space-sm">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[26px]">shield_person</span>
                  </div>
                  <h3 className="font-title-lg text-title-lg text-on-surface font-bold">Character & Attributes</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Build real-life stats across Intellect, Strength, Discipline, Vitality, and Focus. Watch your character level up as you complete tasks.
                  </p>
                </div>
                <div className="font-label-telemetry text-[11px] text-secondary uppercase font-bold flex items-center gap-1">
                  <span>RPG STAT ENGINE</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </div>
              </div>

              {/* Feature 3: Sanctuary Store */}
              <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col justify-between gap-space-md hover:border-tertiary/40 transition-colors">
                <div className="flex flex-col gap-space-sm">
                  <div className="w-12 h-12 rounded-lg bg-tertiary/10 border border-tertiary/30 flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-[26px]">workspace_premium</span>
                  </div>
                  <h3 className="font-title-lg text-title-lg text-on-surface font-bold">Rewards & Inventory</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Spend Gold earned from completing directives on real-life rewards, custom passes, gaming time, cheat meal tickets, and sanctuary relics.
                  </p>
                </div>
                <div className="font-label-telemetry text-[11px] text-tertiary uppercase font-bold flex items-center gap-1">
                  <span>REQUISITION SHOP</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="relative z-10 w-full px-gutter md:px-margin-lg py-space-xl bg-surface-container-lowest/50 border-t border-surface-container-high/50">
          <div className="max-w-5xl mx-auto flex flex-col gap-space-lg">
            <div className="flex flex-col items-center text-center gap-space-xs">
              <span className="font-label-telemetry text-[11px] text-primary uppercase tracking-widest font-bold">
                THREE SIMPLE STEPS
              </span>
              <h2 className="font-headline-md text-headline-md uppercase text-on-surface font-bold">
                How LifeForge Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mt-space-sm">
              <div className="flex flex-col items-center text-center p-space-md gap-space-xs">
                <div className="w-10 h-10 rounded-full bg-primary text-on-primary font-bold text-[18px] flex items-center justify-center mb-space-xs shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                  1
                </div>
                <h4 className="font-title-md text-title-md text-on-surface font-bold">Forge Directives</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Add your daily tasks, habits, or fitness goals and assign them to RPG attributes.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-space-md gap-space-xs">
                <div className="w-10 h-10 rounded-full bg-primary text-on-primary font-bold text-[18px] flex items-center justify-center mb-space-xs shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                  2
                </div>
                <h4 className="font-title-md text-title-md text-on-surface font-bold">Execute & Earn</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Complete real-world tasks to instantly harvest XP, maintain daily streak bonuses, and accumulate Gold.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-space-md gap-space-xs">
                <div className="w-10 h-10 rounded-full bg-primary text-on-primary font-bold text-[18px] flex items-center justify-center mb-space-xs shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                  3
                </div>
                <h4 className="font-title-md text-title-md text-on-surface font-bold">Level Up & Reward</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Ascend your character rank, upgrade your 3D avatar gear, and redeem earned Gold in the sanctuary store.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION CTA BANNER */}
        <section className="relative z-10 w-full px-gutter md:px-margin-lg py-space-xl">
          <div className="max-w-4xl mx-auto bg-surface-container-low rounded-2xl p-space-xl border border-primary/30 shadow-2xl text-center flex flex-col items-center gap-space-md">
            <h2 className="font-headline-md text-headline-md uppercase text-on-surface font-bold">
              Ready To Level Up Your Life?
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Join LifeForge today and turn your daily habits into an empowering RPG adventure. Free forever for core quests.
            </p>
            <Link
              href="/signup"
              className="px-space-xl py-space-md rounded-lg bg-primary text-on-primary hover:bg-primary-fixed font-label-telemetry text-[12px] uppercase tracking-wider font-bold shadow-[0_0_24px_rgba(245,158,11,0.5)] transition-all mt-space-xs"
            >
              Forge Your Free Character Now
            </Link>
          </div>
        </section>
      </main>

      {/* FULL FLEDGED COPYRIGHT 2026 FOOTER */}
      <footer className="w-full bg-surface-container-lowest border-t border-surface-container-high py-space-lg">
        <div className="max-w-7xl mx-auto px-margin md:px-margin-md flex flex-col md:flex-row items-center justify-between gap-space-md">
          <div className="flex flex-col items-center md:items-start gap-space-2xs">
            <div className="flex items-center gap-space-xs">
              <div className="w-3 h-3 rotate-45 bg-primary shadow-[0_0_10px_rgba(245,158,11,0.6)]"></div>
              <span className="font-headline-sm text-[15px] uppercase text-primary tracking-widest font-bold">
                LIFE FORGE
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-center md:text-left">
              Gamified Life RPG & Productivity Engine. Convert real-world discipline into RPG progression.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-space-md font-label-telemetry text-[11px] text-on-surface-variant">
            <Link href="#overview" className="hover:text-primary transition-colors">Overview</Link>
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">How It Works</Link>
            <Link href="/login" className="hover:text-primary transition-colors">Log In</Link>
            <Link href="/signup" className="hover:text-primary transition-colors">Sign Up</Link>
          </div>

          <div className="font-label-telemetry text-[11px] text-outline text-center md:text-right font-bold">
            © 2026 LifeForge. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
