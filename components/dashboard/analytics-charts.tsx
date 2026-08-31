"use client";

import React, { useState } from "react";
import { Activity, TrendingUp, ShieldCheck, Clock, CheckCircle2, Zap } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Badge } from "@/components/ui/badge";

interface AnalyticsChartsProps {
  runs: any[];
}

export function AnalyticsCharts({ runs }: AnalyticsChartsProps) {
  const [metricTab, setMetricTab] = useState<"confidence" | "latency" | "distribution">("confidence");

  // Synthetic sample or real points
  const confidencePoints = runs.length > 0
    ? runs.map((r, i) => ({
        label: `Run #${runs.length - i}`,
        value: r.confidenceScore || 90,
      })).reverse()
    : [
        { label: "Run #1", value: 85 },
        { label: "Run #2", value: 92 },
        { label: "Run #3", value: 88 },
        { label: "Run #4", value: 95 },
        { label: "Run #5", value: 94 },
        { label: "Run #6", value: 98 },
      ];

  const agentLatencies = [
    { agent: "Requirement", ms: 420, pct: 85 },
    { agent: "Repository", ms: 680, pct: 92 },
    { agent: "Architecture", ms: 890, pct: 90 },
    { agent: "Implementation", ms: 1420, pct: 95 },
    { agent: "Sandbox Tests", ms: 1840, pct: 100 },
    { agent: "Security Audit", ms: 350, pct: 98 },
    { agent: "Verification", ms: 210, pct: 99 },
  ];

  return (
    <SpotlightCard className="p-5 space-y-4" spotlightColor="rgba(99, 102, 241, 0.15)">
      {/* Header & Metric Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Pipeline Analytics & Telemetry
          </h3>
        </div>

        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setMetricTab("confidence")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              metricTab === "confidence"
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Confidence Trend
          </button>
          <button
            onClick={() => setMetricTab("latency")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              metricTab === "latency"
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Agent Latencies
          </button>
        </div>
      </div>

      {/* Tab 1: Confidence Trend SVG Area Chart */}
      {metricTab === "confidence" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Deterministic Verification Score Over Runs</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">Avg: 94%</span>
          </div>

          <div className="h-44 w-full relative">
            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="currentColor" strokeOpacity="0.08" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="currentColor" strokeOpacity="0.08" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="currentColor" strokeOpacity="0.08" />

              {/* Area */}
              <polygon
                fill="url(#areaGradient)"
                points="0,150 0,60 100,40 200,55 300,25 400,30 500,15 500,150"
              />

              {/* Line */}
              <polyline
                fill="none"
                stroke="#6366F1"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,60 100,40 200,55 300,25 400,30 500,15"
              />

              {/* Points */}
              {[
                { cx: 0, cy: 60, val: "85%" },
                { cx: 100, cy: 40, val: "92%" },
                { cx: 200, cy: 55, val: "88%" },
                { cx: 300, cy: 25, val: "95%" },
                { cx: 400, cy: 30, val: "94%" },
                { cx: 500, cy: 15, val: "98%" },
              ].map((pt, i) => (
                <g key={i}>
                  <circle cx={pt.cx} cy={pt.cy} r="5" fill="#6366F1" className="animate-pulse" />
                  <circle cx={pt.cx} cy={pt.cy} r="2.5" fill="#FFFFFF" />
                </g>
              ))}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
            <span>Historical baseline</span>
            <span>Latest verified release</span>
          </div>
        </div>
      )}

      {/* Tab 2: Agent Latencies Bar Chart */}
      {metricTab === "latency" && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Execution Duration Per Agent Phase</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold font-mono">Total: ~5.8s</span>
          </div>

          <div className="space-y-2">
            {agentLatencies.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{item.agent}</span>
                  <span className="font-mono text-slate-500">{item.ms}ms</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 transition-all duration-500"
                    style={{ width: `${(item.ms / 1840) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </SpotlightCard>
  );
}
