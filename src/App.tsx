import React, { useState, useEffect, useCallback, useRef } from 'react';


import type { AgentNode, LogEntry, AgentRole } from './types';
import { INITIAL_AGENTS } from './data';
import { globalRegistry } from './services/Registry';
import { GraphCanvas } from './components/GraphCanvas';

import { Sidebar } from './components/Sidebar';
import { MainStage } from './components/MainStage';
import { Inspector } from './components/Inspector';


/**
 * ==========================================
 * NEXUSFLOW MAIN SHELL
 * ==========================================
 * Integrates the Registry, Graph Engine, and UI Panels.
 */


export default function App() {
  const [nodes, setNodes] = useState<AgentNode[]>(INITIAL_AGENTS);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<AgentNode | null>(null);
  // const [showSettings, setShowSettings] = useState<boolean>(false);

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

  return (
    // 1. GLOBAL CONTAINER
    // 'flex flex-col md:flex-row': Stack vertically on mobile, horizontally on desktop (md+)
    // 'h-screen': Fixed height (no window scroll)
    // 'bg-[#050507]': "Deep Space" background
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-[#050507] text-gray-300 font-sans overflow-hidden selection:bg-blue-500/30">
      
      {/* --- 2. LEFT SIDEBAR: PROTOCOL STREAM --- */}
      {/* Mobile: Full width, fixed height (250px) to show logs without hiding graph */}
      {/* Desktop: Fixed width (420px), full height */}
      {/* 1. LEFT: Logs & Protocol */}
      <Sidebar logs={logs} booting={!hasBooted.current} />


      {/* --- 3. RIGHT AREA: MAIN STAGE --- */}
      {/* 'flex-1': Take remaining space */}
      {/* 'min-h-0': Crucial for nested flex scrolling */}
      {/* 2. CENTER: Graph & Controls */}
      <MainStage 
        registryCount={globalRegistry.count()} 
        onTestRegistry={handleTestRegistry}
        onToggleInspector={handleToggleInspector}
        isInspectorOpen={isInspectorOpen}
        nodes={nodes}
        onSelectNode={handleSelectNode}
        selectedNodeId={selectedNode?.id ?? null}
      />

      {/* --- RIGHT REGION: INSPECTOR PANEL (Slide-Out) --- */}
      {/* Hidden by default, toggles via state in future increments */}
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

