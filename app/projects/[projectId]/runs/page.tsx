import Link from "next/link";
import { memoryStore } from "@/db/client";
import { notFound } from "next/navigation";
import { Terminal, PlusCircle, ArrowLeft, GitBranch, ArrowUpRight } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatTimeAgo } from "@/lib/utils";

export default async function ProjectRunsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = memoryStore.projects.get(projectId);

  if (!project) {
    notFound();
  }

  const runs = Array.from(memoryStore.agentRuns.values()).filter(
    (r) => r.projectId === projectId
  );

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-7">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center space-x-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {project.name} — Engineering Runs
          </h1>
        </div>

        <Link href={`/projects/${projectId}/runs/new`}>
          <Button variant="primary" size="sm">
            <PlusCircle className="w-4 h-4" />
            <span>New Run</span>
          </Button>
        </Link>
      </div>

      {runs.length === 0 ? (
        <SpotlightCard className="p-8 text-center space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">No engineering runs launched for this repository yet.</p>
          <Link href={`/projects/${projectId}/runs/new`}>
            <Button variant="primary" size="sm">
              <PlusCircle className="w-4 h-4" />
              <span>Launch First Run</span>
            </Button>
          </Link>
        </SpotlightCard>
      ) : (
        <div className="space-y-3">
          {runs.map((r) => (
            <Link
              key={r.id}
              href={`/projects/${r.projectId}/runs/${r.id}`}
              className="block"
            >
              <SpotlightCard className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">{r.requirement}</span>
                    <Badge variant={r.status === "COMPLETED" ? "lime" : "indigo"}>{r.status}</Badge>
                  </div>
                  <div className="flex items-center space-x-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                    <span className="flex items-center text-slate-700 dark:text-slate-300">
                      <GitBranch className="w-3.5 h-3.5 mr-1 text-indigo-500" />
                      {r.branch}
                    </span>
                    {r.confidenceScore ? (
                      <span>
                        Confidence: <strong className="text-emerald-600 dark:text-emerald-400">{r.confidenceScore}%</strong>
                      </span>
                    ) : null}
                    <span>{formatTimeAgo(r.createdAt)}</span>
                  </div>
                </div>

                <Button variant="secondary" size="sm" className="self-end sm:self-center">
                  <span>View Telemetry</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Button>
              </SpotlightCard>
            </Link>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
