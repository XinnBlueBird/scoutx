import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.MIMO_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "MIMO_API_KEY is not configured" },
      { status: 500 }
    );
  }

  let body: { messages?: { role: string; content: string }[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.messages || !Array.isArray(body.messages)) {
    return NextResponse.json(
      { error: "messages array is required" },
      { status: 400 }
    );
  }

  const upstreamRes = await fetch(
    "https://token-plan-sgp.xiaomimimo.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        model: "mimo-v2.5-pro",
        messages: body.messages,
        stream: true,
      }),
    }
  );

  if (!upstreamRes.ok) {
    const errText = await upstreamRes.text().catch(() => "Unknown error");
    return NextResponse.json(
      { error: `Upstream error: ${upstreamRes.status}`, detail: errText },
      { status: upstreamRes.status }
    );
  }

  if (!upstreamRes.body) {
    return NextResponse.json(
      { error: "No response body from upstream" },
      { status: 502 }
    );
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstreamRes.body!.getReader();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;
            const data = trimmed.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta;
              if (!delta) continue;

              // Prefer reasoning_content if present, otherwise content
              const text = delta.reasoning_content ?? delta.content;
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            } catch {
              // Skip unparseable chunks
            }
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "Transfer-Encoding": "chunked",
    },
  });
}
