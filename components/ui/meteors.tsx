"use client";

import React, { useState, useEffect } from "react";

// Deterministic seed-based meteor generator to avoid any SSR hydration mismatch
function getDeterministicMeteors(count: number) {
  return Array.from({ length: count }, (_, idx) => {
    // Deterministic pseudo-random generation based on index
    const top = `${(idx * 29 + 13) % 80}%`;
    const left = `${(idx * 47 + 7) % 95}%`;
    const delay = `${((idx * 0.37 + 0.2) % 4).toFixed(2)}s`;
    const duration = `${((idx % 4) + 4)}s`;

    return { top, left, delay, duration };
  });
}

export function Meteors({ number = 14 }: { number?: number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const meteors = getDeterministicMeteors(number);

  if (!mounted) {
    return <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {meteors.map((m, idx) => (
        <span
          key={`meteor-${idx}`}
          className="absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-slate-400 dark:bg-indigo-300 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg] animate-meteor"
          style={{
            top: m.top,
            left: m.left,
            animationDelay: m.delay,
            animationDuration: m.duration,
          }}
        >
          {/* Meteor Tail */}
          <div className="pointer-events-none absolute top-1/2 -z-10 h-[1px] w-[50px] -translate-y-1/2 bg-gradient-to-r from-indigo-500 via-sky-400 to-transparent" />
        </span>
      ))}
    </div>
  );
}
