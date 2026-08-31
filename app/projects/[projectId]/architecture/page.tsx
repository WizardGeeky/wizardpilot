"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PlusCircle, RefreshCw, Layers, ShieldCheck, Terminal, Boxes } from "lucide-react";
import { ArchitectureGraph } from "@/features/architecture/architecture-graph";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { API_ROUTES, fetchApi } from "@/lib/config/api-routes";

export default function ProjectArchitecturePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = (params?.projectId as string) || "";

  const [project, setProject] = useState<any>(null);
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadArchitecture = async (forceRescan = false) => {
    if (!projectId) return;
    if (forceRescan) setRefreshing(true);

    try {
      const [projRes, archRes] = await Promise.all([
        fetchApi(API_ROUTES.PROJECTS.GET(projectId)),
        forceRescan
          ? fetchApi(API_ROUTES.PROJECTS.ARCHITECTURE(projectId), { method: "POST" })
          : fetchApi(API_ROUTES.PROJECTS.ARCHITECTURE(projectId)),
      ]);

      if (projRes.success && projRes.data) {
        setProject(projRes.data);
      }
      if (archRes.success && archRes.data) {
        setNodes(archRes.data.nodes || []);
        setEdges(archRes.data.edges || []);
      }
    } catch {}
    finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadArchitecture(false);
  }, [projectId]);

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-7">
      <div className="max-w-6xl mx-auto w-full flex flex-col space-y-4 sm:space-y-6">
        {/* Top Header */}
      <div className="flex flex-col space-y-3 pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 min-w-0">
            <Link href="/projects">
              <Button variant="ghost" size="sm" className="px-2 sm:px-3">
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline ml-1">Back</span>
              </Button>
            </Link>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                  {project?.name || "Repository"}
                </h1>
                <Badge variant="indigo" size="sm">
                  {project?.language || "TypeScript"}
                </Badge>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate max-w-[240px] sm:max-w-md">
                {project?.repositoryUrl || "AST Dependency & Module Hierarchy"}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons (full-width grid on mobile, inline on desktop) */}
        <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-end gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadArchitecture(true)}
            disabled={refreshing}
            className="w-full sm:w-auto text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1 shrink-0 ${refreshing ? "animate-spin text-indigo-500" : ""}`} />
            <span className="truncate">{refreshing ? "Scanning..." : "Scan Architecture"}</span>
          </Button>

          <Link href={`/projects/${projectId}/runs/new`} className="w-full sm:w-auto">
            <Button variant="primary" size="sm" className="w-full sm:w-auto text-xs flex items-center justify-center">
              <Terminal className="w-3.5 h-3.5 mr-1 shrink-0" />
              <span className="truncate">Launch Engineering Run</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Architecture Graph Area */}
      <div className="flex-1 min-h-[500px] sm:min-h-[550px]">
        <ArchitectureGraph
          initialNodes={nodes}
          initialEdges={edges}
          projectId={projectId}
        />
      </div>
      </div>
    </div>
  );
}
