"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Search,
  Radar,
  PenTool,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: BarChart3 },
  { label: "Research X", href: "/dashboard/research", icon: Search },
  { label: "Airdrop Scout", href: "/dashboard/scout", icon: Radar },
  { label: "ThreadForge", href: "/dashboard/forge", icon: PenTool },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-60 bg-zinc-900 border-r border-zinc-800
          flex flex-col
          transform transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <Link
            href="/"
            className="text-lg font-bold text-cyan-400 tracking-tight"
          >
            ScoutX
          </Link>
          <button
            className="md:hidden text-zinc-400 hover:text-zinc-100 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-zinc-800 text-cyan-400"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                  }
                `}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-5 py-4 border-t border-zinc-800">
          <p className="text-xs text-zinc-600">ScoutX v1.0</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900">
          <button
            className="text-zinc-400 hover:text-zinc-100 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-cyan-400 tracking-tight">
            ScoutX
          </span>
          <div className="w-5" />
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
