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

  const updateEdgeType = (edgeId: string, type: AgentEdge['type'], label?: string) => {
    setEdges(prev => prev.map(e => e.id === edgeId ? { ...e, type, label: label || e.label } : e));
  };

  // --- ORCHESTRATOR ---
  const runSimulation = async () => {
    if (isSimulating) return;
    setIsSimulating(true);

    // ==========================================
    // STEP 1: INITIALIZATION & INTENT
    // ==========================================
    setEdges([]);
    setNodes(INITIAL_AGENTS.map(n => ({ ...n, status: 'idle' })));
    addLog('system', 'Simulation Sequence Initiated...', 'info');
    await wait(600);

    const intentPacket = MCP.createIntent('ECU-Control-Unit', 5000, '2026-03-01');
    addLog('buyer-01', 'Broadcast Intent: REQUIRE [ECU-Control-Unit] QTY:5k', 'query', intentPacket);
    updateNodeStatus('buyer-01', 'working');
    await wait(1200);

    // ==========================================
    // STEP 2: DISCOVERY
    // ==========================================
    addLog('network', 'NANDA Discovery: Resolving "automotive_chips"...', 'action');
    await wait(1000);
    
    const candidates = globalRegistry.find({ role: 'supplier', capability: 'automotive_chips' });
    
    // FIX: Explicitly cast to AgentEdge to resolve TypeScript mismatch in filter predicate
    const queryEdges = candidates.map((candidate, index) => {
      const targetNode = INITIAL_AGENTS.find(n => n.facts.identity.did === candidate.identity.did);
      if (!targetNode) return null;
      
      const edge: AgentEdge = {
        id: `edge-${targetNode.id}`,
        from: 'buyer-01',
        to: targetNode.id,
        type: 'query',
        label: 'RFQ'
      };
      return edge;
    }).filter((e): e is AgentEdge => e !== null);
    
    setEdges(queryEdges);
    
    candidates.forEach(c => {
       const node = INITIAL_AGENTS.find(n => n.facts.identity.did === c.identity.did);
       if(node) updateNodeStatus(node.id, 'negotiating');
    });
    
    addLog('network', `Registry found ${candidates.length} suitable suppliers.`, 'success');
    await wait(1500);

    // ==========================================
    // STEP 3: DYNAMIC NEGOTIATION
    // ==========================================
    interface Proposal {
      nodeId: string;
      price: number;
      leadTime: string;
    }
    const proposals: Proposal[] = [];

    for (const candidate of candidates) {
      const node = INITIAL_AGENTS.find(n => n.facts.identity.did === candidate.identity.did);
      if (!node) continue;

      addLog(node.id, `Analyzing RFQ from Tesla...`, 'action');
      await wait(600); 

      const basePrice = 450;
      const priceModifier = node.id === 'supplier-a' ? 0 : 60; 
      const randomVar = Math.floor(Math.random() * 20);
      const finalPrice = basePrice + priceModifier + randomVar;
      const leadTime = node.id === 'supplier-a' ? '14 days' : '21 days';

      const offerPacket = MCP.createOffer(`req_${Date.now()}`, finalPrice, 'USD', leadTime);
      addLog(node.id, `Offer Generated: $${finalPrice}/unit.`, 'success', offerPacket);
      updateEdgeType(`edge-${node.id}`, 'negotiate', `OFFER $${finalPrice}`);
      proposals.push({ nodeId: node.id, price: finalPrice, leadTime });
      await wait(800);
    }

    if (proposals.length > 0) {
      addLog('buyer-01', `Evaluating ${proposals.length} proposals...`, 'action');
      await wait(1000);

      proposals.sort((a, b) => a.price - b.price);
      const winner = proposals[0];
      const losers = proposals.slice(1);

      addLog('buyer-01', `Offer Accepted: ${winner.nodeId.toUpperCase()} ($${winner.price}).`, 'success');
      
      // FIX: Batch update all nodes to prevent race conditions and ensure losers reset to idle
      setNodes(prev => prev.map(n => {
        if (n.id === winner.nodeId) return { ...n, status: 'success' };
        if (n.id === 'buyer-01') return { ...n, status: 'success' };
        if (losers.some(l => l.nodeId === n.id)) return { ...n, status: 'idle' };
        return n;
      }));

      // Log decline for losers
      losers.forEach(loser => {
        addLog('buyer-01', `Declining offer from ${loser.nodeId}.`, 'info');
      });

      // Update edges: Set winner to contract, remove losers
      setEdges(prev => prev
        .map(e => e.id === `edge-${winner.nodeId}` ? { ...e, type: 'contract' as const, label: 'SIGNED' } : e)
        .filter(e => !losers.some(l => `edge-${l.nodeId}` === e.id))
      );
      
      await wait(1000);

      // ==========================================
      // STEP 4: LOGISTICS & SETTLEMENT
      // ==========================================
      addLog(winner.nodeId, 'Initiating Logistics Protocol...', 'action');
      await wait(800);

      const logisticsCandidates = globalRegistry.find({ role: 'logistics' });
      
      if (logisticsCandidates.length > 0) {
         const logisticsPartner = INITIAL_AGENTS.find(n => n.facts.identity.did === logisticsCandidates[0].identity.did);
         
         if (logisticsPartner) {
             const bookingPacket = MCP.createBooking(
                winner.nodeId === 'supplier-a' ? 'TW KHH' : 'KR PUS',
                'US SJC', 
                500
             );
             
             addLog(winner.nodeId, `Booking Freight: ${logisticsPartner.label}`, 'query', bookingPacket);
             
             // Draw Edge: Supplier -> Logistics
             setEdges(prev => [
                ...prev, 
                {
                    id: `edge-logistics-${Date.now()}`,
                    from: winner.nodeId,
                    to: logisticsPartner.id,
                    type: 'logistics',
                    label: 'FREIGHT'
                }
             ]);
             
             updateNodeStatus(logisticsPartner.id, 'working');
             await wait(1500);
             
             addLog(logisticsPartner.id, 'Shipment Confirmed. Waybill generated.', 'success', { waybill: 'MAEU998877', vessel: 'Emma Maersk' });
             updateNodeStatus(logisticsPartner.id, 'success');
             
             await wait(500);
             addLog('system', 'Transaction Cycle Complete. Escrow released.', 'success');
         }
      } else {
         addLog('system', 'CRITICAL: No Logistics Provider found in Registry.', 'error');
      }

    } else {
      addLog('buyer-01', 'No valid proposals received. Aborting.', 'error');
    }

    setIsSimulating(false);
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

