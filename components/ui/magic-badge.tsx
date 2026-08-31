"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MagicBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function MagicBadge({ className, children, ...props }: MagicBadgeProps) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center p-[1px] rounded-full overflow-hidden font-mono text-xs font-semibold shadow-xs",
        className
      )}
      {...props}
    >
      <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#6366F1_0%,#8B5CF6_50%,#06B6D4_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-50 dark:bg-slate-950 px-3 py-1 text-slate-800 dark:text-slate-200 backdrop-blur-3xl space-x-1.5">
        {children}
      </span>
    </div>
  );
}
