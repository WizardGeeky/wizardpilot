"use client";

import React, { useState, useEffect } from "react";
import { Terminal, CheckCircle, Cpu, ShieldCheck, Play, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SIMULATED_STREAM = [
  { agent: "Requirement Analyst", text: "Analyzing: 'Implement idempotency check on cancellation'", status: "done" },
  { agent: "Repository Intelligence", text: "Mapped 247 files across 14 modules (TypeScript / Spring Boot)", status: "done" },
  { agent: "Architecture Analyst", text: "Identified concurrency race condition in RefundProcessor.java", status: "done" },
  { agent: "Implementation Agent", text: "Synthesized atomic check-then-act patch across 3 files", status: "done" },
  { agent: "Sandbox Test Agent", text: "Ephemeral Docker container spawned: 58 unit tests PASSED (1,840ms)", status: "done" },
  { agent: "Security Auditor", text: "Static scan complete: 0 critical vulnerabilities, 0 hardcoded secrets", status: "done" },
  { agent: "Verification Agent", text: "Calculated deterministic confidence score: 94% [FINAL AUTHORITY PASSED]", status: "success" },
];

export function HeroTerminal() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % (SIMULATED_STREAM.length + 1));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all text-left">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-[11px] font-mono text-slate-500 ml-2 font-medium">wizardpilot-engine — bash</span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="lime" size="sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
            LIVE PIPELINE
          </Badge>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 sm:p-6 font-mono text-xs space-y-3 min-h-[300px] flex flex-col justify-between">
        <div className="space-y-2.5">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-[11px]">
            <span>$</span>
            <span>wizardpilot run --repo=payment-service --task=&quot;Fix duplicate refund race condition&quot;</span>
          </div>

          {SIMULATED_STREAM.slice(0, Math.max(1, activeStep)).map((step, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border transition-all flex items-start space-x-2.5 text-xs ${
                step.status === "success"
                  ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                  : "bg-slate-50/60 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
              }`}
            >
              {step.status === "success" ? (
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <span className="font-bold text-[11px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mr-2">
                  [{step.agent}]
                </span>
                <span className="text-[11px]">{step.text}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Live Status Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-500 animate-spin-once" />
            <span>Sandbox Isolation: Ephemeral Docker runtime</span>
          </div>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">Score: 94% Verified</span>
        </div>
      </div>
    </div>
  );
}
