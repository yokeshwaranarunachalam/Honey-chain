import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Hexagon, ShieldCheck, Beaker, QrCode, LayoutDashboard, Home, Award } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? 'bg-amber-600 text-white font-semibold shadow-sm'
      : 'text-amber-900 hover:bg-amber-100 hover:text-amber-950 font-medium';
  };

  return (
    <header className="sticky top-0 z-50 bg-[#fffdf8]/90 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <Hexagon className="w-6 h-6 stroke-[2.2]" />
              <span className="absolute text-xs font-bold">🐝</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold text-amber-950 tracking-tight">Honey</span>
                <span className="text-xl font-black bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">Chain</span>
              </div>
              <p className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">Hive to Home Provenance</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${isActive('/')}`}>
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link to="/beekeeper" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${isActive('/beekeeper')}`}>
              <Hexagon className="w-4 h-4" />
              <span>Beekeeper</span>
            </Link>
            <Link to="/lab" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${isActive('/lab')}`}>
              <Beaker className="w-4 h-4" />
              <span>Lab Portal</span>
            </Link>
            <Link to="/consumer/HC-2026-KA-00417" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${isActive('/consumer/HC-2026-KA-00417')}`}>
              <QrCode className="w-4 h-4 text-amber-600" />
              <span>Consumer View</span>
            </Link>
            <Link to="/admin" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${isActive('/admin')}`}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Regulator</span>
            </Link>
          </nav>

          {/* SIH Hackathon Tag */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-100/90 text-amber-900 border border-amber-300/60 rounded-full text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>SIH 2026 • Team "Hive and seek"</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
