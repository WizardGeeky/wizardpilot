"use client";

import React from "react";
import Link from "next/link";
import {
  Cpu,
  Boxes,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  GitBranch,
  Terminal,
  Layers,
  CheckCircle,
  FileCode,
  Lock,
  Flame,
  Activity,
  Check,
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  LockKeyhole,
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { MagicBadge } from "@/components/ui/magic-badge";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Meteors } from "@/components/ui/meteors";
import { HeroTerminal } from "@/components/landing/hero-terminal";
import { TechMarquee } from "@/components/landing/tech-marquee";
import { AgentEcosystemShowcase } from "@/components/landing/agent-ecosystem-showcase";
import { InteractiveDiffShowcase } from "@/components/landing/interactive-diff-showcase";

export default function LandingPage() {
  const comparison = [
    {
      feature: "Autonomous Multi-Agent Consensus",
      detail: "8 specialized AI agents sequentially investigate, plan, code, test, and audit",
      pilot: "8-Agent Pipeline",
      copilots: "Single Prompt",
    },
    {
      feature: "Isolated Ephemeral Sandbox Execution",
      detail: "Real Docker container runtime executing npm/mvn test suites in sandbox",
      pilot: "Docker Runtime",
      copilots: "None (Text Only)",
    },
    {
      feature: "Self-Healing Test Failure Debug Loops",
      detail: "Autonomous triage of compiler errors and failed assertions up to 3 attempts",
      pilot: "Automatic Loop",
      copilots: "Manual Prompting",
    },
    {
      feature: "Deterministic Mathematical Confidence",
      detail: "Strict 6-factor weighted calculation (requirements, test suite, security, regressions)",
      pilot: "Mathematical 0-100%",
      copilots: "Subjective Guesswork",
    },
    {
      feature: "Full AST Architecture Dependency Graph",
      detail: "React Flow visual dependency graph between controllers, services, and gateways",
      pilot: "Interactive Graph",
      copilots: "Not Supported",
    },
    {
      feature: "Automated Static Security & Secret Audit",
      detail: "Pre-commit scanning for credentials, injection vectors, and authorization holes",
      pilot: "Pre-Commit Audit",
      copilots: "Not Included",
    },
    {
      feature: "Direct GitHub OAuth App Integration",
      detail: "Connect live repositories and branches with encrypted token security",
      pilot: "OAuth 2.0 Native",
      copilots: "Varies",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#030712] transition-colors duration-200">
      {/* Hero Section with Shooting Meteors and Glowing Orbs */}
      <section className="relative overflow-hidden pt-12 pb-14 sm:pt-24 sm:pb-28 cyber-grid">
        <Meteors number={16} />

        {/* Ambient Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[700px] h-[600px] sm:h-[700px] bg-radial from-indigo-500/15 via-sky-500/10 to-transparent blur-3xl pointer-events-none animate-float-glow" />
        <div className="absolute top-1/2 right-1/4 w-[350px] sm:w-[400px] h-[350px] sm:h-[400px] bg-radial from-emerald-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 text-center space-y-6 sm:space-y-8">
          <div className="inline-flex items-center justify-center">
            <MagicBadge>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5 shrink-0" />
              <span className="text-[11px] sm:text-xs tracking-wider">THE AUTONOMOUS AI ENGINEERING PLATFORM</span>
            </MagicBadge>
          </div>

          <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.15] sm:leading-[1.1]">
              Don&apos;t Just Generate Code. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
                Engineer The Solution.
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed px-2">
              Wizard Pilot delivers an 8-agent autonomous software engineering pipeline with isolated Docker sandbox verification, AST architecture intelligence, and deterministic confidence scoring.
            </p>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <ShimmerButton className="text-sm sm:text-base px-6 sm:px-8 py-3.5 w-full sm:w-auto font-bold flex items-center justify-center">
                <Play className="w-4 h-4 mr-2 shrink-0" />
                <span>Launch Engineering Run</span>
              </ShimmerButton>
            </Link>

            <Link href="/projects/new" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="rounded-xl px-6 py-3.5 text-sm font-semibold w-full sm:w-auto flex items-center justify-center">
                <Boxes className="w-4 h-4 mr-2 text-indigo-500 shrink-0" />
                <span>Connect GitHub Repository</span>
              </Button>
            </Link>
          </div>

          {/* Hero Terminal Preview */}
          <div className="pt-6 sm:pt-8 max-w-4xl mx-auto">
            <HeroTerminal />
          </div>

          {/* Infinite Tech Marquee */}
          <div className="pt-4">
            <TechMarquee />
          </div>
        </div>
      </section>

      {/* 8-Agent Deep-Dive Ecosystem & Works Showcase */}
      <section className="py-16 sm:py-20 border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/40 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AgentEcosystemShowcase />
        </div>
      </section>

      {/* Interactive Surgical Code Diff Showcase */}
      <section className="py-16 sm:py-20 border-t border-slate-200 dark:border-slate-800/80 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <InteractiveDiffShowcase />
        </div>
      </section>

      {/* Deterministic Confidence Formula Section */}
      <section className="py-16 sm:py-20 border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/40 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8 sm:space-y-12">
          <div className="text-center space-y-2 sm:space-y-3 max-w-2xl mx-auto">
            <h2 className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              Verification Authority
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Deterministic Mathematical Confidence
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-2">
              Unlike subjective LLM self-evaluation, Wizard Pilot calculates confidence through weighted mathematical indicators across test suites and AST boundaries.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 text-center">
            {[
              { label: "Requirements Satisfied", weight: "30%", color: "text-emerald-500" },
              { label: "Sandbox Test Pass Rate", weight: "30%", color: "text-emerald-500" },
              { label: "Regression Suite Impact", weight: "15%", color: "text-sky-500" },
              { label: "Static Security Posture", weight: "10%", color: "text-indigo-500" },
              { label: "Ambiguity Resolution", weight: "5%", color: "text-amber-500" },
              { label: "Patch Cleanliness", weight: "10%", color: "text-purple-500" },
            ].map((metric, idx) => (
              <SpotlightCard key={idx} className="p-3.5 sm:p-4 space-y-1">
                <span className={`text-xl sm:text-2xl font-black font-mono ${metric.color}`}>{metric.weight}</span>
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-600 dark:text-slate-400 block leading-tight">
                  {metric.label}
                </span>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Comparison Section - Fully Responsive for Mobile and Desktop */}
      <section className="py-16 sm:py-24 border-t border-slate-200 dark:border-slate-800/80 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8 sm:space-y-12">
          <div className="text-center space-y-2 sm:space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center mb-1">
              <MagicBadge>
                <Zap className="w-3.5 h-3.5 mr-1 text-amber-500" />
                <span>ARCHITECTURAL ADVANTAGE</span>
              </MagicBadge>
            </div>
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Why Wizard Pilot Outperforms Copilots
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed px-2">
              Standard coding assistants generate hallucinated code in a chat box with zero test execution. Wizard Pilot acts as an autonomous engineer that compiles, executes, tests, and validates verified patches.
            </p>
          </div>

          {/* Desktop Table View (md+) */}
          <SpotlightCard className="hidden md:block p-0 overflow-hidden shadow-2xl border-slate-200 dark:border-slate-800" spotlightColor="rgba(99, 102, 241, 0.2)">
            <div className="grid grid-cols-12 p-5 bg-slate-100 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 items-center">
              <div className="col-span-6">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Engineering Capability
                </span>
              </div>
              <div className="col-span-3 text-center">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>WIZARD PILOT</span>
                </div>
              </div>
              <div className="col-span-3 text-center">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Standard AI Copilots
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              {comparison.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 p-5 items-center hover:bg-indigo-50/30 dark:hover:bg-slate-900/40 transition-colors"
                >
                  <div className="col-span-6 space-y-0.5 pr-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm block">
                      {row.feature}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-relaxed">
                      {row.detail}
                    </span>
                  </div>

                  <div className="col-span-3 flex justify-center">
                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{row.pilot}</span>
                    </div>
                  </div>

                  <div className="col-span-3 flex justify-center">
                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 font-mono text-[11px]">
                      <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{row.copilots}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SpotlightCard>

          {/* Mobile Card Stack View (< md) */}
          <div className="md:hidden space-y-3">
            {comparison.map((row, idx) => (
              <SpotlightCard key={idx} className="p-4 space-y-3">
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm block">
                    {row.feature}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-relaxed">
                    {row.detail}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="p-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex flex-col justify-between space-y-1">
                    <span className="text-[9px] font-mono uppercase font-bold text-emerald-600 dark:text-emerald-400">
                      Wizard Pilot
                    </span>
                    <span className="font-bold text-[11px] flex items-center">
                      <Check className="w-3.5 h-3.5 mr-1 text-emerald-500 shrink-0" />
                      <span className="truncate">{row.pilot}</span>
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs flex flex-col justify-between space-y-1">
                    <span className="text-[9px] font-mono uppercase font-bold text-slate-400">
                      Standard AI
                    </span>
                    <span className="font-medium text-[11px] flex items-center text-slate-500 dark:text-slate-400">
                      <X className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                      <span className="truncate">{row.copilots}</span>
                    </span>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Ultra-Modern High-Impact Bottom CTA Banner with Meteors */}
      <section className="py-16 sm:py-24 border-t border-slate-200 dark:border-slate-800/80 relative overflow-hidden">
        <Meteors number={12} />

        {/* Background Mesh Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[300px] sm:h-[350px] bg-radial from-indigo-500/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 text-center space-y-6 sm:space-y-8">
          <SpotlightCard
            className="p-6 sm:p-14 space-y-6 sm:space-y-8 text-center relative overflow-hidden border-indigo-500/30 dark:border-indigo-500/40 bg-white/95 dark:bg-slate-900/90 shadow-2xl"
            spotlightColor="rgba(99, 102, 241, 0.3)"
          >
            {/* Top Badge */}
            <div className="inline-flex items-center justify-center">
              <MagicBadge>
                <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-500 shrink-0" />
                <span className="text-[11px] sm:text-xs">START AUTONOMOUS ENGINEERING</span>
              </MagicBadge>
            </div>

            {/* Headline */}
            <div className="space-y-2.5 sm:space-y-3 max-w-2xl mx-auto">
              <h3 className="text-2xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                Ready to automate your engineering lifecycle?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mx-auto px-2">
                Connect your GitHub repository and watch the 8-agent autonomous pipeline engineer, test, and verify your patches with 94%+ confidence.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1 sm:pt-2 w-full">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <ShimmerButton className="text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 w-full sm:w-auto font-bold flex items-center justify-center">
                  <Play className="w-4 h-4 mr-2 shrink-0" />
                  <span>Enter Command Center</span>
                  <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
                </ShimmerButton>
              </Link>

              <Link href="/projects/new" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="rounded-xl px-6 py-3.5 sm:py-4 text-sm font-semibold w-full sm:w-auto flex items-center justify-center">
                  <Boxes className="w-4 h-4 mr-2 text-indigo-500 shrink-0" />
                  <span>Connect Repository</span>
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-left sm:text-center">
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="leading-tight">Deterministic Verification</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 text-xs">
                <Terminal className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="leading-tight">Ephemeral Sandbox Isolation</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 text-xs">
                <LockKeyhole className="w-4 h-4 text-sky-500 shrink-0" />
                <span className="leading-tight">Zero Secret Retention</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 text-xs">
                <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                <span className="leading-tight">Real GitHub OAuth Sync</span>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="font-bold text-slate-900 dark:text-slate-100">Wizard Pilot</span>
            <span className="hidden sm:inline">— Autonomous AI Software Engineering Platform</span>
          </div>
          <span>&copy; {new Date().getFullYear()} Wizard Pilot. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
