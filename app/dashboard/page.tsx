"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  CheckCircle,
  Boxes,
  ShieldCheck,
  PlusCircle,
  FolderGit2,
  GitBranch,
  Terminal,
  Layers,
  ArrowUpRight,
  Sparkles,
  Play,
  RotateCcw,
  Trash2,
  TrendingUp,
  Cpu,
  BarChart3,
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { MagicBadge } from "@/components/ui/magic-badge";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatTimeAgo } from "@/lib/utils";
import { API_ROUTES, fetchApi } from "@/lib/config/api-routes";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { AIPromptConsole } from "@/components/dashboard/ai-prompt-console";

export default function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [projRes, runsRes] = await Promise.all([
        fetchApi(API_ROUTES.PROJECTS.LIST),
        fetchApi("/api/runs"),
      ]);

      if (projRes.success && Array.isArray(projRes.data)) {
        setProjects(projRes.data);
      }
      if (runsRes.success && Array.isArray(runsRes.data)) {
        setRuns(runsRes.data);
      }
    } catch {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this repository project?")) return;

    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setRuns((prev) => prev.filter((r) => r.projectId !== projectId));

    await fetchApi(API_ROUTES.PROJECTS.DELETE(projectId), { method: "DELETE" });
  };

  const handleDeleteRun = async (runId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this run record?")) return;

    setRuns((prev) => prev.filter((r) => r.id !== runId));
    await fetchApi(API_ROUTES.RUNS.DELETE(runId), { method: "DELETE" });
  };

  const activeRuns = runs.filter((r) => r.status !== "COMPLETED" && r.status !== "FAILED" && r.status !== "CANCELLED");
  const verifiedRuns = runs.filter((r) => r.status === "COMPLETED");

  const avgConfidence = verifiedRuns.length > 0
    ? Math.round(verifiedRuns.reduce((acc, r) => acc + (r.confidenceScore || 0), 0) / verifiedRuns.length)
    : 0;

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-7">
      <div className="max-w-6xl mx-auto w-full space-y-6 sm:space-y-8">
        {/* Top Banner Hero */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800/80">
        <div className="space-y-2">
          <div className="inline-flex items-center">
            <MagicBadge>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
              <span>AUTONOMOUS ENGINE ACTIVE</span>
            </MagicBadge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Engineering Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Autonomous AI software engineering pipeline with isolated sandbox verification, AST-level code intelligence, and verified patch delivery.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Link href="/projects/new" className="w-full sm:w-auto">
            <ShimmerButton className="w-full sm:w-auto flex items-center justify-center">
              <PlusCircle className="w-4 h-4 mr-1.5" />
              <span>Connect Repository</span>
            </ShimmerButton>
          </Link>
        </div>
      </div>

      {/* 3-Step Guided Workflow Banner for Users */}
      <SpotlightCard className="p-4 sm:p-5 bg-gradient-to-r from-indigo-500/5 via-sky-500/5 to-emerald-500/5 border-indigo-500/20" spotlightColor="rgba(99, 102, 241, 0.15)">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                How Autonomous Engineering Works on Wizard Pilot
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                A deterministic 3-step workflow from GitHub prompt to verified code patch.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full md:w-auto text-xs">
            <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
              <span className="font-medium text-slate-800 dark:text-slate-200 text-[11px]">Connect GitHub Repo</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
              <span className="font-medium text-slate-800 dark:text-slate-200 text-[11px]">Describe Requirement</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
              <span className="font-medium text-slate-800 dark:text-slate-200 text-[11px]">Inspect & Verify Run</span>
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* KPI Telemetry Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <SpotlightCard className="p-3.5 sm:p-5" spotlightColor="rgba(56, 189, 248, 0.2)">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-medium">
            <span>Connected Repos</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Boxes className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
            <span className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {projects.length}
            </span>
            <span className="text-[9px] sm:text-[11px] text-slate-500 font-mono">active projects</span>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-3.5 sm:p-5" spotlightColor="rgba(99, 102, 241, 0.2)">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-medium">
            <span>Active Pipelines</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
            <span className="text-xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400 font-mono">
              {activeRuns.length}
            </span>
            <span className="text-[9px] sm:text-[11px] text-slate-500 font-mono">in execution</span>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-3.5 sm:p-5" spotlightColor="rgba(74, 222, 128, 0.2)">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-medium">
            <span>Verified Runs</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
            <span className="text-xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {verifiedRuns.length}
            </span>
            <span className="text-[9px] sm:text-[11px] text-slate-500 font-mono">100% verified</span>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-3.5 sm:p-5" spotlightColor="rgba(251, 191, 36, 0.2)">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-medium">
            <span>Avg Confidence</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
            <span className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {avgConfidence > 0 ? `${avgConfidence}%` : "—"}
            </span>
            <span className="text-[9px] sm:text-[11px] text-slate-500 font-mono">deterministic</span>
          </div>
        </SpotlightCard>
      </div>

      {/* Interactive AI Engineer Prompt Console & Live Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        <div className="lg:col-span-6">
          <AIPromptConsole projects={projects} />
        </div>
        <div className="lg:col-span-6">
          <AnalyticsCharts runs={runs} />
        </div>
      </div>

      {/* Main Content Area: Repositories & Recent Activity */}
      {!loading && projects.length === 0 ? (
        <SpotlightCard className="p-6 sm:p-12 text-center space-y-4" spotlightColor="rgba(99, 102, 241, 0.25)">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
            <FolderGit2 className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              No Repositories Connected
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Connect one of your GitHub repositories to inspect its module hierarchy, visualize its architecture graph, and execute verified autonomous pipelines.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/projects/new" className="inline-block w-full sm:w-auto">
              <ShimmerButton className="w-full sm:w-auto">
                <PlusCircle className="w-4 h-4 mr-1.5" />
                <span>Connect Your First Repository</span>
              </ShimmerButton>
            </Link>
          </div>
        </SpotlightCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Target Repositories Section */}
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold flex items-center space-x-1.5">
                <Boxes className="w-4 h-4 text-indigo-500" />
                <span>Connected Repositories ({projects.length})</span>
              </h2>
              <Link href="/projects/new" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                + Connect
              </Link>
            </div>

            <div className="space-y-3">
              {projects.map((project) => (
                <SpotlightCard key={project.id} className="p-4 space-y-3" spotlightColor="rgba(99, 102, 241, 0.15)">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{project.name}</h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block mt-0.5 truncate max-w-[200px]">
                        {project.repositoryUrl}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5 shrink-0">
                      <Badge variant="indigo" size="sm">
                        {project.defaultBranch}
                      </Badge>
                      <button
                        onClick={(e) => handleDeleteProject(project.id, e)}
                        title="Delete Project"
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Link href={`/projects/${project.id}/runs/new`} className="flex-1">
                      <Button variant="primary" size="sm" className="w-full text-xs">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Run</span>
                      </Button>
                    </Link>
                    <Link href={`/projects/${project.id}/architecture`} className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full text-xs">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Graph</span>
                      </Button>
                    </Link>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>

          {/* Recent Engineering Runs */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold flex items-center space-x-1.5">
                <Terminal className="w-4 h-4 text-sky-500" />
                <span>Recent Autonomous Runs ({runs.length})</span>
              </h2>
            </div>

            {runs.length === 0 ? (
              <SpotlightCard className="p-8 text-center space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">No engineering runs launched yet.</p>
                <Link href="/projects/new">
                  <Button variant="outline" size="sm">
                    Launch First Run
                  </Button>
                </Link>
              </SpotlightCard>
            ) : (
              <div className="space-y-3">
                {runs.map((run) => (
                  <SpotlightCard
                    key={run.id}
                    className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    spotlightColor="rgba(56, 189, 248, 0.15)"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0 w-full sm:w-auto">
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            run.status === "COMPLETED"
                              ? "lime"
                              : run.status === "FAILED"
                              ? "danger"
                              : "cyan"
                          }
                          size="sm"
                        >
                          {run.status}
                        </Badge>
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center space-x-1 truncate">
                          <GitBranch className="w-3 h-3 text-indigo-500 shrink-0" />
                          <span className="truncate">{run.branch}</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-900 dark:text-slate-100 font-medium line-clamp-2">
                        {run.requirement}
                      </p>
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        {run.confidenceScore ? `Score: ${run.confidenceScore}% • ` : ""}
                        {formatTimeAgo(new Date(run.createdAt))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                      <Link href={`/projects/${run.projectId}/runs/${run.id}`}>
                        <Button variant="outline" size="sm">
                          <span>Inspect</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <button
                        onClick={(e) => handleDeleteRun(run.id, e)}
                        title="Delete Run Record"
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer border border-transparent hover:border-rose-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
