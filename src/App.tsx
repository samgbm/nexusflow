import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Activity, 
  Globe, 
  Settings, 
  Server,
  Zap,
  Box,
  Cpu,
  Truck,
  X,
  Search,
  ChevronRight,
  Play,
  AlertTriangle,
  Link as LinkIcon,
  MapPin,
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

/**
 * ==========================================
 * INCREMENT 2: THE UI SKELETON ("High Density")
 * ==========================================
 * Goal: Define the internal layout regions for the "Bloomberg Terminal" look.
 * Structure:
 * 1. Sidebar (Left): Split into "Log Stream" (Flex-Grow) and "Packet Inspector" (Fixed Bottom).
 * 2. Main Stage (Center):
 * - Top Bar: Metrics & Controls.
 * - Graph Area: The infinite canvas for nodes.
 * - Controls Overlay: Floating panel for user actions.
 * 3. Inspector Panel (Right): Conditional slide-out for details.
 */


/**
 * ==========================================
 * INCREMENT 3: NANDA DATA MODELS & IDENTITY
 * ==========================================
 * Goal: Define the "AgentFacts" schema and populate the simulation with 4 distinct actors.
 * * NANDA Schema Implementation:
 * - Identity: DID (Decentralized Identifier)
 * - Role: The functional archetype (Buyer, Supplier, Logistics)
 * - Capabilities: What the agent can do (Semantic Search tags)
 * - Context: Geo-location (UN/LOCODE) and Jurisdiction
 */

/**
 * ==========================================
 * INCREMENT 4: AGENT REGISTRY & TYPESCRIPT
 * ==========================================
 * Goal: Implement the "DNS" for Agents using strict TypeScript definitions.
 * Features:
 * 1. Interfaces: Formal NANDA Schema definitions.
 * 2. AgentRegistry: Class for service discovery.
 * 3. Boot Sequence: Auto-register agents on startup.
 */

// --- 1. NANDA TYPE DEFINITIONS ---

type AgentRole = 'buyer' | 'supplier' | 'logistics';

interface GeoLocation {
  code: string; // UN/LOCODE
  name: string;
  lat: number;
  lon: number;
}

interface AgentIdentity {
  did: string; // Decentralized Identifier
  role: AgentRole;
}

interface AgentContext {
  jurisdiction: string;
  currency?: string;
  location?: GeoLocation;
  fleet?: string;
}

interface AgentFacts {
  identity: AgentIdentity;
  capabilities: string[];
  context: AgentContext;
  endpoint: string;
}

interface AgentNode {
  id: string;
  type: AgentRole;
  label: string;
  status: 'idle' | 'working' | 'negotiating' | 'success' | 'error';
  facts: AgentFacts;
}

interface LogEntry {
  id: number;
  timestamp: string;
  agentId: string;
  text: string;
  type: 'info' | 'success' | 'error' | 'warning' | 'query';
  mcpPayload?: any;
}

interface RegistryQuery {
  role?: AgentRole;
  capability?: string;
  jurisdiction?: string;
}

// --- REAL-WORLD CONSTANTS ---
const LOCATIONS: Record<string, GeoLocation> = {
  SHANGHAI: { code: 'CN SHA', name: 'Shanghai Port', lat: 31.23, lon: 121.47 },
  ROTTERDAM: { code: 'NL RTM', name: 'Port of Rotterdam', lat: 51.92, lon: 4.47 },
  HAMBURG: { code: 'DE HAM', name: 'Port of Hamburg', lat: 53.54, lon: 9.99 },
  KAOHSIUNG: { code: 'TW KHH', name: 'Kaohsiung Port', lat: 22.62, lon: 120.27 },
  BUSAN: { code: 'KR PUS', name: 'Busan Port', lat: 35.10, lon: 129.04 },
  FREMONT: { code: 'US SJC', name: 'Fremont Factory', lat: 37.54, lon: -121.98 }
};



// --- 3. THE REGISTRY CLASS (Logic Layer) ---

class AgentRegistry {
  private agents: AgentFacts[] = [];

  register(agentFacts: AgentFacts): boolean {
    // Prevent duplicate DIDs
    if (this.agents.find(a => a.identity.did === agentFacts.identity.did)) {
      return false;
    }
    this.agents.push(agentFacts);
    return true;
  }

  /**
   * Semantic Discovery: Finds agents matching partial criteria.
   * "Find a supplier in Taiwan that can handle semiconductors"
   */
  find(query: RegistryQuery): AgentFacts[] {
    return this.agents.filter(agent => {
      let match = true;
      if (query.role && agent.identity.role !== query.role) match = false;
      if (query.jurisdiction && agent.context.jurisdiction !== query.jurisdiction) match = false;
      if (query.capability && !agent.capabilities.includes(query.capability)) match = false;
      return match;
    });
  }

  count(): number {
    return this.agents.length;
  }

  clear(): void {
    this.agents = [];
  }
}

// Global Singleton for the Registry
const globalRegistry = new AgentRegistry();


const HS_CODES = {
  ECU: '8537.10.9170', // Electronic Control Units
  STEEL: '7210.49.00', // Flat-rolled steel
};


// --- NANDA AGENT SEED DATA ---
const INITIAL_AGENTS: AgentNode[] = [
  {
    id: 'buyer-01', type: 'buyer', label: 'Tesla Procurement', status: 'idle',
    facts: {
      identity: { did: 'did:nanda:tesla_procure_x', role: 'buyer' },
      capabilities: ['procurement', 'contract_signing', 'payment_swift'],
      context: { jurisdiction: 'US', currency: 'USD', location: LOCATIONS.FREMONT },
      endpoint: 'mcp://buyer.tesla.ai'
    }
  },
  {
    id: 'supplier-a', type: 'supplier', label: 'TSMC (Taiwan)', status: 'idle',
    facts: {
      identity: { did: 'did:nanda:tsmc_fab_12', role: 'supplier' },
      capabilities: ['semiconductors', 'automotive_chips', 'iso_26262'],
      context: { jurisdiction: 'TW', location: LOCATIONS.KAOHSIUNG },
      endpoint: 'mcp://fab12.tsmc.com'
    }
  },
  {
    id: 'supplier-b', type: 'supplier', label: 'Posco (Korea)', status: 'idle',
    facts: {
      identity: { did: 'did:nanda:posco_busan', role: 'supplier' },
      capabilities: ['steel_rolling', 'high_tensile'],
      context: { jurisdiction: 'KR', location: LOCATIONS.BUSAN },
      endpoint: 'mcp://api.posco.co.kr'
    }
  },
  {
    id: 'logistics-a', type: 'logistics', label: 'Maersk Global', status: 'idle',
    facts: {
      identity: { did: 'did:nanda:maersk_line', role: 'logistics' },
      capabilities: ['sea_freight', 'customs_brokerage'],
      context: { jurisdiction: 'GLOBAL', fleet: 'Triple-E Class' },
      endpoint: 'mcp://api.maersk.com/booking'
    }
  },
  {
    id: 'logistics-b', type: 'logistics', label: 'DHL Global Freight', status: 'idle',
    facts: {
      identity: { did: 'did:nanda:dhl_global_freight', role: 'logistics' },
      capabilities: ['global_freight', 'customs_clearance', 'delivery_tracking'],
      context: { jurisdiction: 'DE', location: LOCATIONS.HAMBURG },
      endpoint: 'mcp://logistics.dhl.com'
    }
  },
  {
    id: 'supplier-c', type: 'supplier', label: 'Hyundai Motor (Korea)', status: 'idle',
    facts: {
      identity: { did: 'did:nanda:hyundai_auto_01', role: 'supplier' },
      capabilities: ['automotive_components', 'battery_systems', 'ev_platforms'],
      context: { jurisdiction: 'KR', location: LOCATIONS.BUSAN },
      endpoint: 'mcp://auto01.hyundai.com'
    }
  }
];



export default function App() {
  const [nodes, setNodes] = useState<AgentNode[]>(INITIAL_AGENTS);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<AgentNode | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // FIX: Use ref to prevent Strict Mode double-invocation of boot sequence
  const hasBooted = useRef(false);

  // Helper to add logs to the sidebar
  const addLog = useCallback((agentId: string, text: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [{
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 2 }),
      agentId,
      text,
      type
    }, ...prev].slice(0, 50));
  }, []);

  // --- BOOT SEQUENCE (Increment 4) ---
  useEffect(() => {
    if (hasBooted.current) return;
    hasBooted.current = true;

    // 1. Register Agents (Idempotent)
    let registeredCount = 0;
    
    // Clear registry first to ensure clean state on HMR
    globalRegistry.clear();
    
    INITIAL_AGENTS.forEach(node => {
      if (globalRegistry.register(node.facts)) {
        registeredCount++;
      }
    });
    
    addLog('system', `NANDA Registry initialized. Registered ${registeredCount} agents via DID.`, 'success');

    // 2. Run Self-Test Query
    setTimeout(() => {
      addLog('test', 'Running Self-Test: Find "Supplier" in "TW"', 'query');
      const results = globalRegistry.find({ role: 'supplier', jurisdiction: 'TW' });
      
      if (results.length > 0) {
        addLog('test', `PASSED: Found ${results[0].identity.did} (${results[0].context.location?.name})`, 'success');
      } else {
        addLog('test', 'FAILED: No agents found matching criteria.', 'error');
      }
    }, 800);

  }, [addLog]);



  return (
    // 1. GLOBAL CONTAINER
    // 'flex flex-col md:flex-row': Stack vertically on mobile, horizontally on desktop (md+)
    // 'h-screen': Fixed height (no window scroll)
    // 'bg-[#050507]': "Deep Space" background
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-[#050507] text-gray-300 font-sans overflow-hidden selection:bg-blue-500/30">
      
      {/* --- 2. LEFT SIDEBAR: PROTOCOL STREAM --- */}
      {/* Mobile: Full width, fixed height (250px) to show logs without hiding graph */}
      {/* Desktop: Fixed width (420px), full height */}
      <div className="w-full h-[300px] md:w-[420px] md:h-full border-b md:border-b-0 md:border-r border-gray-800 flex flex-col bg-[#0a0a0c]">
        
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
        {/* LOG STREAM AREA (Flex Grow) */}
        {/* LOG STREAM */}
        <div className="flex-1 overflow-y-auto p-2 bg-[#0a0a0c] relative scrollbar-thin scrollbar-thumb-gray-800">
          {logs.length === 0 && !hasBooted.current && (
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 pointer-events-none">
              <Server className="w-12 h-12 text-gray-500 mb-2" />
              <span className="text-[10px] font-mono text-gray-500">AWAITING NANDA SIGNALS</span>
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

        {/* Bottom Panel Placeholder (Packet Inspector) */}
        {/* Hidden on very small screens to save space, visible on desktop */}
        {/* PACKET INSPECTOR (Fixed Height Bottom) */}
        <div className="h-48 border-t border-gray-800 bg-[#08080a] flex flex-col shrink-0">
           <div className="px-3 py-2 bg-[#0f0f12] border-b border-gray-800 text-[10px] font-bold text-gray-500 uppercase flex justify-between">
             <span>Packet Inspector (MCP)</span>
             <span className="text-gray-600 font-mono">IDLE</span>
           </div>
           <div className="flex-1 p-3 font-mono text-[10px] text-green-500/50 overflow-auto">
             // Raw JSON payloads will appear here...
             {/* Future increments will populate this */}
             <span className="opacity-50">System Idle. No active packets.</span>
           </div>
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
          {/* Metrics Grid */}
          <div className="flex gap-4 md:gap-8">
             <MetricPlaceholder label="Volume" />
             <MetricPlaceholder label="Active Nodes" />
             <MetricPlaceholder label="Carbon" />
          </div>
          
          {/* Settings Toggle */}
          <div className="relative">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded transition-colors ${showSettings ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 text-gray-500'}`}
            >
               <Settings className="w-4 h-4" />
            </button>
            {/* Settings Dropdown Placeholder */}
            {showSettings && (
              <div className="absolute top-10 right-0 w-64 bg-[#141418] border border-gray-700 rounded shadow-xl p-4 z-50">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-2">Debug Actions</h3>
                <button 
                  onClick={() => {
                    addLog('test', 'Manual Registry Check...', 'query');
                    setTimeout(() => {
                       const count = globalRegistry.count();
                       addLog('test', `Registry Status: ${count} agents online.`, 'success');
                    }, 500);
                  }}
                  className="w-full text-xs bg-gray-800 hover:bg-gray-700 text-white p-2 rounded border border-gray-600 mb-2 flex items-center gap-2 justify-center"
                >
                  <Search className="w-3 h-3" /> Test Registry
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Graph Area */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center">
          {/* Background Grid Effect using CSS Gradients */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
          
          {/* FLOATING CONTROLS OVERLAY (Top Left) */}
          <div className="absolute top-4 left-4 z-10 w-64 md:w-72 pointer-events-none">
            {/* We use pointer-events-auto on the child so clicks pass through the empty areas */}
            <div className="bg-[#0f0f12]/90 backdrop-blur border border-gray-800 p-4 rounded-lg shadow-2xl pointer-events-auto">
              <div className="text-[10px] font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                <Zap className="w-3 h-3 text-yellow-500" />
                Orchestration
              </div>
              
              {/* Simulation Trigger Button Placeholder */}
              <div className="h-10 bg-gray-800/50 border border-gray-700 border-dashed rounded flex items-center justify-center text-xs text-gray-600">
                [Play Button Placeholder]
              </div>
              
              {/* Resilience Toggle Placeholder */}
              <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between">
                 <span className="text-[10px] text-gray-500 flex items-center gap-1">
                   <AlertTriangle className="w-3 h-3" /> Resilience Test
                 </span>
                 <div className="w-8 h-4 bg-gray-800 rounded-full border border-gray-700"></div>
              </div>
            </div>
          </div>


          {/* Debug Visualization for Increment 3 */}
          <div className="z-0 text-center pointer-events-none opacity-50">
             <h2 className="text-4xl font-bold text-gray-700 tracking-tighter">REGISTRY ONLINE</h2>
             <p className="text-sm text-gray-600 font-mono mt-2">{globalRegistry.count()} Verified Agents</p>
          </div>


        </div>
      </div>

      {/* --- RIGHT REGION: INSPECTOR PANEL (Slide-Out) --- */}
      {/* Hidden by default, toggles via state in future increments */}
      {isInspectorOpen && selectedNode && (
        <div className="absolute right-0 top-0 h-full w-[350px] bg-[#0a0a0c] border-l border-gray-800 shadow-2xl z-30 animate-in slide-in-from-right duration-300">
           <div className="h-14 border-b border-gray-800 flex items-center justify-between px-4 bg-[#0f0f12]">
             <span className="text-xs font-bold uppercase text-gray-400">Agent Dossier</span>
             <button onClick={() => setIsInspectorOpen(false)}><X className="w-4 h-4 text-gray-500 hover:text-white" /></button>
           </div>
           
           <div className="p-6 overflow-y-auto">
             <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center border border-gray-700">
                  <AgentIcon type={selectedNode.type} />
               </div>
               <div>
                  <h2 className="text-lg font-bold text-gray-200">{selectedNode.label}</h2>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-[10px] bg-blue-900/30 text-blue-400 px-1.5 py-0.5 rounded border border-blue-800 font-mono">
                       {selectedNode.facts.identity.role.toUpperCase()}
                     </span>
                  </div>
               </div>
             </div>

             <div className="space-y-6">
               <div>
                 <Label>NANDA Identity (DID)</Label>
                 <div className="text-xs text-gray-300 font-mono break-all">{selectedNode.facts.identity.did}</div>
               </div>
               
               <div>
                 <Label>Jurisdiction & Location</Label>
                 <div className="flex items-center gap-2 text-xs text-gray-300">
                   <MapPin className="w-3 h-3 text-gray-500" />
                   {selectedNode.facts.context.location?.name || selectedNode.facts.context.jurisdiction}
                 </div>
               </div>

               <div>
                 <Label>Capabilities</Label>
                 <div className="flex flex-wrap gap-2">
                   {selectedNode.facts.capabilities.map(cap => (
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
                   {selectedNode.facts.endpoint}
                 </div>
               </div>
             </div>
           </div>






        </div>
      )}

      {/* Dev Tool: Temporary Toggle for Inspector */}
      <button 
        onClick={() => setIsInspectorOpen(!isInspectorOpen)}
        className="fixed bottom-4 right-4 z-50 bg-gray-800 p-2 rounded-full text-xs text-gray-400 border border-gray-700 hover:text-white"
      >
        {isInspectorOpen ? <ChevronRight className="w-4 h-4"/> : <Search className="w-4 h-4"/>}
      </button>

    </div>
  );
}

// Sub-component for clean Top Bar metrics
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