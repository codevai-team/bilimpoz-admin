'use client';

import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      {/* Header */}
      <Header 
        onMenuToggle={toggleMobileMenu} 
        isMobileMenuOpen={isMobileMenuOpen} 
      />
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={closeMobileMenu} 
      />
      
      {/* Main Content */}
      <main className="pt-24 lg:pl-72 pr-4 min-h-screen">
        <div className="dashboard-main-content">
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
