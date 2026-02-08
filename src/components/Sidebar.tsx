import React from 'react';
import { Activity, Server } from 'lucide-react';
import type { LogEntry } from '../types';

interface SidebarProps {
  logs: LogEntry[];
  booting: boolean;
}

export function Sidebar({ logs, booting }: SidebarProps) {
  return (
    <div className="w-full h-[300px] md:w-[420px] md:h-full border-b md:border-b-0 md:border-r border-gray-800 flex flex-col bg-[#0a0a0c] shrink-0 z-20">
      {/* Header */}
      <div className="h-10 md:h-14 border-b border-gray-800 flex items-center px-4 bg-[#0f0f12] shrink-0 justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Protocol Stream</span>
        </div>
        {/* Status Indicator (Pulse) */}
        <div className="ml-auto flex gap-2 items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[9px] text-gray-500 uppercase">Online</span>
          </div>
      </div>
      
      {/* Log Stream */}
      <div className="flex-1 overflow-y-auto p-2 bg-[#0a0a0c] relative scrollbar-thin scrollbar-thumb-gray-800">
        {logs.length === 0 && booting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 pointer-events-none">
            <Server className="w-12 h-12 text-gray-500 mb-2" />
            <span className="text-[10px] font-mono text-gray-500">BOOTING NANDA KERNEL...</span>
          </div>
        )}
        
        <div className="space-y-2">
          {logs.map(log => (
            <div key={log.id} className="p-2 rounded hover:bg-white/5 border border-transparent hover:border-gray-800 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-1">
                <span className={`font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                   log.agentId === 'system' || log.agentId === 'test' ? 'bg-purple-900/20 border-purple-800 text-purple-400' : 'bg-blue-900/20 border-blue-800 text-blue-400'
                }`}>
                  {log.agentId}
                </span>
                <span className="font-mono text-[9px] text-gray-600">{log.timestamp}</span>
              </div>
              <div className={`text-xs font-mono leading-relaxed ${
                log.type === 'error' ? 'text-red-400' : 
                log.type === 'success' ? 'text-emerald-400' : 
                log.type === 'query' ? 'text-yellow-400' : 
                'text-gray-300'
              }`}>
                {log.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Packet Inspector */}
      <div className="h-48 border-t border-gray-800 bg-[#08080a] flex flex-col shrink-0">
         <div className="px-3 py-2 bg-[#0f0f12] border-b border-gray-800 text-[10px] font-bold text-gray-500 uppercase flex justify-between">
           <span>Packet Inspector (MCP)</span>
           <span className="text-gray-600 font-mono">IDLE</span>
         </div>
         <div className="flex-1 p-3 font-mono text-[10px] text-green-500/50 overflow-auto">
           <span className="opacity-50">System Idle. No active packets.</span>
         </div>
      </div>
    </div>
  );
}