import React, { useState } from 'react';
import { Activity, Server } from 'lucide-react';
import type { LogEntry } from '../types';

interface SidebarProps {
  logs: LogEntry[];
  booting: boolean;
}

export function Sidebar({ logs, booting }: SidebarProps) {
  // Local state to track which log is selected for inspection
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);

  // Find the selected log object
  const selectedLog = logs.find(l => l.id === selectedLogId);




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
            {/* <span className="text-[9px] text-gray-500 uppercase">Online</span> */}
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
            <div 
              key={log.id} 
              onClick={() => setSelectedLogId(log.id)}
              className={`p-2 rounded border transition-colors cursor-pointer group flex flex-col gap-1
                ${selectedLogId === log.id ? 'bg-white/10 border-gray-600' : 'hover:bg-white/5 border-transparent hover:border-gray-800'}
              `}
            >
              <div className="flex justify-between items-start">
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
              {/* Visual Indicator if Payload exists */}
              {log.mcpPayload && (
                <div className="mt-1 text-[9px] text-gray-500 font-mono flex items-center gap-1">
                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                   MCP Payload Attached
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Packet Inspector (Updated) */}
      <div className="h-48 border-t border-gray-800 bg-[#08080a] flex flex-col shrink-0">
         <div className="px-3 py-2 bg-[#0f0f12] border-b border-gray-800 text-[10px] font-bold text-gray-500 uppercase flex justify-between">
           <span>Packet Inspector (MCP)</span>
           <span className="text-gray-600 font-mono">{selectedLog ? `ID: ${selectedLog.id.toString().slice(-4)}` : 'IDLE'}</span>
         </div>
         <div className="flex-1 p-3 font-mono text-[10px] overflow-auto">
           {selectedLog ? (
             selectedLog.mcpPayload ? (
               <pre className="text-green-400 whitespace-pre-wrap">
                 {JSON.stringify(selectedLog.mcpPayload, null, 2)}
               </pre>
             ) : (
               <div className="text-gray-600 opacity-50 italic">
                 // No structured payload available for this entry.
               </div>
             )
           ) : (
             <div className="text-gray-600 opacity-50 flex flex-col gap-1">
               <span>// Select a log entry above to inspect headers.</span>
               <span>// Waiting for user selection...</span>
             </div>
           )}
         </div>
      </div>
    </div>
  );
}