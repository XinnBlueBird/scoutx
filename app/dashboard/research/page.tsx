"use client";

import { useState, useRef } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Send,
  Users,
  ExternalLink,
  Loader2,
} from "lucide-react";

interface Topic {
  id: number;
  name: string;
  sentiment: "bullish" | "bearish" | "neutral";
  mentions: number;
  trend: "up" | "down" | "flat";
  summary: string;
  details: string;
}

const topics: Topic[] = [
  {
    id: 1,
    name: "Bitcoin ETF Flows",
    sentiment: "bullish",
    mentions: 14200,
    trend: "up",
    summary:
      "Institutional inflows into spot Bitcoin ETFs have accelerated over the past 72 hours, with BlackRock IBIT leading at $320M daily net inflow. Total cumulative flows now exceed $15.4B since January launch.",
    details:
      "The sustained ETF inflow pattern suggests renewed institutional conviction following the Fed's dovish tone. Fidelity FBTC and ARK ARKB are also seeing increased allocations from wealth management desks. On-chain data shows exchange BTC reserves dropping to multi-year lows, consistent with ETF custody accumulation. Key risk: regulatory headwinds if SEC enforcement actions target adjacent DeFi products.",
  },
  {
    id: 2,
    name: "Solana Memecoin Surge",
    sentiment: "bullish",
    mentions: 28400,
    trend: "up",
    summary:
      "Solana DEX volume hit $3.2B in 24 hours, driven primarily by memecoin trading on Raydium and Jupiter. New launches on pump.fun are averaging 4,000 per day with a median lifespan of 6 hours.",
    details:
      "The current memecoin cycle on Solana has outpaced the previous peak in both volume and unique wallet participation. Notable tokens include WIF, BONK, and several AI-themed narratives. MEV bots are extracting an estimated $2M daily from sandwich attacks on these pools. Validators are earning record priority fees. Risk profile: extremely high volatility, 97% of new tokens fail within 48 hours.",
  },
  {
    id: 3,
    name: "ETH L2 Wars",
    sentiment: "neutral",
    mentions: 8900,
    trend: "flat",
    summary:
      "Base, Arbitrum, and Optimism are competing aggressively for TVL and developer mindshare. Base has captured 38% of L2 transaction volume following the Coinbase integration push.",
    details:
      "The L2 landscape is fragmenting rapidly. Base benefits from Coinbase distribution but lacks native token incentives. Arbitrum Orbit chains are proliferating, with 12 new app-chains launched this month. Optimism's Superchain thesis is gaining traction with World Chain and Zora Network joining. zkSync Era and Starknet are seeing slower adoption but stronger technical foundations. The real winner: ETH stakers earning blob fee revenue.",
  },
  {
    id: 4,
    name: "EigenLayer Restaking",
    sentiment: "bullish",
    mentions: 6700,
    trend: "up",
    summary:
      "EigenLayer TVL has crossed $15B with 18 actively validated services (AVS) now live. Restaking yields are averaging 4.2% on top of native ETH staking rewards.",
    details:
      "The restaking meta is maturing beyond speculation. EigenDA is processing real data availability workloads. Oracle networks and bridge security modules are the most promising AVS categories. Risk: slashing contagion is a real systemic concern if a major AVS misbehaves. The EIGEN token governance structure adds another layer of complexity. Institutional stakers are beginning to explore restaking strategies through Figment and Kiln.",
  },
  {
    id: 5,
    name: "TON Ecosystem Growth",
    sentiment: "neutral",
    mentions: 5100,
    trend: "up",
    summary:
      "Telegram's TON blockchain has onboarded 8M new wallets in Q2 through mini-apps and gaming integrations. USDT on TON has reached $1.2B in circulation.",
    details:
      "The TON ecosystem is leveraging Telegram's 800M user base for distribution. Games like Notcoin and Hamster Kombat have driven viral adoption, though retention metrics remain unclear. The TON Foundation's grants program is attracting Solidity developers through EVM compatibility tooling. Regulatory risk: potential classification concerns given the Telegram connection. Liquidity depth on TON DEXs remains shallow compared to EVM chains.",
  },
  {
    id: 6,
    name: "RWA Tokenization",
    sentiment: "bullish",
    mentions: 4300,
    trend: "up",
    summary:
      "BlackRock BUIDL fund has surpassed $500M in tokenized treasury assets. Ondo Finance and Centrifuge are leading the charge in on-chain real-world asset tokenization.",
    details:
      "Real-world asset tokenization is moving from narrative to product-market fit. Treasury bills are the lowest-hanging fruit, with 6 protocols now offering tokenized T-bill exposure. The next frontier: private credit, real estate, and commodity tokenization. Compliance frameworks are maturing through partnerships with Securitize and Polymath. Institutional adoption is being driven by settlement efficiency and 24/7 transferability.",
  },
];

const kols = [
  { handle: "@inversebrah", name: "inversebrah", followers: "312K", focus: "Macro / Memes" },
  { handle: "@DefiIgnas", name: "DefiIgnas", followers: "187K", focus: "DeFi Research" },
  { handle: "@cryptoquant_com", name: "CryptoQuant", followers: "245K", focus: "On-chain Data" },
  { handle: "@aaboronov", name: "Alex Boronov", followers: "89K", focus: "L2 / Infra" },
  { handle: "@TheBlock__", name: "The Block", followers: "620K", focus: "Industry News" },
  { handle: "@HsakaTrades", name: "Hsaka", followers: "298K", focus: "Trading / Alpha" },
];

export default function ResearchPage() {
  const [selectedTopic, setSelectedTopic] = useState<Topic>(topics[0]);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: string; content: string }[]
  >([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  async function handleChat(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim() || isStreaming) return;

    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setChatInput("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/mimo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a crypto research analyst. Give concise, data-driven answers about crypto markets, protocols, and narratives. Keep responses under 200 words.",
            },
            { role: "user", content: userMsg },
          ],
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      setChatMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let accumulated = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;
          setChatMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: accumulated,
            };
            return updated;
          });
        }
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Failed to get a response. Check your API key configuration.",
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  }

  function SentimentBadge({ sentiment }: { sentiment: string }) {
    const styles: Record<string, string> = {
      bullish: "bg-emerald-400/10 text-emerald-400",
      bearish: "bg-red-400/10 text-red-400",
      neutral: "bg-zinc-700 text-zinc-400",
    };
    return (
      <span
        className={`text-xs font-mono px-2 py-0.5 rounded ${styles[sentiment] || styles.neutral}`}
      >
        {sentiment}
      </span>
    );
  }

  function TrendIcon({ trend }: { trend: string }) {
    if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
    if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-red-400" />;
    return <Minus className="w-3.5 h-3.5 text-zinc-500" />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Research X</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Trending narratives and market intelligence
        </p>
      </div>

      {/* Main panels */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left: Topic List */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-200">
              Trending Topics
            </h2>
          </div>
          <div className="divide-y divide-zinc-800">
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className={`w-full text-left px-4 py-3 hover:bg-zinc-800/50 transition-colors ${
                  selectedTopic.id === topic.id ? "bg-zinc-800/70" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-zinc-200">
                    {topic.name}
                  </span>
                  <TrendIcon trend={topic.trend} />
                </div>
                <div className="flex items-center gap-2">
                  <SentimentBadge sentiment={topic.sentiment} />
                  <span className="text-xs text-zinc-500 font-mono">
                    {topic.mentions.toLocaleString()} mentions
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Topic Detail */}
        <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-zinc-100">
                {selectedTopic.name}
              </h2>
              <div className="flex items-center gap-2">
                <SentimentBadge sentiment={selectedTopic.sentiment} />
                <TrendIcon trend={selectedTopic.trend} />
              </div>
            </div>
            <span className="text-xs text-zinc-500 font-mono">
              {selectedTopic.mentions.toLocaleString()} mentions in last 24h
            </span>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Summary
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {selectedTopic.summary}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Detailed Analysis
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {selectedTopic.details}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KOL Tracker */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
          <Users className="w-4 h-4 text-zinc-500" />
          <h2 className="text-sm font-semibold text-zinc-200">KOL Tracker</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800">
          {kols.map((kol) => (
            <div
              key={kol.handle}
              className="px-5 py-3 hover:bg-zinc-800/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-zinc-200">
                  {kol.handle}
                </span>
                <ExternalLink className="w-3 h-3 text-zinc-600" />
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="font-mono">{kol.followers} followers</span>
                <span className="text-zinc-700">|</span>
                <span>{kol.focus}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Chat */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-200">
            Research Assistant
          </h2>
        </div>
        {chatMessages.length > 0 && (
          <div className="max-h-64 overflow-y-auto px-5 py-3 space-y-3">
            {chatMessages.map((msg, i) => (
              <div key={i} className={msg.role === "user" ? "text-right" : ""}>
                <span
                  className={`inline-block text-sm px-3 py-2 rounded-lg max-w-[85%] text-left ${
                    msg.role === "user"
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "bg-zinc-800 text-zinc-300"
                  }`}
                >
                  {msg.content || (
                    <Loader2 className="w-4 h-4 animate-spin inline" />
                  )}
                </span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}
        <form onSubmit={handleChat} className="flex border-t border-zinc-800">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask about any topic..."
            className="flex-1 bg-transparent px-5 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isStreaming}
            className="px-4 text-zinc-500 hover:text-cyan-400 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
