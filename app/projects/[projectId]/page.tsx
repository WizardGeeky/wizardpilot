import { memoryStore } from "@/db/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Boxes, GitBranch, Layers, Terminal, ArrowLeft, ArrowUpRight } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function ProjectDetailPage({
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center space-x-3">
          <Link href="/projects">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              <span>Repositories</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{project.name}</h1>
        </div>

        <div className="flex items-center space-x-2">
          <Link href={`/projects/${projectId}/architecture`}>
            <Button variant="secondary" size="sm">
              <Layers className="w-4 h-4" />
              <span>Architecture Graph</span>
            </Button>
          </Link>
          <Link href={`/projects/${projectId}/runs/new`}>
            <Button variant="primary" size="sm">
              <Terminal className="w-4 h-4" />
              <span>Launch Run</span>
            </Button>
          </Link>
        </div>
      </div>

      <SpotlightCard className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-slate-900 dark:text-slate-100">Repository Metadata</span>
          <Badge variant="indigo">{project.language || "TypeScript"}</Badge>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{project.description || project.repositoryUrl}</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span>Default Branch:</span>
            <p className="text-slate-900 dark:text-slate-100 font-semibold mt-0.5">{project.defaultBranch}</p>
          </div>
          <div>
            <span>Framework:</span>
            <p className="text-slate-900 dark:text-slate-100 font-semibold mt-0.5">{project.framework || "Standard"}</p>
          </div>
          <div>
            <span>Total Runs:</span>
            <p className="text-slate-900 dark:text-slate-100 font-semibold mt-0.5">{runs.length} runs</p>
          </div>
          <div>
            <span>Status:</span>
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">Connected</p>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}
