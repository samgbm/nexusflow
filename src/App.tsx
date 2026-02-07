import React from 'react';
import { 
  Activity, 
  Globe, 
  Settings, 
  Server,
  Zap
} from 'lucide-react';

/**
 * ==========================================
 * INCREMENT 1: SCAFFOLDING & SHELL (Responsive)
 * ==========================================
 * Goal: Establish the "Bloomberg Terminal" dark-mode aesthetic.
 * * RESPONSIVE STRATEGY:
 * - Mobile: Stacked Layout (Sidebar on top, Graph below).
 * - Desktop: Split Layout (Sidebar on left, Graph on right).
 */

export default function App() {
  return (
    // 1. GLOBAL CONTAINER
    // 'flex flex-col md:flex-row': Stack vertically on mobile, horizontally on desktop (md+)
    // 'h-screen': Fixed height (no window scroll)
    // 'bg-[#050507]': "Deep Space" background
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#050507] text-gray-300 font-sans overflow-hidden selection:bg-blue-500/30">
      
      {/* --- 2. LEFT SIDEBAR: PROTOCOL STREAM --- */}
      {/* Mobile: Full width, fixed height (250px) to show logs without hiding graph */}
      {/* Desktop: Fixed width (420px), full height */}
      <div className="w-full h-[250px] md:w-[420px] md:h-full border-b md:border-b-0 md:border-r border-gray-800 flex flex-col bg-[#0a0a0c]">
        
        {/* Sidebar Header */}
        <div className="h-10 md:h-14 border-b border-gray-800 flex items-center px-4 bg-[#0f0f12] shrink-0">
          <Activity className="w-4 h-4 text-emerald-500 mr-2" />
          <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">MCP Protocol Stream</span>
          {/* Status Indicator (Pulse) */}
          <div className="ml-auto flex gap-2 items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[9px] text-gray-500 uppercase">Online</span>
          </div>
        </div>
        
        {/* Empty State for Logs (Placeholder) */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-40">
           <div className="w-12 h-12 md:w-16 md:h-16 border-2 border-gray-700 border-dashed rounded-lg mb-4 flex items-center justify-center">
             <Server className="w-6 h-6 md:w-8 md:h-8 text-gray-600" />
           </div>
           <p className="text-xs font-mono text-gray-500">
             [SYSTEM_INIT]<br/>
             Waiting for NANDA Registry...
           </p>
        </div>

        {/* Bottom Panel Placeholder (Packet Inspector) */}
        {/* Hidden on very small screens to save space, visible on desktop */}
        <div className="hidden md:flex h-56 border-t border-gray-800 bg-[#08080a] items-center justify-center shrink-0">
           <span className="text-[10px] uppercase font-bold text-gray-600">Packet Inspector Loading...</span>
        </div>
      </div>

      {/* --- 3. RIGHT AREA: MAIN STAGE --- */}
      {/* 'flex-1': Take remaining space */}
      {/* 'min-h-0': Crucial for nested flex scrolling */}
      <div className="flex-1 flex flex-col relative min-h-0">
        
        {/* Top Header: Financials & Metrics */}
        <div className="h-12 md:h-14 border-b border-gray-800 flex items-center justify-between px-4 md:px-6 bg-[#0a0a0c] shrink-0">
          <div className="flex items-center gap-3">
             <div className="p-1.5 bg-blue-500/10 rounded border border-blue-500/30">
               <Globe className="w-4 h-4 text-blue-400" />
             </div>
             <div>
               <h1 className="text-xs md:text-sm font-bold text-gray-200 tracking-tight">
                 NexusFlow <span className="text-gray-600 font-normal hidden sm:inline">| Global Supply OS</span>
               </h1>
             </div>
          </div>
          
          {/* Placeholder Metrics */}
          <div className="flex gap-4 md:gap-8 opacity-50">
            <div className="text-right">
              <div className="text-[9px] uppercase text-gray-500 font-bold tracking-wider">Trade Volume</div>
              <div className="text-sm md:text-lg font-mono font-bold text-gray-600">--</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-800 rounded text-gray-500 transition-colors">
               <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Graph Area */}
        <div className="flex-1 relative bg-[#050507] overflow-hidden flex items-center justify-center">
          {/* Background Grid Effect using CSS Gradients */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
          
          {/* Welcome Message */}
          <div className="z-10 text-center px-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-200 mb-2">NexusFlow Environment Ready</h2>
            <p className="text-xs md:text-sm text-gray-500 mb-6">Increment 1 Complete: Responsive Shell Initialized</p>
            <div className="flex gap-4 justify-center">
              <div className="px-4 py-2 bg-gray-800 rounded border border-gray-700 text-xs text-gray-400 flex items-center gap-2">
                <Zap className="w-3 h-3 text-yellow-500" /> React 19 Loaded
              </div>
              <div className="px-4 py-2 bg-gray-800 rounded border border-gray-700 text-xs text-gray-400">
                Mobile-First Ready
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}