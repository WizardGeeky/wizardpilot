"use client";

import React, { useState, useEffect } from "react";
import {
  FileCode,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  Activity,
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { MagicBadge } from "@/components/ui/magic-badge";
import { Badge } from "@/components/ui/badge";

interface DiffScenario {
  title: string;
  badge: string;
  file: string;
  confidence: number;
  reasoning: string;
  codeLines: Array<{ type: "add" | "del" | "ctx"; text: string }>;
}

const SCENARIOS: DiffScenario[] = [
  {
    title: "Double-Refund Race Condition Prevention",
    badge: "CONCURRENCY",
    file: "src/services/cancellation.service.ts",
    confidence: 96,
    reasoning: "Introduced atomic check-then-act with Redis distributed locking and idempotent event checks.",
    codeLines: [
      { type: "ctx", text: "  async cancelOrder(orderId: string, reason: string): Promise<OrderResult> {" },
      { type: "del", text: "-   const order = await this.orderRepo.findById(orderId);" },
      { type: "del", text: "-   await this.paymentGateway.refund(order.paymentId);" },
      { type: "add", text: "+   const lock = await this.distributedLock.acquire(`cancel:${orderId}`, 5000);" },
      { type: "add", text: "+   const order = await this.orderRepo.findByIdForUpdate(orderId);" },
      { type: "add", text: "+   if (order.status === 'CANCELLED') throw new OrderAlreadyCancelledException();" },
      { type: "add", text: "+   await this.paymentGateway.refundWithIdempotencyKey(order.paymentId, `rf_${orderId}`);" },
      { type: "ctx", text: "    order.status = 'CANCELLED';" },
      { type: "ctx", text: "    return await this.orderRepo.save(order);" },
      { type: "ctx", text: "  }" },
    ],
  },
  {
    title: "Webhook Signature Replay Attack Mitigation",
    badge: "SECURITY",
    file: "app/api/webhooks/stripe/route.ts",
    confidence: 98,
    reasoning: "Enforced timestamp tolerance window & cryptographic HMAC-SHA256 signature verification.",
    codeLines: [
      { type: "ctx", text: "export async function POST(req: NextRequest) {" },
      { type: "del", text: "-   const payload = await req.json();" },
      { type: "del", text: "-   await processEvent(payload.event);" },
      { type: "add", text: "+   const signature = req.headers.get('stripe-signature');" },
      { type: "add", text: "+   const event = stripe.webhooks.constructEvent(body, signature, webhookSecret, {" },
      { type: "add", text: "+     tolerance: 300 // 5-minute replay prevention window" },
      { type: "add", text: "+   });" },
      { type: "ctx", text: "    await dispatchIdempotentWorker(event);" },
      { type: "ctx", text: "    return NextResponse.json({ received: true });" },
      { type: "ctx", text: "}" },
    ],
  },
  {
    title: "Database Deadlock Elimination in Batch Settlement",
    badge: "PERFORMANCE",
    file: "src/processors/settlement.processor.ts",
    confidence: 94,
    reasoning: "Sorted account IDs prior to lock acquisition to guarantee deterministic locking order.",
    codeLines: [
      { type: "ctx", text: "  async executeSettlementBatch(entries: SettlementEntry[]) {" },
      { type: "del", text: "-   for (const entry of entries) {" },
      { type: "del", text: "-     await this.accountRepo.lockAndTransfer(entry.source, entry.dest, entry.amount);" },
      { type: "add", text: "+   // Prevent cyclic deadlocks by sorting account keys deterministically" },
      { type: "add", text: "+   const sortedEntries = entries.sort((a, b) => a.sourceId.localeCompare(b.sourceId));" },
      { type: "add", text: "+   return await this.txManager.withTransaction(async (tx) => {" },
      { type: "add", text: "+     for (const entry of sortedEntries) await tx.transfer(entry);" },
      { type: "add", text: "+   });" },
      { type: "ctx", text: "  }" },
    ],
  },
];

export function InteractiveDiffShowcase() {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const scenario = SCENARIOS[activeScenarioIdx];

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center">
          <MagicBadge>
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
            <span>SURGICAL UNIFIED PATCH SYNTHESIS</span>
          </MagicBadge>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          See Autonomous Engineering in Action
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto">
          Instead of blindly regenerating entire files, Wizard Pilot synthesizes minimal, safe unified git diffs backed by deterministic confidence math.
        </p>
      </div>

      {/* Scenario Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {SCENARIOS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setActiveScenarioIdx(idx)}
            className={`p-3 sm:p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              activeScenarioIdx === idx
                ? "bg-white dark:bg-slate-900 border-indigo-500 shadow-md ring-1 ring-indigo-500/50"
                : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-indigo-500/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <Badge variant={idx === 0 ? "lime" : idx === 1 ? "indigo" : "amber"}>
                {s.badge}
              </Badge>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {s.confidence}% Conf.
              </span>
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
              {s.title}
            </span>
          </button>
        ))}
      </div>

      {/* Live Diff Card */}
      <SpotlightCard
        className="p-0 overflow-hidden shadow-2xl border-slate-200 dark:border-slate-800"
        spotlightColor="rgba(99, 102, 241, 0.25)"
      >
        {/* Top File & Verification Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 font-mono text-xs">
          <div className="flex items-center space-x-2">
            <FileCode className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="text-slate-900 dark:text-slate-100 font-semibold">{scenario.file}</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <span className="flex items-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              100% Sandbox Tests Passed
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold">
              {scenario.confidence}% Mathematical Confidence
            </span>
          </div>
        </div>

        {/* Code Diff Display */}
        <div className="p-4 sm:p-5 bg-slate-950 text-slate-200 font-mono text-[11px] sm:text-xs overflow-x-auto leading-relaxed">
          {scenario.codeLines.map((line, idx) => (
            <div
              key={idx}
              className={`flex items-start py-0.5 px-2 rounded ${
                line.type === "add"
                  ? "bg-emerald-500/15 text-emerald-300 font-medium"
                  : line.type === "del"
                  ? "bg-rose-500/15 text-rose-300 line-through opacity-70"
                  : "text-slate-400"
              }`}
            >
              <span className="w-6 shrink-0 select-none opacity-40 text-right mr-3">
                {idx + 1}
              </span>
              <pre className="font-mono whitespace-pre">{line.text}</pre>
            </div>
          ))}
        </div>

        {/* Bottom Architectural Reasoning Callout */}
        <div className="p-3.5 sm:p-4 bg-slate-100/90 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-start space-x-2.5 text-xs text-slate-700 dark:text-slate-300">
          <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 dark:text-slate-100 font-mono text-[10px] uppercase block">
              Architectural Reasoning & Invariant Enforcement:
            </span>
            <p className="mt-0.5 text-slate-600 dark:text-slate-400">{scenario.reasoning}</p>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}
