# ERC-8183 Agent Commerce Simulator

Build an interactive demo app that visualizes the ERC-8183 "Agentic Commerce Protocol" job lifecycle.

## What ERC-8183 Is

ERC-8183 defines how AI agents do jobs with escrowed payments:
- **Client**: Creates job, funds escrow
- **Provider**: Does the work, submits deliverable
- **Evaluator**: Attests completion (releases payment) or rejects (refunds client)

## State Machine

```
Open → Funded → Submitted → Completed/Rejected/Expired
```

States:
- **Open**: Job created, budget not set/funded. Client can set budget, fund, or reject.
- **Funded**: Budget escrowed. Provider can work and submit. Evaluator can reject. Can expire.
- **Submitted**: Provider submitted deliverable. Only evaluator can complete or reject. Can expire.
- **Completed**: Terminal. Payment released to provider.
- **Rejected**: Terminal. Refund to client.
- **Expired**: Terminal. Timeout refund to client.

## Core Functions

1. `createJob(provider, evaluator, expiredAt, description)` - Client creates job
2. `setBudget(jobId, amount)` - Client or provider sets price
3. `fund(jobId, expectedBudget)` - Client funds escrow
4. `submit(jobId, deliverable)` - Provider submits work
5. `complete(jobId, reason?)` - Evaluator approves, releases payment
6. `reject(jobId, reason?)` - Client (Open) or Evaluator (Funded/Submitted) rejects

## App Requirements

### Tech Stack
- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- Shadcn/ui components

### Features

1. **Interactive State Machine Visualization**
   - Show all 6 states as nodes
   - Highlight current state
   - Animate transitions when actions occur
   - Show which transitions are valid from current state

2. **Job Simulator Panel**
   - Create a mock job with description, provider, evaluator addresses
   - Set budget
   - Fund the job
   - Submit deliverable (mock hash)
   - Complete or reject

3. **Role Switcher**
   - Toggle between Client, Provider, Evaluator views
   - Only show actions available to current role
   - Show which wallet is "connected" for each role

4. **Transaction Log**
   - Show simulated on-chain events
   - Include timestamps
   - Show state transitions

5. **Educational Content**
   - "How It Works" section explaining ERC-8183
   - Why escrow matters for AI agents
   - Comparison with x402 (payment) vs ERC-8183 (escrow/jobs)

### Design
- Dark theme
- Clean, minimal UI
- Neobrutalist accents (thick borders, high contrast)
- State machine should be the visual centerpiece

### Landing Content

Hero: "ERC-8183: Trustless Jobs for AI Agents"
Subtitle: "The escrow layer that lets AI agents do work with guaranteed payment"

Key points:
- Client funds upfront → Provider works confidently
- Evaluator attests quality → Payment released atomically
- Timeout protection → No stuck funds
- Composes with ERC-8004 (reputation) and x402 (payments)

## Output

- Deploy to Vercel
- Create GitHub repo at github.com/Samdevrel/erc-8183-commerce
- Update Sam's portfolio

## References

- ERC-8183 spec: https://eips.ethereum.org/EIPS/eip-8183
- Authors: Virtuals Protocol team (Davide Crapis, Bryan Lim, Tay Weixiong, Chooi Zuhwa)
- Created: 2026-02-25
