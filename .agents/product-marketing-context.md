# Product Marketing Context

*Last updated: 2026-04-26*
*Status: V1 auto-drafted from landing page, API docs, about page, and i18n copy. Needs human review — flag corrections inline.*

## Product Overview
**One-liner:** A P2P cloud desktop you can actually share — real multiplayer for humans and a REST API for AI agents.
**What it does:** Cyqle spins up a full Linux desktop in the browser in seconds. Multiple humans can drive it simultaneously (multiple cursors, multiple keyboards, P2P streaming) — and AI agents can boot, drive, snapshot, and tear down sessions over HTTP.
**Product category:** Cloud desktop / virtual desktop infrastructure (VDI), with a second shelf as an "agent computer" / browser-and-OS infrastructure for AI agents (adjacent to E2B, Browserbase, Daytona, Anthropic's computer-use sandbox).
**Product type:** SaaS — usage-based credits + monthly subscriptions. Self-serve with API access on paid tiers.
**Business model:** Freemium. Free tier (60-min sessions, 1 vCPU). Paid: $0.20/credit (Lite) or $0.40/credit (Pro), 1 credit = 10 hours of desktop time. Power tiers (Turbo 2×, Max 4×) for heavier workloads. Custom pricing on team seats.

## Target Audience
**Target companies:**
- Distributed dev/QA teams who pair-program, debug, or run regression tests together
- AI/agent companies building computer-use products who need a sandboxed Linux desktop per agent run
- Support and ops teams who need a shared, secure environment for guided sessions and internal tools
- Solo developers who want a persistent cloud dev environment

**Decision-makers:**
- Engineering leads / staff engineers (pair programming, QA infra, CI sandboxes)
- Heads of AI/Agent platforms (computer-use infra spend)
- DevOps / Platform engineering (replacing brittle local envs and self-hosted VDI)
- Founders of small AI startups (one buyer, one user)

**Primary use case:** Two distinct primary use cases — (1) "share a real computer with my team in 10 seconds without screen sharing" and (2) "give my AI agent a sandboxed Linux desktop over HTTP."

**Jobs to be done:**
- Replace screen sharing with a real shared workspace where everyone can act, not just watch
- Give AI agents a real OS to operate in (not just a tool-calling tab)
- Spin up disposable, reproducible environments for QA, demos, support, and onboarding

**Use cases (from /):**
- Remote pair programming on a persistent cloud env
- QA & testing in a shared, clean environment
- Collaborative customer support — co-drive instead of describe
- Secure ops on internal tools without exposing local networks
- Virtual office / shared admin work
- Browser automation and recorded workflow replay
- AI agent infrastructure (snapshot once, clone thousands)

## Personas
| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| **Dev Team Lead** (Champion + User) | Velocity, fewer "works on my machine" loops | Pair sessions are clumsy; envs drift | Real multiplayer desktop. Snapshots end env drift. |
| **AI Engineer / Agent Builder** (User + Decision Maker for small co.) | Sandboxing, parallel agent runs, low cost per session | Building computer-use infra is a side quest, not the product | One POST → real Linux desktop. Snapshot-clone for parallel runs. Bearer token + OpenAPI. |
| **QA / Support Engineer** (User) | Reproducing bugs, guided sessions | Can't co-drive a session today; only one person can type | Multiple cursors. Invite link. Disposable, ephemeral. |
| **Platform/DevOps lead** (Technical Influencer) | Security, isolation, compliance | Self-hosted VDI is heavy; SaaS desktops leak data | Zero-knowledge architecture, per-session encryption, ephemeral by default. SCCs for cross-border. |
| **Founder of small AI startup** (Financial Buyer + Champion) | Time to market, pricing predictability | Doesn't want to build agent infra | Pay-as-you-go credits, snapshot-clone economics, billable usage hooks via API. |

## Problems & Pain Points
**Core problem:** Desktops were built for one user. Everything else — screen sharing, "can you see my screen?", VMs you SSH into alone, tool-calling agents stuck in a tab — is a workaround. Cyqle rebuilt the desktop for many users (humans *or* agents) on the same machine.

**Why alternatives fall short:**
- Screen sharing: one driver, many watchers — not collaboration
- Local dev envs: drift, break, can't be shared by link
- VDI / Citrix-style tools: heavy, single-user, slow to provision
- Agent SDKs that wrap browsers: agents are stuck in a tab, not a real OS
- DIY agent sandboxes (E2B, custom Docker): functional but require infra work and don't include a real desktop UI for humans to inspect/take over

**What it costs them:**
- Time wasted dictating actions over screen share
- Bugs that don't reproduce because envs differ
- Engineering hours rebuilding agent sandbox infra instead of shipping the product
- Security risk from running agents on developer laptops or in shared envs without isolation

**Emotional tension:**
- "I'm watching, not working." — frustration with screen-share-as-collaboration
- "We're rebuilding infra that should be a commodity." — for AI builders
- "If this agent runs amok, what does it touch?" — anxiety about isolation
- "Will I lose my env when I close the tab?" — friction trying cloud desktops

## Competitive Landscape
**Direct (multiplayer cloud desktops):**
- Tuple / Pop / Drovio — pair programming overlays, but they ride on top of one person's local machine
- Coder, Gitpod, GitHub Codespaces — cloud dev envs, but single-player and IDE-shaped, not desktop-shaped
- *Falls short because:* none of these give multiple humans simultaneous input on the same OS at the same time

**Direct (agent computer / sandbox):**
- E2B — code-interpreter sandboxes, primarily headless
- Browserbase / Hyperbrowser — headless browser as a service, no desktop
- Daytona, Modal sandboxes — dev-env-shaped, not desktop-shaped
- Anthropic computer-use reference impls — DIY VM, no managed product
- *Falls short because:* most are headless or browser-only; Cyqle gives the agent a real desktop with windows, files, shell, and the ability for a human to take over the same session

**Secondary:**
- Zoom/Meet screen sharing — solves the "show my screen" job poorly
- Google Docs / Figma for shared admin — works for docs, not for OS-level work
- *Falls short because:* not a desktop at all

**Indirect:**
- "Just have a call and share my screen"
- "Use a hosted Jupyter / Colab"
- "Spin up our own VDI on EC2"
- *Falls short because:* hidden cost in coordination, infra, and onboarding time

## Differentiation
**Key differentiators:**
- True simultaneous multi-user input on one Linux OS (multiple cursors, multiple keyboards) — not screen sharing
- P2P streaming (no central relay) — low latency, fewer middlemen
- Ephemeral by default with cryptographic erasure (per-session AES-256, key destroyed at session end — even Cyqle can't recover it)
- Snapshot once, clone thousands — pre-warmed parallel agent runs
- One product serves both humans (browser UI, mobile gestures) and agents (REST API + OpenAPI 3.0)
- Sub-5-second boot times
- Native mobile experience with touch gestures (pinch to resize windows, drag to move)

**How we do it differently:**
- Built the OS layer for many users from day one rather than retrofitting collaboration onto a single-player machine
- libp2p for direct peer streaming instead of a central media server
- Jailed environment with zero-knowledge guarantee — Cyqle the company has no access to the inside of your session

**Why that's better:**
- Faster collaboration with no "driver" handoff
- No latency tax from a central relay
- A real privacy story to point at: "we couldn't read your data even if we wanted to"
- Agent infra you don't have to build

**Why customers choose us:**
- Devs who tried Tuple/Coder and still couldn't co-edit
- Agent builders who don't want to maintain VM infra
- Teams who screen-share 20+ times a day and finally felt the friction

## Objections
| Objection | Response |
|-----------|----------|
| "Can I trust your security?" | Ephemeral by default, AES-256 per-session keys, cryptographic erasure, zero-knowledge architecture, SCCs for cross-border. Annual third-party pen tests. Linkable: `/privacy-policy`. |
| "How is this different from Tuple/Codespaces?" | Multiple cursors on the same OS at the same time. Not pair programming overlays — real multiplayer at the OS level. |
| "Why not just use a VM + screen share?" | Sub-5-sec boot, link-to-join, no host/guest split, snapshot-clone for repeat envs, mobile-native, and one cohesive product instead of a stack. |
| "We're already on E2B / Browserbase for agents." | Cyqle gives the agent a full desktop (windows, shell, files) instead of a headless sandbox or a tab. A human can step in and take over the same session. Snapshot-clone economics undercut DIY infra. |
| "Will it be fast enough?" | P2P streaming, sub-5-sec boot, free tier to test it before paying. |
| "What about pricing predictability?" | Two billing models — fixed monthly *or* pay-as-you-go credits. 1 credit = 10 hours. |

**Anti-persona:**
- Single-player developers who never collaborate and don't run agents (a regular Codespace is fine)
- Compliance-locked enterprises that can't accept any cloud desktop (today)
- Crypto miners and abuse-pattern users (explicitly prohibited under TOS)

## Switching Dynamics
**Push:** "Screen share is killing my pair sessions." / "Building agent sandbox infra is a tax on my roadmap." / "My local dev env keeps drifting." / "I'm tired of describing bugs over Slack."
**Pull:** One link, everyone in. One POST, real desktop. Snapshot-clone for parallel agent runs. Ephemeral and cryptographically erasable. Free tier with no credit card.
**Habit:** Zoom/Meet screen sharing. Local IDE + dotfiles. Existing E2B/Browserbase pipelines. "We've always paired this way."
**Anxiety:** Latency. Security/privacy of code in the cloud. Lock-in. Cost predictability under usage-based pricing. Whether the multiplayer story actually works.

## Customer Language
**How they describe the problem:** *(needs verbatim quotes from real users — fill in from interviews/support)*
- placeholder: "I just want everyone to be in the same machine, not watching me drive."
- placeholder: "I'm spending more time building agent infra than building the agent."

**How they describe us:** *(needs verbatim quotes)*
- placeholder: "It's like Google Docs for a Linux box."
- placeholder: "A computer my agent can actually use."

**Words to use:**
- "Multiplayer desktop", "everyone drives", "your agent inhabits a machine", "one POST", "spin up", "snapshot", "ephemeral", "cryptographically erased", "P2P", "sub-5-second", "real Linux", "your agent, inside a real computer"
- Concrete primitives: cursor, keyboard, window, shell, file, screenshot, snapshot, session

**Words to avoid:**
- "Synergy", "platform" (overused), "AI-powered" without specifics, "revolutionary", "leverage", "VDI" in dev-facing copy (sounds enterprisey/heavy), "screen sharing" as a positive (we beat it)
- Don't oversell as "the future of work" — keep it grounded in primitives

**Glossary:**
| Term | Meaning |
|------|---------|
| Slot | One active desktop session at a time |
| Credit | Currency for usage-based billing; 1 credit = 10 hours of desktop time |
| Power tier | Resource multiplier: Standard (1×), Turbo (2×), Max (4×) |
| Ephemeral session | Default mode; cryptographically erased on close |
| Persistent session | Paid-tier option; data retained per tier limits |
| Snapshot | Frozen configured desktop you can clone |
| AI Operator | Cyqle's automation engine for recorded browser workflows |
| Jailed environment | Per-session isolated filesystem and process namespace |

## Brand Voice
**Tone:** Direct, technical, slightly cocky, dev-respectful. Avoids marketing fluff. Confident enough to say "stop wrapping SDKs" and "boot a desktop in one call."
**Style:** Short sentences. Concrete primitives over abstractions. Code-adjacent examples (curl, POST, OpenAPI) sit comfortably next to product copy. Some playful clarity ("can you see my screen?" — "they're already there").
**Personality:** Engineering-credible. Plainspoken. Multiplayer-native. Privacy-serious. Slightly playful. Not corporate.

## Proof Points
**Metrics:** *(needs real data — fill in)*
- Sub-5-second boot times (claimed in /about)
- 60-minute free sessions, no credit card
- Pricing benchmark: 10 hours of desktop time for less than a coffee ($0.20)

**Customers:** *(needs logos / case studies)*
**Testimonials:** *(needs verbatim quotes)*

**Value themes:**
| Theme | Proof |
|-------|-------|
| Real multiplayer (not screen share) | Multiple cursors / multiple keyboards on one OS, P2P streaming, demo video |
| Agent-native | Live OpenAPI 3.0 spec at `/api-docs`, curl example on landing, snapshot-clone primitive |
| Ephemeral + private | Per-session AES-256, cryptographic erasure, zero-knowledge architecture |
| Fast | Sub-5-sec boot, no install/config |
| Mobile-first | Native touch gestures (pinch/drag/swipe), full desktop on phone |
| Predictable pricing | Free tier; $0.20/credit = 10 hours; or fixed monthly |

## Goals
**Business goal:** Drive signups and paid conversions across two parallel motions —
1. Team-led growth: dev/QA/support teams pulling teammates in via the invite link (built-in viral loop)
2. API-led growth: AI agent builders adopting the REST API for their own products (developer-led)

**Conversion action:**
- Primary: Click "Get Started" / "Power On — It's Free" → free session with no credit card
- Secondary: API key signup from `/api-docs`
- Tertiary: "Book a Demo" / "Request a Quote" for team-sized deals

**Current metrics:** *(needs real numbers — fill in)*
- Signup → first session activation rate
- First session → invite-a-teammate conversion (the viral loop metric that matters most)
- API key created → first successful POST `/sessions` (the agent-side activation metric)
- Free → paid conversion by tier

---

## Gaps to fill (review with human)
- Verbatim customer quotes (problem and solution language)
- Real customer logos and named testimonials
- Actual current metrics (MRR, signups, activation %, viral coefficient)
- Confirmed competitor pricing for comparison pages
- Whether "AI Operator" branding is sticking or being deprecated
- Confirmed launch phase (Internal / Alpha / Beta / Early Access / Full) — recent commits suggest API is just launching
- Product Hunt / launch readiness state
