"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Cpu,
  Boxes,
  Activity,
  Menu,
  X,
  PlusCircle,
  LogOut,
  User,
  FolderGit2,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-provider";
import { API_ROUTES, fetchApi } from "@/lib/config/api-routes";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; username: string; avatarUrl: string } | null>(null);

  useEffect(() => {
    fetchApi(API_ROUTES.AUTH.ME)
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetchApi(API_ROUTES.AUTH.LOGOUT, { method: "POST" });
    setUser(null);
    setMobileMenuOpen(false);
    router.push("/login");
  };

  const navLinks = [
    { href: "/dashboard", label: "Command Center", icon: Activity },
    { href: "/projects", label: "Repositories", icon: Boxes },
    { href: "/projects/new", label: "Connect Repository", icon: FolderGit2 },
  ];

  const isLoginPage = pathname === "/login";

  return (
    <div className="sticky top-0 z-50 w-full px-3 sm:px-6 lg:px-8 pt-3 pb-1 pointer-events-none">
      <header className="max-w-6xl mx-auto rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#030712]/90 backdrop-blur-2xl shadow-xl shadow-indigo-500/5 transition-all duration-200 pointer-events-auto">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-sky-400 p-[1.5px] transition-transform group-hover:scale-105 shadow-sm">
                <div className="w-full h-full bg-slate-50 dark:bg-slate-900 rounded-[9px] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-slate-100">
                  Wizard Pilot
                </span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono tracking-wider -mt-1">
                  AUTONOMOUS ENGINE
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          {user && (
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? "bg-slate-100 dark:bg-slate-800/90 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700/60 font-semibold shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Desktop Right Actions */}
          <div className="hidden sm:flex items-center space-x-3">
            <ThemeToggle />

            {user ? (
              <>
                <Link
                  href="/projects/new"
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-600 text-white font-semibold text-xs transition-all hover:opacity-95 shadow-sm active:scale-[0.98]"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>New Project</span>
                </Link>

                <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-7 h-7 rounded-full border border-indigo-500/40 object-cover shadow-xs"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs text-slate-700 dark:text-slate-300 font-bold">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-200 leading-tight truncate max-w-[100px]">
                      {user.name}
                    </span>
                    <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 leading-tight">
                      @{user.username}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              !isLoginPage && (
                <Link
                  href="/login"
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs transition-all hover:opacity-95 shadow-sm"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              )
            )}
          </div>

          {/* Mobile Right Bar (ThemeToggle + Hamburger) */}
          <div className="flex items-center space-x-2 sm:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-200/80 dark:border-slate-800/80 px-4 py-4 space-y-3 bg-white/95 dark:bg-[#030712]/95 rounded-b-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            {user ? (
              <>
                {/* User Profile Card */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center space-x-3">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-9 h-9 rounded-full border border-indigo-500/40 object-cover shadow-xs"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-sm text-slate-700 dark:text-slate-300 font-bold">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{user.name}</span>
                      <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">@{user.username}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                {/* Nav Links */}
                <div className="space-y-1 pt-1">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Icon className="w-4 h-4 text-indigo-500" />
                          <span>{link.label}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </Link>
                    );
                  })}
                </div>

                {/* Quick Action Button */}
                <Link
                  href="/projects/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md mt-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Connect New Repository</span>
                </Link>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In with GitHub</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}
