"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function ShimmerButton({ className, children, ...props }: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 animate-shimmer items-center justify-center rounded-xl border border-indigo-500/30 dark:border-indigo-400/30 bg-[linear-gradient(110deg,#4f46e5,45%,#818cf8,55%,#4f46e5)] dark:bg-[linear-gradient(110deg,#1e1b4b,45%,#3730a3,55%,#1e1b4b)] bg-[length:200%_100%] px-6 font-medium text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none cursor-pointer space-x-2 text-sm",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
