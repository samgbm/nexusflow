import React from 'react';
import { X, Box, Cpu, Truck, Server, MapPin, Link as LinkIcon } from 'lucide-react';
import type { AgentNode, AgentRole } from '../types';

interface InspectorProps {
  node: AgentNode;
  onClose: () => void;
}

export function Inspector({ node, onClose }: InspectorProps) {
  return (
    <div className="absolute right-0 top-0 h-full w-[350px] bg-[#0a0a0c] border-l border-gray-800 shadow-2xl z-30 animate-in slide-in-from-right duration-300 flex flex-col">
       <div className="h-14 border-b border-gray-800 flex items-center justify-between px-4 bg-[#0f0f12] shrink-0">
         <span className="text-xs font-bold uppercase text-gray-400">Agent Dossier</span>
         <button onClick={onClose}><X className="w-4 h-4 text-gray-500 hover:text-white" /></button>
       </div>
       <div className="p-6 overflow-y-auto">
         <div className="flex items-center gap-4 mb-6">
           <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center border border-gray-700">
              <AgentIcon type={node.type} />
           </div>
           <div>
              <h2 className="text-lg font-bold text-gray-200">{node.label}</h2>
              <div className="flex items-center gap-2 mt-1">
                 <span className="text-[10px] bg-blue-900/30 text-blue-400 px-1.5 py-0.5 rounded border border-blue-800 font-mono">
                   {node.facts.identity.role.toUpperCase()}
                 </span>
              </div>
           </div>
         </div>

         <div className="space-y-6">
           <div>
             <Label>NANDA Identity (DID)</Label>
             <div className="text-xs text-gray-300 font-mono break-all">{node.facts.identity.did}</div>
           </div>
           
           <div>
             <Label>Jurisdiction & Location</Label>
             <div className="flex items-center gap-2 text-xs text-gray-300">
               <MapPin className="w-3 h-3 text-gray-500" />
               {node.facts.context.location?.name || node.facts.context.jurisdiction}
             </div>
           </div>

           <div>
             <Label>Capabilities</Label>
             <div className="flex flex-wrap gap-2">
               {node.facts.capabilities.map(cap => (
                 <span key={cap} className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700">
                   {cap}
                 </span>
               ))}
             </div>
           </div>

           <div>
             <Label>MCP Endpoint</Label>
             <div className="flex items-center gap-2 text-xs text-gray-500 font-mono bg-black/40 p-2 rounded border border-gray-800">
               <LinkIcon className="w-3 h-3" />
               {node.facts.endpoint}
             </div>
           </div>
         </div>
       </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] uppercase text-gray-500 font-bold mb-2 flex items-center gap-1">{children}</div>;
}

function AgentIcon({ type }: { type: AgentRole }) {
  switch(type) {
    case 'buyer': return <Box className="w-6 h-6 text-blue-400" />;
    case 'supplier': return <Cpu className="w-6 h-6 text-purple-400" />;
    case 'logistics': return <Truck className="w-6 h-6 text-orange-400" />;
    default: return <Server className="w-6 h-6" />;
  }
}