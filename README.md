# ScoutX

Crypto intelligence meets content creation. ScoutX is a unified platform for market research, airdrop eligibility analysis, and social content generation.

## Features

### Research X
- Track trending crypto narratives in real-time
- Monitor sentiment (bullish / bearish / neutral) across topics
- KOL tracker with follower counts and focus areas
- AI-powered research assistant for on-demand analysis

### Airdrop Scout
- Scan any wallet address for airdrop eligibility
- Eligibility scoring across multiple protocols (Starknet, zkSync, LayerZero, EigenLayer)
- Criteria breakdown: met vs missed with detailed explanations
- Gas cost estimation for claim transactions
- AI analysis of wallet airdrop potential

### ThreadForge
- Generate publication-ready Twitter threads from raw notes
- Multiple source inputs: Research data, Airdrop data, or custom text
- Tone presets: Alpha Call, Tutorial, Degen Mode, Professional
- Live preview with per-tweet character counts
- Streaming generation for real-time feedback

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: lucide-react
- **AI**: MiMo v2.5-pro (via OpenAI-compatible API)
- **Font**: Inter (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone <repo-url>
cd scoutx
npm install
```

### Environment Variables

Copy the example env file and add your API key:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `MIMO_API_KEY` | API key for MiMo AI (obtain from Xiaomi MiMo platform) |

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## API Documentation

### `POST /api/mimo`

Proxy endpoint for the MiMo AI API. Handles streaming responses and parses both `content` and `reasoning_content` fields.

**Request Body:**
```json
{
  "messages": [
    { "role": "system", "content": "You are a helpful assistant." },
    { "role": "user", "content": "Your question here" }
  ]
}
```

**Response:**
- Content-Type: `text/plain; charset=utf-8`
- Streaming text response (plain text chunks)

**Error Responses:**
- `500` - `MIMO_API_KEY` not configured
- `400` - Invalid request body
- `5xx` - Upstream API error

## Project Structure

```
scoutx/
├── app/
│   ├── layout.tsx              # Root layout (Inter font, dark theme)
│   ├── globals.css             # Tailwind v4 + custom dark theme
│   ├── page.tsx                # Landing page
│   ├── api/
│   │   └── mimo/
│   │       └── route.ts        # MiMo AI streaming proxy
│   └── dashboard/
│       ├── layout.tsx           # Dashboard layout with sidebar
│       ├── page.tsx             # Dashboard overview
│       ├── research/
│       │   └── page.tsx         # Research X module
│       ├── scout/
│       │   └── page.tsx         # Airdrop Scout module
│       └── forge/
│           └── page.tsx         # ThreadForge module
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## License

MIT
