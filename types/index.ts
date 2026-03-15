// This file defines all the TypeScript interfaces (data shapes) for Iron.
// TypeScript helps us catch bugs by ensuring we're always working with the
// right data structure. For example, if we try to access user.age but User
// doesn't have an age field, TypeScript will warn us before we even run the code.

// ============================================================================
// USER TYPES
// ============================================================================

// The User represents someone who has an account in Iron
export interface User {
  id: string; // Unique identifier (from Firebase Auth)
  email: string; // User's email address
  displayName?: string; // Optional display name
  createdAt: Date; // When they signed up
  level: number; // Current Iron level (starts at 1)
  xp: number; // Current XP points
  streak: number; // Consecutive training days
  lastWorkoutDate?: Date; // Last time they completed a workout
  experienceLevel: "beginner" | "intermediate" | "advanced"; // Training experience
  availableEquipment: string[]; // What equipment they have access to
  preferredUnits: "lbs" | "kg"; // Weight units preference
  injuries?: string[]; // Any current injuries or limitations
}

// ============================================================================
// GOAL TYPES
// ============================================================================

// Goals are what the user wants to achieve
export interface Goal {
  id: string;
  userId: string; // Which user this goal belongs to
  type: "strength" | "bodyComp" | "general"; // Category of goal
  description: string; // e.g., "Bench press 225 lbs"
  targetDate?: Date; // Optional deadline
  createdAt: Date;
  completed: boolean; // Has this goal been achieved?
  completedAt?: Date;
}

// ============================================================================
// WORKOUT TYPES
// ============================================================================

// An Exercise is a single movement in a workout (e.g., "Bench Press")
export interface Exercise {
  id: string;
  name: string; // e.g., "Bench Press", "Squat"
  category: "chest" | "back" | "legs" | "shoulders" | "arms" | "core";
  sets: number; // How many sets to perform
  reps: number; // Target reps per set
  weight?: number; // Weight to use (optional for bodyweight)
  restSeconds: number; // Rest time between sets
  notes?: string; // Optional instructions from AI coach
}

// A CompletedSet tracks what actually happened when the user did a set
export interface CompletedSet {
  setNumber: number; // Which set (1, 2, 3...)
  reps: number; // How many reps they actually did
  weight: number; // What weight they actually used
  timestamp: Date; // When they logged this set
  isPR: boolean; // Was this a personal record?
}

// A WorkoutSession is a complete gym visit
export interface WorkoutSession {
  id: string;
  userId: string;
  date: Date; // When the workout happened
  exercises: Exercise[]; // The planned exercises
  completedSets: {
    // What they actually did
    [exerciseId: string]: CompletedSet[];
  };
  completed: boolean; // Did they finish the whole workout?
  totalVolume: number; // Total weight lifted (sum of all sets × reps × weight)
  duration?: number; // How long it took (in minutes)
  xpEarned: number; // XP awarded for this session
  aiCommentary?: string; // Coach's post-workout feedback
}

// ============================================================================
// ACHIEVEMENT TYPES
// ============================================================================

// Achievements are badges/trophies the user can unlock
export interface Achievement {
  id: string;
  name: string; // e.g., "First Steps", "Iron Streak"
  description: string; // What you need to do to earn it
  iconPath: string; // Path to the pixel art badge image
  category: "workout" | "strength" | "streak" | "milestone";
  requirement: {
    // What unlocks this achievement
    type: "session_count" | "total_volume" | "streak" | "pr" | "level";
    value: number; // e.g., 10 sessions, 5000 lbs total, 7-day streak
  };
  unlockedAt?: Date; // When the user unlocked it (undefined if locked)
}

// ============================================================================
// LLM (AI) TYPES
// ============================================================================

// WorkoutPlanRequest is what we send to the AI to generate a workout
export interface WorkoutPlanRequest {
  userId: string;
  goals: Goal[]; // What the user wants to achieve
  recentSessions: WorkoutSession[]; // Their last few workouts
  availableEquipment: string[]; // What they can use
  userProfile: {
    experienceLevel: "beginner" | "intermediate" | "advanced";
    injuries?: string[];
    preferredUnits: "lbs" | "kg";
  };
  context?: string; // Optional context (e.g., "I'm tired today")
}

// WorkoutPlanResponse is what the AI returns
export interface WorkoutPlanResponse {
  exercises: Exercise[]; // The workout plan
  strategyNote: string; // Why the AI chose these exercises
  estimatedDuration: number; // How long this should take (minutes)
  focusAreas: string[]; // Muscle groups targeted
}

// ChatMessage represents a single message in the coach chat
export interface ChatMessage {
  id: string;
  role: "user" | "coach"; // Who sent this message
  content: string; // The message text
  timestamp: Date;
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

// These types help manage the app's UI state

// Loading states for async operations
export type LoadingState = "idle" | "loading" | "success" | "error";

// Navigation route names (we'll use these with Expo Router)
export type RouteNames =
  | "(auth)/login"
  | "(auth)/signup"
  | "(main)/home"
  | "(main)/coach"
  | "(main)/session"
  | "(main)/history"
  | "(main)/goals"
  | "(main)/achievements"
  | "(main)/profile";
