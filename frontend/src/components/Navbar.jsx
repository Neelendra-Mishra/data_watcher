import React, { useState, useEffect } from 'react';
import { Activity, BookOpen } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 50) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-[#E7D9C8]/90 backdrop-blur-md border-b border-[#DCC8B2] transition-all duration-300 ease-in-out ${
        visible ? 'translate-y-0 shadow-sm shadow-[#667035]/10' : '-translate-y-full shadow-none'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="p-2 bg-[#C2856A] rounded-xl text-white shadow-md shadow-[#C2856A]/25">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#38401C] tracking-tight">Data Watcher</h1>
            <p className="text-[11px] text-[#786C5A] font-medium">Time-Series Anomaly Intelligence</p>
          </div>
        </div>

        {/* Top Navigation Tabs */}
        <nav className="flex items-center space-x-1 bg-[#DCC8B2]/50 p-1 rounded-xl border border-[#DCC8B2]">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'dashboard'
                ? 'bg-[#C2856A] text-white shadow-sm shadow-[#C2856A]/30'
                : 'text-[#524B42] hover:text-[#2C2621]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'docs'
                ? 'bg-[#C2856A] text-white shadow-sm shadow-[#C2856A]/30'
                : 'text-[#524B42] hover:text-[#2C2621]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>How It Works</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

