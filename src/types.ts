// --- 1. NANDA TYPE DEFINITIONS ---
/**
 * ==========================================
 * NANDA TYPE DEFINITIONS
 * ==========================================
 * Shared interfaces for the Supply Chain OS.
 */

export type AgentRole = 'buyer' | 'supplier' | 'logistics';

export interface GeoLocation {
  code: string; // UN/LOCODE
  name: string;
  lat: number;
  lon: number;
}

export interface AgentIdentity {
  did: string; // Decentralized Identifier
  role: AgentRole;
}

export interface AgentContext {
  jurisdiction: string;
  currency?: string;
  location?: GeoLocation;
  fleet?: string;
}

export interface AgentFacts {
  identity: AgentIdentity;
  capabilities: string[];
  context: AgentContext;
  endpoint: string;
}

export interface AgentNode {
  id: string;
  type: AgentRole;
  label: string;
  status: 'idle' | 'working' | 'negotiating' | 'success' | 'error';
  facts: AgentFacts;
  // Visual Coordinates (Increment 6)
  x: number;
  y: number;
}

// INCREMENT 8: Edge Definition
export interface AgentEdge {
  id: string;
  from: string; // Agent Node ID
  to: string;   // Agent Node ID
  type: 'query' | 'negotiate' | 'contract' | 'logistics' | 'reject';
  label?: string;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  agentId: string;
  text: string;
  type: 'info' | 'success' | 'error' | 'warning' | 'query' | 'action';
  mcpPayload?: MCPMessage; // Updated to use strict MCP type
}

export interface RegistryQuery {
  role?: AgentRole;
  capability?: string;
  jurisdiction?: string;
}

// --- INCREMENT 9: MCP (Model Context Protocol) JSON-RPC 2.0 ---

export interface MCPJsonRpc {
  jsonrpc: "2.0";
  id: string | number;
}

export interface MCPRequest extends MCPJsonRpc {
  method: string;
  params: Record<string, any>;
}

export interface MCPResponse extends MCPJsonRpc {
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export type MCPMessage = MCPRequest | MCPResponse;