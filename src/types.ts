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
}

export interface LogEntry {
  id: number;
  timestamp: string;
  agentId: string;
  text: string;
  type: 'info' | 'success' | 'error' | 'warning' | 'query';
  mcpPayload?: any;
}

export interface RegistryQuery {
  role?: AgentRole;
  capability?: string;
  jurisdiction?: string;
}