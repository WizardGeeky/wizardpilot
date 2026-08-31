"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Terminal, Sparkles, Play, GitBranch, ArrowRight, ShieldCheck } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { API_ROUTES, fetchApi } from "@/lib/config/api-routes";

export default function NewEngineeringRunPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = (params?.projectId as string) || "";

  const [requirement, setRequirement] = useState(
    "Implement idempotency check to prevent race conditions during order cancellation."
  );
  const [branch, setBranch] = useState("fix/cancellation-idempotent-refund");
  const [loading, setLoading] = useState(false);

  const presets = [
    {
      title: "Duplicate Refund on Cancellation",
      badge: "RECOMMENDED",
      branch: "fix/cancellation-idempotent-refund",
      text: "Investigate cancellation flow and fix double-refund race conditions without breaking existing behavior.",
    },
    {
      title: "Webhook Concurrency Collision",
      badge: "CONCURRENCY",
      branch: "fix/webhook-concurrency-lock",
      text: "Simultaneous webhook deliveries trigger duplicate event notifications. Introduce distributed lock checks.",
    },
    {
      title: "Database Deadlock in Batch Settlement",
      badge: "DATABASE",
      branch: "perf/ledger-settlement-deadlock",
      text: "End-of-day batch job experiences row-level deadlocks. Optimize transactional lock acquisitions.",
    },
  ];

  const handleStartRun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requirement) return;

    setLoading(true);
    try {
      const data = await fetchApi(API_ROUTES.RUNS.CREATE, {
        method: "POST",
        body: JSON.stringify({
          projectId,
          branch,
          requirement,
        }),
      });

      if (data.success && data.data?.id) {
        router.push(`/projects/${projectId}/runs/${data.data.id}`);
      } else {
        router.push(`/projects/${projectId}/runs`);
      }
    } catch {
      router.push(`/projects/${projectId}/runs`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-7">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        {/* Header */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-200 dark:border-slate-800/80">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
          <Terminal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Launch Autonomous Engineering Run
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Engage the 8-agent autonomous pipeline to investigate, plan, implement, test, and verify your requirement.
          </p>
        </div>
      </div>

      {/* Preset Scenarios */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          One-Click Engineering Presets
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setRequirement(p.text);
                setBranch(p.branch);
              }}
              className="text-left p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-2 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <Badge variant={idx === 0 ? "lime" : "indigo"}>{p.badge}</Badge>
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              </div>
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-200">{p.title}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {p.text}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Run Form */}
      <SpotlightCard className="p-6">
        <form onSubmit={handleStartRun} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Target Git Branch
            </label>
            <div className="relative">
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="e.g. fix/cancellation-idempotent-refund"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono"
                required
              />
              <GitBranch className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Engineering Requirement & Scope
            </label>
            <textarea
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              rows={5}
              placeholder="Describe the bug, feature, or refactoring task in detail..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 leading-relaxed"
              required
            />
          </div>

          {/* Pipeline Notice */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between text-slate-700 dark:text-slate-300">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Isolated sandbox execution with 100% test & confidence validation</span>
            </div>
            <Badge variant="indigo">8 AGENTS READY</Badge>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <ShimmerButton
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{loading ? "Dispatching Agents..." : "Start Autonomous Run"}</span>
            </ShimmerButton>
          </div>
        </form>
      </SpotlightCard>
      </div>
    </div>
  );
}
