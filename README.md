# ERC-8183 Agent Commerce Simulator

Interactive demo of the **Agentic Commerce Protocol** — trustless job escrow for AI agents.

🔗 **Live Demo**: [erc-8183-commerce.vercel.app](https://erc-8183-commerce.vercel.app)

## What is ERC-8183?

ERC-8183 defines how AI agents can do jobs with guaranteed payment:

```
┌─────────────────────────────────────────────────────────────────┐
│                    ERC-8183 STATE MACHINE                       │
│                                                                 │
│   ┌──────┐    fund()    ┌────────┐   submit()   ┌───────────┐  │
│   │ Open │ ──────────→  │ Funded │ ──────────→  │ Submitted │  │
│   └──┬───┘              └────┬───┘              └─────┬─────┘  │
│      │                       │                        │        │
│      │ reject()              │ reject()               │        │
│      │ (client)              │ (evaluator)            │        │
│      │                       │                        │        │
│      │         timeout       │        timeout         │        │
│      ↓            ↓          ↓           ↓            ↓        │
│ ┌────────┐   ┌────────┐  ┌────────┐  ┌───────────┐            │
│ │Rejected│   │Expired │  │Rejected│  │ Completed │            │
│ └────────┘   └────────┘  └────────┘  └───────────┘            │
│                                           ↑                    │
│                                      complete()                │
│                                     (evaluator)                │
└─────────────────────────────────────────────────────────────────┘
```

### Roles

- **Client**: Creates job, funds escrow, can reject when Open
- **Provider**: Does the work, submits deliverable
- **Evaluator**: Attests completion (releases payment) or rejects (refunds)

### Key Functions

| Function | Caller | Description |
|----------|--------|-------------|
| `createJob()` | Client | Create job with description, provider, evaluator |
| `setBudget()` | Client/Provider | Set the job price |
| `fund()` | Client | Lock budget in escrow |
| `submit()` | Provider | Submit deliverable hash |
| `complete()` | Evaluator | Release payment to provider |
| `reject()` | Client/Evaluator | Refund to client |

## The Agent Commerce Stack

```
┌─────────────────────────────────────────────┐
│              Agent Commerce                  │
├─────────────┬─────────────┬─────────────────┤
│  ERC-8004   │  ERC-8183   │     x402        │
│  Identity   │   Escrow    │   Payments      │
├─────────────┴─────────────┴─────────────────┤
│               ERC-7710/7715                  │
│            Delegations & Permissions         │
└─────────────────────────────────────────────┘
```

## Features

- **Interactive state machine visualization** — see transitions as they happen
- **Role switcher** — experience the flow as Client, Provider, or Evaluator
- **Transaction log** — simulated on-chain events
- **Educational content** — understand why agents need escrow

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Deployed on Vercel

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Links

- [ERC-8183 Specification](https://eips.ethereum.org/EIPS/eip-8183)
- [Sam's Portfolio](https://github.com/Samdevrel)
- [@samdevrel on X](https://x.com/samdevrel)

## Related Projects

- [x402 API Gateway](https://github.com/Samdevrel/x402-api-gateway) — HTTP 402 payments for agents
- [Agent Budget Manager](https://github.com/Samdevrel/agent-budget-manager) — Spending caps for AI agents
- [Delegation Audit Trail](https://github.com/Samdevrel/delegation-audit-trail) — Full visibility into agent transactions

---

Built by [@samdevrel](https://x.com/samdevrel) • Part of the Agent Commerce series
