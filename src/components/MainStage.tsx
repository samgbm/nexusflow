import React, { useState } from 'react';
import { Globe, Settings, Search, Zap, AlertTriangle, Server, Cpu, Box, Truck } from 'lucide-react';
import { globalRegistry } from '../services/Registry';

interface MainStageProps {
  registryCount: number;
  onTestRegistry: () => void;
  onToggleInspector: () => void;
  isInspectorOpen: boolean;
}

export function MainStage({ registryCount, onTestRegistry, onToggleInspector, isInspectorOpen }: MainStageProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex-1 flex flex-col relative min-h-0 bg-[#050507]">
      {/* Top Bar */}
      <div className="h-12 md:h-14 border-b border-gray-800 flex items-center justify-between px-4 md:px-6 bg-[#0a0a0c] shrink-0 z-20">
        <div className="flex items-center gap-3">
           <div className="p-1.5 bg-blue-500/10 rounded border border-blue-500/30">
             <Globe className="w-4 h-4 text-blue-400" />
           </div>
           <div>
             <h1 className="text-xs md:text-sm font-bold text-gray-200 tracking-tight leading-none">
               NexusFlow <span className="text-gray-600 font-normal hidden sm:inline">| Supply OS</span>
             </h1>
           </div>
        </div>
        
        <div className="flex gap-4 md:gap-8">
           <MetricPlaceholder label="Volume" />
           <MetricPlaceholder label="Active Nodes" />
           <MetricPlaceholder label="Carbon" />
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded transition-colors ${showSettings ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 text-gray-500'}`}
          >
             <Settings className="w-4 h-4" />
          </button>
          {showSettings && (
            <div className="absolute top-10 right-0 w-64 bg-[#141418] border border-gray-700 rounded shadow-xl p-4 z-50">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-2">Debug Actions</h3>
              <button 
                onClick={onTestRegistry}
                className="w-full text-xs bg-gray-800 hover:bg-gray-700 text-white p-2 rounded border border-gray-600 mb-2 flex items-center gap-2 justify-center"
              >
                <Search className="w-3 h-3" /> Test Registry
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="absolute top-4 left-4 z-10 w-64 md:w-72 pointer-events-none">
          <div className="bg-[#0f0f12]/90 backdrop-blur border border-gray-800 p-4 rounded-lg shadow-2xl pointer-events-auto">
            <div className="text-[10px] font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
              <Zap className="w-3 h-3 text-yellow-500" />
              Orchestration
            </div>
            <div className="h-10 bg-gray-800/50 border border-gray-700 border-dashed rounded flex items-center justify-center text-xs text-gray-600 cursor-not-allowed">
              System Ready (Idle)
            </div>
            <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between">
               <span className="text-[10px] text-gray-500 flex items-center gap-1">
                 <AlertTriangle className="w-3 h-3" /> Resilience Test
               </span>
               <div className="w-8 h-4 bg-gray-800 rounded-full border border-gray-700"></div>
            </div>
          </div>
        </div>
        
        <div className="z-0 text-center pointer-events-none opacity-50">
           <h2 className="text-4xl font-bold text-gray-700 tracking-tighter">REGISTRY ONLINE</h2>
           <p className="text-sm text-gray-600 font-mono mt-2">{registryCount} Verified Agents</p>
        </div>
      </div>

      {/* Toggle Inspector Button */}
      <button 
        onClick={onToggleInspector}
        className="fixed bottom-4 right-4 z-50 bg-gray-800 p-2 rounded-full text-xs text-gray-400 border border-gray-700 hover:text-white shadow-lg"
      >
        <Search className="w-4 h-4"/>
      </button>
    </div>
  );
}

function MetricPlaceholder({ label }: { label: string }) {
  return (
    <div className="text-right">
      <div className="text-[9px] uppercase text-gray-500 font-bold tracking-wider mb-0.5">{label}</div>
      <div className="h-4 w-16 bg-gray-800/50 rounded animate-pulse"></div>
    </div>
  );
}


  
function Label({ children }: { children: React.ReactNode }) {
    return <div className="text-[10px] uppercase text-gray-500 font-bold mb-2 flex items-center gap-1">{children}</div>;
}
  
function AgentIcon({ type }: { type: string }) {
    switch(type) {
      case 'buyer': return <Box className="w-6 h-6 text-blue-400" />;
      case 'supplier': return <Cpu className="w-6 h-6 text-purple-400" />;
      case 'logistics': return <Truck className="w-6 h-6 text-orange-400" />;
      default: return <Server className="w-6 h-6" />;
    }
}