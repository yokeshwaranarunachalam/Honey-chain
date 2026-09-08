import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import BeekeeperDashboard from './pages/BeekeeperDashboard';
import LabDashboard from './pages/LabDashboard';
import BatchDetailPage from './pages/BatchDetailPage';
import ConsumerScanPage from './pages/ConsumerScanPage';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#fffdf8] text-amber-950 font-sans honeycomb-pattern">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/beekeeper" element={<BeekeeperDashboard />} />
            <Route path="/lab" element={<LabDashboard />} />
            <Route path="/passport/:batchId" element={<BatchDetailPage />} />
            <Route path="/consumer/:batchId" element={<ConsumerScanPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
