import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(date: string | Date | number): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);

  if (seconds < 60) return `${Math.max(1, seconds)}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const seconds = (ms / 1000).toFixed(1);
  return `${seconds}s`;
}

export function getStatusColor(status: string): string {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
    case "VERIFIED":
    case "PASSED":
      return "text-[#B8F34A] border-[#B8F34A]/30 bg-[#B8F34A]/10";
    case "FAILED":
      return "text-[#FF647C] border-[#FF647C]/30 bg-[#FF647C]/10";
    case "RUNNING":
    case "IMPLEMENTING":
    case "ANALYZING_ARCHITECTURE":
    case "TESTING":
    case "DEBUGGING":
      return "text-[#29D9FF] border-[#29D9FF]/30 bg-[#29D9FF]/10";
    case "QUEUED":
    case "PENDING":
      return "text-[#7C83FF] border-[#7C83FF]/30 bg-[#7C83FF]/10";
    case "WARNING":
    case "PARTIALLY_VERIFIED":
      return "text-[#FFB547] border-[#FFB547]/30 bg-[#FFB547]/10";
    default:
      return "text-slate-400 border-slate-700 bg-slate-800/40";
  }
}
