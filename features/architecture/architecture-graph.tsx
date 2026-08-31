"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Position,
  Handle,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Filter, Layers, Zap, Info, ShieldCheck, FolderGit2, Play, FileCode, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ArchitectureGraphProps {
  initialNodes?: any[];
  initialEdges?: any[];
  projectId?: string;
}

// Custom High-Tech Node Component
function CustomNode({ data }: { data: any }) {
  const typeColors: Record<string, { border: string; text: string; bg: string }> = {
    controller: { border: "border-sky-500", text: "text-sky-600 dark:text-sky-400", bg: "bg-sky-500/10" },
    service: { border: "border-indigo-500", text: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-500/10" },
    repository: { border: "border-purple-500", text: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10" },
    database: { border: "border-emerald-500", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
    external_api: { border: "border-amber-500", text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
    test: { border: "border-teal-500", text: "text-teal-600 dark:text-teal-400", bg: "bg-teal-500/10" },
    utility: { border: "border-slate-400", text: "text-slate-700 dark:text-slate-300", bg: "bg-slate-500/10" },
    module: { border: "border-cyan-500", text: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-500/10" },
  };

  const style = typeColors[data.nodeType] || typeColors.service;
  const isHighImpact = (data.impactScore || 0) > 80;

  return (
    <div
      className={`px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0D1014] border-2 ${style.border} min-w-[190px] shadow-lg backdrop-blur-md transition-all hover:scale-105 select-none ${
        isHighImpact ? "ring-2 ring-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.25)]" : ""
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-indigo-500 !w-2.5 !h-2.5 !border-2 !border-white" />
      <div className="flex items-center justify-between space-x-2">
        <span className={`text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded ${style.bg} ${style.text}`}>
          {data.nodeType}
        </span>
        {isHighImpact && (
          <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 flex items-center font-bold">
            <Zap className="w-2.5 h-2.5 mr-0.5 text-indigo-500" />
            CORE
          </span>
        )}
      </div>

      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1.5 truncate">
        {data.name}
      </div>

      {data.filePath && (
        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate mt-0.5 max-w-[170px]">
          {data.filePath.split("/").pop()}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-sky-500 !w-2.5 !h-2.5 !border-2 !border-white" />
    </div>
  );
}

const nodeTypes = {
  customNode: CustomNode,
};

export function ArchitectureGraph({
  initialNodes = [],
  initialEdges = [],
  projectId,
}: ArchitectureGraphProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  const defaultNodes: Node[] = useMemo(() => {
    if (initialNodes.length > 0) {
      return initialNodes.map((n, i) => ({
        id: n.id || `node-${i + 1}`,
        type: "customNode",
        position: n.position || {
          x: (i % 3) * 260 + 60,
          y: Math.floor(i / 3) * 160 + 60,
        },
        data: {
          name: n.name || n.data?.label || `Component ${i + 1}`,
          nodeType: n.nodeType || n.data?.type || "service",
          filePath: n.filePath || `src/${n.name || "module"}.ts`,
          impactScore: n.metadata?.impactScore ?? (i < 3 ? 92 : 65),
          layer: n.layer || n.metadata?.layer || "Application Layer",
        },
      }));
    }
    return [];
  }, [initialNodes]);

  const defaultEdges: Edge[] = useMemo(() => {
    if (initialEdges.length > 0) {
      return initialEdges.map((e, i) => ({
        id: e.id || `edge-${i + 1}`,
        source: e.sourceNodeId || e.source,
        target: e.targetNodeId || e.target,
        animated: e.relationType === "CALLS" || e.relationType === "TESTS" || e.animated || true,
        style: { stroke: e.relationType === "TESTS" ? "#10B981" : "#6366F1", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#6366F1" },
        label: e.relationType || e.label || "CALLS",
        labelStyle: { fill: "#64748b", fontSize: 9, fontFamily: "monospace", fontWeight: 700 },
        labelBgStyle: { fill: "#ffffff", fillOpacity: 0.9 },
        labelBgPadding: [4, 2] as [number, number],
        labelBgBorderRadius: 4,
      }));
    }
    return [];
  }, [initialEdges]);

  const filteredNodes = useMemo(() => {
    if (selectedType === "ALL") return defaultNodes;
    return defaultNodes.filter((n) => String(n.data?.nodeType || "").toLowerCase() === selectedType.toLowerCase());
  }, [defaultNodes, selectedType]);

  const nodeTypesList = ["ALL", "CONTROLLER", "SERVICE", "REPOSITORY", "MODULE", "TEST", "UTILITY"];

  if (defaultNodes.length === 0) {
    return (
      <Card className="p-12 border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-center space-y-3 h-full flex flex-col items-center justify-center min-h-[400px]">
        <Layers className="w-10 h-10 text-indigo-500 animate-pulse mx-auto" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-200">No Architecture Graph Generated Yet</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
          Click &quot;Scan Architecture&quot; above to index the real repository file tree and visualize AST components.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-3 w-full">
      {/* Controls Bar: Two Clean Rows to Guarantee Zero Badge/Button Overlap */}
      <div className="flex flex-col space-y-2.5 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
        {/* Row 1: Header + AST Counters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 shrink-0">
            <Layers className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
              AST Dependency Map
            </span>
          </div>
          <div className="flex items-center space-x-1.5 shrink-0">
            <Badge variant="cyan" size="sm">{defaultNodes.length} NODES</Badge>
            <Badge variant="indigo" size="sm">{defaultEdges.length} EDGES</Badge>
          </div>
        </div>

        {/* Row 2: Filter Pills with zero overlap and hidden scrollbar */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 w-full scrollbar-none">
          <span className="text-[10px] font-mono text-slate-400 uppercase mr-1 shrink-0 flex items-center">
            <Filter className="w-3 h-3 mr-1" />
            Filter:
          </span>
          {nodeTypesList.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                selectedType === type
                  ? "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/40 shadow-xs font-bold"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Legend & Interactive Guidance */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 shrink-0">
        <div className="flex flex-wrap items-center gap-1 font-mono text-[10px]">
          <span className="font-bold text-slate-700 dark:text-slate-300 mr-1 uppercase">Legend:</span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-600 dark:text-sky-400 font-semibold">Controller</span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold">Service</span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-600 dark:text-purple-400 font-semibold">Persistence</span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-semibold">UI Module</span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-teal-500/15 text-teal-600 dark:text-teal-400 font-semibold">Test Suite</span>
        </div>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 italic">
          💡 Click any node to inspect file details or launch a targeted run.
        </span>
      </div>

      {/* React Flow Canvas */}
      <div
        className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-[#030712] relative shadow-lg"
        style={{ width: "100%", height: "550px", minHeight: "500px" }}
      >
        <ReactFlow
          nodes={filteredNodes}
          edges={defaultEdges}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => setSelectedNode(node.data)}
          fitView
          fitViewOptions={{ padding: 0.2, minZoom: 0.5, maxZoom: 1.2 }}
          defaultViewport={{ x: 40, y: 40, zoom: 0.9 }}
          minZoom={0.2}
          maxZoom={2}
          style={{ width: "100%", height: "100%" }}
        >
          <Background color="#6366F1" gap={24} size={1} />
          <Controls className="!bg-white dark:!bg-slate-900 !border-slate-200 dark:!border-slate-800 !fill-slate-700 dark:!fill-slate-300 shadow-md" />
          <MiniMap
            nodeColor={(n) => {
              if (n.data?.nodeType === "controller") return "#38BDF8";
              if (n.data?.nodeType === "service") return "#6366F1";
              if (n.data?.nodeType === "database" || n.data?.nodeType === "repository") return "#A855F7";
              if (n.data?.nodeType === "test") return "#10B981";
              return "#F59E0B";
            }}
            maskColor="rgba(3, 7, 18, 0.4)"
            className="!bg-white/80 dark:!bg-slate-900/80 !border-slate-200 dark:!border-slate-800 !rounded-xl shadow-md !w-28 !h-20"
          />
        </ReactFlow>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute bottom-4 right-4 max-w-sm w-full p-4 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-indigo-500/40 backdrop-blur-md shadow-2xl space-y-3 z-10 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 uppercase font-bold">
                {selectedNode.nodeType}
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedNode.name}</h4>
            {selectedNode.filePath && (
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 break-all bg-slate-100 dark:bg-slate-950 p-2 rounded-lg">
                {selectedNode.filePath}
              </p>
            )}
            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
              <span>Layer: {selectedNode.layer || "Application"}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                Impact: {selectedNode.impactScore}%
              </span>
            </div>

            {projectId && (
              <Button
                variant="primary"
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  router.push(`/projects/${projectId}/runs/new?target=${encodeURIComponent(selectedNode.name)}`);
                }}
              >
                <Play className="w-3.5 h-3.5 mr-1" />
                <span>Launch Run for this Component</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
