import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-4 py-2 text-sm rounded-xl",
    lg: "px-6 py-2.5 text-base rounded-xl",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 dark:from-[#29D9FF] dark:via-[#7C83FF] dark:to-[#B8F34A] text-white dark:text-[#08090B] font-semibold hover:opacity-95 shadow-sm hover:shadow-md active:scale-[0.98]",
    secondary:
      "bg-slate-100 dark:bg-[#1E293B] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#374151] hover:bg-slate-200 dark:hover:bg-[#334155] active:scale-[0.98]",
    outline:
      "bg-transparent text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-[#374151] hover:bg-slate-100 dark:hover:bg-[#1E293B] hover:text-slate-900 dark:hover:text-white active:scale-[0.98]",
    danger:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 active:scale-[0.98]",
    ghost:
      "bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#1E293B] active:scale-[0.98]",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center space-x-2 font-medium transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
