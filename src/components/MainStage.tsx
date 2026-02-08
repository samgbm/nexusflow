import React, { useState } from 'react';
import { Globe, Settings, Search, Zap, AlertTriangle, Server, Cpu, Box, Truck, Activity, Share2, FileCode } from 'lucide-react';
// import { globalRegistry } from '../services/Registry';
import type { AgentNode, AgentRole, AgentEdge } from '../types';



interface MainStageProps {
  nodes: AgentNode[]; // New Prop: Nodes to render
  edges: AgentEdge[]; // NEW: Edges Prop
  registryCount: number;
  onTestRegistry: () => void;
  onToggleInspector: () => void;
  onSelectNode: (node: AgentNode) => void; // New Prop: Selection handler
  onTestConnection: () => void; // New prop for testing
  onTestMCP: () => void; // New prop for testing
  onCycleStatus: () => void; // New prop for testing
  selectedNodeId: string | null; // New Prop: Visual selection state
  isInspectorOpen: boolean;
}

export function MainStage({
  nodes,
  edges,
  registryCount,
  onTestRegistry,
  onToggleInspector,
  onSelectNode,
  onTestConnection,
  selectedNodeId,
  onCycleStatus,
  onTestMCP,
  isInspectorOpen
}: MainStageProps) {
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
              <div className="absolute top-10 right-0 w-64 bg-[#141418] border border-gray-700 rounded shadow-xl p-4 z-50">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-2">Debug Actions</h3>
                <button
                  onClick={onTestRegistry}
                  className="w-full text-xs bg-gray-800 hover:bg-gray-700 text-white p-2 rounded border border-gray-600 mb-2 flex items-center gap-2 justify-center"
                >
                  <Search className="w-3 h-3" /> Test Registry
                </button>

                <button
                  onClick={onCycleStatus}
                  className="w-full text-xs bg-gray-800 hover:bg-gray-700 text-white p-2 rounded border border-gray-600 flex items-center gap-2 justify-center"
                >
                  <Activity className="w-3 h-3 text-yellow-500" /> Cycle Visuals
                </button>
                <button
                  onClick={onTestConnection}
                  className="w-full text-xs bg-gray-800 hover:bg-gray-700 text-white p-2 rounded border border-gray-600 flex items-center gap-2 justify-center"
                >
                  <Share2 className="w-3 h-3 text-blue-500" /> Test Edge
                </button>
                {/* NEW BUTTON */}
                <button 
                  onClick={onTestMCP}
                  className="w-full text-xs bg-gray-800 hover:bg-gray-700 text-white p-2 rounded border border-gray-600 flex items-center gap-2 justify-center"
                >
                  <FileCode className="w-3 h-3 text-green-500" /> Test MCP
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>


        {/* CONTROLS OVERLAY */}
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


        {/* --- INCREMENT 8: SVG EDGE LAYER --- */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <marker id="arrow-query" markerWidth="10" markerHeight="10" refX="22" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
            </marker>
            <marker id="arrow-contract" markerWidth="10" markerHeight="10" refX="22" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#10b981" />
            </marker>
            <marker id="arrow-reject" markerWidth="10" markerHeight="10" refX="22" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
            </marker>
          </defs>
          {edges.map((edge) => {
            const source = nodes.find(n => n.id === edge.from);
            const target = nodes.find(n => n.id === edge.to);
            if (!source || !target) return null;

            // Center offsets: Node is 56px wide (w-14), center is 28px
            const x1 = source.x + 28;
            const y1 = source.y + 28;
            const x2 = target.x + 28;
            const y2 = target.y + 28;

            const styles = getEdgeStyles(edge.type);

            return (
              <g key={edge.id}>
                <path
                  d={`M${x1},${y1} L${x2},${y2}`}
                  stroke={styles.color}
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={styles.dash}
                  markerEnd={`url(#${styles.marker})`}
                  className="animate-pulse" // Simple pulse for now, custom keyframes in future
                />
                {edge.label && (
                  <g>
                    <rect
                      x={(x1 + x2) / 2 - 20}
                      y={(y1 + y2) / 2 - 10}
                      width="40"
                      height="20"
                      rx="4"
                      fill="#050507"
                      stroke={styles.color}
                    />
                    <text
                      x={(x1 + x2) / 2}
                      y={(y1 + y2) / 2 + 4}
                      textAnchor="middle"
                      fontSize="9"
                      fill={styles.color}
                      className="font-mono uppercase font-bold"
                    >
                      {edge.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>



        {/* GRAPH NODES (Increment 6) */}
        <div className="absolute inset-0 z-0">
          {nodes.map(node => {
            const { base, ping, border } = getNodeVisuals(node.status);
            return (
              <div
                key={node.id}
                style={{ top: node.y, left: node.x }}
                className={`absolute w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all duration-500 z-10 cursor-pointer group shadow-2xl hover:scale-110
                  ${base}
                  ${selectedNodeId === node.id ? 'ring-2 ring-white scale-110 shadow-blue-500/50' : ''}
              `}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNode(node);
                }}
              >
                {node.status !== 'idle' && (
                  <div className={`absolute -inset-2 rounded-xl opacity-30 animate-ping ${ping}`}></div>
                )}
                {/* Node Icon */}
                <AgentIcon type={node.type} className={border} />

                {/* Node Label */}
                <div className="absolute -bottom-8 w-40 text-center text-[10px] font-bold text-gray-500 group-hover:text-gray-300 transition-colors bg-black/80 rounded px-2 py-1 backdrop-blur-sm -translate-x-1/2 left-1/2 border border-white/10 pointer-events-none">
                  {node.label}
                  <div className="text-[9px] text-gray-600 font-normal">{node.status.toUpperCase()}</div>
                </div>
              </div>
            );
          })}
        </div>


        {/* Empty State / Registry Counter */}
        {nodes.length === 0 && (
          <div className="z-0 text-center pointer-events-none opacity-50">
            <h2 className="text-4xl font-bold text-gray-700 tracking-tighter">REGISTRY ONLINE</h2>
            <p className="text-sm text-gray-600 font-mono mt-2">{registryCount} Verified Agents</p>
          </div>
        )}
      </div>

      {/* Toggle Inspector Button */}
      <button
        onClick={onToggleInspector}
        className="fixed bottom-4 right-4 z-50 bg-gray-800 p-2 rounded-full text-xs text-gray-400 border border-gray-700 hover:text-white shadow-lg"
      >
        <Search className="w-4 h-4" />
      </button>
    </div>
  );
}


// --- Helpers ---


function MetricPlaceholder({ label }: { label: string }) {
  return (
    <div className="text-right">
      <div className="text-[9px] uppercase text-gray-500 font-bold tracking-wider mb-0.5">{label}</div>
      <div className="h-4 w-16 bg-gray-800/50 rounded animate-pulse"></div>
    </div>
  );
}

// Enhanced Visual Logic for Increment 7
function getNodeVisuals(status: AgentNode['status']) {
  switch (status) {
    case 'idle':
      return { base: 'bg-[#1a1a20] border-gray-600 text-gray-500', ping: 'hidden', border: 'text-gray-500' };
    case 'working':
      return { base: 'bg-blue-950/80 border-blue-400 text-blue-200 shadow-[0_0_20px_rgba(59,130,246,0.5)]', ping: 'bg-blue-500', border: 'text-blue-400' };
    case 'negotiating':
      return { base: 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.5)]', ping: 'bg-amber-500', border: 'text-amber-400' };
    case 'success':
      return { base: 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.5)]', ping: 'hidden', border: 'text-emerald-400' };
    case 'error':
      return { base: 'bg-red-950/80 border-red-500 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse', ping: 'bg-red-500', border: 'text-red-400' };
    default:
      return { base: 'bg-gray-800 border-gray-600', ping: 'hidden', border: 'text-gray-500' };
  }
}

function getEdgeStyles(type: AgentEdge['type']) {
  switch (type) {
    case 'query': return { color: '#3b82f6', dash: '5,5', marker: 'arrow-query' }; // Blue Dashed
    case 'negotiate': return { color: '#f59e0b', dash: '2,2', marker: 'arrow-query' }; // Amber Tight Dash
    case 'contract': return { color: '#10b981', dash: '0', marker: 'arrow-contract' }; // Green Solid
    case 'logistics': return { color: '#f97316', dash: '10,5', marker: 'arrow-query' }; // Orange Long Dash
    case 'reject': return { color: '#ef4444', dash: '2,2', marker: 'arrow-reject' }; // Red
    default: return { color: '#6b7280', dash: '0', marker: 'arrow-query' };
  }
}


function AgentIcon({ type, className }: { type: AgentRole, className?: string }) {
  const props = { className: `w-6 h-6 ${className}` };
  switch (type) {
    case 'buyer': return <Box {...props} />;
    case 'supplier': return <Cpu {...props} />;
    case 'logistics': return <Truck {...props} />;
    default: return <Server {...props} />;
  }
}