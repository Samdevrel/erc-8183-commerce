'use client';

import { useState } from 'react';

type JobState = 'Open' | 'Funded' | 'Submitted' | 'Completed' | 'Rejected' | 'Expired';
type Role = 'Client' | 'Provider' | 'Evaluator';

i
      <header className="border-b-4 border-purple-400 bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black">App</h1>
              <p className="text-gray-400 mt-2">Interactive demo</p>
            </div>
            <nav className="flex gap-2">
              <a href="/" className="px-4 py-2 bg-gray-800 border-2 border-gray-600 hover:border-purple-400 rounded font-bold transition-all">
                Home
              </a>
              <a href="/docs" className="px-4 py-2 bg-purple-500 border-2 border-purple-400 rounded font-bold transition-all">
                Documentation
              </a>
            </nav>
          </div>
        </div>
      </header>

nterface Job {
  id: string;
  description: string;
  client: string;
  provider: string;
  evaluator: string;
  budget: number;
  status: JobState;
  deliverable?: string;
  createdAt: Date;
  expiredAt: Date;
}

interface LogEntry {
  timestamp: Date;
  action: string;
  from: JobState;
  to: JobState;
  actor: Role;
  details?: string;
}

const stateColors: Record<JobState, string> = {
  Open: 'bg-blue-500',
  Funded: 'bg-yellow-500',
  Submitted: 'bg-purple-500',
  Completed: 'bg-green-500',
  Rejected: 'bg-red-500',
  Expired: 'bg-gray-500',
};

const stateDescriptions: Record<JobState, string> = {
  Open: 'Job created. Budget not yet set or funded.',
  Funded: 'Budget escrowed. Provider can submit work.',
  Submitted: 'Work submitted. Awaiting evaluator decision.',
  Completed: 'Terminal. Payment released to provider.',
  Rejected: 'Terminal. Funds refunded to client.',
  Expired: 'Terminal. Timeout refund to client.',
};

export default function Home() {
  const [currentRole, setCurrentRole] = useState<Role>('Client');
  const [job, setJob] = useState<Job | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [description, setDescription] = useState('Build a REST API for user authentication');
  const [budget, setBudget] = useState(1000);
  const [deliverable, setDeliverable] = useState('QmX7d3...abc123');

  const addLog = (action: string, from: JobState, to: JobState, actor: Role, details?: string) => {
    setLogs(prev => [...prev, {
      timestamp: new Date(),
      action,
      from,
      to,
      actor,
      details,
    }]);
  };

  const createJob = () => {
    const newJob: Job = {
      id: `job-${Date.now()}`,
      description,
      client: '0xClient...abc',
      provider: '0xProvider...def',
      evaluator: '0xEvaluator...ghi',
      budget: 0,
      status: 'Open',
      createdAt: new Date(),
      expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };
    setJob(newJob);
    addLog('createJob', 'Open', 'Open', 'Client', `Job created: "${description}"`);
  };

  const setBudgetAction = () => {
    if (!job || job.status !== 'Open') return;
    setJob({ ...job, budget });
    addLog('setBudget', 'Open', 'Open', currentRole, `Budget set to ${budget} USDC`);
  };

  const fundJob = () => {
    if (!job || job.status !== 'Open' || job.budget === 0) return;
    setJob({ ...job, status: 'Funded' });
    addLog('fund', 'Open', 'Funded', 'Client', `Escrowed ${job.budget} USDC`);
  };

  const submitWork = () => {
    if (!job || job.status !== 'Funded') return;
    setJob({ ...job, status: 'Submitted', deliverable });
    addLog('submit', 'Funded', 'Submitted', 'Provider', `Deliverable: ${deliverable}`);
  };

  const completeJob = () => {
    if (!job || job.status !== 'Submitted') return;
    setJob({ ...job, status: 'Completed' });
    addLog('complete', 'Submitted', 'Completed', 'Evaluator', `Payment released: ${job.budget} USDC`);
  };

  const rejectJob = () => {
    if (!job) return;
    const prevStatus = job.status;
    if (prevStatus === 'Open' && currentRole !== 'Client') return;
    if ((prevStatus === 'Funded' || prevStatus === 'Submitted') && currentRole !== 'Evaluator') return;
    
    setJob({ ...job, status: 'Rejected' });
    addLog('reject', prevStatus, 'Rejected', currentRole, 'Work rejected, funds refunded');
  };

  const expireJob = () => {
    if (!job || (job.status !== 'Funded' && job.status !== 'Submitted')) return;
    setJob({ ...job, status: 'Expired' });
    addLog('claimRefund', job.status, 'Expired', 'Client', 'Timeout expired, funds refunded');
  };

  const resetDemo = () => {
    setJob(null);
    setLogs([]);
  };

  const isTerminal = job?.status === 'Completed' || job?.status === 'Rejected' || job?.status === 'Expired';

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b-4 border-yellow-400 bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black">ERC-8183: Agent Commerce Protocol</h1>
          <p className="text-gray-400 mt-2">Trustless job escrow for AI agents</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Role Switcher */}
        <section className="bg-gray-900 border-4 border-gray-700 p-4">
          <h2 className="text-sm font-bold text-gray-400 mb-3">CURRENT ROLE</h2>
          <div className="flex gap-2 flex-wrap">
            {(['Client', 'Provider', 'Evaluator'] as Role[]).map((role) => (
              <button
                key={role}
                onClick={() => setCurrentRole(role)}
                className={`px-4 py-2 font-bold border-4 transition-all ${
                  currentRole === role
                    ? 'bg-yellow-400 text-black border-yellow-400'
                    : 'bg-gray-800 text-white border-gray-600 hover:border-gray-500'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-2">
            {currentRole === 'Client' && '💼 Creates jobs, funds escrow, can reject when Open'}
            {currentRole === 'Provider' && '🔧 Does work, submits deliverables'}
            {currentRole === 'Evaluator' && '⚖️ Attests completion or rejection'}
          </p>
        </section>

        {/* State Machine Visualization */}
        <section className="bg-gray-900 border-4 border-gray-700 p-6">
          <h2 className="text-sm font-bold text-gray-400 mb-4">STATE MACHINE</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {(['Open', 'Funded', 'Submitted', 'Completed', 'Rejected', 'Expired'] as JobState[]).map((state, i) => (
              <div key={state} className="flex items-center">
                <div
                  className={`w-28 h-28 flex flex-col items-center justify-center border-4 ${
                    job?.status === state
                      ? `${stateColors[state]} border-white animate-pulse`
                      : 'bg-gray-800 border-gray-600'
                  }`}
                >
                  <span className="font-black text-sm">{state}</span>
                  {job?.status === state && <span className="text-xs mt-1">●</span>}
                </div>
                {i < 2 && <span className="text-2xl mx-2">→</span>}
                {i === 2 && <span className="text-2xl mx-2">→</span>}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-gray-400 text-sm">
            {job ? stateDescriptions[job.status] : 'No job created yet'}
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Control Panel */}
          <section className="bg-gray-900 border-4 border-gray-700 p-6">
            <h2 className="text-sm font-bold text-gray-400 mb-4">JOB CONTROLS</h2>
            
            {!job ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Job Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 bg-gray-800 border-2 border-gray-600 text-white"
                  />
                </div>
                <button
                  onClick={createJob}
                  className="w-full py-3 bg-blue-500 text-white font-bold border-4 border-blue-400 hover:bg-blue-600 transition-all"
                >
                  createJob()
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-gray-800 border-2 border-gray-600">
                  <div className="text-xs text-gray-400">Job ID</div>
                  <div className="font-mono text-sm">{job.id}</div>
                </div>
                <div className="p-3 bg-gray-800 border-2 border-gray-600">
                  <div className="text-xs text-gray-400">Description</div>
                  <div className="text-sm">{job.description}</div>
                </div>
                <div className="p-3 bg-gray-800 border-2 border-gray-600">
                  <div className="text-xs text-gray-400">Budget</div>
                  <div className="text-lg font-bold">{job.budget} USDC</div>
                </div>

                {/* Actions based on state and role */}
                {job.status === 'Open' && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Set Budget (USDC)</label>
                      <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="w-full p-3 bg-gray-800 border-2 border-gray-600 text-white"
                      />
                    </div>
                    <button
                      onClick={setBudgetAction}
                      className="w-full py-3 bg-gray-700 text-white font-bold border-4 border-gray-500 hover:bg-gray-600"
                    >
                      setBudget()
                    </button>
                    {job.budget > 0 && currentRole === 'Client' && (
                      <button
                        onClick={fundJob}
                        className="w-full py-3 bg-yellow-500 text-black font-bold border-4 border-yellow-400 hover:bg-yellow-400"
                      >
                        fund() → Escrow {job.budget} USDC
                      </button>
                    )}
                    {currentRole === 'Client' && (
                      <button
                        onClick={rejectJob}
                        className="w-full py-3 bg-red-600 text-white font-bold border-4 border-red-500 hover:bg-red-500"
                      >
                        reject() → Cancel Job
                      </button>
                    )}
                  </>
                )}

                {job.status === 'Funded' && currentRole === 'Provider' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Deliverable Hash</label>
                      <input
                        type="text"
                        value={deliverable}
                        onChange={(e) => setDeliverable(e.target.value)}
                        className="w-full p-3 bg-gray-800 border-2 border-gray-600 text-white font-mono text-sm"
                      />
                    </div>
                    <button
                      onClick={submitWork}
                      className="w-full py-3 bg-purple-500 text-white font-bold border-4 border-purple-400 hover:bg-purple-400"
                    >
                      submit() → Submit Work
                    </button>
                  </div>
                )}

                {job.status === 'Funded' && currentRole === 'Evaluator' && (
                  <button
                    onClick={rejectJob}
                    className="w-full py-3 bg-red-600 text-white font-bold border-4 border-red-500 hover:bg-red-500"
                  >
                    reject() → Reject Before Submission
                  </button>
                )}

                {job.status === 'Submitted' && currentRole === 'Evaluator' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-900/30 border-2 border-purple-500">
                      <div className="text-xs text-purple-400">Submitted Deliverable</div>
                      <div className="font-mono text-sm">{job.deliverable}</div>
                    </div>
                    <button
                      onClick={completeJob}
                      className="w-full py-3 bg-green-500 text-white font-bold border-4 border-green-400 hover:bg-green-400"
                    >
                      complete() → Release Payment
                    </button>
                    <button
                      onClick={rejectJob}
                      className="w-full py-3 bg-red-600 text-white font-bold border-4 border-red-500 hover:bg-red-500"
                    >
                      reject() → Reject Work
                    </button>
                  </div>
                )}

                {(job.status === 'Funded' || job.status === 'Submitted') && (
                  <button
                    onClick={expireJob}
                    className="w-full py-2 bg-gray-700 text-gray-300 font-bold border-2 border-gray-500 hover:bg-gray-600 text-sm"
                  >
                    ⏱️ Simulate Timeout → claimRefund()
                  </button>
                )}

                {isTerminal && (
                  <div className="pt-4">
                    <button
                      onClick={resetDemo}
                      className="w-full py-3 bg-gray-700 text-white font-bold border-4 border-gray-500 hover:bg-gray-600"
                    >
                      Reset Demo
                    </button>
                  </div>
                )}

                {!isTerminal && job.status !== 'Open' && currentRole !== 'Provider' && job.status === 'Funded' && (
                  <p className="text-gray-500 text-sm text-center">
                    Switch to Provider role to submit work
                  </p>
                )}
                {!isTerminal && job.status === 'Submitted' && currentRole !== 'Evaluator' && (
                  <p className="text-gray-500 text-sm text-center">
                    Switch to Evaluator role to complete or reject
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Transaction Log */}
          <section className="bg-gray-900 border-4 border-gray-700 p-6">
            <h2 className="text-sm font-bold text-gray-400 mb-4">TRANSACTION LOG</h2>
            {logs.length === 0 ? (
              <p className="text-gray-500 text-sm">No transactions yet</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {logs.map((log, i) => (
                  <div key={i} className="p-3 bg-gray-800 border-l-4 border-yellow-400">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-sm text-yellow-400">{log.action}()</span>
                      <span className="text-xs text-gray-500">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {log.from} → {log.to} • by {log.actor}
                    </div>
                    {log.details && (
                      <div className="text-xs text-gray-500 mt-1">{log.details}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* How It Works */}
        <section className="bg-gray-900 border-4 border-yellow-400 p-6">
          <h2 className="text-xl font-black text-yellow-400 mb-4">How ERC-8183 Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-800 border-2 border-gray-600">
              <h3 className="font-bold text-blue-400 mb-2">1. Client Creates & Funds</h3>
              <p className="text-sm text-gray-400">
                Client creates a job with description, provider, and evaluator. 
                Sets budget and funds escrow. Money is locked in the contract.
              </p>
            </div>
            <div className="p-4 bg-gray-800 border-2 border-gray-600">
              <h3 className="font-bold text-purple-400 mb-2">2. Provider Works & Submits</h3>
              <p className="text-sm text-gray-400">
                Provider completes the work and submits a deliverable hash.
                This could be an IPFS CID, attestation, or any verifiable reference.
              </p>
            </div>
            <div className="p-4 bg-gray-800 border-2 border-gray-600">
              <h3 className="font-bold text-green-400 mb-2">3. Evaluator Attests</h3>
              <p className="text-sm text-gray-400">
                Evaluator reviews the work. Calls complete() to release payment,
                or reject() to refund the client. Atomic settlement.
              </p>
            </div>
          </div>
        </section>

        {/* Why It Matters */}
        <section className="bg-gray-900 border-4 border-gray-700 p-6">
          <h2 className="text-xl font-black mb-4">Why Agents Need This</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-yellow-400 mb-2">The Problem</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• AI agents need to pay for services</li>
                <li>• But who trusts an agent with a credit card?</li>
                <li>• How do you verify work was done?</li>
                <li>• What if the agent disappears mid-job?</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-yellow-400 mb-2">The Solution</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Escrow locks funds upfront (trustless)</li>
                <li>• Evaluator can be another agent or oracle</li>
                <li>• Timeouts prevent stuck funds</li>
                <li>• Composes with ERC-8004 reputation</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Stack */}
        <section className="bg-gray-900 border-4 border-gray-700 p-6">
          <h2 className="text-sm font-bold text-gray-400 mb-4">THE AGENT COMMERCE STACK</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-900/30 border-2 border-blue-500">
              <div className="font-bold text-blue-400">ERC-8004</div>
              <div className="text-xs text-gray-400">Identity & Reputation</div>
            </div>
            <div className="p-4 bg-purple-900/30 border-2 border-purple-500">
              <div className="font-bold text-purple-400">ERC-8183</div>
              <div className="text-xs text-gray-400">Jobs & Escrow</div>
            </div>
            <div className="p-4 bg-yellow-900/30 border-2 border-yellow-500">
              <div className="font-bold text-yellow-400">x402</div>
              <div className="text-xs text-gray-400">HTTP Payments</div>
            </div>
            <div className="p-4 bg-green-900/30 border-2 border-green-500">
              <div className="font-bold text-green-400">ERC-7710</div>
              <div className="text-xs text-gray-400">Delegations</div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm py-8 border-t border-gray-800">
          <p>
            Built by <a href="https://x.com/samdevrel" className="text-yellow-400 hover:underline">@samdevrel</a>
            {' • '}
            <a href="https://eips.ethereum.org/EIPS/eip-8183" className="text-blue-400 hover:underline">ERC-8183 Spec</a>
            {' • '}
            <a href="https://github.com/Samdevrel/erc-8183-commerce" className="text-gray-400 hover:underline">Source Code</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
