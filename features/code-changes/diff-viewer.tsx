"use client";

import React, { useState } from "react";
import { FileCode, Copy, Check, Plus, Minus } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FileChangeItem {
  id?: string;
  path?: string;
  filePath?: string;
  changeType: "CREATE" | "MODIFY" | "DELETE";
  reason: string;
  diff: string;
}

interface DiffViewerProps {
  changes?: FileChangeItem[];
}

export function DiffViewer({ changes = [] }: DiffViewerProps) {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (changes.length === 0) {
    return (
      <SpotlightCard className="p-8 text-center space-y-3">
        <FileCode className="w-8 h-8 text-slate-400 mx-auto" />
        <p className="text-xs text-slate-500 dark:text-slate-400">No code changes or patches generated yet.</p>
      </SpotlightCard>
    );
  }

  const activeChange = changes[selectedFileIndex] || changes[0];
  const activePath = activeChange.path || activeChange.filePath || "src/index.ts";

  const copyPatchToClipboard = () => {
    navigator.clipboard.writeText(activeChange.diff || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const diffLines = (activeChange.diff || "").split("\n");

  return (
    <div className="flex flex-col space-y-4">
      {/* File Selector Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-1 md:pb-0">
          {changes.map((change, idx) => {
            const path = change.path || change.filePath || `file_${idx}`;
            const fileName = path.split("/").pop();
            return (
              <button
                key={path + idx}
                onClick={() => setSelectedFileIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                  selectedFileIndex === idx
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-500/40 shadow-xs font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{fileName}</span>
                <Badge
                  variant={
                    change.changeType === "CREATE"
                      ? "lime"
                      : change.changeType === "DELETE"
                      ? "danger"
                      : "indigo"
                  }
                  size="sm"
                >
                  {change.changeType}
                </Badge>
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-2 self-end md:self-auto">
          <Button variant="ghost" size="sm" onClick={copyPatchToClipboard}>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="text-xs">{copied ? "Copied" : "Copy Diff"}</span>
          </Button>
        </div>
      </div>

      {/* Rationale Callout */}
      {activeChange.reason && (
        <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 text-xs text-slate-800 dark:text-slate-200">
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold font-mono text-[11px] block mb-1">
            Patch Intent & Architectural Constraint:
          </span>
          <p className="leading-relaxed">{activeChange.reason}</p>
        </div>
      )}

      {/* Diff Code Container */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs shadow-lg">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px]">
          <span className="text-slate-300 font-semibold">{activePath}</span>
          <span>Unified Git Diff</span>
        </div>

        <div className="overflow-x-auto max-h-[500px] p-3 space-y-0.5">
          {diffLines.map((line, idx) => {
            const isAddition = line.startsWith("+") && !line.startsWith("+++");
            const isDeletion = line.startsWith("-") && !line.startsWith("---");
            const isHunkHeader = line.startsWith("@@");

            let bgClass = "hover:bg-slate-900/60 text-slate-300";
            let prefixIcon = null;

            if (isAddition) {
              bgClass = "bg-emerald-950/40 text-emerald-400 border-l-2 border-emerald-500";
              prefixIcon = <Plus className="w-3 h-3 inline mr-1 text-emerald-400 shrink-0" />;
            } else if (isDeletion) {
              bgClass = "bg-rose-950/40 text-rose-400 border-l-2 border-rose-500";
              prefixIcon = <Minus className="w-3 h-3 inline mr-1 text-rose-400 shrink-0" />;
            } else if (isHunkHeader) {
              bgClass = "bg-indigo-950/40 text-indigo-300 font-semibold py-1";
            }

            return (
              <div
                key={idx}
                className={`flex items-center px-3 py-0.5 rounded-xs whitespace-pre ${bgClass}`}
              >
                <span className="w-8 select-none text-slate-600 text-[10px] shrink-0 text-right pr-2">
                  {idx + 1}
                </span>
                <span className="flex-1 truncate">
                  {prefixIcon}
                  {line}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
