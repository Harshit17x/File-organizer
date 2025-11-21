"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Folder, Star, Trash2, Settings, Menu } from "lucide-react";
import { useState } from "react";
import { StorageIndicator } from '../ui/StorageIndicator';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "All Subjects", href: "/subjects", icon: Folder },
  { name: "Favorites", href: "/favorites", icon: Star },
  { name: "Trash", href: "/trash", icon: Trash2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 glass rounded-full text-foreground"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Container */}
      <aside
        className={clsx(
          "fixed left-0 top-0 h-screen w-64 bg-[rgba(5,5,20,0.9)] border-r border-[rgba(217,70,239,0.2)] backdrop-blur-xl shadow-[5px_0_30px_rgba(0,0,0,0.5)] flex flex-col z-50 md:translate-x-0 transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Tech Border Line */}
        <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[rgba(217,70,239,0.5)] to-transparent" />

        <div className="p-6 relative overflow-hidden">
          {/* HUD Corner */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[rgba(217,70,239,0.5)] to-transparent" />
          <div className="absolute top-0 left-0 w-[2px] h-8 bg-[rgba(217,70,239,0.5)]" />

          <h1 className="text-2xl font-bold tracking-wider text-white flex items-center gap-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d946ef] to-[#06b6d4] text-glow">ORGANIZE</span>
            <span className="text-xs bg-[rgba(217,70,239,0.1)] text-[#d946ef] px-1 py-0.5 rounded border border-[rgba(217,70,239,0.3)]">OS</span>
          </h1>
        </div>

        <nav className="mt-6 px-4 space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={twMerge(
                  "flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 group relative overflow-hidden border border-transparent",
                  isActive
                    ? "bg-[rgba(217,70,239,0.1)] text-[#d946ef] border-[rgba(217,70,239,0.3)] shadow-[0_0_15px_rgba(217,70,239,0.15)]"
                    : "text-cyan-100/60 hover:bg-[rgba(217,70,239,0.05)] hover:text-[#f472b6] hover:border-[rgba(217,70,239,0.2)]"
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#d946ef] shadow-[0_0_10px_rgba(217,70,239,0.8)]" />}

                <Icon
                  size={20}
                  className={clsx(
                    "transition-colors",
                    isActive ? "text-[#d946ef]" : "group-hover:text-[#f472b6]"
                  )}
                />
                <span className="font-medium tracking-wide">{item.name.toUpperCase()}</span>
              </Link>
            );
          })}
        </nav>

        <div className="relative bg-black/20 backdrop-blur-md border-t border-[rgba(217,70,239,0.2)]">
          {/* Tech Line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(217,70,239,0.3)] to-transparent" />

          {/* System Monitor Widget */}
          <div className="px-4 pt-4 pb-2">
            <div className="bg-black/40 border border-[#d946ef]/20 rounded p-3 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono text-[#06b6d4]">
                <span>CPU_LOAD</span>
                <span className="animate-pulse">12%</span>
              </div>
              <div className="h-1 bg-[#d946ef]/10 rounded-full overflow-hidden">
                <div className="h-full w-[12%] bg-[#06b6d4] shadow-[0_0_5px_rgba(6,182,212,0.5)]" />
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-[#d946ef]">
                <span>MEM_USAGE</span>
                <span>45%</span>
              </div>
              <div className="h-1 bg-[#d946ef]/10 rounded-full overflow-hidden">
                <div className="h-full w-[45%] bg-[#d946ef] shadow-[0_0_5px_rgba(217,70,239,0.5)]" />
              </div>
            </div>
          </div>

          <StorageIndicator />

          <div className="p-4">
            <Link
              href="/settings"
              className={twMerge(
                "flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 group border border-transparent",
                pathname === '/settings'
                  ? "bg-[rgba(217,70,239,0.1)] text-[#d946ef] border-[rgba(217,70,239,0.3)]"
                  : "text-cyan-100/60 hover:bg-[rgba(217,70,239,0.05)] hover:text-[#f472b6] hover:border-[rgba(217,70,239,0.2)]"
              )}
            >
              <Settings size={20} />
              <span className="font-medium tracking-wide">SETTINGS</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
