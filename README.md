# NexusFlow: The NANDA-Native Supply Chain OS 🌍📦

> **Winner - Hack-Nation 2026 (VC Big Bet Track)**
> *One Click AI Challenge: Supply Chain Agents*

![NEXUS FLOW dashboard](demo%20app%20image.png)

## 🚀 The Moonshot

Global supply chains (\$115T output) run on "antique" rails—emails, PDFs, and manual spreadsheets. **NexusFlow** upgrades this infrastructure to the "Internet of Agents."

It is an autonomous orchestration layer where AI agents discover partners, negotiate contracts, and execute logistics in real-time using the **NANDA Protocol** and **Model Context Protocol (MCP)**.

## ⚡ Key Features

### 1. NANDA Registry ("The Yellow Pages")

A semantic discovery layer where agents publish their `AgentFacts` (Identity, Capabilities, Location).

* **Tech:** In-memory vector-like search based on UN/LOCODE and ISO capability tags.

### 2. Autonomous Negotiation (MCP)

Agents communicate via structured JSON-RPC 2.0 packets to solicit bids and award contracts dynamically.

* **Protocol:** `supply.procure`, `supply.offer`, `logistics.book`.

### 3. Self-Healing Logistics

The system detects node failures (e.g., Port Strikes) and autonomously reroutes trade flows to alternative suppliers.

### 4. "God Mode" Visualization

A React-based dynamic graph engine that visualizes the "Invisible Hand" of the market in real-time.

## 🛠️ Tech Stack

* **Core:** React 19, TypeScript

* **Styling:** Tailwind CSS, Lucide React

* **Architecture:** Component-based Architecture (Sidebar, MainStage, Inspector)

* **State Management:** React Hooks + Custom Registry Class

* **Protocol:** Model Context Protocol (MCP) Factory

## 🏁 Quick Start

1. **Clone the repo**

   ```bash
   git clone [https://github.com/samgbm/nexusflow.git](https://github.com/samgbm/nexusflow.git)
   cd nexusflow
