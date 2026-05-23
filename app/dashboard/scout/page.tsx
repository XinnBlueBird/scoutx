"use client";

import { useState, useRef } from "react";
import {
  Search,
  Wallet,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Fuel,
  Send,
  Loader2,
  TrendingUp,
} from "lucide-react";

interface AirdropEligibility {
  protocol: string;
  estimatedRange: string;
  criteriaMet: string[];
  criteriaMissed: string[];
  gasEstimate: string;
  score: number;
}

const mockWalletData = {
  address: "0x7a2E953f8D3cD3f9C2F3f3A29b2E41d8a81b3F9e",
  firstTx: "2023-03-14",
  totalTxs: 847,
  uniqueProtocols: 23,
  bridgeActivity: ["Stargate", "Across", "Orbiter", "LayerZero"],
  totalGasSpent: "2.4 ETH",
  activeDays: 142,
};

const airdrops: AirdropEligibility[] = [
  {
    protocol: "Starknet",
    estimatedRange: "800 - 2,400 STRK",
    criteriaMet: [
      "Bridge activity (>5 transactions)",
      "Smart wallet deployed",
      "Starknet ID claimed",
    ],
    criteriaMissed: ["LP provision on Ekubo"],
    gasEstimate: "$12.40",
    score: 82,
  },
  {
    protocol: "zkSync Era",
    estimatedRange: "1,200 - 4,800 ZK",
    criteriaMet: [
      "100+ transactions",
      "Multi-month activity",
      "Native bridge used",
      "Diversity score high",
    ],
    criteriaMissed: ["Gitcoin passport score below 20"],
    gasEstimate: "$18.60",
    score: 74,
  },
  {
    protocol: "LayerZero",
    estimatedRange: "50 - 200 ZRO",
    criteriaMet: [
      "Cross-chain messaging (8 txs)",
      "Multiple destination chains",
      "Stargate LP positions",
    ],
    criteriaMissed: [
      "Volume below 10 ETH threshold",
      "No DVN staking",
    ],
    gasEstimate: "$34.20",
    score: 61,
  },
  {
    protocol: "EigenLayer",
    estimatedRange: "30 - 120 EIGEN",
    criteriaMet: [
      "Restaked 2 ETH",
      "Delegated to operator",
      "Active for 60+ days",
    ],
    criteriaMissed: [
      "No native ETH staking",
      "Below minimum restake tier",
    ],
    gasEstimate: "$8.90",
    score: 55,
  },
];

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 75
      ? "bg-emerald-400"
      : score >= 50
        ? "bg-amber-400"
        : "bg-red-400";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-sm font-mono text-zinc-300 w-8 text-right">
        {score}
      </span>
    </div>
  );
}

export default function ScoutPage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: string; content: string }[]
  >([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  function handleScan(e: React.FormEvent) {
    e.preventDefault();
    if (!walletAddress.trim()) return;
    setIsScanning(true);
    setShowResults(false);
    setTimeout(() => {
      setIsScanning(false);
      setShowResults(true);
    }, 1200);
  }

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
                "You are an airdrop analyst. Evaluate wallet eligibility for crypto airdrops based on on-chain activity patterns. Be concise and specific. Under 200 words.",
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

  const overallScore = Math.round(
    airdrops.reduce((sum, a) => sum + a.score, 0) / airdrops.length
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Airdrop Scout</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Analyze wallet eligibility across protocols
        </p>
      </div>

      {/* Wallet Input */}
      <form onSubmit={handleScan} className="flex gap-3">
        <div className="flex-1 relative">
          <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Enter wallet address (0x...) or ENS name"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={isScanning}
          className="flex items-center gap-2 bg-cyan-500 text-zinc-950 font-semibold px-5 py-3 rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50 text-sm"
        >
          {isScanning ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          Scan
        </button>
      </form>

      {/* Scanning state */}
      {isScanning && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-3" />
          <p className="text-sm text-zinc-400">
            Scanning wallet across 50+ protocols...
          </p>
        </div>
      )}

      {/* Results */}
      {showResults && (
        <>
          {/* Wallet Summary */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-sm font-semibold text-zinc-200 mb-1">
                  Wallet Analysis
                </h2>
                <span className="text-xs font-mono text-zinc-500">
                  {mockWalletData.address}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">Overall Score</span>
                <span
                  className={`text-2xl font-bold font-mono ${
                    overallScore >= 75
                      ? "text-emerald-400"
                      : overallScore >= 50
                        ? "text-amber-400"
                        : "text-red-400"
                  }`}
                >
                  {overallScore}
                </span>
                <span className="text-xs text-zinc-600">/100</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <p className="text-xs text-zinc-500 mb-1">Total Txs</p>
                <p className="text-lg font-mono font-semibold text-zinc-200">
                  {mockWalletData.totalTxs}
                </p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <p className="text-xs text-zinc-500 mb-1">Protocols</p>
                <p className="text-lg font-mono font-semibold text-zinc-200">
                  {mockWalletData.uniqueProtocols}
                </p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <p className="text-xs text-zinc-500 mb-1">Active Days</p>
                <p className="text-lg font-mono font-semibold text-zinc-200">
                  {mockWalletData.activeDays}
                </p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <p className="text-xs text-zinc-500 mb-1">Gas Spent</p>
                <p className="text-lg font-mono font-semibold text-zinc-200">
                  {mockWalletData.totalGasSpent}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 mb-2">
                Bridge Activity
              </p>
              <div className="flex flex-wrap gap-2">
                {mockWalletData.bridgeActivity.map((bridge) => (
                  <span
                    key={bridge}
                    className="text-xs font-mono bg-zinc-800 text-zinc-400 px-2 py-1 rounded"
                  >
                    {bridge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Eligibility Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {airdrops.map((airdrop) => (
              <div
                key={airdrop.protocol}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-zinc-100">
                    {airdrop.protocol}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-sm font-mono text-cyan-400">
                      {airdrop.estimatedRange}
                    </span>
                  </div>
                </div>

                <ScoreBar score={airdrop.score} />

                <div className="mt-3 space-y-2">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Criteria Met</p>
                    {airdrop.criteriaMet.map((c) => (
                      <div key={c} className="flex items-center gap-2 py-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="text-xs text-zinc-400">{c}</span>
                      </div>
                    ))}
                  </div>
                  {airdrop.criteriaMissed.length > 0 && (
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Missed</p>
                      {airdrop.criteriaMissed.map((c) => (
                        <div
                          key={c}
                          className="flex items-center gap-2 py-0.5"
                        >
                          <XCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span className="text-xs text-zinc-500">{c}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center gap-2">
                  <Fuel className="w-3.5 h-3.5 text-zinc-600" />
                  <span className="text-xs text-zinc-500">
                    Est. claim gas:{" "}
                    <span className="text-zinc-400 font-mono">
                      {airdrop.gasEstimate}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* AI Analysis */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-800 flex items-center gap-2">
              <Search className="w-4 h-4 text-zinc-500" />
              <h2 className="text-sm font-semibold text-zinc-200">
                AI Airdrop Analysis
              </h2>
            </div>
            {chatMessages.length > 0 && (
              <div className="max-h-64 overflow-y-auto px-5 py-3 space-y-3">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={msg.role === "user" ? "text-right" : ""}
                  >
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
                placeholder="Ask about this wallet's airdrop potential..."
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
        </>
      )}
    </div>
  );
}
