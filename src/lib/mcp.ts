import type { MCPRequest, MCPResponse } from '../types';

/**
 * Model Context Protocol (MCP) Factory
 * Generates standard JSON-RPC 2.0 envelopes for agent communication.
 */

export const MCP = {
  // Generate a Unique ID
  id: () => `req_${Date.now()}_${Math.floor(Math.random() * 1000)}`,

  // 1. Procurement Intent (Buyer -> Network)
  createIntent: (item: string, qty: number, deadline: string): MCPRequest => ({
    jsonrpc: "2.0",
    id: MCP.id(),
    method: "supply.procure",
    params: {
      item,
      qty,
      deadline,
      standards: ["ISO-26262", "AEC-Q100"]
    }
  }),

  // 2. Offer (Supplier -> Buyer)
  createOffer: (reqId: string | number, price: number, currency: string, leadTime: string): MCPResponse => ({
    jsonrpc: "2.0",
    id: reqId,
    result: {
      status: "accepted",
      quote: {
        price_per_unit: price,
        currency,
        incoterms: "FOB",
        lead_time_days: leadTime
      }
    }
  }),

  // 3. Logistics Booking (Supplier -> Logistics)
  createBooking: (origin: string, dest: string, weightKg: number): MCPRequest => ({
    jsonrpc: "2.0",
    id: MCP.id(),
    method: "logistics.book",
    params: {
      origin_locode: origin,
      dest_locode: dest,
      cargo_weight: weightKg,
      service_level: "express"
    }
  }),

  // 4. Error (Generic)
  createError: (reqId: string | number, code: number, message: string): MCPResponse => ({
    jsonrpc: "2.0",
    id: reqId,
    error: {
      code,
      message
    }
  })
};