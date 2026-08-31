"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Boxes, PlusCircle, GitBranch, Layers, Terminal, ArrowUpRight, FolderGit2, Trash2 } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { API_ROUTES, fetchApi } from "@/lib/config/api-routes";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const res = await fetchApi(API_ROUTES.PROJECTS.LIST);
      if (res.success && Array.isArray(res.data)) {
        setProjects(res.data);
      }
    } catch {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this repository project?")) return;

    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    await fetchApi(API_ROUTES.PROJECTS.DELETE(projectId), { method: "DELETE" });
  };

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-7">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center space-x-2">
            <Boxes className="w-6 h-6 text-indigo-500" />
            <span>Target Repositories</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Connected GitHub repositories available for autonomous engineering runs
          </p>
        </div>

        <Link href="/projects/new">
          <ShimmerButton>
            <PlusCircle className="w-4 h-4" />
            <span>Connect Repository</span>
          </ShimmerButton>
        </Link>
      </div>

      {/* Projects Grid or Empty State */}
      {!loading && projects.length === 0 ? (
        <SpotlightCard className="p-12 text-center space-y-4" spotlightColor="rgba(99, 102, 241, 0.2)">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
            <FolderGit2 className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">No Repositories Connected</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Connect one of your GitHub repositories to inspect its module hierarchy, visualize its architecture graph, and execute verified engineering runs.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/projects/new">
              <ShimmerButton>
                <PlusCircle className="w-4 h-4" />
                <span>Connect GitHub Repository</span>
              </ShimmerButton>
            </Link>
          </div>
        </SpotlightCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <SpotlightCard key={project.id} className="flex flex-col justify-between p-5 space-y-4" spotlightColor="rgba(99, 102, 241, 0.15)">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">{project.name}</span>
                  <div className="flex items-center space-x-1.5">
                    <Badge variant="indigo">{project.language || "TypeScript"}</Badge>
                    <button
                      onClick={(e) => handleDeleteProject(project.id, e)}
                      title="Delete Project"
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {project.description || project.repositoryUrl}
                </p>

                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-slate-700 dark:text-slate-300">
                      <GitBranch className="w-3.5 h-3.5 mr-1 text-indigo-500" />
                      {project.defaultBranch}
                    </span>
                    <span>{project.framework || "Standard"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2">
                <Link href={`/projects/${project.id}/architecture`} className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Graph</span>
                  </Button>
                </Link>
                <Link href={`/projects/${project.id}/runs/new`} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>New Run</span>
                  </Button>
                </Link>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
