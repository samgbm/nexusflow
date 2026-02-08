import React, { useState, useEffect, useCallback, useRef } from 'react';


import type { AgentNode, LogEntry, AgentRole, AgentEdge } from './types';
import { INITIAL_AGENTS } from './data';
import { globalRegistry } from './services/Registry';
import { GraphCanvas } from './components/GraphCanvas';

import { Sidebar } from './components/Sidebar';
import { MainStage } from './components/MainStage';
import { Inspector } from './components/Inspector';
import { MCP } from './lib/mcp';


/**
 * ==========================================
 * NEXUSFLOW MAIN SHELL
 * ==========================================
 * Integrates the Registry, Graph Engine, and UI Panels.
 */
// Async delay helper
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


export default function App() {
  const [nodes, setNodes] = useState<AgentNode[]>(INITIAL_AGENTS);
  const [edges, setEdges] = useState<AgentEdge[]>([]); // New State
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<AgentNode | null>(null);
  // const [showSettings, setShowSettings] = useState<boolean>(false);


  // INCREMENT 10: Orchestrator State
  const [isSimulating, setIsSimulating] = useState(false);


  // FIX: Use ref to prevent Strict Mode double-invocation of boot sequence
  const hasBooted = useRef(false);

  // Helper to add logs to the sidebar
  const addLog = useCallback((agentId: string, text: string, type: LogEntry['type'] = 'info', mcpPayload?: any) => {
    setLogs(prev => [{
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 2 }),
      agentId,
      text,
      type,
      mcpPayload // Now supported
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
    // setTimeout(() => {
    //   addLog('test', 'Running Self-Test: Find "Supplier" in "TW"', 'query');
    //   const results = globalRegistry.find({ role: 'supplier', jurisdiction: 'TW' });
      
    //   if (results.length > 0) {
    //     addLog('test', `PASSED: Found ${results[0].identity.did} (${results[0].context.location?.name})`, 'success');
    //   } else {
    //     addLog('test', 'FAILED: No agents found matching criteria.', 'error');
    //   }
    // }, 800);

  }, [addLog]);

  // --- HELPERS ---
  const updateNodeStatus = (id: string, status: AgentNode['status']) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, status } : n));
  };

  // --- ORCHESTRATOR: STEP 1 (INTENT) ---
  const runSimulation = async () => {
    if (isSimulating) return; // Prevent double trigger
    setIsSimulating(true);

    // 1. Reset Scene
    // ==========================================
    // STEP 1: INITIALIZATION & INTENT
    // ==========================================
    setEdges([]);
    setNodes(INITIAL_AGENTS.map(n => ({ ...n, status: 'idle' })));
    addLog('system', 'Simulation Sequence Initiated...', 'info');
    await wait(600);

    // 2. Buyer Intent
    const intentPacket = MCP.createIntent('ECU-Control-Unit', 5000, '2026-03-01');
    addLog('buyer-01', 'Broadcast Intent: REQUIRE [ECU-Control-Unit] QTY:5k', 'query', intentPacket);
    updateNodeStatus('buyer-01', 'working');


    await wait(1200);

    // ==========================================
    // STEP 2: DISCOVERY (REGISTRY LOOKUP)
    // ==========================================
    // End Step 1 for now
    // We will auto-advance to Discovery in Increment 11
    // setIsSimulating(false); // Keep it true for now as if it's processing
    addLog('network', 'NANDA Discovery: Resolving "automotive_chips" + "supplier"...', 'action');
    await wait(1000);

    // 2a. Query Registry
    const candidates = globalRegistry.find({ role: 'supplier', capability: 'automotive_chips' });
    
    addLog('network', `Registry returned ${candidates.length} matches.`, 'success', {
      query: "capability:automotive_chips",
      candidates: candidates.map(c => c.identity.did)
    });

    // 2b. Draw Edges to Candidates
    const newEdges = candidates.map((candidate, index) => {
      // Find the visual node ID that corresponds to the NANDA DID
      const targetNode = INITIAL_AGENTS.find(n => n.facts.identity.did === candidate.identity.did);
      if (!targetNode) return null;

      return {
        id: `edge-query-${index}-${Date.now()}`,
        from: 'buyer-01',
        to: targetNode.id,
        type: 'query' as const,
        label: 'RFQ'
      };
    }).filter((e) => e !== null);

    setEdges(newEdges);

    // 2c. Update Candidate Status to "Negotiating" (Visual Feedback)
    candidates.forEach(c => {
       const node = INITIAL_AGENTS.find(n => n.facts.identity.did === c.identity.did);
       if(node) updateNodeStatus(node.id, 'negotiating');
    });

    // End of Increment 11 - Pause here to let user see the discovery state
    setIsSimulating(false); // Re-enable button for now (will automate in next increments)
  };

  // --- HANDLERS ---
  const handleTestRegistry = () => {
    addLog('test', 'Manual Registry Check...', 'query');
    setTimeout(() => {
       const count = globalRegistry.count();
       addLog('test', `Registry Status: ${count} agents online.`, 'success');
    }, 500);
  };

  const handleToggleInspector = () => {
    const newState = !isInspectorOpen;
    setIsInspectorOpen(newState);
    if (newState && !selectedNode) {
      setSelectedNode(nodes[0]); // Default to first node if none selected
    }
  };

  const handleSelectNode = (node: AgentNode) => {
    setSelectedNode(node);
    setIsInspectorOpen(true);
    addLog('ui', `User inspected agent: ${node.label}`, 'info');
  };


  // NEW: Debugging tool to verify visual states
  const handleCycleStatus = () => {
    setNodes(prev => prev.map(n => {
      let nextStatus: AgentNode['status'] = 'idle';
      if (n.status === 'idle') nextStatus = 'working';
      else if (n.status === 'working') nextStatus = 'negotiating';
      else if (n.status === 'negotiating') nextStatus = 'success';
      else if (n.status === 'success') nextStatus = 'error';
      else nextStatus = 'idle';
      return { ...n, status: nextStatus };
    }));
    addLog('debug', 'Cycled all node statuses for visual verification.', 'warning');
  };

  // NEW: Debug edge rendering
  const handleTestConnection = () => {
    // Connect Buyer -> Supplier A
    const newEdge: AgentEdge = {
      id: `edge-${Date.now()}`,
      from: 'buyer-01',
      to: 'supplier-a',
      type: 'query',
      label: 'RFQ-101'
    };
    
    setEdges(prev => {
      // Clear if exists (toggle effect)
      if (prev.length > 0) {
        addLog('debug', 'Cleared test edges.', 'info');
        return [];
      }
      addLog('debug', 'Drawing test edge: Buyer -> Supplier A', 'action');
      return [newEdge];
    });
  };

  // NEW: Debug MCP Packet
  const handleTestMCP = () => {
    const packet = MCP.createIntent('ECU-Control-Unit', 5000, '2026-03-01');
    addLog('buyer-01', 'Broadcast Intent: REQUIRE [ECU-Control-Unit] QTY:5k', 'query', packet);
  };
  


  return (  
    // 'bg-[#050507]': "Deep Space" background
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-[#050507] text-gray-300 font-sans overflow-hidden selection:bg-blue-500/30">      
     
      {/* 1. LEFT: Logs & Protocol */}
      <Sidebar logs={logs} booting={!hasBooted.current} />
   
      {/* 2. CENTER: Graph & Controls */}
      <MainStage 
        nodes={nodes}
        edges={edges}
        registryCount={globalRegistry.count()} 
        onTestRegistry={handleTestRegistry}
        onToggleInspector={handleToggleInspector}
        onSelectNode={handleSelectNode}
        onCycleStatus={handleCycleStatus}
        onTestConnection={handleTestConnection}
        onTestMCP={handleTestMCP}
        
        onStartSimulation={runSimulation}
        isSimulating={isSimulating}

        selectedNodeId={selectedNode?.id || null}
        isInspectorOpen={isInspectorOpen}
      />
   
      {/* 3. RIGHT: Inspector Overlay */}
      {isInspectorOpen && selectedNode && (
        <Inspector 
          node={selectedNode} 
          onClose={() => setIsInspectorOpen(false)} 
        />
      )}
    </div>
  );
}

