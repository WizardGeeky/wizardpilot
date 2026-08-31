"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Boxes,
  GitBranch,
  FolderGit2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Lock,
  Globe,
  PlusCircle,
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { MagicBadge } from "@/components/ui/magic-badge";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { API_ROUTES, fetchApi } from "@/lib/config/api-routes";

interface GitHubRepoItem {
  id: number;
  name: string;
  fullName: string;
  description: string;
  defaultBranch: string;
  isPrivate: boolean;
  language: string;
  url: string;
  owner: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [defaultBranch, setDefaultBranch] = useState("main");
  const [loading, setLoading] = useState(false);

  // User's Real Repositories
  const [userRepos, setUserRepos] = useState<GitHubRepoItem[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [branches, setBranches] = useState<string[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);

  // Fetch real user repositories from GitHub OAuth
  useEffect(() => {
    fetchApi(API_ROUTES.GITHUB.REPOS)
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setUserRepos(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingRepos(false));
  }, []);

  // When a user selects a real repository from their GitHub account
  const handleSelectUserRepo = async (repo: GitHubRepoItem) => {
    setName(repo.name);
    setRepoUrl(repo.url);
    setDefaultBranch(repo.defaultBranch);

    // Fetch branches for this repo
    setLoadingBranches(true);
    try {
      const data = await fetchApi(API_ROUTES.GITHUB.BRANCHES(repo.owner, repo.name));
      if (data.success && Array.isArray(data.data)) {
        setBranches(data.data.map((b: any) => b.name));
      }
    } catch {}
    finally {
      setLoadingBranches(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) return;

    setLoading(true);
    try {
      const data = await fetchApi(API_ROUTES.PROJECTS.CREATE, {
        method: "POST",
        body: JSON.stringify({
          name: name || "target-repository",
          repositoryUrl: repoUrl,
          defaultBranch: defaultBranch || "main",
        }),
      });

      if (data.success && data.data?.id) {
        router.push(`/projects/${data.data.id}/runs/new`);
      } else {
        router.push("/projects");
      }
    } catch {
      router.push("/projects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-7">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <FolderGit2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Connect Repository
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select one of your real GitHub repositories or enter any repository URL
            </p>
          </div>
        </div>
      </div>

      {/* Real GitHub Account Repositories Grid */}
      {userRepos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-2">
              <FolderGit2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Your Real GitHub Repositories ({userRepos.length})</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-64 sm:max-h-72 overflow-y-auto pr-1">
            {userRepos.map((repo) => (
              <button
                key={repo.id}
                type="button"
                onClick={() => handleSelectUserRepo(repo)}
                className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between space-y-1.5 cursor-pointer ${
                  repoUrl === repo.url
                    ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 shadow-sm ring-1 ring-indigo-500/40"
                    : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-indigo-500/40"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {repo.name}
                  </span>
                  {repo.isPrivate ? (
                    <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                  ) : (
                    <Globe className="w-3 h-3 text-slate-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  {repo.description || "No description provided"}
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="truncate">{repo.language || "TypeScript"}</span>
                  <span className="shrink-0">branch: {repo.defaultBranch}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Manual or Selected Repository Form */}
      <SpotlightCard className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              GitHub Repository URL
            </label>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repository"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Project Alias (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. payment-service"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Default Target Branch
              </label>
              {branches.length > 0 ? (
                <select
                  value={defaultBranch}
                  onChange={(e) => setDefaultBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                >
                  {branches.map((b) => (
                    <option key={b} value={b} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                      {b}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={defaultBranch}
                  onChange={(e) => setDefaultBranch(e.target.value)}
                  placeholder="main"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono"
                />
              )}
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/projects")}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full sm:w-auto order-1 sm:order-2 flex items-center justify-center"
            >
              <span>{loading ? "Connecting..." : "Proceed to Engineering Run"}</span>
              <ArrowRight className="w-4 h-4 ml-1.5 shrink-0" />
            </Button>
          </div>
        </form>
      </SpotlightCard>
      </div>
    </div>
  );
}
