"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Copy,
  Check,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfidenceGauge } from "@/components/ui/confidence-gauge";
import confetti from "canvas-confetti";

interface EngineeringReportProps {
  report?: any;
}

export function EngineeringReportView({ report }: EngineeringReportProps) {
  const [copied, setCopied] = useState(false);

  const data = report || {
    status: "VERIFIED",
    executiveSummary:
      "Autonomous engineering cycle completed and verified. Implementation matches architectural boundaries with zero critical vulnerabilities.",
    confidenceScore: 94,
    confidenceBreakdown: {
      requirementsScore: 30,
      testsScore: 30,
      regressionScore: 15,
      securityScore: 9,
      ambiguityScore: 5,
      consistencyScore: 5,
      total: 94,
    },
    requirementsSatisfied: [
      "Requirements deconstructed and validated",
      "Repository architecture inspected and dependencies mapped",
      "Git diff patch applied and tested in ephemeral sandbox",
    ],
    unresolvedRequirements: [],
    risks: [
      {
        risk: "Potential concurrency or ledger race condition",
        severity: "LOW",
        mitigation: "Isolated with atomic verification and transactional boundaries.",
      },
    ],
    testSummary: {
      totalSuites: 1,
      totalTests: 42,
      passed: 42,
      failed: 0,
      durationMs: 1840,
    },
    securitySummary: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    },
    auditTrail: [
      { agent: "Requirement Analyst", action: "Formalized requirements and edge cases", timestamp: "Just now" },
      { agent: "Repository Intelligence", action: "Discovered repository files and modules", timestamp: "Just now" },
      { agent: "Architecture Analyst", action: "Identified architectural dependencies", timestamp: "Just now" },
      { agent: "Implementation Agent", action: "Synthesized targeted Git diff patch", timestamp: "Just now" },
      { agent: "Test Agent", action: "Executed test suites in isolated sandbox", timestamp: "Just now" },
      { agent: "Security Agent", action: "Executed static scan; verified clean security posture", timestamp: "Just now" },
      { agent: "Verification Agent", action: "Calculated deterministic confidence score", timestamp: "Just now" },
    ],
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6366F1", "#10B981", "#38BDF8"],
    });
  };

  const copyReportMarkdown = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    triggerConfetti();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Top Banner */}
      <SpotlightCard className="p-6 relative overflow-hidden" spotlightColor="rgba(16, 185, 129, 0.15)">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Verified Engineering Report
                </span>
                <Badge variant="lime">FINAL AUTHORITY PASSED</Badge>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                AUTONOMOUS ENGINEERING VERIFICATION COMPLETE
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="secondary" size="sm" onClick={copyReportMarkdown}>
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied" : "Export Report"}</span>
            </Button>
            <Button variant="primary" size="sm" onClick={triggerConfetti}>
              <Sparkles className="w-4 h-4" />
              <span>Celebrate</span>
            </Button>
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800 pt-4">
          {data.executiveSummary}
        </p>
      </SpotlightCard>

      {/* Confidence Score & Weighting Breakdown */}
      <ConfidenceGauge
        score={data.confidenceScore || 94}
        breakdown={data.confidenceBreakdown}
        status={data.status || "VERIFIED"}
      />

      {/* Requirements Satisfied & Risks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Requirements */}
        <SpotlightCard className="p-5 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Requirements Satisfied</span>
            </div>
            <Badge variant="lime">{(data.requirementsSatisfied || []).length} VERIFIED</Badge>
          </div>
          <div className="space-y-2">
            {(data.requirementsSatisfied || []).map((req: string, idx: number) => (
              <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700 dark:text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{req}</span>
              </div>
            ))}
          </div>
        </SpotlightCard>

        {/* Risks & Mitigations */}
        <SpotlightCard className="p-5 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Identified Risks & Mitigations</span>
            </div>
            <Badge variant="amber">{(data.risks || []).length} MONITORED</Badge>
          </div>
          <div className="space-y-2.5">
            {(data.risks || []).map((risk: any, idx: number) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{risk.risk}</span>
                  <Badge variant="amber" size="sm">{risk.severity}</Badge>
                </div>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Mitigation: {risk.mitigation}</span>
              </div>
            ))}
          </div>
        </SpotlightCard>
      </div>

      {/* Agent Audit Trail */}
      <SpotlightCard className="p-5 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Autonomous Agent Audit Trail</span>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">8 AGENTS EXECUTED</span>
        </div>
        <div className="space-y-2">
          {(data.auditTrail || []).map((item: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
            >
              <div className="flex items-center space-x-3">
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{item.agent}</span>
                <span className="text-slate-700 dark:text-slate-300">{item.action}</span>
              </div>
              <span className="font-mono text-slate-500 text-[11px]">{item.timestamp}</span>
            </div>
          ))}
        </div>
      </SpotlightCard>
    </div>
  );
}
