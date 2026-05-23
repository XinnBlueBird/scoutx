"use client";

import { useState, useRef } from "react";
import {
  PenTool,
  Search,
  Radar,
  FileText,
  Loader2,
  Hash,
  Type,
} from "lucide-react";

const sources = [
  { id: "research", label: "From Research", icon: Search },
  { id: "airdrop", label: "From Airdrop", icon: Radar },
  { id: "custom", label: "Custom Input", icon: FileText },
];

const tones = [
  { id: "alpha", label: "Alpha Call" },
  { id: "tutorial", label: "Tutorial" },
  { id: "degen", label: "Degen Mode" },
  { id: "professional", label: "Professional" },
];

interface Tweet {
  id: number;
  content: string;
}

const mockThread: Tweet[] = [
  {
    id: 1,
    content:
      "Bitcoin ETF inflows just hit $320M in a single day. BlackRock IBIT alone absorbed more than the entire gold ETF market did in Q1. This is not a drill. Here's what you need to know:",
  },
  {
    id: 2,
    content:
      "Cumulative ETF flows have crossed $15.4B since January. For context, the gold ETF took 2 years to reach similar numbers. The institutional gate is wide open and capital is flowing fast.",
  },
  {
    id: 3,
    content:
      "On-chain data confirms it: exchange BTC reserves are at a 5-year low. Every day, roughly 4,000 BTC leave exchanges. ETF custody wallets are the primary destination. Supply shock thesis is playing out in real time.",
  },
  {
    id: 4,
    content:
      "Fidelity FBTC and ARK ARKB are quietly gaining ground. Wealth management desks are allocating client funds at scale. This is not retail FOMO - this is calculated institutional positioning.",
  },
  {
    id: 5,
    content:
      "The macro setup is perfect: Fed signaling rate cuts, dollar weakening, and global uncertainty rising. Bitcoin is being priced as a risk-on AND hedge asset simultaneously. That's new.",
  },
  {
    id: 6,
    content:
      "TLDR: ETF flows are accelerating, exchange supply is shrinking, institutions are loading up. If you're waiting for a better entry, you might be waiting a long time. Position accordingly.",
  },
];

export default function ForgePage() {
  const [source, setSource] = useState("custom");
  const [tone, setTone] = useState("alpha");
  const [rawInput, setRawInput] = useState("");
  const [thread, setThread] = useState<Tweet[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");

  async function handleGenerate() {
    setIsGenerating(true);
    setThread([]);
    setStreamedContent("");

    const prompt =
      source === "custom"
        ? rawInput || "Write a crypto alpha thread about current market conditions"
        : source === "research"
          ? "Generate a thread about the latest Bitcoin ETF flows and institutional adoption trends"
          : "Generate a thread about airdrop hunting strategies and wallet optimization techniques";

    const toneInstructions: Record<string, string> = {
      alpha: "Write in an alpha caller style. Direct, confident, use short punchy sentences. Build urgency.",
      tutorial: "Write in an educational style. Explain concepts clearly with numbered steps.",
      degen: "Write in degen style. Use crypto slang, casual tone, slightly unhinged but informative.",
      professional: "Write in a professional analysis style. Data-driven, measured, institutional-grade.",
    };

    try {
      const res = await fetch("/api/mimo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are a crypto Twitter thread writer. Generate exactly 6 tweets, separated by "---". ${toneInstructions[tone]} Each tweet must be under 280 characters. No emojis. Number each tweet.`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let accumulated = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setStreamedContent(accumulated);
        }

        // Parse the final content into tweets
        const tweets = accumulated
          .split("---")
          .map((t: string) => t.trim())
          .filter((t: string) => t.length > 0)
          .map((t: string, i: number) => ({
            id: i + 1,
            content: t.replace(/^\d+[\.\)]\s*/, ""),
          }));

        if (tweets.length > 0) {
          setThread(tweets);
        } else {
          // Fallback: treat the whole content as a single tweet set
          setThread([{ id: 1, content: accumulated }]);
        }
      }
    } catch {
      setThread([
        {
          id: 1,
          content:
            "Failed to generate thread. Check your API key configuration and try again.",
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">ThreadForge</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Generate publication-ready Twitter threads
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Input Panel */}
        <div className="space-y-4">
          {/* Source Selector */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-zinc-200 mb-3">
              Source
            </h2>
            <div className="flex flex-wrap gap-2">
              {sources.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSource(s.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    source === s.id
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                      : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"
                  }`}
                >
                  <s.icon className="w-4 h-4" />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Input */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-zinc-200 mb-3">
              {source === "custom"
                ? "Raw Notes / Brain Dump"
                : source === "research"
                  ? "Research Context"
                  : "Airdrop Data"}
            </h2>
            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder={
                source === "custom"
                  ? "Paste your notes, key points, or data here. The AI will transform this into a cohesive thread..."
                  : source === "research"
                    ? "Research data will be pulled from your Research X module. Add any extra context here..."
                    : "Airdrop data will be pulled from your Airdrop Scout results. Add any extra context here..."
              }
              className="w-full h-48 bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
            />
          </div>

          {/* Tone Selector */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-zinc-200 mb-3">
              Tone
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {tones.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tone === t.id
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                      : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 bg-cyan-500 text-zinc-950 font-semibold px-6 py-3 rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <PenTool className="w-4 h-4" />
                Generate Thread
              </>
            )}
          </button>
        </div>

        {/* Right: Thread Preview */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-zinc-500" />
              <h2 className="text-sm font-semibold text-zinc-200">
                Thread Preview
              </h2>
            </div>
            {thread.length > 0 && (
              <span className="text-xs font-mono text-zinc-500">
                {thread.length} tweets
              </span>
            )}
          </div>

          <div className="p-4 space-y-3 max-h-[700px] overflow-y-auto">
            {isGenerating && streamedContent && (
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {streamedContent}
                </p>
              </div>
            )}

            {!isGenerating && thread.length === 0 && (
              <div className="text-center py-12">
                <Type className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                <p className="text-sm text-zinc-600">
                  Select a source, add context, choose a tone, and generate.
                </p>
              </div>
            )}

            {!isGenerating &&
              thread.length > 0 &&
              thread.map((tweet) => (
                <div
                  key={tweet.id}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-zinc-600 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-cyan-400">
                      Tweet {tweet.id}/{thread.length}
                    </span>
                    <span
                      className={`text-xs font-mono ${
                        tweet.content.length > 280
                          ? "text-red-400"
                          : "text-zinc-600"
                      }`}
                    >
                      {tweet.content.length}/280
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {tweet.content}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
