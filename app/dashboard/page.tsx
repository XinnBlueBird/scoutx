"use client";

import Link from "next/link";
import {
  Search,
  Radar,
  PenTool,
  TrendingUp,
  ArrowRight,
  Clock,
  Wallet,
  FileText,
  Activity,
} from "lucide-react";

const modules = [
  {
    title: "Research X",
    description: "Track narratives, sentiment, and KOL activity across crypto markets",
    icon: Search,
    href: "/dashboard/research",
    stats: "12 active topics",
    status: "Live",
  },
  {
    title: "Airdrop Scout",
    description: "Evaluate wallet eligibility for upcoming and past airdrop events",
    icon: Radar,
    href: "/dashboard/scout",
    stats: "4 protocols tracked",
    status: "Ready",
  },
  {
    title: "ThreadForge",
    description: "Generate publication-ready Twitter threads from research and data",
    icon: PenTool,
    href: "/dashboard/forge",
    stats: "127 threads created",
    status: "Ready",
  },
];

const recentActivity = [
  {
    id: 1,
    action: "Research X",
    detail: "Bitcoin ETF flow analysis updated",
    time: "2 min ago",
    icon: Search,
  },
  {
    id: 2,
    action: "Airdrop Scout",
    detail: "Starknet eligibility scan completed for 0x7a2...3f9e",
    time: "15 min ago",
    icon: Radar,
  },
  {
    id: 3,
    action: "ThreadForge",
    detail: "Thread generated: ETH L2 wars breakdown",
    time: "1 hr ago",
    icon: PenTool,
  },
  {
    id: 4,
    action: "Research X",
    detail: "KOL tracker: @inversebrah mentioned SOL",
    time: "2 hrs ago",
    icon: TrendingUp,
  },
  {
    id: 5,
    action: "Airdrop Scout",
    detail: "zkSync eligibility score changed: 62 to 71",
    time: "3 hrs ago",
    icon: Wallet,
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Overview</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Crypto intelligence command center
        </p>
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modules.map((mod) => (
          <Link
            key={mod.title}
            href={mod.href}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-cyan-500/40 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center">
                <mod.icon className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                {mod.status}
              </span>
            </div>
            <h3 className="text-base font-semibold text-zinc-100 mb-1">
              {mod.title}
            </h3>
            <p className="text-xs text-zinc-500 mb-3">{mod.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-mono">
                {mod.stats}
              </span>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-zinc-500" />
            <h2 className="text-sm font-semibold text-zinc-200">
              Recent Activity
            </h2>
          </div>
          <div className="divide-y divide-zinc-800">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="px-5 py-3 flex items-center gap-3 hover:bg-zinc-800/30 transition-colors"
              >
                <item.icon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-300 truncate">
                    {item.detail}
                  </p>
                  <p className="text-xs text-zinc-600">{item.action}</p>
                </div>
                <span className="text-xs text-zinc-600 flex-shrink-0">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="px-5 py-4 border-b border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-200">
              Quick Actions
            </h2>
          </div>
          <div className="p-4 space-y-2">
            <Link
              href="/dashboard/research"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              Browse Trending Topics
            </Link>
            <Link
              href="/dashboard/scout"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <Radar className="w-4 h-4 text-cyan-400" />
              Scan a Wallet
            </Link>
            <Link
              href="/dashboard/forge"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <PenTool className="w-4 h-4 text-cyan-400" />
              Generate a Thread
            </Link>
            <div className="pt-2 mt-2 border-t border-zinc-800">
              <div className="flex items-center gap-3 px-3 py-2.5">
                <Activity className="w-4 h-4 text-zinc-600" />
                <span className="text-xs text-zinc-500">
                  All systems operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
