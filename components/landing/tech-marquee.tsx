"use client";

import React from "react";
import {
  Boxes,
  Terminal,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  GitBranch,
  FileCode,
  Activity,
  Sparkles,
  Lock,
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";

const TECH_ITEMS = [
  { name: "Gemini 2.5 Pro", category: "Reasoning Model", icon: Sparkles, color: "text-indigo-500" },
  { name: "Docker Sandboxes", category: "Ephemeral Runtime", icon: Terminal, color: "text-sky-500" },
  { name: "AST Dependency Engine", category: "Code Analysis", icon: Layers, color: "text-purple-500" },
  { name: "GitHub OAuth 2.0", category: "Repository Sync", icon: GitBranch, color: "text-emerald-500" },
  { name: "Vitest & Jest", category: "Test Runner", icon: Activity, color: "text-amber-500" },
  { name: "Static Security Guard", category: "CWE Scanner", icon: Lock, color: "text-rose-500" },
  { name: "Next.js 15 & React", category: "Frontend Stack", icon: Boxes, color: "text-sky-400" },
  { name: "Spring Boot & Maven", category: "Enterprise Backend", icon: Cpu, color: "text-teal-500" },
  { name: "Deterministic Math", category: "Release Authority", icon: ShieldCheck, color: "text-indigo-400" },
];

export function TechMarquee() {
  const items = [...TECH_ITEMS, ...TECH_ITEMS];

  return (
    <div className="w-full space-y-4 py-8 overflow-hidden relative">
      {/* Side Fade Gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-50 dark:from-[#030712] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-50 dark:from-[#030712] to-transparent z-10 pointer-events-none" />

      <div className="text-center">
        <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Powered By Mission-Critical Autonomous Infrastructure
        </span>
      </div>

      <div className="flex w-max animate-marquee space-x-3 sm:space-x-4">
        {items.map((tech, idx) => {
          const Icon = tech.icon;
          return (
            <div
              key={idx}
              className="flex items-center space-x-2.5 px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-500/50 hover:shadow-md transition-all shrink-0 cursor-default"
            >
              <div className={`p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 ${tech.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  {tech.name}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  {tech.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
