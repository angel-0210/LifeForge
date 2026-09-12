'use client';

import React, { useState } from 'react';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import AppBottomNav from './AppBottomNav';
import AppMobileDrawer from './AppMobileDrawer';
import { CharacterProvider } from '@/context/CharacterContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Fixed Header with Mobile Menu Toggle */}
      <AppHeader onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)} />

      {/* Left Fixed Vertical Sidebar for Desktop (lg:flex) */}
      <AppSidebar />

      {/* Responsive Slide-out Mobile Drawer for Phone/Tablet */}
      <AppMobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Fixed Bottom Navigation Bar for Phone/Tablet (lg:hidden) */}
      <AppBottomNav onOpenMenu={() => setMobileMenuOpen(true)} />

      {/* Main Content Area: Responsive padding for Header (pt-16), Desktop Sidebar (lg:pl-72), and Mobile Bottom Nav (pb-20 lg:pb-6) */}
      <div className="flex-1 lg:pl-72 pt-16 pb-20 lg:pb-6 min-h-screen flex flex-col justify-between">
        <main className="w-full flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
