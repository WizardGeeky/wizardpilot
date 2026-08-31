"use client";

import React from "react";
import { Cpu, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { MagicBadge } from "@/components/ui/magic-badge";
import { ShimmerButton } from "@/components/ui/shimmer-button";

export default function LoginPage() {
  const handleGithubOAuthLogin = () => {
    window.location.href = "/api/auth/github";
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 bg-slate-50 dark:bg-[#030712] cyber-grid relative min-h-[calc(100vh-4rem)] transition-colors duration-200">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-indigo-500/10 via-sky-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center mb-1">
            <MagicBadge>
              <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-500" />
              <span>AUTONOMOUS SOFTWARE ENGINEERING</span>
            </MagicBadge>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Sign In to{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
              Wizard Pilot
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            Connect your GitHub account to access autonomous engineering pipelines, real repository intelligence, and verified patch delivery.
          </p>
        </div>

        {/* Single Focused Login Card */}
        <SpotlightCard className="p-8 space-y-6 shadow-2xl" spotlightColor="rgba(99, 102, 241, 0.25)">
          <div className="space-y-4">
            <button
              onClick={handleGithubOAuthLogin}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm flex items-center justify-center space-x-3 transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Real GitHub API repository & branch exploration</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Isolated Docker sandbox execution & test verification</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0" />
              <span>AES-256-GCM encrypted token storage</span>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}
