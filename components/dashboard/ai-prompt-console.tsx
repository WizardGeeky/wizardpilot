"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Terminal, ArrowRight, Boxes, Play, Cpu } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Button } from "@/components/ui/button";
import { API_ROUTES, fetchApi } from "@/lib/config/api-routes";

interface AIPromptConsoleProps {
  projects: any[];
}

export function AIPromptConsole({ projects }: AIPromptConsoleProps) {
  const router = useRouter();
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || "");
  const [promptText, setPromptText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim() || !selectedProjectId) return;

    setLoading(true);
    try {
      const res = await fetchApi(API_ROUTES.RUNS.CREATE, {
        method: "POST",
        body: JSON.stringify({
          projectId: selectedProjectId,
          requirement: promptText.trim(),
        }),
      });

      if (res.success && res.data?.id) {
        router.push(`/projects/${selectedProjectId}/runs/${res.data.id}`);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Implement idempotency key check to prevent duplicate refund race conditions",
    "Add JWT token refresh middleware with exponential backoff on 401",
    "Refactor database connection pool timeout to prevent pool exhaustion under load",
  ];

  return (
    <SpotlightCard className="p-5 space-y-4" spotlightColor="rgba(56, 189, 248, 0.2)">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Autonomous AI Engineer Console
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Instruct the 8-agent pipeline to investigate, plan, code, test, and verify.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleLaunch} className="space-y-3">
        {/* Repo Selector & Prompt Box */}
        <div className="space-y-2">
          {projects.length > 0 ? (
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-slate-500 shrink-0">Target Repo:</span>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-white dark:bg-slate-900">
                    {p.name} ({p.defaultBranch || "main"})
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="relative">
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Describe the software engineering requirement, bug fix, or feature..."
              rows={3}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono resize-none leading-relaxed"
              required
            />
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Suggested Engineering Scenarios:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPromptText(q)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer truncate max-w-full"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={loading || projects.length === 0}
            className="w-full sm:w-auto"
          >
            <Play className="w-4 h-4 mr-1.5" />
            <span>{loading ? "Engaging Pipeline..." : "Dispatch Autonomous Run"}</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </form>
    </SpotlightCard>
  );
}
