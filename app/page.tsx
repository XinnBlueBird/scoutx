import Link from "next/link";
import {
  Search,
  Radar,
  PenTool,
  ArrowRight,
  Wallet,
  FileText,
  Activity,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-cyan-400 tracking-tight">
            ScoutX
          </span>
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 hover:text-cyan-400 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-zinc-100 tracking-tight mb-4">
            Scout<span className="text-cyan-400">X</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Crypto Intelligence Meets Content Creation
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-cyan-500 text-zinc-950 font-semibold px-6 py-3 rounded-lg hover:bg-cyan-400 transition-colors"
          >
            Enter the Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Feature Cards */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Research X */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-cyan-500/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center mb-4">
                <Search className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                Research X
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Track trending narratives, monitor KOL sentiment, and get
                AI-powered market analysis across the crypto landscape.
              </p>
            </div>

            {/* Airdrop Scout */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-cyan-500/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center mb-4">
                <Radar className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                Airdrop Scout
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Analyze any wallet for airdrop eligibility across protocols.
                Get estimated allocations, gas costs, and actionable criteria.
              </p>
            </div>

            {/* ThreadForge */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-cyan-500/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center mb-4">
                <PenTool className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                ThreadForge
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Transform research and airdrop data into polished Twitter
                threads. Multiple tones from alpha calls to professional analysis.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="border-y border-zinc-800 bg-zinc-900/50">
          <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Wallet className="w-4 h-4 text-cyan-400" />
                <span className="text-2xl font-bold text-zinc-100">
                  10K+
                </span>
              </div>
              <span className="text-sm text-zinc-500">Wallets Scanned</span>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span className="text-2xl font-bold text-zinc-100">
                  500+
                </span>
              </div>
              <span className="text-sm text-zinc-500">Threads Generated</span>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-2xl font-bold text-zinc-100">
                  50+
                </span>
              </div>
              <span className="text-sm text-zinc-500">Protocols Tracked</span>
            </div>
          </div>
        </section>

        {/* About / Footer */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
            <h2 className="text-xl font-semibold text-zinc-100 mb-3">
              About ScoutX
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              ScoutX is a unified crypto intelligence and content creation
              platform built for researchers, degens, and alpha callers. Our
              three core modules work together seamlessly: Research X tracks
              narratives and sentiment in real-time, Airdrop Scout evaluates
              wallet eligibility across protocols, and ThreadForge transforms
              raw insights into publishable social content.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Whether you are tracking Bitcoin ETF flows, checking your eligibility
              for the next big airdrop, or crafting the perfect alpha thread,
              ScoutX provides the tools you need in a single, distraction-free
              command center.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <span className="text-sm text-zinc-500">
            ScoutX v1.0
          </span>
          <span className="text-xs text-zinc-600">
            Crypto Intelligence Platform
          </span>
        </div>
      </footer>
    </div>
  );
}
