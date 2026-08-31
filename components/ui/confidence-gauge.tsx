"use client";

import React from "react";
import { CheckCircle, AlertTriangle, Shield, Check, Lock, GitCommit } from "lucide-react";

interface ConfidenceBreakdown {
  requirementsScore: number;
  testsScore: number;
  regressionScore: number;
  securityScore: number;
  ambiguityScore: number;
  consistencyScore: number;
  total: number;
}

interface ConfidenceGaugeProps {
  score: number;
  breakdown?: ConfidenceBreakdown;
  status?: string;
}

export function ConfidenceGauge({ score, breakdown, status = "VERIFIED" }: ConfidenceGaugeProps) {
  const isHigh = score >= 90;
  const isMedium = score >= 70 && score < 90;

  const strokeColor = isHigh ? "#B8F34A" : isMedium ? "#FFB547" : "#FF647C";
  const glowColor = isHigh ? "glow-lime" : isMedium ? "glow-amber" : "glow-rose";

  const categories = [
    { label: "Requirements Satisfied", max: 30, current: breakdown?.requirementsScore ?? 30, icon: CheckCircle, color: "bg-[#29D9FF]" },
    { label: "Sandbox Test Execution", max: 30, current: breakdown?.testsScore ?? 30, icon: Check, color: "bg-[#B8F34A]" },
    { label: "Zero Regression Impact", max: 15, current: breakdown?.regressionScore ?? 15, icon: GitCommit, color: "bg-[#7C83FF]" },
    { label: "Security Vulnerability Scan", max: 10, current: breakdown?.securityScore ?? 9, icon: Shield, color: "bg-[#FFB547]" },
    { label: "Ambiguity Resolution", max: 5, current: breakdown?.ambiguityScore ?? 5, icon: Lock, color: "bg-[#A855F7]" },
    { label: "Patch Cleanliness", max: 10, current: breakdown?.consistencyScore ?? 5, icon: AlertTriangle, color: "bg-emerald-400" },
  ];

  return (
    <div className="flex flex-col space-y-4">
      {/* Top Gauge Header */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[#141922] border border-[#1F2633]">
        <div className="flex items-center space-x-4">
          <div className="relative flex items-center justify-center">
            {/* SVG Circle */}
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="#1F2633"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke={strokeColor}
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={201}
                strokeDashoffset={201 - (201 * score) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-bold font-mono text-white">{score}%</span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-slate-200">ENGINEERING CONFIDENCE</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                  isHigh
                    ? "bg-[#B8F34A]/15 text-[#B8F34A] border border-[#B8F34A]/30"
                    : "bg-[#FFB547]/15 text-[#FFB547] border border-[#FFB547]/30"
                }`}
              >
                {status}
              </span>
            </div>
            <span className="text-xs text-slate-400 mt-0.5">
              Deterministic weighting formula across 6 verification dimensions
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const percentage = Math.round((cat.current / cat.max) * 100);
          return (
            <div
              key={cat.label}
              className="p-3 rounded-lg bg-[#0D1014] border border-[#1F2633] flex flex-col space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-[11px]">{cat.label}</span>
                </div>
                <span className="font-mono text-slate-200 font-semibold">
                  {cat.current}/{cat.max}
                </span>
              </div>
              <div className="w-full bg-[#141922] h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${cat.color} rounded-full transition-all duration-700`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
