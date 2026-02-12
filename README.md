<p align="center">
  <img src="docs/assets/gaas-logo.png" alt="GaaS — Governance as a Service" width="400">
</p>

<h3 align="center">Governance as a Service</h3>

<p align="center">
  The governance layer for autonomous AI agents.<br>
  Every consequential action — declared, enriched, evaluated, deliberated, audited.
</p>

<p align="center">
  <a href="https://gaas.to">Documentation</a> ·
  <a href="https://gaas.to/api">API Reference</a> ·
  <a href="https://gaas.to/quickstart">Quick Start</a> ·
  <a href="https://github.com/H2OmAI/gaas">Source</a> ·
  <a href="https://gaas.is">Website</a>
</p>

---

## What is GaaS?

GaaS is an external governance pipeline for AI agents. It sits between an agent's decision to act and the action itself — intercepting, evaluating, and either approving, modifying, escalating, or blocking every consequential action in real time.

The agent is not the governor. That separation is architectural, not aspirational. Agents declare intent. GaaS decides whether that intent should proceed — and produces an immutable audit record of every decision, regardless of outcome.

**The problem it solves:** AI agents today self-govern. They carry their own safety rules, compliance logic, and risk assessments in-context — consuming 23,000–65,000 tokens per governance cycle and still missing things no self-interested system can catch. GaaS externalizes governance into a purpose-built pipeline, reducing governance token consumption by 92–97% while providing stronger, auditable, explainable oversight.

## The Pipeline

Every governed action passes through five stages:

```
┌─────────────┐    ┌─────────────────┐    ┌────────────────┐    ┌──────────────┐    ┌────────────────┐
│   Intent     │───▶│    Context       │───▶│    Policy       │───▶│ Deliberation │───▶│   Decision     │
│ Declaration  │    │  Enrichment     │    │  Evaluation    │    │   (if needed) │    │   + Audit      │
└─────────────┘    └─────────────────┘    └────────────────┘    └──────────────┘    └────────────────┘
    Stage 1             Stage 2              Stage 3              Stage 4              Stage 5
     < 5ms              < 50ms               < 10ms            200ms – 5s              < 10ms
```

**Stage 1 — Intent Declaration.** The agent declares what it intends to do: action type, target, payload, estimated impact, urgency. If it can't declare it, it can't do it. Opacity of intent is the primary risk vector in autonomous AI systems — the Intent Declaration API eliminates it at the point of entry.

**Stage 2 — Context Enrichment.** GaaS discovers what the agent doesn't know. It queries environmental data, entity state, regulatory databases, historical patterns, and organizational policies in parallel across five source categories. Contradictions between agent-declared context and discovered context are flagged as governance signals — they are the highest-value finding.

**Stage 3 — Policy Evaluation.** The enriched intent is evaluated against a four-tier policy hierarchy: platform policies (GaaS-wide), regulatory policies (jurisdiction-specific), organizational policies (customer-defined), and agent-specific policies. Conflicts between tiers resolve in favor of the more restrictive policy. Every verdict includes a full reasoning chain.

**Stage 4 — Deliberation.** High-risk actions trigger multi-agent deliberation. A panel of 2–6 specialized agents — Compliance, Risk, Domain Expert, Ethics, Cost/Efficiency, Precedent — debate the action and reach consensus. Most actions skip this stage entirely. The ones that reach it need it.

**Stage 5 — Decision + Audit.** A verdict is issued (`approve`, `approve_modified`, `escalate`, or `block`) and an immutable, hash-chained audit record is created. The record captures the full reasoning trail: every context source queried, every policy evaluated, every deliberation argument, every dissent.

**Routine actions clear the full pipeline in under 100ms.** High-stakes actions with full deliberation complete in under 10 seconds.

## Quick Start

### Python

```python
from gaas import GovernanceClient, Action, Target, Impact

gov = GovernanceClient(api_key="gaas_live_org_...")

decision = gov.evaluate(
    agent_id="customer_service_bot_v2",
    action=Action(
        type="communicate",
        verb="send_email",
        target=Target(
            type="person",
            identifier="customer@example.com",
            sensitivity="confidential"
        )
    ),
    summary="Send loan rate quote to customer including APR disclosure",
    impact=Impact(
        reversible=True,
        financial_exposure_usd=0,
        audience_size=1,
        regulatory_domains=["TILA", "RESPA"]
    ),
    urgency="routine"
)

if decision.approved:
    send_email(decision.payload)       # Payload may be modified for compliance
elif decision.escalated:
    queue_for_human_review(decision)
elif decision.blocked:
    log_blocked_action(decision.reason, decision.alternatives)
```

### TypeScript

```typescript
import { GovernanceClient } from '@gaas/sdk';

const gov = new GovernanceClient({ apiKey: 'gaas_live_org_...' });

const decision = await gov.evaluate({
  agentId: 'trading_assistant_v1',
  action: {
    type: 'transact',
    verb: 'execute_trade',
    target: { type: 'account', identifier: 'acct_001', sensitivity: 'regulated' }
  },
  summary: 'Execute buy order for 500 shares of AAPL at market price',
  impact: {
    reversible: true,
    financialExposureUsd: 42500.00,
    audienceSize: 1,
    regulatoryDomains: ['SEC', 'FINRA']
  },
  urgency: 'elevated'
});

switch (decision.verdict) {
  case 'approve':          await executeTrade(decision.payload); break;
  case 'approve_modified': await executeTrade(decision.payload); break;
  case 'escalate':         await notifyTrader(decision.escalationDetails); break;
  case 'block':            console.log(decision.reason, decision.alternatives); break;
}
```

### Framework Integration — LangChain

```python
from gaas.integrations.langchain import GaaSGovernanceTool

governance_tool = GaaSGovernanceTool(
    api_key="gaas_live_org_...",
    agent_id="langchain_agent_v1",
    auto_govern=True  # Automatically intercept tool calls
)

# When auto_govern=True, every tool invocation is wrapped:
# 1. Agent decides to call a tool
# 2. GaaS intercepts, evaluates the intent
# 3. If approved — tool executes
# 4. If modified — tool executes with modified parameters
# 5. If blocked — agent receives block reason + alternatives
# 6. If escalated — execution pauses until human review completes
```

SDKs are available for **Python**, **TypeScript**, and **Java**, with framework plugins for **LangChain**, **AutoGen**, and **CrewAI**.

## API

**Base URL:**
```
Production:  https://api.gaas.is/v1
Staging:     https://staging-api.gaas.is/v1
```

**Protocol:** HTTPS only. JSON request/response bodies. HTTP requests are rejected, not redirected.

**Authentication:** Bearer token per organization, with optional agent and environment scoping.

```
Authorization: Bearer gaas_live_org_a1b2c3d4e5f6...
```

Key environments: `gaas_live_` (production — decisions enforced), `gaas_shadow_` (shadow mode — decisions logged, not enforced), `gaas_test_` (testing — no audit trail, mock enrichment).

**Core endpoints:**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/intents` | `POST` | Submit an intent for governance evaluation |
| `/v1/intents/{id}` | `GET` | Retrieve governance decision for an intent |
| `/v1/intents/{id}/audit` | `GET` | Retrieve the full audit record |
| `/v1/agents` | `POST` | Register a new agent |
| `/v1/agents/{id}` | `GET` | Retrieve agent registration and governance history |

See the full [API Reference](https://gaas.to/api) for complete endpoint documentation, request/response schemas, error codes, and worked examples.

## How Agents Connect

GaaS supports three integration models:

**SDK Integration** — A lightweight SDK wraps the agent's action functions. Before any action executes, the SDK submits the intent to GaaS and waits for a governance decision. Available for Python, TypeScript, and Java.

**API Gateway** — For agents that communicate via APIs, GaaS operates as a proxy gateway. All API calls pass through GaaS, which intercepts, evaluates, and either forwards (approved), modifies (approved_modified), holds (escalated), or rejects (blocked) the call.

**Framework Plugins** — Pre-built integrations for LangChain, AutoGen, and CrewAI that hook into each framework's action execution pipeline. Drop-in governance with minimal code changes.

## Onboarding

GaaS takes a new customer from "I want to govern my AI agents" to "my agents are governed" in hours, not weeks.

1. **Context Intake** — Provide a URL, upload documents, describe your business, list your agents. GaaS reads, infers, and builds.
2. **Membrane Generation** — GaaS builds a complete governance membrane: policies, risk thresholds, enrichment configuration, deliberation panel composition, and agent-specific delegation profiles. No YAML. No rules engine configuration.
3. **Conversational Validation** — Validate the membrane through dialogue. Ask "what if" questions. Probe edge cases. The membrane updates in real time.
4. **Shadow Mode** — The full pipeline runs on real agent actions, produces real governance decisions, but doesn't enforce them. Review what would have happened. Refine the membrane.
5. **Live Mode** — Governance enforced. Every action governed. Every decision audited.

## Trust Tiers

| Tier | Requirements | Benefits |
|------|-------------|----------|
| **Registered** | GaaS SDK integrated, basic policies active | GaaS token issued, audit trail access |
| **Verified** | Full policy suite configured, 30-day compliant operation | Elevated trust tokens, access to GaaS-governed properties |
| **Certified** | Independent audit, all regulatory policies active, deliberation enabled for high-risk actions | "H2Om GaaS Certified" designation, insurance premium eligibility, regulatory safe-harbor arguments, full network trust |

As more organizations adopt GaaS, outbound-governed agents gain access to more GaaS-protected properties, inbound-governed properties attract higher-quality agent traffic, and the governance data corpus grows — improving risk models and policy recommendations across the network.

## Design Principles

These principles are non-negotiable across every component of the platform:

**Fail-safe, not fail-open.** When in doubt, block. When policies conflict, the more restrictive policy wins. When context is missing, assume worst case. Organizations can loosen defaults — but the defaults protect.

**Explain everything.** Every verdict includes a reasoning chain. A developer debugging a blocked action traces the exact policy, condition, and data that triggered the block. A compliance officer reviewing an audit trail sees a complete narrative of how the decision was made. Opaque governance is not governance.

**Speed scales with risk.** Low-risk actions clear the pipeline in single-digit milliseconds. High-risk actions touching multiple regulatory frameworks take longer because they should. The system never sacrifices correctness for speed, but aggressively optimizes the common path.

**The agent is not the governor.** Architectural separation between the entity that acts and the entity that governs. This is the foundational constraint. Everything else follows from it.

**Missing context is itself a finding.** When GaaS can't determine something — a regulation's applicability, a customer's consent status, a market's current state — that gap is treated as a governance signal, not an absence of information.

**Contradictions are the highest-value signal.** When an agent says one thing and discovered context says another, that discrepancy is the most important thing GaaS found.

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture Overview](https://gaas.to/architecture) | Foundational system design — the 5-stage pipeline, risk model, integration model, trust tiers |
| [Intent Declaration API](https://gaas.to/api/intent-declaration) | API spec — endpoints, schemas, validation, authentication, SDK quick starts |
| [Context Enrichment](https://gaas.to/architecture/context-enrichment) | How GaaS discovers what the agent doesn't know — source categories, connectors, contradiction detection |
| [Policy Engine](https://gaas.to/architecture/policy-engine) | The 4-tier policy hierarchy — evaluation logic, conflict resolution, composite risk scoring |
| [Deliberation Engine](https://gaas.to/architecture/deliberation) | Multi-agent deliberation — panel composition, consensus protocols, dissent handling |
| [Decision + Audit Service](https://gaas.to/architecture/decision-audit) | Verdict assembly, hash-chained audit records, GDPR pseudonymization, audit queries |
| [Escalation Service](https://gaas.to/architecture/escalation) | Human-in-the-loop — escalation triggers, reviewer interface, timeout behavior, sovereign human decisions |
| [Learning Engine](https://gaas.to/architecture/learning) | Continuous refinement — feedback loops, pattern detection, policy recommendation, calibration |
| [Onboarding Engine](https://gaas.to/architecture/onboarding) | Context intake — membrane generation — conversational validation — shadow — live |
| [Compliance Dashboard](https://gaas.to/architecture/dashboard) | Operational visibility — real-time monitoring, audit trail access, governance ROI metrics |

## Latency Targets

| Operation | Target | Notes |
|-----------|--------|-------|
| Intent declaration parsing | < 5ms | Local SDK validation |
| Context enrichment | < 50ms | Parallel queries across 5 source categories |
| Policy evaluation | < 10ms | In-memory policy graph evaluation |
| Deliberation (2-agent, routine) | < 200ms | Fast-path for low-risk triggers |
| Deliberation (full panel) | < 5s | Complex reasoning across 4–6 agents |
| **Total pipeline (routine)** | **< 100ms** | **Most actions take this path** |
| Total pipeline (high-stakes) | < 10s | Full deliberation with human notification |

## Risk Scoring

GaaS computes a composite risk score across seven dimensions:

| Dimension | Weight | What it measures |
|-----------|--------|------------------|
| Reversibility | 0.20 | Can this action be undone? |
| Financial exposure | 0.20 | How much money is at risk? |
| Regulatory density | 0.20 | How heavily regulated is this action? |
| Audience impact | 0.15 | How many people are affected? |
| Context confidence | 0.15 | How sure are we about the context? |
| Novelty | 0.05 | Has this type of action been governed before? |
| Agent trust | 0.05 | What is this agent's governance track record? |

The composite score determines whether an action clears on the fast path, triggers deliberation, or requires human escalation.

## Repository Structure

```
gaas.to/
├── docs/
│   ├── architecture/          # System design and component specs
│   ├── api/                   # API reference and endpoint documentation
│   ├── guides/                # Integration guides and tutorials
│   ├── examples/              # Worked examples and sample integrations
│   └── assets/                # Images, diagrams, logos
└── README.md
```

## Related Repositories

| Repository | Description |
|------------|-------------|
| [H2OmAI/gaas](https://github.com/H2OmAI/gaas) | GaaS framework, source code, and internal documentation |
| [H2OmAI/gaas.is](https://github.com/H2OmAI/gaas.is) | Marketing site — [gaas.is](https://gaas.is) |
| **H2OmAI/gaas.to** (this repo) | Public documentation — [gaas.to](https://gaas.to) |

## Status

GaaS is in active development. All 10 specifications are complete at v0.1:

- ✅ Agent Logic Architecture
- ✅ Intent Declaration API
- ✅ Context Enrichment Service
- ✅ Policy Engine
- ✅ Deliberation Engine
- ✅ Decision + Audit Service
- ✅ Escalation Service
- ✅ Learning Engine
- ✅ Onboarding Engine
- ✅ Compliance Dashboard

Implementation is underway. SDKs, connectors, and the core pipeline services are being built against these specifications.

## License

Copyright © 2025 H2Om Technologies. All rights reserved.

---

<p align="center">
  <a href="https://gaas.to">gaas.to</a> · <a href="https://gaas.is">gaas.is</a> · <a href="https://github.com/H2OmAI">GitHub</a>
</p>
