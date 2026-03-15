# IRON — AI-Powered Strength Training Coach

## Project Plan & Technical Blueprint

---

## 1. Product Vision

**Iron** is a personal AI strength training coach that lives on your phone. It does three things exceptionally well:

1. **Strategic Planning** — You tell it your goals (e.g., "increase my bench press, lose 15lbs, build muscle symmetry"). It builds a long-term training strategy: periodization, volume progression, exercise selection, rest and recovery guidance.
2. **Session Crafting** — You walk into the gym. Iron knows where you are in your program, what you lifted last time, how your body is recovering, and generates a concrete workout for today — adapted in real time if you need to swap equipment or cut a session short.
3. **Adaptive Pivoting** — Goals shift. An injury happens. You get bored. Iron reads the signals (you tell it, or it infers from logged data) and re-routes your plan without losing momentum.

The experience should feel like having a knowledgeable, calm, and encouraging training partner in your pocket — not a chatbot with a barbell sticker.

---

## 2. The Spirit of Iron — Game Boy Color Design Philosophy

This section is the design soul of the app. Every UI decision, every animation, every piece of visual chrome should flow from this vision.

### The Core Feeling

Iron is not another sleek, corporate fitness app. It is a **Game Boy Color game brought to life**. Specifically, it captures the exact visual language of Pokémon Gold/Silver/Crystal and The Legend of Zelda: Oracle of Ages/Seasons and Link's Awakening DX.

When the user opens Iron, they should feel like they just booted up their childhood Game Boy. The emotional target: **nostalgia mixed with excitement** — the same feeling you got when starting a new Pokémon adventure.

### Visual Language — Authentic GBC Aesthetic

#### Color Palette

Game Boy Color games used extremely limited palettes — typically 4-8 colors per screen element. We follow this constraint religiously.

**Base Grayscale (Used everywhere):**

- `gb-black`: #000000 — **Critical**: All borders, outlines, text shadows. True black.
- `gb-darkest`: #0f0f1e — Deep backgrounds
- `gb-dark`: #2d2b3a — Card/panel backgrounds
- `gb-mid`: #5a5568 — Inactive elements, secondary borders
- `gb-light`: #9c9ca4 — Secondary text, disabled states
- `gb-lightest`: #f0ece3 — Primary text, numbers

**Accent Colors (One dominant per screen):**

- `gb-gold`: #f0c000 — XP, levels, achievements, primary CTAs
- `gb-blue`: #4080f0 — AI coach, information, calm contexts
- `gb-red`: #e84030 — Intensity, warnings, PRs
- `gb-green`: #40c040 — Success, health, completion
- `gb-sand`: #d8c870 — Warm neutrals, paths, secondary backgrounds
- `gb-grass`: #40a840 — Nature accents, growth themes

**Color Usage Rule:** Each screen picks ONE dominant accent color (usually gold) and uses it sparingly for the most important interactive elements. The rest is grayscale. This is exactly how Pokémon handled UI — mostly white/grey with gold text for important items.

#### Borders & Outlines — The Most Critical Element

Looking at the reference screenshots, **thick black borders define everything**. This is THE signature of GBC games.

**Border Rules:**

- **All UI elements have 3-4px black borders** — cards, buttons, panels, dialogue boxes
- **Nested borders**: Inner elements can have colored borders (gold, blue), but they still sit inside black outlines
- **No border-radius**: Everything is square. The GBC couldn't do rounded corners.
- **Decorative corners**: Important panels (like "TEAM ROCKET HQ" label) have ornate corner pieces — small pixel art embellishments

**Examples from reference:**

- Team Rocket HQ building: Thick black outline with decorative border pattern
- Dialogue boxes: Black border with inner colored trim
- Path edges: Black outlines separating grass from path tiles

#### Texture & Dithering

The GBC created depth through **dithering** — checkerboard patterns of two colors to simulate shading. Look at the grass, sand, and water in the screenshots — all dithered.

**How we apply this:**

- Background textures use repeating dither patterns (we can do this with small PNG tiles or CSS patterns)
- Card backgrounds can have subtle dither texture overlays
- "Shadow" effects are achieved with dither patterns, not gradients or blur

**Examples from reference:**

- Grass tiles: Light and dark green in checkerboard
- Sand paths: Light and medium tan dithered
- Water: Two shades of blue in wave patterns

#### Typography

**Fonts:**

- **Display/Titles**: Press Start 2P (Google Fonts) — authentic 8-bit pixel font
- **Body/UI**: VT323 (Google Fonts) — monospace pixel font, excellent for numbers
- **Size constraints**: 14px, 16px, 18px, 20px, 24px only — no odd sizes
- **Rendering**: Text must render crisply without anti-aliasing (where possible)
- **Text shadows**: 1-2px black shadow on light text for readability (like Pokémon menus)

**Text Display Pattern (from Pokémon):**

```
LEVEL
  12

XP  450/500
```

Small label above, large number below. Simple. Clear.

#### Layout Principles

**The 8px Grid:**
Everything snaps to multiples of 8px. No exceptions.

- Padding: 8px, 16px, 24px
- Margins: 8px, 16px
- Element heights: 40px (small), 56px (medium), 72px (large)
- Touch targets: minimum 48px × 48px

**Corner UI Elements:**
Like the reference screenshots show (hearts in top-left, rupee count in top-left), important stats live in screen corners:

- Top-left: Level & XP bar
- Top-right: Streak counter
- These are always visible, overlaying other content if needed

**Label Boxes:**
Important titles get white boxes with black borders, like "TEAM ROCKET HQ":

```
┌─────────────────┐
│  WORKOUT PLAN   │
└─────────────────┘
```

### UI Components Style

#### Buttons

Styled exactly like Game Boy game buttons:

- **Shape**: Rectangle, no border-radius
- **Border**: 4px solid black outer, 2px solid accent color inner (gold/blue/green)
- **Background**: Solid color (gb-dark or accent color)
- **Text**: Press Start 2P, white with 2px black shadow
- **Press state**: Scale to 0.95, border color shifts brighter
- **Dimensions**: Minimum 48px tall (touch target)

Visual representation:

```
┌─────────────────────┐
│     START LIFT      │
└─────────────────────┘
     (4px black)
```

#### Cards / Panels

All content lives in bordered panels:

- **Border**: 4px black outer
- **Background**: gb-dark with optional dither texture
- **Inner border**: Optional 2px colored accent (gold for active, mid for inactive)
- **Padding**: 16px
- **Shadow**: None — GBC didn't have shadows. Use border thickness for depth.

#### XP Bar (Critical Component)

The XP bar is styled exactly like Pokémon's HP/EXP bars:

```
XP    450 / 500
┌────────────────────┐
│████████████░░░░░░░░│
└────────────────────┘
```

**Specifications:**

- **Height**: 16px (including border)
- **Border**: 2px black
- **Fill color**: gb-gold
- **Empty color**: gb-darkest
- **Animation**: Fill in discrete 10% chunks with 50ms pause between chunks (NOT smooth)
- **Label**: VT323, 16px, above bar
- **Number**: VT323, 14px, gb-lightest

#### Interactive Chat System (AI Coach)

The chat system consists of three components that work together to create a fully interactive conversation interface:

**1. ChatMessage Component** - Individual message display

Coach messages (from AI):

```
┌────────────────────────────┐
│ [32x32 SPRITE]             │
│                            │
│  Nice work! Your bench     │
│  press is improving.       │
│  Let's increase weight     │
│  next session.             │
└────────────────────────────┘
```

- **Full width**, left-aligned
- **Border**: 4px black outer, 2px white inner (classic Pokémon style)
- **Background**: gb-light (cream/grey)
- **Text**: VT323, 16px, black text on light background
- **Sprite**: 32×32px coach in top-left corner

User messages (from user):

```
                    ┌──────────────┐
                    │ Can we swap  │
                    │ bench for    │
                    │ incline?     │
                    └──────────────┘
```

- **Max 80% width**, right-aligned
- **Border**: 3px black outer, 2px blue inner
- **Background**: gb-dark
- **Text**: VT323, 14px, white text on dark background

**2. ChatInput Component** - Fixed bottom input field

```
┌──────────────────────────────────┐
│ [Text input...]         [SEND]   │
└──────────────────────────────────┘
```

- **Position**: Fixed at bottom of screen
- **Border**: 4px black outer, 2px blue inner (when active)
- **Background**: gb-dark
- **Text input**: VT323, 16px, white text
- **Send button**: Small gold IronButton, only enabled when text is present
- **Keyboard handling**: Proper KeyboardAvoidingView behavior

**3. ChatScreen Component** - Complete chat interface

- **Message history**: Scrollable list of ChatMessage components
- **Auto-scroll**: Automatically scrolls to latest message when new ones arrive
- **Loading state**: Shows "..." message while AI is responding
- **Async handling**: Manages API calls and response updates
- **Error handling**: Displays error messages as coach messages if API fails

**Interaction Flow:**

1. User types in ChatInput at bottom
2. User message appears immediately in history (right side, blue)
3. Loading indicator appears ("...")
4. Coach response arrives from LLM API
5. Coach message appears in history (left side, light, with sprite)
6. Chat auto-scrolls to show latest message
7. Input clears and is ready for next message

#### Stat Display (Corner HUD)

Mimics the heart counter and rupee display from Zelda:

```
┌──────────┐
│ LV  12   │
│ ░░░░░░░█ │
└──────────┘

┌──────────┐
│ STREAK   │
│   8 🔥   │
└──────────�┘
```

**Specifications:**

- **Size**: Compact — 80-100px wide
- **Border**: 3px black with 1px white inner
- **Background**: Semi-transparent gb-dark (90% opacity)
- **Text**: VT323, 14px for labels, 20px for numbers
- **Position**: Top corners, fixed position

#### List Items (Exercise Sets, History)

Each item is a bordered box, like Pokémon's item list:

```
┌──────────────────────────┐
│ ✓ Bench Press            │
│   3 × 8 @ 185 lbs        │
└──────────────────────────┘
┌──────────────────────────┐
│   Incline Press          │
│   3 × 10 @ 135 lbs       │
└──────────────────────────┘
```

**Specifications:**

- **Border**: 3px black
- **Height**: 64px
- **Background**: Alternating gb-dark / gb-darkest (zebra striping)
- **Completed items**: Checkmark icon (pixel art, gb-green)
- **Active item**: Gold inner border (2px)

### Animation Principles

#### Timing

- **Fast and snappy**: 100-150ms for interactions
- **No easing**: Linear timing only, or step-based
- **Discrete animations**: Things move in chunks, not smoothly

#### Button Press

```
1. User touches → Scale to 0.95 (instant)
2. Border color brightens
3. Hold for 100ms
4. Release → Snap back to 1.0 (instant)
```

No bounce. No ripple. Just immediate feedback.

#### XP Fill Animation

```
1. Current XP: 45%
2. Gain 15 XP → Target: 60%
3. Fill increases in 5% chunks:
   45% → 50% (pause 50ms)
   50% → 55% (pause 50ms)
   55% → 60% (pause 50ms)
   DONE
```

Each chunk is a distinct visual step. Like watching a Pokémon's HP bar drain or fill.

#### Level Up Celebration

```
1. Screen flash (white, 100ms)
2. XP bar resets to 0
3. Level number increases
4. Particle effect: 8-10 gold squares (4×4px) spawn at center, fall outward
5. Gold border pulse around level display (200ms)
6. Done
```

This is a BIG moment. It should feel important.

#### Screen Transitions

- **Fade to black**: 200ms fade out, 200ms fade in (like entering a Pokémon Center)
- **Slide**: New screen slides in from right (200ms linear), old screen slides out left

No fancy curves. Linear motion only.

### Screen-by-Screen Design Specifications

#### Home / Dashboard

**Visual reference**: Pokémon Gold overworld — top-corner HUD, central content area

**Layout:**

- **Top-left corner**: Level + XP bar (always visible)
- **Top-right corner**: Streak counter with flame emoji
- **Center**: Today's workout as a large card with thick black border and gold accent
- **Bottom**: Tab navigation (we'll design this later)

**Dominant color**: gb-gold (for XP, active workout card)

**Background**: gb-darkest with optional dither texture

#### AI Coach Chat

**Visual reference**: Pokémon dialogue box at bottom of screen, but fully interactive

**Layout:**

- **Top**: Scrollable message history showing full conversation
  - User messages: Right-aligned, gb-dark background, white border, small compact boxes
  - Coach messages: Left-aligned, gb-light background (like Pokémon dialogue), black text, full-width dialogue boxes with sprite
- **Bottom**: Fixed input area with dialogue-style border
  - Text input field (looks like a Pokémon text entry box)
  - Send button (styled as GBC button, gold accent)

**Interaction Flow:**

1. User types question or command (e.g., "Can we swap bench press for incline?")
2. Message appears in history as user bubble (right side, dark)
3. Coach responds in dialogue box (left side, light, with sprite)
4. Full conversation scrolls upward as new messages arrive
5. Input stays fixed at bottom, always accessible

**Use Cases:**

- Ask questions about workout strategy
- Request exercise substitutions mid-workout
- Get form tips or clarification
- Modify today's session on the fly
- Discuss goals and progression

**Dominant color**: gb-blue (coach's dialogue border accent)

**Background**: gb-darkest

#### Workout Session (In-Gym)

**Visual reference**: Pokémon battle screen — clear, information-dense, easy to tap

**Layout:**

- **Top**: Exercise name in label box (like "TEAM ROCKET HQ" style)
- **Center**: Current set number, target reps, weight (LARGE text, VT323)
- **Input area**: Number pad or +/- buttons for logging actual reps and weight
- **Bottom**: Large "LOG SET" button (gold)
- **Below that**: List of completed sets (checkmarks)

**Dominant color**: gb-gold (active set, log button)

**Supporting color**: gb-green (completed set checkmarks)

**Background**: gb-darkest

#### History / Quest Log

**Visual reference**: Pokémon's Pokédex list

**Layout:**

- **Top**: "QUEST LOG" label box
- **Scrollable list**: Past workouts, each in a bordered box
  - Date, duration, total volume
  - Tap to expand for details
- **Selected item**: Gold inner border

**Dominant color**: gb-gold (selected item)

**Background**: gb-darkest

#### Achievements

**Visual reference**: Pokémon badge collection, Zelda item menu

**Layout:**

- **Grid of badges**: 4 per row, 32×32px each
- **Unlocked**: Full color pixel art
- **Locked**: Greyscale (gb-mid to gb-dark)
- **Tap badge**: Expands to show name, description, unlock date

**Dominant color**: gb-gold (unlocked badges)

**Background**: gb-darkest

### Pixel Art Assets Needed

#### Coach Sprite

- **Size**: 32×32px
- **Style**: Side-facing portrait (like Pokémon trainer sprites or Zelda NPCs)
- **Palette**: 4 colors max (black outline, 3 fill colors)
- **Expressions**:
  - Neutral (default)
  - Encouraging (slight smile, raised fist)
  - Thoughtful (hand on chin)

#### Exercise Category Icons

- **Size**: 24×24px each
- **Categories needed**:
  - Chest (barbell icon)
  - Back (pull-up icon)
  - Legs (squat icon)
  - Shoulders (overhead press icon)
  - Arms (dumbbell icon)
  - Core (plank figure icon)
- **Style**: Simple, bold shapes with black outlines
- **Color**: Single accent color (gold or category-specific)

#### Achievement Badges

- **Size**: 32×32px each
- **Examples**:
  - Trophy (first workout)
  - Flame (streak)
  - Star (level milestone)
  - Barbell (total volume milestone)
  - Medal (PR achievement)
- **Style**: Classic game badges — bold, readable at small size
- **Color**: Gold for unlocked, greyscale for locked

#### UI Chrome Elements

- **Corner decorations**: 8×8px ornate corners for important panels
- **Border patterns**: Repeating 8px decorative trim (optional enhancement)
- **Selection cursor**: 8×8px arrow (like Pokémon menu cursor)

---

## 3. Tech Stack Decision & Rationale

### Frontend: **Expo (React Native)**

| Factor              | Why Expo                                                                            |
| ------------------- | ----------------------------------------------------------------------------------- |
| Cross-platform      | Single codebase → iOS, Android, and (via Expo for Web) a web experience             |
| Your experience     | You already know React. React Native's paradigm will transfer directly.             |
| Ecosystem maturity  | Largest mobile JS ecosystem. Expo abstracts away native builds, so you ship faster. |
| App Store readiness | Expo's EAS Build service compiles production-ready binaries for both stores.        |
| Animations          | **Reanimated 2** for 60fps animations — critical for the snappy GBC feel.           |

### Backend & Infrastructure: **Firebase + Cloud Functions**

| Service                       | Role                                                                                                      |
| ----------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Firebase Auth**             | Email/password + Google sign-in. Handles tokens, sessions, password reset.                                |
| **Cloud Firestore**           | NoSQL document store for user profiles, training history, goals, generated workout plans. Real-time sync. |
| **Cloud Functions (Node.js)** | Serverless compute. LLM calls, prompt engineering, rate limiting — all server-side.                       |
| **Firebase Hosting**          | Hosts the web version (Expo for Web output).                                                              |

### Styling: **NativeWind + Custom Components**

- **NativeWind v4** — Tailwind utility classes in React Native
- **Custom component library** — We will NOT use any pre-built component library. Every button, card, and UI element is custom-built to match the GBC aesthetic. This is critical for authenticity.

---

## 4. LLM Provider Analysis & Cost Comparison

### 4.1 The Candidates

#### **Anthropic Claude** (Recommended)

| Model             | Input (per 1M tokens) | Output (per 1M tokens) | Context Window |
| ----------------- | --------------------- | ---------------------- | -------------- |
| Claude Haiku 4.5  | $1.00                 | $5.00                  | 200K           |
| Claude Sonnet 4.5 | $3.00                 | $15.00                 | 1M             |

**Why Claude Haiku 4.5 for Iron:**

- Excellent at structured output (reliable JSON generation for workouts)
- Strong long-context reasoning (can hold 6-8 sessions of history in context)
- Prompt caching: 90% discount on cached tokens (system prompt, user profile)
- Fitness knowledge is strong
- Cost-effective for this use case

#### **OpenAI GPT**

| Model       | Input (per 1M tokens) | Output (per 1M tokens) | Context Window |
| ----------- | --------------------- | ---------------------- | -------------- |
| GPT-4o mini | $0.15                 | $0.60                  | 128K           |
| GPT-4o      | $2.50                 | $10.00                 | 128K           |

**Assessment:**

- GPT-4o mini is the cheapest option
- Structured output is less reliable than Claude for complex JSON
- Would require more prompt engineering

#### **Google Gemini**

| Model          | Input (per 1M tokens) | Output (per 1M tokens) | Context Window |
| -------------- | --------------------- | ---------------------- | -------------- |
| Gemini 3 Flash | $0.50                 | $3.00                  | 1M             |
| Gemini 3 Pro   | $2.00                 | $12.00                 | 1M             |

**Assessment:**

- Gemini Flash has a generous free tier (1,500 requests/day)
- Perfect for development
- Structured output is good but slightly less predictable than Claude

### 4.2 Cost Modeling for Iron

**Per-session estimate:**

- System prompt + user profile: ~800 tokens (input, cached)
- Training history: ~3,000 tokens (input)
- Workout request: ~100 tokens (input)
- Generated workout: ~600 tokens (output)

**Monthly usage (4 sessions/week × 4 weeks):**

- ~16 workout generations + ~40 chat interactions
- **Input: ~360K tokens | Output: ~46K tokens**

| Provider  | Model                    | Monthly Cost |
| --------- | ------------------------ | ------------ |
| Anthropic | Haiku 4.5 (w/ caching)   | **$0.27**    |
| Google    | Gemini Flash (free tier) | **$0.00**    |
| OpenAI    | GPT-4o mini              | **$0.08**    |

**Bottom line:** Cost is negligible. Choose based on quality.

### 4.3 Recommendation

**Development:** Gemini Flash free tier (1,500 req/day) — iterate on prompts for free

**Production:** Claude Haiku 4.5 — best structured output reliability at $0.27/month

**Implementation:** Build provider abstraction layer in Cloud Functions — swapping providers is a config change, not a refactor.

---

## 5. Application Architecture

```
┌─────────────────────────────────────────────────┐
│                   IRON CLIENT                     │
│           (Expo / React Native / Web)             │
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │
│  │  Auth    │  │ Workout  │  │   AI Coach     │  │
│  │  Screen  │  │  Logger  │  │   Chat         │  │
│  └──────────┘  └──────────┘  └────────────────┘  │
│         │              │              │            │
│         └──────────────┴──────────────┘            │
│                        │                           │
│              Firebase JS SDK                       │
│         (Auth, Firestore, Functions)               │
└────────────────────┬────────────────────────────┘
                     │ HTTPS
┌────────────────────┼────────────────────────────┐
│   FIREBASE BACKEND  │                             │
│                     ▼                             │
│  ┌─────────────────────────────────────────┐     │
│  │         Cloud Functions (Node.js)       │     │
│  │                                         │     │
│  │  • /generateWorkout                    │     │
│  │  • /chat                               │     │
│  │  • /updateStrategy                     │     │
│  └──────────────┬──────────────────────────┘     │
│                 │                                  │
│         ┌───────┴────────┐                        │
│         ▼                ▼                        │
│  ┌────────────┐   ┌─────────────┐                │
│  │ Firestore  │   │   LLM API   │                │
│  │  (data)    │   │  (Claude)   │                │
│  └────────────┘   └─────────────┘                │
└───────────────────────────────────────────────────┘
```

---

## 6. LLM Prompt Architecture

### System Prompt

Defines the coach persona and output format rules. Specifies when to return JSON vs. conversational text.

### Context Window (assembled per-call in Cloud Functions)

```
[System Prompt — cached]
[User Profile — cached]
[Current Goals]
[Recent History: last 6-8 sessions]
[Current Strategic Plan]
[User's request]
```

### Output Formats

- **Workout generation**: JSON (exercise, sets, reps, weight, rest)
- **Chat**: Free-form text
- **Strategy updates**: JSON (goals, periodization notes)

---

## 7. Screen & Feature Map (MVP)

### Screens

| #   | Screen                 | Purpose                                             |
| --- | ---------------------- | --------------------------------------------------- |
| 1   | **Onboarding / Auth**  | Sign up, set goals, profile (experience, equipment) |
| 2   | **Home / Dashboard**   | Today's workout (quest card), streak, level/XP      |
| 3   | **AI Coach**           | Dialogue-style chat with coach sprite               |
| 4   | **Workout Session**    | In-gym screen — log sets, track workout             |
| 5   | **History**            | Quest log — past workouts                           |
| 6   | **Goals & Strategy**   | View/edit goals and AI's plan                       |
| 7   | **Achievements**       | Badge collection screen                             |
| 8   | **Profile / Settings** | Equipment, units, preferences                       |

### MVP Feature Scope

- [x] Auth (email + Google)
- [x] Goal setting
- [x] AI-generated workouts (daily)
- [x] In-session logging (sets, reps, weight)
- [x] AI coach chat with dialogue UI
- [x] Workout history
- [x] XP + Level system
- [x] Streak tracking
- [x] Achievement badges (initial set)
- [x] PR detection + celebration
- [ ] _(Post-MVP)_ Charts & analytics
- [ ] _(Post-MVP)_ Rest timer
- [ ] _(Post-MVP)_ Push notifications

---

## 8. Build Roadmap

### Phase 1: Foundation (Sessions 1–3)

- Project scaffolding (Expo, TypeScript, NativeWind, Firebase)
- Firebase setup (Auth, Firestore, Functions)
- Auth flow
- Navigation structure
- **Design system: GBC theme, custom components**
  - ✅ IronButton (with variants: primary, secondary, danger)
  - ✅ XPBar (animated progress bar)
  - ✅ ChatMessage (coach + user message bubbles)
  - ✅ ChatInput (bottom input field)
  - ✅ ChatScreen (complete chat interface)
- Install pixel fonts (Press Start 2P, VT323)
- Gemini Flash configured for dev

### Phase 2: Core Loop (Sessions 3–5)

- Goal setting + onboarding
- Firestore data models
- Cloud Function: `generateWorkout` (first LLM call)
- Workout Session screen (display + logging)
- Home/Dashboard (quest card, XP bar, streak)
- XP award logic

### Phase 3: Intelligence & Character (Sessions 5–7)

- AI Coach chat screen using ChatScreen component
- Cloud Function: `chat` (handles conversational messages)
- Cloud Function: `updateStrategy` (re-evaluates training plan)
- History screen (quest log)
- Goals & Strategy screen
- Achievement system (badges, unlocking logic)
- Level-up + PR celebration animations
- Switch from Gemini Flash to Claude Haiku for production
- Refine prompt architecture based on real usage

### Phase 4: Polish & Ship (Sessions 7–8)

- Pixel art assets (coach sprite, icons, badges)
- Dithered background textures
- Full animation pass
- Offline support
- Error handling
- EAS Build (App Store + Google Play)
- Device testing

---

## 9. Cost Estimates

| Service                                   | Cost                                  |
| ----------------------------------------- | ------------------------------------- |
| Firebase (Spark plan)                     | **Free**                              |
| Cloud Functions                           | **Free** (up to 2M invocations/month) |
| LLM (Claude Haiku w/ caching)             | **~$0.27/month**                      |
| Expo EAS Build                            | **Free** (dev builds)                 |
| **Total (production)**                    | **~$0.27/month**                      |
| **Total (development, Gemini free tier)** | **$0.00/month**                       |

---

## 10. Project Structure

```
iron/
├── app/
│   ├── (auth)/          # Login, signup
│   ├── (main)/          # Authenticated screens
│   │   ├── home.tsx
│   │   ├── coach.tsx
│   │   ├── session.tsx
│   │   ├── history.tsx
│   │   ├── goals.tsx
│   │   ├── achievements.tsx
│   │   └── profile.tsx
│   └── _layout.tsx      # Root layout + auth gate
├── components/          # Custom GBC-styled components
│   ├── IronButton.tsx
│   ├── QuestCard.tsx
│   ├── XPBar.tsx
│   ├── ChatMessage.tsx      # Individual message bubble
│   ├── ChatInput.tsx        # Bottom input field
│   ├── ChatScreen.tsx       # Full chat interface
│   ├── StatDisplay.tsx
│   ├── BorderedPanel.tsx
│   └── ...
├── hooks/               # useAuth, useWorkout, useXP, etc.
├── services/            # Firebase SDK wrappers
├── functions/           # Cloud Functions
│   └── src/
│       ├── index.ts
│       ├── llmClient.ts        # Provider abstraction
│       ├── generateWorkout.ts
│       ├── chat.ts
│       └── updateStrategy.ts
├── constants/           # Theme (GBC colors), XP constants
├── types/               # TypeScript interfaces
└── assets/
    ├── sprites/         # Coach, icons, badges (pixel art)
    ├── textures/        # Dither patterns (optional)
    └── fonts/           # Press Start 2P, VT323
```

---

## 11. Key Design Decisions Summary

1. **Authentic GBC aesthetic** — Not "retro-inspired," but pixel-perfect Game Boy Color visual language
2. **Thick black borders** — 3-4px on everything, no exceptions
3. **Limited palette** — One dominant accent color per screen
4. **Pixel fonts** — Press Start 2P + VT323, no anti-aliasing
5. **8px grid** — All spacing and sizing in multiples of 8
6. **Snappy animations** — 100-150ms, linear timing, discrete steps
7. **Corner HUD** — Level/XP always visible in top-left
8. **Dialogue-style coach** — 32×32 sprite with Pokémon-style dialogue boxes
9. **Custom components only** — No pre-built UI library
10. **Claude Haiku for production** — Gemini Flash for free dev iteration

---

---

This is Iron. A Game Boy Color game you can take to the gym.

---

## 12. Current Development Progress

### ✅ Completed (Phase 1)

**Project Setup:**

- Expo project scaffolded with TypeScript
- NativeWind (Tailwind) configured with GBC color palette
- Project structure created (app/, components/, constants/, types/, etc.)
- Theme constants defined (Colors, Spacing, BorderWidth, FontSize, XP constants)
- TypeScript type definitions created (User, Goal, Exercise, WorkoutSession, Achievement, etc.)

**Components Built:**

1. **IronButton** - GBC-styled button with variants (primary/gold, secondary/blue, danger/red, disabled)
   - Thick black borders, square corners
   - Size variants (small, medium, large)
   - Full-width option
   - Proper touch target sizing

2. **XPBar** - Animated progress bar like Pokémon HP/EXP bars
   - Shows current/max XP with label
   - Animated fill (gold color)
   - Black border with dark empty background
   - Configurable height and animation

3. **ChatMessage** - Individual message bubble component
   - Coach messages: Full-width, light background, Pokémon dialogue style with sprite slot
   - User messages: Compact, right-aligned, dark background with blue accent
   - Black borders on both, different text colors

4. **ChatInput** - Fixed bottom input field with send button
   - Bordered text input (blue accent when active)
   - Gold "SEND" button (only enabled when text present)
   - Proper keyboard handling (KeyboardAvoidingView)
   - Auto-clears after sending

5. **ChatScreen** - Complete interactive chat interface
   - Scrollable message history
   - Auto-scroll to latest message
   - Loading state while waiting for AI response
   - Error handling
   - Ready to connect to LLM API

**Test Screen:**

- Component showcase displaying all built components
- Interactive XP bar with ADD XP / RESET buttons
- Interactive chat with simulated AI responses
- Button variants demonstration

### 🚧 Next Steps (Phase 1-2 Completion)

**Immediate:**

- Install pixel fonts (Press Start 2P, VT323) and integrate into components
- Create remaining base components:
  - StatDisplay (corner HUD for level/streak)
  - QuestCard (today's workout card for home screen)
  - BorderedPanel (generic bordered container)
- Firebase project setup (Auth, Firestore, Cloud Functions)

**Phase 2:**

- Auth flow (login, signup, Google OAuth)
- Firestore data models implementation
- First Cloud Function (`generateWorkout`) with Gemini Flash
- Home/Dashboard screen with real data
- Workout Session screen (log sets, track progress)
- Goal setting + onboarding flow

**Phase 3:**

- Connect ChatScreen to real LLM API
- Implement `chat` and `updateStrategy` Cloud Functions
- History and Goals screens
- Achievement system
- Celebration animations (level up, PR)
- Switch to Claude Haiku for production

**Phase 4:**

- Pixel art assets (coach sprite, icons, badges)
- Dithered background textures
- Full animation polish pass
- Offline support hardening
- EAS Build for iOS + Android
- App Store submission
