import { type AgentFacts, type RegistryQuery } from '../types';

/**
 * ==========================================
 * AGENT REGISTRY SERVICE
 * ==========================================
 * Acts as the DNS (Decentralized Name Service) for agents.
 */

// --- 3. THE REGISTRY CLASS (Logic Layer) ---

export class AgentRegistry {
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

  
// Export a singleton instance
export const globalRegistry = new AgentRegistry();