"use client";

import React from "react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Badge } from "@/components/ui/badge";

interface SecurityFindingItem {
  id?: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  filePath?: string;
  lineNumber?: number;
  title: string;
  description: string;
  recommendation: string;
  cwe?: string;
}

interface SecurityViewerProps {
  findings?: SecurityFindingItem[];
}

export function SecurityViewer({ findings = [] }: SecurityViewerProps) {
  const criticalCount = findings.filter((i) => i.severity === "CRITICAL").length;
  const highCount = findings.filter((i) => i.severity === "HIGH").length;
  const mediumCount = findings.filter((i) => i.severity === "MEDIUM").length;
  const lowCount = findings.filter((i) => i.severity === "LOW").length;

  return (
    <div className="flex flex-col space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Static Security & Vulnerability Analysis
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={findings.length === 0 ? "lime" : "amber"}>
            {findings.length === 0 ? "ALL CHECKS PASSED" : `${findings.length} FINDINGS`}
          </Badge>
        </div>
      </div>

      {/* Severity Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500 block text-[10px]">CRITICAL</span>
          <span className={`text-base font-bold ${criticalCount > 0 ? "text-rose-500" : "text-slate-400"}`}>
            {criticalCount}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500 block text-[10px]">HIGH</span>
          <span className={`text-base font-bold ${highCount > 0 ? "text-rose-500" : "text-slate-400"}`}>
            {highCount}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500 block text-[10px]">MEDIUM</span>
          <span className={`text-base font-bold ${mediumCount > 0 ? "text-amber-500" : "text-slate-400"}`}>
            {mediumCount}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500 block text-[10px]">LOW</span>
          <span className="text-base font-bold text-slate-400">{lowCount}</span>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {findings.length === 0 ? (
          <SpotlightCard className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-xs text-slate-900 dark:text-slate-100 font-semibold">No Security Vulnerabilities Detected</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Automated static scan verified clean credentials, safe queries, and absence of command injections.
            </p>
          </SpotlightCard>
        ) : (
          findings.map((item, idx) => (
            <SpotlightCard key={item.id || idx} className="p-4 space-y-2.5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        item.severity === "CRITICAL" || item.severity === "HIGH"
                          ? "danger"
                          : item.severity === "MEDIUM"
                          ? "amber"
                          : "indigo"
                      }
                      size="sm"
                    >
                      {item.severity}
                    </Badge>
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">{item.title}</span>
                  </div>
                  {item.filePath && (
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      {item.filePath}
                      {item.lineNumber ? `:${item.lineNumber}` : ""}
                    </span>
                  )}
                </div>

                {item.cwe && (
                  <Badge variant="outline" size="sm">
                    {item.cwe}
                  </Badge>
                )}
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{item.description}</p>

              <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/30 text-[11px] text-emerald-700 dark:text-emerald-300 space-y-0.5">
                <span className="font-semibold block text-[10px] uppercase font-mono text-emerald-600 dark:text-emerald-400">
                  Remediation Guidance:
                </span>
                <p>{item.recommendation}</p>
              </div>
            </SpotlightCard>
          ))
        )}
      </div>
    </div>
  );
}
