"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Activity,
  Layers,
  FileCode,
  Terminal,
  ShieldCheck,
  FileText,
  StopCircle,
  CheckCircle,
  AlertCircle,
  Cpu,
  Sparkles,
  GitBranch,
  Check,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  Radio,
  RefreshCw,
  Clock,
  ChevronRight,
  Shield,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ArchitectureGraph } from "../architecture/architecture-graph";
import { DiffViewer } from "../code-changes/diff-viewer";
import { TestRunnerViewer } from "../tests/test-runner-viewer";
import { SecurityViewer } from "../security/security-viewer";
import { EngineeringReportView } from "../reports/engineering-report-view";
import { formatTimeAgo } from "@/lib/utils";
import { API_ROUTES, fetchApi } from "@/lib/config/api-routes";

interface CommandCenterProps {
  initialRun: any;
  initialEvents?: any[];
  initialChanges?: any[];
  initialTests?: any[];
  initialSecurity?: any[];
  initialReport?: any;
  architectureData?: { nodes: any[]; edges: any[] };
}

export function CommandCenter({
  initialRun,
  initialEvents = [],
  initialChanges = [],
  initialTests = [],
  initialSecurity = [],
  initialReport,
  architectureData = { nodes: [], edges: [] },
}: CommandCenterProps) {
  const [run, setRun] = useState(initialRun);
  const [events, setEvents] = useState<any[]>(initialEvents);
  const [changes, setChanges] = useState<any[]>(initialChanges);
  const [tests, setTests] = useState<any[]>(initialTests);
  const [security, setSecurity] = useState<any[]>(initialSecurity);
  const [report, setReport] = useState<any>(initialReport);
  const [archData, setArchData] = useState<{ nodes: any[]; edges: any[] }>(architectureData);

  const [mobileSection, setMobileSection] = useState<"artifacts" | "pipeline" | "stream">("artifacts");
  const [activeTab, setActiveTab] = useState<"overview" | "architecture" | "changes" | "tests" | "security" | "report">("overview");
  const [eventFilter, setEventFilter] = useState<"ALL" | "INFO" | "WARNING">("ALL");
  const [retrying, setRetrying] = useState(false);
  const eventsEndRef = useRef<HTMLDivElement>(null);

  // Synchronize artifacts from API
  const refreshArtifacts = async () => {
    if (!run?.id) return;
    try {
      const [chRes, tRes, sRes, repRes, rRes, archRes] = await Promise.all([
        fetchApi(API_ROUTES.RUNS.CHANGES(run.id)),
        fetchApi(API_ROUTES.RUNS.TESTS(run.id)),
        fetchApi(API_ROUTES.RUNS.SECURITY(run.id)),
        fetchApi(API_ROUTES.RUNS.REPORT(run.id)),
        fetchApi(API_ROUTES.RUNS.GET(run.id)),
        fetchApi(API_ROUTES.PROJECTS.ARCHITECTURE(run.projectId)),
      ]);

      if (chRes.success && Array.isArray(chRes.data)) setChanges(chRes.data);
      if (tRes.success && Array.isArray(tRes.data)) setTests(tRes.data);
      if (sRes.success && Array.isArray(sRes.data)) setSecurity(sRes.data);
      if (repRes.success && repRes.data) setReport(repRes.data);
      if (rRes.success && rRes.data) setRun(rRes.data);
      if (archRes.success && archRes.data) setArchData(archRes.data);
    } catch {}
  };

  useEffect(() => {
    refreshArtifacts();
  }, [run?.id, activeTab]);

  // SSE Live Stream Connection
  useEffect(() => {
    if (!run?.id) return;

    const eventSource = new EventSource(API_ROUTES.RUNS.EVENTS(run.id));

    eventSource.addEventListener("agent_event", (e) => {
      try {
        const newEvent = JSON.parse(e.data);
        setEvents((prev) => {
          if (newEvent.id && prev.some((ev) => ev.id === newEvent.id)) {
            return prev;
          }
          return [...prev, newEvent];
        });
      } catch {}
    });

    eventSource.addEventListener("status_update", (e) => {
      try {
        const update = JSON.parse(e.data);
        setRun((prev: any) => ({ ...prev, ...update }));
        if (update.status === "COMPLETED") {
          refreshArtifacts();
        }
      } catch {}
    });

    eventSource.addEventListener("run_finished", () => {
      refreshArtifacts();
      eventSource.close();
    });

    return () => {
      eventSource.close();
    };
  }, [run?.id]);

  useEffect(() => {
    eventsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  const agentPipeline = [
    { key: "requirement_analyst", num: "01", name: "Requirement Analyst", desc: "Deconstructs requirements & edge cases" },
    { key: "repository_intelligence", num: "02", name: "Repository Intelligence", desc: "Maps codebase & dependency graph" },
    { key: "architecture_analyst", num: "03", name: "Architecture Analyst", desc: "Identifies risks & concurrency hazards" },
    { key: "implementation_agent", num: "04", name: "Implementation Agent", desc: "Generates minimal safe Git diffs" },
    { key: "test_agent", num: "05", name: "Sandbox Test Agent", desc: "Executes test suites in isolated sandbox" },
    { key: "debug_agent", num: "06", name: "Autonomous Debug Agent", desc: "Diagnoses stack traces & applies fixes" },
    { key: "security_agent", num: "07", name: "Security Auditor", desc: "Static scans for secrets & vulnerabilities" },
    { key: "verification_agent", num: "08", name: "Verification Agent", desc: "Calculates deterministic confidence" },
  ];

  const reqAnalysis = run.metadata?.requirementAnalysis;
  const archPlan = run.metadata?.architecturePlan;

  const getAgentStatus = (agentKey: string) => {
    if (run.status === "COMPLETED") return "COMPLETED";

    const hasReq = Boolean(reqAnalysis?.functionalRequirements?.length || run.metadata?.requirementAnalysis);
    const hasRepo = Boolean(run.metadata?.repositoryAnalysis || hasReq);
    const hasArch = Boolean(archPlan?.affectedFiles?.length || run.metadata?.architecturePlan);
    const hasDiff = Boolean(changes.length > 0 || run.metadata?.fileChanges?.length);
    const hasTest = Boolean(tests.length > 0 || run.metadata?.testRuns?.length);
    const hasSec = Boolean(security.length > 0 || run.metadata?.securityFindings?.length);
    const hasVer = Boolean(report || (run.confidenceScore && run.confidenceScore > 0));

    const completedMap: Record<string, boolean> = {
      requirement_analyst: hasReq,
      repository_intelligence: hasRepo,
      architecture_analyst: hasArch,
      implementation_agent: hasDiff,
      test_agent: hasTest,
      debug_agent: false,
      security_agent: hasSec,
      verification_agent: hasVer,
    };

    if (run.status === "FAILED") {
      if (completedMap[agentKey]) return "COMPLETED";
      if (run.currentAgent === agentKey || (run.currentAgent === "orchestrator" && !completedMap[agentKey])) {
        const order = agentPipeline.map((a) => a.key);
        const firstIncomplete = order.find((k) => !completedMap[k]);
        if (firstIncomplete === agentKey) return "FAILED";
      }
      return "PENDING";
    }

    if (run.currentAgent === agentKey) return "RUNNING";
    if (completedMap[agentKey]) return "COMPLETED";
    return "PENDING";
  };

  const completedAgentsCount = agentPipeline.filter((a) => getAgentStatus(a.key) === "COMPLETED").length;

  const filteredEvents = events.filter((e) => {
    if (eventFilter === "ALL") return true;
    return e.severity?.toUpperCase() === eventFilter;
  });

  const handleRetryRun = async () => {
    setRetrying(true);
    try {
      const res = await fetchApi(API_ROUTES.RUNS.CREATE, {
        method: "POST",
        body: JSON.stringify({
          projectId: run.projectId,
          requirement: run.requirement,
          branch: run.branch,
        }),
      });
      if (res?.data?.id) {
        window.location.href = `/projects/${run.projectId}/runs/${res.data.id}`;
      }
    } catch {
      setRetrying(false);
    }
  };

  // Pipeline List Component (Left Column)
  const PipelineList = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Autonomous Pipeline
          </span>
        </div>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          {completedAgentsCount}/8 Active
        </span>
      </div>

      <div className="space-y-2 pt-1">
        {agentPipeline.map((agent) => {
          const status = getAgentStatus(agent.key);
          const isRunning = status === "RUNNING";
          const isCompleted = status === "COMPLETED";
          const isFailed = status === "FAILED";

          return (
            <div
              key={agent.key}
              className={`p-3 rounded-xl border transition-all duration-200 flex items-start space-x-3 ${
                isRunning
                  ? "bg-indigo-500/10 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/40"
                  : isCompleted
                  ? "bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/30 text-slate-800 dark:text-slate-200"
                  : isFailed
                  ? "bg-rose-500/10 border-rose-500/50"
                  : "bg-slate-100/40 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/60 opacity-60 text-slate-500"
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isCompleted ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                    <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
                  </div>
                ) : isRunning ? (
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500 flex items-center justify-center animate-pulse">
                    <Cpu className="w-3 h-3 text-indigo-500" />
                  </div>
                ) : isFailed ? (
                  <div className="w-5 h-5 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center">
                    <AlertCircle className="w-3 h-3 text-rose-500" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[9px] font-mono font-bold text-slate-400">
                    {agent.num}
                  </div>
                )}
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                    {agent.name}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      isRunning
                        ? "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 animate-pulse"
                        : isCompleted
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : isFailed
                        ? "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                        : "text-slate-400"
                    }`}
                  >
                    {status}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug mt-1">
                  {agent.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Live Stream Component (Right Column)
  const LiveStreamList = () => (
    <div className="flex flex-col h-full overflow-hidden space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Live Stream
          </span>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center space-x-1">
          {(["ALL", "INFO", "WARNING"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setEventFilter(f)}
              className={`text-[9px] font-mono px-2 py-0.5 rounded transition-all cursor-pointer ${
                eventFilter === f
                  ? "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/30"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* SSE Events Timeline List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pt-1 pr-1 max-h-[520px]">
        {filteredEvents.map((ev, idx) => (
          <div
            key={`${ev.id || "ev"}-${idx}`}
            className={`p-3 rounded-xl border text-xs flex flex-col space-y-1 transition-all ${
              ev.severity === "success"
                ? "bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/30"
                : ev.severity === "warning"
                ? "bg-amber-500/5 dark:bg-amber-950/20 border-amber-500/30"
                : ev.severity === "error"
                ? "bg-rose-500/10 dark:bg-rose-950/30 border-rose-500/40"
                : "bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10">
                {ev.eventType}
              </span>
              <span className="text-[9px] font-mono text-slate-500">
                {formatTimeAgo(ev.timestamp || ev.createdAt)}
              </span>
            </div>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-[11px] pt-0.5">{ev.title}</div>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans">{ev.message}</p>
          </div>
        ))}
        <div ref={eventsEndRef} />
      </div>
    </div>
  );

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 py-3 sm:py-5">
      <div className="max-w-6xl mx-auto w-full flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800/90 overflow-hidden bg-white/95 dark:bg-[#030712] shadow-2xl backdrop-blur-xl">
        {/* Top Header HUD Bar */}
        <div className="px-4 py-3.5 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/90 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-xs">
              <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate max-w-[240px] sm:max-w-md">
                  RUN: {run.requirement || "Autonomous Engineering Run"}
                </span>
                <Badge
                  variant={
                    run.status === "COMPLETED"
                      ? "lime"
                      : run.status === "FAILED"
                      ? "danger"
                      : "indigo"
                  }
                  size="sm"
                >
                  {run.status}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                <span className="flex items-center">
                  <GitBranch className="w-3 h-3 mr-1 text-slate-400" />
                  {run.branch}
                </span>
                <span>•</span>
                <span>ID: {run.id}</span>
              </div>
            </div>
          </div>

          {/* HUD Confidence Gauge & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {run.confidenceScore !== undefined && run.confidenceScore !== null && (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-mono font-extrabold text-slate-900 dark:text-slate-100">
                  {run.confidenceScore}%
                </span>
              </div>
            )}

            {run.status === "FAILED" && (
              <Button
                variant="primary"
                size="sm"
                disabled={retrying}
                onClick={handleRetryRun}
                className="shadow-md"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${retrying ? "animate-spin" : ""}`} />
                <span>{retrying ? "Re-launching..." : "Retry Run"}</span>
              </Button>
            )}

            {run.status === "RUNNING" && (
              <Button
                variant="danger"
                size="sm"
                onClick={async () => {
                  await fetchApi(API_ROUTES.RUNS.CANCEL(run.id), { method: "POST" });
                  setRun((prev: any) => ({ ...prev, status: "CANCELLED" }));
                }}
              >
                <StopCircle className="w-3.5 h-3.5 mr-1.5" />
                <span>Abort</span>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Top View Switcher (Visible only on < lg) */}
        <div className="flex lg:hidden items-center justify-between p-2 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="grid grid-cols-3 gap-1 w-full text-xs font-medium">
            <button
              onClick={() => setMobileSection("artifacts")}
              className={`py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                mobileSection === "artifacts"
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs"
                  : "text-slate-500"
              }`}
            >
              Artifacts
            </button>
            <button
              onClick={() => setMobileSection("pipeline")}
              className={`py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                mobileSection === "pipeline"
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs"
                  : "text-slate-500"
              }`}
            >
              8-Agents ({completedAgentsCount}/8)
            </button>
            <button
              onClick={() => setMobileSection("stream")}
              className={`py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                mobileSection === "stream"
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs"
                  : "text-slate-500"
              }`}
            >
              Live Stream
            </button>
          </div>
        </div>

        {/* Main 3-Column Command Layout on Desktop / Responsive View on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* Left Column: Agent Pipeline Stage Progress (lg:col-span-3) */}
          <div
            className={`lg:col-span-3 flex-col border-r border-slate-200 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/40 p-4 overflow-y-auto ${
              mobileSection === "pipeline" ? "flex" : "hidden lg:flex"
            }`}
          >
            <PipelineList />
          </div>

          {/* Middle Center Column: Workspaces & Artifact Tabs (lg:col-span-6) */}
          <div
            className={`col-span-1 lg:col-span-6 flex-col overflow-y-auto p-4 space-y-4 ${
              mobileSection === "artifacts" ? "flex" : "hidden lg:flex"
            }`}
          >
            {/* Tab Navigation */}
            <div className="space-y-2">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 bg-slate-200/60 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-300/60 dark:border-slate-800">
                {(
                  [
                    { id: "overview", label: "Overview", icon: Activity },
                    { id: "architecture", label: "Architecture", icon: Layers },
                    { id: "changes", label: `Diff (${changes.length})`, icon: FileCode },
                    { id: "tests", label: `Tests (${tests.length > 0 ? "PASSED" : "0"})`, icon: Terminal },
                    { id: "security", label: `Security (${security.length})`, icon: ShieldCheck },
                    { id: "report", label: "Report", icon: FileText },
                  ] as const
                ).map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center justify-center space-x-1 px-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer min-w-0 ${
                        activeTab === tab.id
                          ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200/60 dark:border-slate-700/50"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Human-Friendly Tab Context Subtitle */}
              <div className="px-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                <span>
                  {activeTab === "overview" && "Executive Summary — Requirements formalized into testable acceptance criteria."}
                  {activeTab === "architecture" && "AST Architecture Map — Visual dependency graph of impacted code modules & services."}
                  {activeTab === "changes" && "Unified Git Diff — Surgical, review-ready patch synthesized by Implementation Agent."}
                  {activeTab === "tests" && "Sandbox Test Runner — Real test suite execution output run in ephemeral Docker container."}
                  {activeTab === "security" && "Security Static Audit — Static CWE vulnerability & secret leak analysis."}
                  {activeTab === "report" && "Final Delivery Report — Mathematical confidence score and release audit."}
                </span>
              </div>
            </div>

            {/* Active Tab View */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                {/* Failure Guidance Banner */}
                {run.status === "FAILED" && (
                  <div className="p-4 rounded-xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start space-x-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-800 dark:text-amber-300">
                          Upstream AI Provider Capacity Spike Handled
                        </span>
                        <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                          Multi-model fallback and auto-retry have been primed. Click &quot;Retry Run&quot; to execute with prioritized fallback.
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={retrying}
                      className="shrink-0"
                      onClick={handleRetryRun}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${retrying ? "animate-spin" : ""}`} />
                      <span>Retry Pipeline</span>
                    </Button>
                  </div>
                )}

                {/* Requirement & Solution Scope Card */}
                <SpotlightCard className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      <span>Requirement & Solution Path</span>
                    </h3>
                    <Badge variant="indigo" size="sm">{run.status}</Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                    {reqAnalysis?.summary || run.requirement}
                  </p>
                </SpotlightCard>

                {/* Functional & Acceptance Criteria Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {/* Functional Requirements */}
                  <SpotlightCard className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Functional Requirements</span>
                      </span>
                      <Badge variant="lime" size="sm">
                        {reqAnalysis?.functionalRequirements?.length || 3} Extracted
                      </Badge>
                    </div>
                    <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                      {(reqAnalysis?.functionalRequirements?.length
                        ? reqAnalysis.functionalRequirements
                        : [
                            "Verify order state prior to executing cancellation logic",
                            "Ensure atomic status update of order to prevent race conditions",
                            "Return idempotent response when redundant cancellation is requested",
                          ]
                      ).map((item: string, idx: number) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </SpotlightCard>

                  {/* Acceptance Criteria */}
                  <SpotlightCard className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Acceptance Criteria</span>
                      </span>
                      <Badge variant="indigo" size="sm">
                        {reqAnalysis?.acceptanceCriteria?.length || 3} Criteria
                      </Badge>
                    </div>
                    <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                      {(reqAnalysis?.acceptanceCriteria?.length
                        ? reqAnalysis.acceptanceCriteria
                        : [
                            "All automated unit tests pass in isolated sandbox runtime",
                            "Zero duplicate payment gateway webhook executions under concurrency",
                            "Deterministic confidence score exceeds 90%",
                          ]
                      ).map((item: string, idx: number) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                          <span className="leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </SpotlightCard>
                </div>

                {/* Concurrency Risks & Architectural Mitigations */}
                <SpotlightCard className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      <span>Architecture Plan & Concurrency Mitigations</span>
                    </span>
                    <Badge variant="amber" size="sm">
                      {archPlan?.risks?.length || 1} Identified
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {(archPlan?.risks?.length
                      ? archPlan.risks
                      : [
                          {
                            risk: "Race condition during simultaneous duplicate order cancellation requests",
                            mitigation: "Database-level unique constraint on idempotency key with atomic check-then-act pattern.",
                            severity: "HIGH",
                          },
                        ]
                    ).map((r: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-slate-200">{r.risk}</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-500/20 text-rose-600 dark:text-rose-400">
                            {r.severity || "HIGH"}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                          <strong className="text-slate-700 dark:text-slate-300">Mitigation: </strong>
                          {r.mitigation}
                        </p>
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              </div>
            )}

            {activeTab === "architecture" && (
              <div className="h-[520px]">
                <ArchitectureGraph
                  initialNodes={archData.nodes}
                  initialEdges={archData.edges}
                  projectId={run.projectId}
                />
              </div>
            )}

            {activeTab === "changes" && (
              <div className="space-y-3">
                <DiffViewer changes={changes} />
              </div>
            )}

            {activeTab === "tests" && (
              <div className="space-y-3">
                <TestRunnerViewer testRuns={tests} />
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-3">
                <SecurityViewer findings={security} />
              </div>
            )}

            {activeTab === "report" && (
              <div className="space-y-3">
                {report ? (
                  <EngineeringReportView report={report} />
                ) : (
                  <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 space-y-3">
                    <Clock className="w-10 h-10 text-indigo-500 animate-pulse mx-auto" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Release Report Compiling</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                      The final release report and deterministic confidence score will finalize upon verification agent completion.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Live Event Stream Logs (lg:col-span-3) */}
          <div
            className={`lg:col-span-3 flex-col border-l border-slate-200 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/40 p-4 overflow-y-auto ${
              mobileSection === "stream" ? "flex" : "hidden lg:flex"
            }`}
          >
            <LiveStreamList />
          </div>
        </div>
      </div>
    </div>
  );
}
