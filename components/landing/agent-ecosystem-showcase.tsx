"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Boxes,
  Layers,
  FileCode,
  Terminal,
  RotateCcw,
  Lock,
  ShieldCheck,
  Cpu,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  Code2,
  Check,
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { MagicBadge } from "@/components/ui/magic-badge";
import { Badge } from "@/components/ui/badge";

interface AgentDetail {
  id: string;
  number: number;
  name: string;
  role: string;
  icon: any;
  color: string;
  badgeColor: "indigo" | "lime" | "cyan" | "amber" | "danger";
  statLabel: string;
  statValue: string;
  avgLatency: string;
  input: string;
  output: string;
  worksAndUsages: string[];
  sampleLog: string;
}

const AGENTS: AgentDetail[] = [
  {
    id: "req",
    number: 1,
    name: "Requirement Analyst",
    role: "Formalizes raw user requests into structured, unambiguous engineering specifications.",
    icon: Sparkles,
    color: "from-indigo-500 to-sky-500",
    badgeColor: "indigo",
    statLabel: "Ambiguity Reduction",
    statValue: "98.5%",
    avgLatency: "420ms",
    input: "Raw user feature prompt, issue description, or bug report",
    output: "Structured functional requirements, acceptance criteria, and edge cases",
    worksAndUsages: [
      "Deconstructs high-level business goals into testable software requirements",
      "Isolates potential edge cases and concurrency race conditions before code generation",
      "Establishes strict validation criteria used by downstream verification agents",
    ],
    sampleLog: "[REQ_ANALYST] Extracted 3 functional requirements & 4 acceptance criteria for idempotency verification.",
  },
  {
    id: "repo",
    number: 2,
    name: "Repository Intelligence",
    role: "Performs full AST codebase indexing, module mapping, and dependency discovery.",
    icon: Boxes,
    color: "from-sky-500 to-blue-600",
    badgeColor: "cyan",
    statLabel: "Files Indexed",
    statValue: "10,000+",
    avgLatency: "680ms",
    input: "GitHub repository URL & target branch tree",
    output: "AST module dependency graph, framework detection, and test suite commands",
    worksAndUsages: [
      "Scans recursive git tree to map controllers, services, database models, and utilities",
      "Detects package managers (npm, pnpm, Maven, Gradle, Cargo) and test runners",
      "Ensures zero secrets or sensitive credentials leak into AI context",
    ],
    sampleLog: "[REPO_INTEL] Mapped 247 files across 14 modules (TypeScript & Spring Boot). Detected 'npm test'.",
  },
  {
    id: "arch",
    number: 3,
    name: "Architecture Analyst",
    role: "Evaluates systemic architectural impact and mitigates concurrency and deadlock hazards.",
    icon: Layers,
    color: "from-purple-500 to-indigo-600",
    badgeColor: "indigo",
    statLabel: "Risk Isolation",
    statValue: "100%",
    avgLatency: "890ms",
    input: "Requirement analysis + AST repository dependency map",
    output: "Architectural execution plan with affected modules and concurrency boundaries",
    worksAndUsages: [
      "Traces data flow from controllers down to database persistence layers",
      "Detects optimistic lock race hazards and distributed webhook collisions",
      "Constrains implementation agents to surgical modifications within architectural boundaries",
    ],
    sampleLog: "[ARCH_ANALYST] Isolated race condition in RefundProcessor.java. Enforcing atomic check-then-act pattern.",
  },
  {
    id: "impl",
    number: 4,
    name: "Implementation Agent",
    role: "Synthesizes minimal, safe unified Git diffs matching architectural constraints.",
    icon: FileCode,
    color: "from-blue-500 to-indigo-500",
    badgeColor: "indigo",
    statLabel: "Patch Precision",
    statValue: "99.2%",
    avgLatency: "1,420ms",
    input: "Architecture plan & target source file slices",
    output: "Unified Git diff patch with inline architectural reasoning",
    worksAndUsages: [
      "Generates surgical patches rather than rewriting entire files blindly",
      "Maintains existing codebase conventions, typing rules, and code style",
      "Applies defensive validation and atomic transaction wrappers",
    ],
    sampleLog: "[IMPL_AGENT] Synthesized 3 unified diff hunks with idempotency key constraints across 2 files.",
  },
  {
    id: "test",
    number: 5,
    name: "Sandbox Test Agent",
    role: "Executes real test suites in ephemeral, isolated Docker containers.",
    icon: Terminal,
    color: "from-emerald-500 to-teal-600",
    badgeColor: "lime",
    statLabel: "Sandbox Isolation",
    statValue: "100%",
    avgLatency: "1,840ms",
    input: "Git diff patch + repository branch inside isolated container",
    output: "Real test stdout/stderr, pass/fail counts, duration, and stack traces",
    worksAndUsages: [
      "Spawns an isolated sandbox runtime to prevent host contamination",
      "Applies the patch directly to the cloned git repository",
      "Executes real test commands (`npm test`, `pytest`, `mvn test`) and captures stdout/stderr",
    ],
    sampleLog: "[TEST_AGENT] Spawned ephemeral sandbox. Executed 58 test cases: 58 PASSED, 0 FAILED (1,840ms).",
  },
  {
    id: "debug",
    number: 6,
    name: "Autonomous Debug Agent",
    role: "Triages compiler errors and test failures with self-healing feedback loops.",
    icon: RotateCcw,
    color: "from-amber-500 to-orange-600",
    badgeColor: "amber",
    statLabel: "Self-Healing Rate",
    statValue: "91.4%",
    avgLatency: "1,120ms",
    input: "Failed test stack trace, failing assertions, and previous patch diff",
    output: "Root cause diagnosis and corrective patch hunk",
    worksAndUsages: [
      "Analyzes stack traces and assertion failures to pinpoint the exact broken line",
      "Generates targeted corrective patches without human intervention",
      "Re-triggers the test agent in sandbox up to 3 iterative cycles until all tests pass",
    ],
    sampleLog: "[DEBUG_AGENT] Triaged OptimisticLockException. Applied exponential backoff retry constraint.",
  },
  {
    id: "sec",
    number: 7,
    name: "Security Auditor",
    role: "Static analysis for SQLi, command injection, authorization flaws, and credential leaks.",
    icon: Lock,
    color: "from-rose-500 to-red-600",
    badgeColor: "danger",
    statLabel: "Security Posture",
    statValue: "0 Secrets",
    avgLatency: "350ms",
    input: "Final combined patch diff across all modified files",
    output: "Security audit report with severity breakdown and CWE mitigations",
    worksAndUsages: [
      "Scans for hardcoded secrets, API tokens, and private keys in diff additions",
      "Inspects parameterized queries to prevent SQL and command injections",
      "Verifies access control and role-based authorization integrity",
    ],
    sampleLog: "[SEC_AUDITOR] Static audit complete: 0 critical findings. Verified credential and query sanitization.",
  },
  {
    id: "ver",
    number: 8,
    name: "Verification Authority",
    role: "Final engineering authority that enforces deterministic mathematical confidence scores.",
    icon: ShieldCheck,
    color: "from-emerald-400 to-indigo-500",
    badgeColor: "lime",
    statLabel: "Confidence Accuracy",
    statValue: "94%+",
    avgLatency: "210ms",
    input: "All previous 7 agents' telemetry, test results, and security findings",
    output: "Verified engineering report and deterministic release authority approval",
    worksAndUsages: [
      "Calculates strict 6-metric deterministic score: (30% Req + 30% Test + 15% Reg + 10% Sec + 5% Amb + 10% Cons)",
      "Rejects patches with low confidence (<80%) or failing sandbox tests",
      "Synthesizes the final executive delivery report with audit trail and diff export",
    ],
    sampleLog: "[VER_AUTHORITY] Verified 100% compliance. Final Confidence Score: 94% [FINAL AUTHORITY PASSED].",
  },
];

export function AgentEcosystemShowcase() {
  const [selectedAgentIndex, setSelectedAgentIndex] = useState(0);
  const [activePulse, setActivePulse] = useState(0);

  // Simulated active pulse across pipeline
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePulse((prev) => (prev + 1) % AGENTS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const activeAgent = AGENTS[selectedAgentIndex];
  const Icon = activeAgent.icon;

  return (
    <div className="space-y-10 w-full">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center">
          <MagicBadge>
            <Activity className="w-3.5 h-3.5 mr-1.5 text-indigo-500 animate-pulse" />
            <span>8-AGENT AUTONOMOUS ORCHESTRATION</span>
          </MagicBadge>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          How The 8 Specialized Agents Work
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Each agent is specialized in a single phase of software engineering. Together, they form an autonomous assembly line that eliminates guesswork and delivers verified code.
        </p>
      </div>

      {/* Interactive Horizontal Pipeline Visualizer */}
      <div className="p-3 sm:p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[760px] gap-2">
          {AGENTS.map((agent, idx) => {
            const AgentIcon = agent.icon;
            const isSelected = selectedAgentIndex === idx;
            const isPulsing = activePulse === idx;

            return (
              <React.Fragment key={agent.id}>
                <button
                  onClick={() => setSelectedAgentIndex(idx)}
                  className={`flex-1 flex flex-col items-center p-3 rounded-xl transition-all cursor-pointer text-center relative ${
                    isSelected
                      ? "bg-white dark:bg-slate-800 border border-indigo-500 shadow-md scale-105"
                      : "hover:bg-white/60 dark:hover:bg-slate-800/50 border border-transparent"
                  }`}
                >
                  {isPulsing && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  )}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 transition-transform ${
                      isSelected
                        ? "bg-indigo-500 text-white shadow-xs scale-110"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <AgentIcon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                    {agent.number}. {agent.name.split(" ")[0]}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 mt-0.5">{agent.avgLatency}</span>
                </button>

                {idx < AGENTS.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Agent Interactive Deep-Dive Card */}
      <SpotlightCard
        className="p-6 sm:p-8 space-y-6 shadow-2xl border-indigo-500/30"
        spotlightColor="rgba(99, 102, 241, 0.25)"
      >
        {/* Top Agent Identity Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 p-[2px] shadow-lg">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Icon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Badge variant={activeAgent.badgeColor}>AGENT #{activeAgent.number}</Badge>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {activeAgent.name}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                {activeAgent.role}
              </p>
            </div>
          </div>

          {/* Quick Telemetry Badges */}
          <div className="grid grid-cols-2 sm:flex items-center gap-2.5 sm:space-x-3 w-full sm:w-auto">
            <div className="p-2.5 sm:p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center font-mono">
              <span className="text-[10px] text-slate-500 block uppercase">{activeAgent.statLabel}</span>
              <span className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">
                {activeAgent.statValue}
              </span>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center font-mono">
              <span className="text-[10px] text-slate-500 block uppercase">Avg Latency</span>
              <span className="text-sm sm:text-base font-bold text-indigo-600 dark:text-indigo-400">
                {activeAgent.avgLatency}
              </span>
            </div>
          </div>
        </div>

        {/* Inputs, Outputs & Core Usages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Usages & Responsibilities */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Core Usages & Architectural Works</span>
            </span>

            <div className="space-y-2.5">
              {activeAgent.worksAndUsages.map((work, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-2.5"
                >
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{work}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Data Flow & Simulated Output Terminal */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-sky-500" />
              <span>Input & Output Contract</span>
            </span>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block mb-1 font-bold">Input Contract:</span>
                <p className="text-slate-700 dark:text-slate-300 font-sans text-xs">{activeAgent.input}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block mb-1 font-bold">Output Artifact:</span>
                <p className="text-slate-700 dark:text-slate-300 font-sans text-xs">{activeAgent.output}</p>
              </div>

              {/* Sample Live Agent Event */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 text-[11px] flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="truncate">{activeAgent.sampleLog}</span>
              </div>
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* Aggregate Pipeline Telemetry Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
        <SpotlightCard className="p-4 sm:p-5 space-y-1" spotlightColor="rgba(99, 102, 241, 0.15)">
          <span className="text-3xl sm:text-4xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">8</span>
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">Autonomous Agents</span>
          <p className="text-[10px] text-slate-500">Zero human intervention needed</p>
        </SpotlightCard>

        <SpotlightCard className="p-4 sm:p-5 space-y-1" spotlightColor="rgba(16, 185, 129, 0.15)">
          <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">94%+</span>
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">Confidence Threshold</span>
          <p className="text-[10px] text-slate-500">Deterministic mathematical rating</p>
        </SpotlightCard>

        <SpotlightCard className="p-4 sm:p-5 space-y-1" spotlightColor="rgba(56, 189, 248, 0.15)">
          <span className="text-3xl sm:text-4xl font-extrabold font-mono text-sky-600 dark:text-sky-400">&lt; 6s</span>
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">End-to-End Latency</span>
          <p className="text-[10px] text-slate-500">Fast autonomous verification</p>
        </SpotlightCard>

        <SpotlightCard className="p-4 sm:p-5 space-y-1" spotlightColor="rgba(245, 158, 11, 0.15)">
          <span className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-600 dark:text-amber-400">100%</span>
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">Sandbox Isolation</span>
          <p className="text-[10px] text-slate-500">Real Docker ephemeral test execution</p>
        </SpotlightCard>
      </div>
    </div>
  );
}
