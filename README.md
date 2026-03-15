# Iron 💪

An AI-powered strength training coach app with a nostalgic Game Boy Color aesthetic. Iron combines modern LLM technology with retro pixel-art design to create a unique, engaging fitness experience.

## Overview

Iron is a mobile-first fitness app that acts as your personal strength training coach. It generates personalized workouts, tracks your progress through an RPG-style leveling system, and provides intelligent coaching advice through conversational AI.

**Key Features:**

- 🤖 **AI Coach**: Conversational strength training guidance powered by Google Gemini
- 💪 **Personalized Workouts**: AI-generated training sessions based on your goals and history
- 🎮 **Game Boy Color Aesthetic**: Authentic retro pixel art, thick borders, limited color palette
- 📊 **RPG Progression**: Level up, earn XP, maintain streaks, unlock achievements
- 🔐 **Firebase Backend**: Secure authentication, real-time data sync, serverless functions
- 💬 **Interactive Chat**: Full two-way conversation with your AI coach about training, form, and goals

## Tech Stack

- **Frontend**: React Native (Expo), TypeScript, NativeWind
- **Backend**: Firebase (Auth, Firestore, Cloud Functions)
- **LLM**: Google Gemini 1.5 Flash (free tier)
- **Design**: Custom Game Boy Color-inspired component library

## Project Structure

```
iron/
├── app/                          # Expo Router screens
│   ├── (auth)/                   # Authentication screens (login, signup)
│   ├── (main)/                   # Main app screens (home, coach, session, test)
│   ├── _layout.tsx               # Root layout with auth state management
│   └── index.tsx                 # Root redirect → /(main)/home
├── components/                   # Reusable UI components
│   ├── IronButton.tsx            # GBC-styled button (primary, secondary, danger variants)
│   ├── XpBar.tsx                 # Animated XP progress bar (Pokémon-style)
│   ├── ChatMessage.tsx           # Individual message bubble (coach vs user styling)
│   ├── ChatInput.tsx             # Bottom input field with send button
│   ├── ChatScreen.tsx            # Complete chat interface with message history
│   ├── StatDisplay.tsx           # Corner HUD stat boxes (level, streak)
│   ├── QuestCard.tsx             # Today's workout card (main home CTA)
│   ├── BorderedPanel.tsx         # Generic bordered container
│   └── session/                  # Session-specific components
│       ├── index.ts              # Barrel export
│       ├── ExerciseListItem.tsx  # Bordered exercise row (active/done/idle states)
│       ├── ActiveSetPanel.tsx    # Main logging panel (set #, +/− reps & weight, LOG SET)
│       ├── CompletedSetsList.tsx # Chronological log of all sets across all exercises
│       └── SessionCompletePanel.tsx # Post-workout summary (XP earned, total volume)
├── services/                     # External service integrations
│   └── firebase.ts               # Firebase init with platform-aware auth persistence
├── functions/                    # Firebase Cloud Functions
│   └── src/
│       └── index.ts              # LLM chat endpoint (Gemini integration)
├── constants/                    # Design system constants
│   └── theme.ts                  # Colors, spacing, typography, XP constants
├── types/                        # TypeScript type definitions
│   └── index.ts                  # User, Goal, Exercise, WorkoutSession, etc.
└── assets/                       # Static assets (fonts, sprites, icons)
```

## Code Organization Philosophy

### Design System

All visual styling follows strict Game Boy Color constraints defined in `constants/theme.ts`:

- **Limited color palette**: 6 grayscale tones + 6 accent colors (gold, blue, red, green, sand, grass)
- **8px grid system**: All spacing and sizing in multiples of 8
- **Thick borders**: 3-4px black borders on all UI elements, no rounded corners
- **One accent color per screen**: Gold for primary, blue for info, green for success, red for warnings

### Component Strategy

Every component is custom-built to maintain authentic GBC aesthetic:

- **No pre-built UI libraries** (React Native Paper, etc.) — breaks the retro feel
- **Variants over new components**: IronButton has primary/secondary/danger variants rather than separate components
- **Composable panels**: BorderedPanel wraps any content with consistent GBC borders
- **Strict prop interfaces**: All components have explicit TypeScript interfaces for maintainability
- **Feature subfolders**: Screen-specific components live in `components/<feature>/` (e.g. `components/session/`) to avoid cluttering the top-level components directory

### State Management

Currently using React hooks (`useState`, `useEffect`) with Firebase real-time listeners:

- Auth state managed in root `_layout.tsx` with `onAuthStateChanged`
- Home screen subscribes to `onAuthStateChanged` rather than reading `auth.currentUser` directly, ensuring auth is fully rehydrated from AsyncStorage before fetching Firestore data
- Session state (active exercise, logged reps/weight, completed sets) managed locally in `session.tsx`
- Chat messages stored in component state (will move to Firestore for persistence)

### Firebase Architecture

- **Authentication**: Email/password via Firebase Auth (Google Sign-In planned for Phase 3)
- **Persistence**: `initializeAuth` with `getReactNativePersistence(AsyncStorage)` on native; `getAuth` on web
- **Database**: Firestore collections: `users`, `workouts`, `goals`, `achievements`
- **Cloud Functions**: Node.js serverless functions for LLM API calls (keeps API keys secure)

## Setup

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Firebase account (free tier)
- Google Gemini API key (free tier: 1,500 requests/day)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/trevorhackett4/iron.git
cd iron
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

   Create `.env` in the project root:

```bash
cp .env.example .env
```

Fill in your Firebase config values (get these from Firebase Console → Project Settings):

```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. **Set up Firebase Cloud Functions**

```bash
cd functions
npm install
```

Create `functions/.env`:

```
GEMINI_API_KEY=your_gemini_api_key
```

5. **Deploy Cloud Functions**

```bash
firebase login
firebase deploy --only functions
```

6. **Start the app**

```bash
cd ..
npx expo start
```

7. **Test on your device**
   - Install Expo Go on your iPhone/Android
   - Scan the QR code with your Camera app (iOS) or Expo Go (Android)

## Development Workflow

### Running the App

```bash
npx expo start              # Start development server
npx expo start --clear      # Clear cache and restart
```

### Testing on Devices

- **iOS**: Open Camera app → Scan QR code → Opens in Expo Go
- **Android**: Open Expo Go app → Scan QR code
- **Web**: Press `w` in terminal (limited functionality)

### Making Changes

The app uses Expo's Fast Refresh — save any file and see changes instantly on your device.

### Deploying Functions

```bash
cd functions
firebase deploy --only functions:chat
```

## Roadmap

### ✅ Phase 1: Foundation (COMPLETE)

- [x] Project scaffolding (Expo, TypeScript, Firebase)
- [x] GBC design system and theme constants
- [x] Core UI components (Button, XpBar, Chat, StatDisplay, QuestCard, BorderedPanel)
- [x] Authentication screens (login, signup) with Firebase Auth
- [x] Home screen with user data (level, XP, streak)
- [x] AI Coach chat screen with Gemini integration
- [x] Cloud Functions for LLM API calls

### ✅ Phase 2a: Workout Session Screen (COMPLETE)

- [x] **Workout Session Screen**
  - Exercise list with active/completed/idle states (gold/green/grey borders)
  - Active set panel: exercise title, set number, +/− reps & weight controls, LOG SET button
  - Coach notes displayed in blue accent box per exercise
  - Chronological completed sets log across all exercises (CompletedSetsList)
  - PR detection on every logged set
  - XP awarded per set (10 XP) + completion bonus (50 XP)
  - Session complete panel showing XP earned and total volume
  - Navigation: QuestCard on home → session, BACK TO HOME → home
- [x] **Firebase auth persistence** via AsyncStorage (survives app restarts)
- [x] **Platform-aware auth init** (AsyncStorage on native, localStorage on web)
- [x] **Auth rehydration fix** in home screen (subscribes to onAuthStateChanged instead of reading currentUser directly)

### 🚧 Phase 2b: Core Workout Features (IN PROGRESS)

- [ ] **Workout Generation Cloud Function**
  - Accept user goals, history, equipment, experience level
  - Call Gemini with structured prompt (system prompt + context window)
  - Return JSON: `{ exercises: [...], strategyNote: string, estimatedDuration: number }`
  - Store generated workouts in Firestore `workouts` collection
- [ ] **Wire session screen to Firestore**
  - Replace mock session data with real generated workout from Firestore
  - Save completed session back to Firestore on finish
  - Update user XP and streak in Firestore on session complete
- [ ] **Workout History Screen**
  - Quest log style: scrollable list of past workouts
  - Each item shows: date, duration, total volume, XP earned
  - Tap to expand full set-by-set breakdown
  - AI coach commentary displayed in dialogue box
- [ ] **Goals & Onboarding Flow**
  - Initial onboarding: collect experience level, equipment, primary goals
  - Goals screen: view/edit current goals (strength targets, body comp, timeline)
  - Store in Firestore `goals` collection
  - Pass to LLM for workout generation context
- [ ] **XP & Leveling Logic**
  - Persist XP to Firestore on session complete
  - Level-up calculation: `xpToNextLevel = level * 100`
  - Trigger level-up animation when threshold crossed

### 📅 Phase 3: Intelligence & Engagement

- [ ] **Enhanced LLM Prompting**
  - Build comprehensive context window: last 6-8 workouts, current goals, injury notes
  - Implement prompt caching (Gemini's context caching for repeated system prompt)
  - Add structured output constraints (ensure reliable JSON for workouts)
  - Test prompt variations for coaching quality
- [ ] **Achievement System**
  - Define achievement badges (first workout, 10-session streak, 1000 lbs total volume, etc.)
  - Store achievements in Firestore `achievements` subcollection
  - Unlock logic triggered by workout completion
  - Achievement screen: grid of 32x32 pixel badges (unlocked = color, locked = greyscale)
  - Unlock animation: screen flash, particle effect, badge revealed
- [ ] **Streak Tracking**
  - Increment streak on workout completion (once per calendar day)
  - Store `lastWorkoutDate` in Firestore
  - Reset streak if >48 hours since last workout
  - Flame icon animation when streak increases
- [ ] **PR Celebration Animation**
  - Detect personal record (new max weight or reps for exercise)
  - Trigger animation: screen flash (white, 100ms), gold particles falling
  - Update Firestore with new PR
  - Award 100 bonus XP
- [ ] **Persistent Chat History**
  - Store chat messages in Firestore `conversations` subcollection
  - Load last 20 messages on CoachScreen mount
  - Pass conversation history to Cloud Function for context
- [ ] **Workout Plan Adaptation**
  - Cloud Function: `updateStrategy` — re-evaluates training plan based on:
    - Recent performance (PRs, volume trends)
    - User feedback via chat ("too hard", "too easy")
    - Goal progress (e.g., user hit target weight)
  - Returns updated strategy and next-session recommendations
- [ ] **Hybrid LLM Strategy (Monetization)**
  - Add `userTier` field to Firestore `users` collection ('free' or 'pro')
  - Update Cloud Function to route: free → Gemini Flash, pro → Claude Haiku
  - Implement in-app purchase flow (Expo Revenue Cat or Stripe)
  - Pro tier benefits: unlimited chat, smarter coach, full history context

### 🎨 Phase 4: Polish & Ship

- [ ] **Pixel Fonts**
  - Download Press Start 2P and VT323 from Google Fonts
  - Add to `assets/fonts/` and load via Expo Font
  - Update all Text components to use pixel fonts
- [ ] **Pixel Art Assets**
  - Coach sprite: 32x32px, 3 expressions (neutral, encouraging, thoughtful)
  - Exercise icons: 24x24px for each category (chest, back, legs, shoulders, arms, core)
  - Achievement badges: 32x32px, ~15 unique badges
  - UI chrome: 8x8px corner decorations for important panels
- [ ] **Dithered Background Textures**
  - Create 2-color dither patterns (checkerboard style)
  - Apply as repeating background images on cards
  - Subtle depth effect without breaking GBC aesthetic
- [ ] **Animation Polish**
  - Button press: scale to 0.95, 100ms duration, no bounce
  - XP bar fill: discrete 10% chunks with 50ms pause between
  - Level up: screen flash + particle effect + number slam-in
  - Screen transitions: fade to black (200ms) or slide (like entering Pokémon Center)
- [ ] **Offline Support**
  - Enable Firestore offline persistence
  - Queue workout logs when offline, sync on reconnect
  - Show offline indicator in corner HUD
- [ ] **Error Handling**
  - Graceful LLM API failures (show error dialogue box from coach)
  - Firebase connection errors (retry logic)
  - Invalid user input validation
- [ ] **App Store Preparation**
  - EAS Build configuration for iOS and Android
  - App icon (512x512, GBC-styled)
  - Splash screen (matches GBC boot screen aesthetic)
  - App Store screenshots and description
  - Privacy policy and terms of service
- [ ] **Production Deployment**
  - Run `eas build --platform ios`
  - Run `eas build --platform android`
  - Submit to Apple App Store Connect
  - Submit to Google Play Console

### 🚀 Future Enhancements (Post-Launch)

- Google Sign-In (requires iOS/Android app config in Firebase)
- Rest timer with pixel-art countdown
- Push notifications ("Time to train!")
- Progress charts (volume over time, strength progression)
- Muscle group targeting UI (select focus areas for workout)
- Form video analysis (upload video, get AI feedback)
- Apple Health / Google Fit integration
- Social features (share PRs, compete on leaderboards)
- MCP server integration (access to exercise database, nutrition info)
- Skill system (custom coaching styles, specialty programs)

## Design Principles

### The Game Boy Color Aesthetic

Every design decision in Iron follows strict GBC constraints:

1. **Limited Color Palette**: Each screen uses 4-5 colors max. One dominant accent (usually gold) against grayscale base.
2. **Thick Black Borders**: 3-4px borders on everything. No exceptions. No rounded corners.
3. **8px Grid**: All spacing, sizing, and positioning snaps to multiples of 8px.
4. **Pixel-Perfect Assets**: All icons and sprites are hand-crafted pixel art at exact dimensions (16x16, 24x24, 32x32).
5. **Snappy Animations**: 100-150ms duration, linear timing, discrete steps (no easing curves).
6. **Dithered Textures**: Checkerboard patterns create depth with limited colors.
7. **No Gradients**: GBC couldn't do gradients. We don't either.

### User Experience Goals

- **Feel like a game**: Opening Iron should spark the same excitement as booting up a Game Boy
- **No friction**: Workout logging should be fast (< 5 seconds per set)
- **Genuinely helpful**: AI coach should provide value, not just novelty
- **Long-term engagement**: RPG progression (levels, achievements, streaks) keeps users coming back

## Contributing

This is currently a solo project, but contributions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Contact

Trevor Hackett - [@trevorhackett4](https://github.com/trevorhackett4)

Project Link: [https://github.com/trevorhackett4/iron](https://github.com/trevorhackett4/iron)
