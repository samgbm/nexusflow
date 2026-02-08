import { type GeoLocation, type AgentNode } from './types';

/**
 * ==========================================
 * STATIC DATA & CONFIGURATION
 * ==========================================
 */


// --- REAL-WORLD CONSTANTS ---
const LOCATIONS: Record<string, GeoLocation> = {
    SHANGHAI: { code: 'CN SHA', name: 'Shanghai Port', lat: 31.23, lon: 121.47 },
    ROTTERDAM: { code: 'NL RTM', name: 'Port of Rotterdam', lat: 51.92, lon: 4.47 },
    HAMBURG: { code: 'DE HAM', name: 'Port of Hamburg', lat: 53.54, lon: 9.99 },
    KAOHSIUNG: { code: 'TW KHH', name: 'Kaohsiung Port', lat: 22.62, lon: 120.27 },
    BUSAN: { code: 'KR PUS', name: 'Busan Port', lat: 35.10, lon: 129.04 },
    FREMONT: { code: 'US SJC', name: 'Fremont Factory', lat: 37.54, lon: -121.98 }
  };
  

  
// Added X/Y Coordinates for Graph Visualization

// --- NANDA AGENT SEED DATA ---
export const INITIAL_AGENTS: AgentNode[] = [
    {
      id: 'buyer-01', type: 'buyer', label: 'Tesla Procurement', status: 'idle',
      x: 400, y: 80,

      facts: {
        identity: { did: 'did:nanda:tesla_procure_x', role: 'buyer' },
        capabilities: ['procurement', 'contract_signing', 'payment_swift'],
        context: { jurisdiction: 'US', currency: 'USD', location: LOCATIONS.FREMONT },
        endpoint: 'mcp://buyer.tesla.ai'
      }
    },
    {
      id: 'supplier-a', type: 'supplier', label: 'TSMC (Taiwan)', status: 'idle',
      x: 200, y: 350,
      facts: {
        identity: { did: 'did:nanda:tsmc_fab_12', role: 'supplier' },
        capabilities: ['semiconductors', 'automotive_chips', 'iso_26262'],
        context: { jurisdiction: 'TW', location: LOCATIONS.KAOHSIUNG },
        endpoint: 'mcp://fab12.tsmc.com'
      }
    },
    {
      id: 'supplier-b', type: 'supplier', label: 'Posco (Korea)', status: 'idle',
      x: 600, y: 350,
      facts: {
        identity: { did: 'did:nanda:posco_busan', role: 'supplier' },
        capabilities: ['steel_rolling', 'high_tensile'],
        context: { jurisdiction: 'KR', location: LOCATIONS.BUSAN },
        endpoint: 'mcp://api.posco.co.kr'
      }
    },
    {
      id: 'logistics-a', type: 'logistics', label: 'Maersk Global', status: 'idle',
      x: 400, y: 550,
      facts: {
        identity: { did: 'did:nanda:maersk_line', role: 'logistics' },
        capabilities: ['sea_freight', 'customs_brokerage'],
        context: { jurisdiction: 'GLOBAL', fleet: 'Triple-E Class' },
        endpoint: 'mcp://api.maersk.com/booking'
      }
    },
    {
      id: 'logistics-b', type: 'logistics', label: 'DHL Global Freight', status: 'idle',
      x: 600, y: 550,
      facts: {
        identity: { did: 'did:nanda:dhl_global_freight', role: 'logistics' },
        capabilities: ['global_freight', 'customs_clearance', 'delivery_tracking'],
        context: { jurisdiction: 'DE', location: LOCATIONS.HAMBURG },
        endpoint: 'mcp://logistics.dhl.com'
      }
    },
    {
      id: 'supplier-c', type: 'supplier', label: 'Hyundai Motor (Korea)', status: 'idle',
      x: 800, y: 350,
      facts: {
        identity: { did: 'did:nanda:hyundai_auto_01', role: 'supplier' },
        capabilities: ['automotive_components', 'battery_systems', 'ev_platforms', 'automotive_chips'],
        context: { jurisdiction: 'KR', location: LOCATIONS.BUSAN },
        endpoint: 'mcp://auto01.hyundai.com'
      }
    }
  ];
  