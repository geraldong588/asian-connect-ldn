// START GENAI
import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";
import {
  useAuth,
  useProfile,
  useCommunities,
  useMessages,
  useEvents,
  useProfiles,
  useConnections,
} from "./hooks/useSupabase";

// ============================================================
// 🗃️ MOCK DATA
// ============================================================

const INTEREST_TAGS = [
  "🍜 Food & Cooking",
  "🎮 Gaming",
  "🎵 K-Pop",
  "🎨 Art & Design",
  "💃 Dance",
  "📸 Photography",
  "🧘 Wellness",
  "🏸 Badminton",
  "🎬 Film & Drama",
  "📚 Book Club",
  "🌿 Hiking",
  "🎤 Karaoke",
  "🍵 Tea Culture",
  "💻 Tech & Startups",
  "✈️ Travel",
  "🎭 Theatre",
  "🏋️ Fitness",
  "🎸 Music",
  "🍱 Street Food",
  "🌸 Fashion",
];

const MOCK_USERS = [
  {
    id: 1,
    name: "Mei Lin",
    age: 26,
    area: "Shoreditch",
    avatar: "M",
    heritage: "Chinese",
    tags: ["🎨 Art & Design", "🍵 Tea Culture", "📸 Photography", "🌸 Fashion"],
    bio: "Digital artist & tea enthusiast ☕",
    online: true,
  },
  {
    id: 2,
    name: "Kai Tanaka",
    age: 29,
    area: "Hackney",
    avatar: "K",
    heritage: "Japanese",
    tags: ["🎮 Gaming", "🎵 K-Pop", "🎤 Karaoke", "💻 Tech & Startups"],
    bio: "Dev by day, gamer by night 🎮",
    online: true,
  },
  {
    id: 3,
    name: "Priya Sharma",
    age: 24,
    area: "Brixton",
    avatar: "P",
    heritage: "Indian",
    tags: ["💃 Dance", "🎵 K-Pop", "🧘 Wellness", "🍜 Food & Cooking"],
    bio: "Bollywood + K-drama obsessed 💕",
    online: false,
  },
  {
    id: 4,
    name: "James Wong",
    age: 31,
    area: "Canary Wharf",
    avatar: "J",
    heritage: "Hong Kong",
    tags: [
      "🏸 Badminton",
      "💻 Tech & Startups",
      "🍜 Food & Cooking",
      "✈️ Travel",
    ],
    bio: "Fintech & dim sum lover 🥟",
    online: true,
  },
  {
    id: 5,
    name: "Yuna Park",
    age: 23,
    area: "New Cross",
    avatar: "Y",
    heritage: "Korean",
    tags: ["🎵 K-Pop", "🎬 Film & Drama", "🌸 Fashion", "📸 Photography"],
    bio: "K-drama marathoner & style icon 🌸",
    online: true,
  },
  {
    id: 6,
    name: "Arjun Patel",
    age: 28,
    area: "Wembley",
    avatar: "A",
    heritage: "Indian",
    tags: ["🏋️ Fitness", "🎸 Music", "🍱 Street Food", "🌿 Hiking"],
    bio: "Gym rat & street food explorer 🌶️",
    online: false,
  },
];

const INITIAL_COMMUNITIES = [
  {
    id: 1,
    name: "K-Pop London 🎵",
    category: "Music",
    description:
      "Dance covers, album drops, concert meetups & all things K-Pop in London!",
    tags: ["🎵 K-Pop", "💃 Dance", "🎤 Karaoke"],
    members: 847,
    emoji: "🎵",
    color: "#ff6b9d",
    events: 3,
    posts: 124,
    joined: false,
    banner: "linear-gradient(135deg, #ff6b9d, #c44dff)",
    messages: [
      {
        id: 1,
        user: "Yuna Park",
        avatar: "Y",
        text: "Anyone going to the TWICE concert next month? 🎤",
        time: "2m ago",
        reactions: ["❤️", "🔥"],
      },
      {
        id: 2,
        user: "Priya Sharma",
        avatar: "P",
        text: "YES! I got tickets already 🙌",
        time: "1m ago",
        reactions: ["🎉"],
      },
      {
        id: 3,
        user: "Mei Lin",
        avatar: "M",
        text: "Which section are you in? Maybe we can meet up!",
        time: "just now",
        reactions: [],
      },
    ],
  },
  {
    id: 2,
    name: "Asian Foodies 🍜",
    category: "Food",
    description:
      "Restaurant reviews, cooking tips, recipe sharing & food crawls across London!",
    tags: ["🍜 Food & Cooking", "🍱 Street Food", "🍵 Tea Culture"],
    members: 1203,
    emoji: "🍜",
    color: "#ff9f43",
    events: 5,
    posts: 312,
    joined: false,
    banner: "linear-gradient(135deg, #ff9f43, #ee5a24)",
    messages: [
      {
        id: 1,
        user: "James Wong",
        avatar: "J",
        text: "Just found an amazing new Sichuan place in Soho 🌶️",
        time: "5m ago",
        reactions: ["🌶️", "😍"],
      },
      {
        id: 2,
        user: "Arjun Patel",
        avatar: "A",
        text: "Drop the name!! Been looking for good Sichuan forever",
        time: "3m ago",
        reactions: [],
      },
      {
        id: 3,
        user: "James Wong",
        avatar: "J",
        text: "Mala Project on Wardour St - dan dan noodles are 🔥",
        time: "1m ago",
        reactions: ["❤️", "🙏", "🔥"],
      },
    ],
  },
  {
    id: 3,
    name: "Tech Asians London 💻",
    category: "Tech",
    description:
      "Networking, startup ideas, career advice & hackathons for Asian tech folks!",
    tags: ["💻 Tech & Startups", "🎮 Gaming"],
    members: 634,
    emoji: "💻",
    color: "#00d2d3",
    events: 2,
    posts: 89,
    joined: false,
    banner: "linear-gradient(135deg, #00d2d3, #0652DD)",
    messages: [
      {
        id: 1,
        user: "Kai Tanaka",
        avatar: "K",
        text: "Anyone at the AI Summit this weekend?",
        time: "10m ago",
        reactions: ["🤖"],
      },
      {
        id: 2,
        user: "James Wong",
        avatar: "J",
        text: "I'll be there! Let's link up 🤝",
        time: "8m ago",
        reactions: ["💪"],
      },
    ],
  },
  {
    id: 4,
    name: "Badminton Club 🏸",
    category: "Sports",
    description:
      "Weekly sessions, tournaments & casual games across London courts!",
    tags: ["🏸 Badminton", "🏋️ Fitness", "🌿 Hiking"],
    members: 289,
    emoji: "🏸",
    color: "#1dd1a1",
    events: 4,
    posts: 67,
    joined: false,
    banner: "linear-gradient(135deg, #1dd1a1, #10ac84)",
    messages: [
      {
        id: 1,
        user: "Arjun Patel",
        avatar: "A",
        text: "Court booked at Islington for Saturday 10am 🏸",
        time: "1h ago",
        reactions: ["🙌", "✅"],
      },
      {
        id: 2,
        user: "James Wong",
        avatar: "J",
        text: "I'm in! Bringing my new racket 😤",
        time: "45m ago",
        reactions: ["😂"],
      },
    ],
  },
  {
    id: 5,
    name: "Asian Creatives 🎨",
    category: "Arts",
    description:
      "Art, design, photography, film & all creative pursuits. Show your work!",
    tags: ["🎨 Art & Design", "📸 Photography", "🎬 Film & Drama"],
    members: 412,
    emoji: "🎨",
    color: "#a29bfe",
    events: 2,
    posts: 198,
    joined: false,
    banner: "linear-gradient(135deg, #a29bfe, #6c5ce7)",
    messages: [
      {
        id: 1,
        user: "Mei Lin",
        avatar: "M",
        text: "Just posted my new digital art series! Check the gallery 🎨",
        time: "30m ago",
        reactions: ["😍", "🔥", "❤️"],
      },
    ],
  },
  {
    id: 6,
    name: "Wellness & Mindfulness 🧘",
    category: "Wellness",
    description:
      "Yoga, meditation, mental health chats & wellness events for the community!",
    tags: ["🧘 Wellness", "🌿 Hiking", "🏋️ Fitness"],
    members: 356,
    emoji: "🧘",
    color: "#fd79a8",
    events: 3,
    posts: 78,
    joined: false,
    banner: "linear-gradient(135deg, #fd79a8, #e84393)",
    messages: [
      {
        id: 1,
        user: "Priya Sharma",
        avatar: "P",
        text: "Morning meditation session tomorrow at 7am 🧘",
        time: "2h ago",
        reactions: ["🙏", "❤️"],
      },
    ],
  },
];

const MOCK_EVENTS = [
  {
    id: 1,
    title: "K-Pop Dance Workshop",
    community: "K-Pop London 🎵",
    communityId: 1,
    date: "Sat 18 Jan",
    time: "2:00 PM",
    location: "Shoreditch Community Centre",
    emoji: "💃",
    attendees: 34,
    capacity: 40,
    price: "Free",
    tags: ["💃 Dance", "🎵 K-Pop"],
    going: false,
  },
  {
    id: 2,
    title: "Asian Street Food Crawl",
    community: "Asian Foodies 🍜",
    communityId: 2,
    date: "Sun 19 Jan",
    time: "12:00 PM",
    location: "Brick Lane, E1",
    emoji: "🍜",
    attendees: 28,
    capacity: 30,
    price: "Free",
    tags: ["🍱 Street Food", "🍜 Food & Cooking"],
    going: false,
  },
  {
    id: 3,
    title: "Tech Networking Mixer",
    community: "Tech Asians London 💻",
    communityId: 3,
    date: "Thu 23 Jan",
    time: "7:00 PM",
    location: "WeWork Moorgate",
    emoji: "🤝",
    attendees: 67,
    capacity: 100,
    price: "£5",
    tags: ["💻 Tech & Startups"],
    going: false,
  },
  {
    id: 4,
    title: "Badminton Tournament",
    community: "Badminton Club 🏸",
    communityId: 4,
    date: "Sat 25 Jan",
    time: "10:00 AM",
    location: "Islington Tennis Centre",
    emoji: "🏸",
    attendees: 24,
    capacity: 32,
    price: "£3",
    tags: ["🏸 Badminton"],
    going: false,
  },
  {
    id: 5,
    title: "Art & Dim Sum Sunday",
    community: "Asian Creatives 🎨",
    communityId: 5,
    date: "Sun 26 Jan",
    time: "11:00 AM",
    location: "Tate Modern + Chinatown",
    emoji: "🎨",
    attendees: 19,
    capacity: 25,
    price: "Free",
    tags: ["🎨 Art & Design", "🍜 Food & Cooking"],
    going: false,
  },
  {
    id: 6,
    title: "Lunar New Year Mixer 🐍",
    community: "Asian Foodies 🍜",
    communityId: 2,
    date: "Wed 29 Jan",
    time: "6:30 PM",
    location: "Chinatown, London",
    emoji: "🏮",
    attendees: 156,
    capacity: 200,
    price: "Free",
    tags: ["🍜 Food & Cooking"],
    going: false,
  },
];

// ============================================================
// 🧠 RECOMMENDATION ENGINE
// ============================================================

function getMatchScore(userTags, targetTags) {
  if (!userTags || userTags.length === 0)
    return Math.floor(Math.random() * 30) + 50;
  const shared = userTags.filter((tag) => targetTags.includes(tag));
  const score = Math.round(
    (shared.length / Math.max(targetTags.length, userTags.length)) * 100
  );
  return Math.min(score + Math.floor(Math.random() * 10), 99);
}

function getRecommendedCommunities(userTags, communities) {
  return [...communities]
    .map((c) => ({ ...c, score: getMatchScore(userTags, c.tags) }))
    .sort((a, b) => b.score - a.score);
}

function getRecommendedUsers(currentUserTags, users) {
  return [...users]
    .map((u) => ({ ...u, score: getMatchScore(currentUserTags || [], u.tags) }))
    .sort((a, b) => b.score - a.score);
}

function getRecommendedEvents(userTags, events) {
  return [...events]
    .map((e) => ({ ...e, score: getMatchScore(userTags, e.tags) }))
    .sort((a, b) => b.score - a.score);
}

// ============================================================
// 🎨 DESIGN TOKENS
// ============================================================

const C = {
  bg: "#0a0a0f",
  surface: "#13131a",
  surface2: "#1a1a24",
  surface3: "#22222f",
  purple: "#8b5cf6",
  purpleLight: "#a78bfa",
  purpleDark: "#6d28d9",
  purpleGlow: "rgba(139, 92, 246, 0.12)",
  purpleGlow2: "rgba(139, 92, 246, 0.25)",
  pink: "#ec4899",
  text: "#f0f0f8",
  textMuted: "#9090a8",
  textDim: "#55556a",
  border: "rgba(139, 92, 246, 0.15)",
  borderBright: "rgba(139, 92, 246, 0.4)",
  success: "#10b981",
  warning: "#f59e0b",
};

// ============================================================
// 🧩 SHARED UI COMPONENTS
// ============================================================

function Avatar({ letter, size = 40, online }) {
  const gradients = [
    "linear-gradient(135deg, #8b5cf6, #ec4899)",
    "linear-gradient(135deg, #6d28d9, #06b6d4)",
    "linear-gradient(135deg, #ec4899, #f97316)",
    "linear-gradient(135deg, #06b6d4, #8b5cf6)",
    "linear-gradient(135deg, #10b981, #8b5cf6)",
    "linear-gradient(135deg, #f59e0b, #ec4899)",
  ];
  const bg = gradients[(letter?.charCodeAt(0) || 0) % gradients.length];
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 800,
          fontSize: size * 0.38,
          boxShadow: `0 0 16px rgba(139,92,246,0.35)`,
          border: `2px solid rgba(139,92,246,0.3)`,
        }}
      >
        {letter}
      </div>
      {online !== undefined && (
        <div
          style={{
            position: "absolute",
            bottom: 1,
            right: 1,
            width: size * 0.28,
            height: size * 0.28,
            borderRadius: "50%",
            background: online ? C.success : C.textDim,
            border: `2px solid ${C.bg}`,
          }}
        />
      )}
    </div>
  );
}

function Tag({ label, small, active, onClick }) {
  return (
    <span
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: small ? "3px 10px" : "6px 14px",
        borderRadius: "20px",
        fontSize: small ? "11px" : "12px",
        fontWeight: 600,
        cursor: onClick ? "pointer" : "default",
        background: active ? C.purple : C.surface3,
        color: active ? "#fff" : C.textMuted,
        border: `1px solid ${active ? C.purple : C.border}`,
        transition: "all 0.2s",
        userSelect: "none",
      }}
    >
      {label}
    </span>
  );
}

function ScoreBadge({ score }) {
  const color = score >= 80 ? C.success : score >= 60 ? C.purple : C.warning;
  return (
    <span
      style={{
        fontSize: "11px",
        fontWeight: 700,
        padding: "3px 8px",
        borderRadius: "10px",
        background: `${color}22`,
        color,
        border: `1px solid ${color}44`,
      }}
    >
      ⚡ {score}% match
    </span>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  small,
  full,
  disabled,
}) {
  const styles = {
    primary: {
      background: `linear-gradient(135deg, ${C.purple}, ${C.pink})`,
      color: "#fff",
      border: "none",
    },
    secondary: {
      background: C.surface3,
      color: C.text,
      border: `1px solid ${C.border}`,
    },
    ghost: {
      background: "transparent",
      color: C.purple,
      border: `1px solid ${C.borderBright}`,
    },
    success: {
      background: `${C.success}22`,
      color: C.success,
      border: `1px solid ${C.success}44`,
    },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        padding: small ? "7px 16px" : "11px 22px",
        borderRadius: "12px",
        fontWeight: 700,
        fontSize: small ? "12px" : "14px",
        cursor: disabled ? "not-allowed" : "pointer",
        width: full ? "100%" : "auto",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.2s",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

function Card({ children, style, onClick, glow }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: C.surface,
        border: `1px solid ${glow ? C.borderBright : C.border}`,
        borderRadius: "18px",
        padding: "16px",
        boxShadow: glow ? `0 0 24px ${C.purpleGlow2}` : "none",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ title, subtitle, action, onAction }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: "14px",
      }}
    >
      <div>
        <div style={{ fontSize: "18px", fontWeight: 800, color: C.text }}>
          {title}
        </div>
        {subtitle && (
          <div
            style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {action && (
        <span
          onClick={onAction}
          style={{
            fontSize: "13px",
            color: C.purple,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {action}
        </span>
      )}
    </div>
  );
}

function ProgressBar({ value, max, color }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div
      style={{
        background: C.surface3,
        borderRadius: "4px",
        height: "5px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: color || `linear-gradient(90deg, ${C.purple}, ${C.pink})`,
          borderRadius: "4px",
          transition: "width 0.4s",
        }}
      />
    </div>
  );
}
// ============================================================
// 🔐 AUTH SCREEN (replaces onboarding for returning users)
// ============================================================

function AuthScreen({ onComplete }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn, signUp } = useAuth();

  const handleSubmit = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError("");

    if (mode === "signup") {
      const { data, error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        // New user - go to onboarding
        onComplete("onboard", data.user);
      }
    } else {
      const { data, error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        // Existing user - go straight to app
        onComplete("app", data.user);
      }
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🌏</div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 900,
              color: C.text,
              marginBottom: "8px",
            }}
          >
            {mode === "login" ? "Welcome back!" : "Join AsianConnect"}
          </h1>
          <p style={{ color: C.textMuted, fontSize: "14px" }}>
            {mode === "login"
              ? "Sign in to your community"
              : "Create your free account today"}
          </p>
        </div>

        {/* Toggle */}
        <div
          style={{
            display: "flex",
            background: C.surface,
            borderRadius: "14px",
            padding: "4px",
            marginBottom: "24px",
            border: `1px solid ${C.border}`,
          }}
        >
          {["login", "signup"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "12px",
                background: mode === m ? C.purple : "transparent",
                color: mode === m ? "#fff" : C.textMuted,
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
                transition: "all 0.2s",
              }}
            >
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Email Input */}
        <div style={{ marginBottom: "12px" }}>
          <label
            style={{
              fontSize: "13px",
              color: C.textMuted,
              display: "block",
              marginBottom: "6px",
              fontWeight: 600,
            }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "14px",
              background: C.surface,
              border: `1px solid ${C.borderBright}`,
              color: C.text,
              fontSize: "15px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Password Input */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              fontSize: "13px",
              color: C.textMuted,
              display: "block",
              marginBottom: "6px",
              fontWeight: 600,
            }}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "14px",
              background: C.surface,
              border: `1px solid ${C.borderBright}`,
              color: C.text,
              fontSize: "15px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#ef444422",
              border: "1px solid #ef444444",
              borderRadius: "12px",
              padding: "12px 16px",
              color: "#ef4444",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          full
          disabled={loading || !email || !password}
        >
          {loading
            ? "Loading..."
            : mode === "login"
            ? "Sign In →"
            : "Create Account →"}
        </Button>

        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: C.textDim,
            marginTop: "20px",
          }}
        >
          By continuing you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
// ============================================================
// 🔐 ONBOARDING SCREEN
// ============================================================

function OnboardingScreen({ onComplete }) {
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [heritage, setHeritage] = useState("");
  const [area, setArea] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const heritages = [
    "Chinese",
    "Japanese",
    "Korean",
    "Indian",
    "Pakistani",
    "Bangladeshi",
    "Vietnamese",
    "Filipino",
    "Thai",
    "Malaysian",
    "Sri Lankan",
    "Nepalese",
    "Other Asian",
  ];
  const areas = [
    "Central London",
    "East London",
    "North London",
    "South London",
    "West London",
    "Shoreditch",
    "Hackney",
    "Brixton",
    "Canary Wharf",
    "Wembley",
    "Croydon",
    "Greenwich",
  ];

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : prev.length < 6
        ? [...prev, tag]
        : prev
    );
  };

  const steps = [
    // Step 0 - Welcome
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{ fontSize: "72px", marginBottom: "24px" }}>🌏</div>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: 900,
          color: C.text,
          marginBottom: "12px",
          lineHeight: 1.2,
        }}
      >
        Welcome to
        <br />
        <span
          style={{
            background: `linear-gradient(135deg, ${C.purple}, ${C.pink})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          AsianConnect
        </span>
      </h1>
      <p
        style={{
          color: C.textMuted,
          fontSize: "16px",
          lineHeight: 1.6,
          marginBottom: "32px",
        }}
      >
        The social app for Asian communities in London 🇬🇧
        <br />
        Find your people. Build your community.
      </p>
      <Button onClick={() => setStep(1)} full>
        Let's Get Started ✨
      </Button>
    </div>,

    // Step 1 - Name
    <div>
      <div
        style={{ fontSize: "40px", textAlign: "center", marginBottom: "16px" }}
      >
        👋
      </div>
      <h2
        style={{
          fontSize: "24px",
          fontWeight: 800,
          color: C.text,
          textAlign: "center",
          marginBottom: "8px",
        }}
      >
        What's your name?
      </h2>
      <p
        style={{
          color: C.textMuted,
          textAlign: "center",
          marginBottom: "28px",
          fontSize: "14px",
        }}
      >
        How should the community know you?
      </p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your first name..."
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: "14px",
          background: C.surface2,
          border: `1px solid ${C.borderBright}`,
          color: C.text,
          fontSize: "16px",
          outline: "none",
          boxSizing: "border-box",
          marginBottom: "20px",
        }}
      />
      <Button
        onClick={() => name.trim() && setStep(2)}
        full
        disabled={!name.trim()}
      >
        Continue →
      </Button>
    </div>,

    // Step 2 - Heritage
    <div>
      <div
        style={{ fontSize: "40px", textAlign: "center", marginBottom: "16px" }}
      >
        🌸
      </div>
      <h2
        style={{
          fontSize: "24px",
          fontWeight: 800,
          color: C.text,
          textAlign: "center",
          marginBottom: "8px",
        }}
      >
        Your heritage?
      </h2>
      <p
        style={{
          color: C.textMuted,
          textAlign: "center",
          marginBottom: "24px",
          fontSize: "14px",
        }}
      >
        Celebrate where you're from!
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "24px",
        }}
      >
        {heritages.map((h) => (
          <span
            key={h}
            onClick={() => setHeritage(h)}
            style={{
              padding: "10px 16px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 600,
              background: heritage === h ? C.purple : C.surface2,
              color: heritage === h ? "#fff" : C.textMuted,
              border: `1px solid ${heritage === h ? C.purple : C.border}`,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {h}
          </span>
        ))}
      </div>
      <Button onClick={() => heritage && setStep(3)} full disabled={!heritage}>
        Continue →
      </Button>
    </div>,

    // Step 3 - Area
    <div>
      <div
        style={{ fontSize: "40px", textAlign: "center", marginBottom: "16px" }}
      >
        📍
      </div>
      <h2
        style={{
          fontSize: "24px",
          fontWeight: 800,
          color: C.text,
          textAlign: "center",
          marginBottom: "8px",
        }}
      >
        Where in London?
      </h2>
      <p
        style={{
          color: C.textMuted,
          textAlign: "center",
          marginBottom: "24px",
          fontSize: "14px",
        }}
      >
        Find people near you!
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "24px",
        }}
      >
        {areas.map((a) => (
          <span
            key={a}
            onClick={() => setArea(a)}
            style={{
              padding: "10px 16px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 600,
              background: area === a ? C.purple : C.surface2,
              color: area === a ? "#fff" : C.textMuted,
              border: `1px solid ${area === a ? C.purple : C.border}`,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {a}
          </span>
        ))}
      </div>
      <Button onClick={() => area && setStep(4)} full disabled={!area}>
        Continue →
      </Button>
    </div>,

    // Step 4 - Interests
    <div>
      <div
        style={{ fontSize: "40px", textAlign: "center", marginBottom: "16px" }}
      >
        🎯
      </div>
      <h2
        style={{
          fontSize: "24px",
          fontWeight: 800,
          color: C.text,
          textAlign: "center",
          marginBottom: "8px",
        }}
      >
        Your interests?
      </h2>
      <p
        style={{
          color: C.textMuted,
          textAlign: "center",
          marginBottom: "24px",
          fontSize: "14px",
        }}
      >
        Pick up to 6 — this powers your recommendations!
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "24px",
        }}
      >
        {INTEREST_TAGS.map((tag) => (
          <span
            key={tag}
            onClick={() => toggleTag(tag)}
            style={{
              padding: "10px 14px",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: 600,
              background: selectedTags.includes(tag) ? C.purple : C.surface2,
              color: selectedTags.includes(tag) ? "#fff" : C.textMuted,
              border: `1px solid ${
                selectedTags.includes(tag) ? C.purple : C.border
              }`,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      <div
        style={{
          fontSize: "12px",
          color: C.textMuted,
          textAlign: "center",
          marginBottom: "16px",
        }}
      >
        {selectedTags.length}/6 selected
      </div>
      <Button
        onClick={async () => {
          if (selectedTags.length === 0 || submitting) return;
          setSubmitting(true);
          await onComplete({ name, heritage, area, tags: selectedTags });
          setSubmitting(false);
        }}
        full
        disabled={selectedTags.length === 0 || submitting}
      >
        {submitting ? "Setting things up..." : "Find My Community 🚀"}
      </Button>
    </div>,
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {step > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: "4px",
                    borderRadius: "2px",
                    background: i <= step ? C.purple : C.surface3,
                    transition: "background 0.3s",
                  }}
                />
              ))}
            </div>
            {step > 1 && (
              <span
                onClick={() => setStep((s) => s - 1)}
                style={{
                  color: C.textMuted,
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                ← Back
              </span>
            )}
          </div>
        )}
        {steps[step]}
      </div>
    </div>
  );
}

// ============================================================
// 🏠 HOME / DISCOVER SCREEN
// ============================================================

function HomeScreen({
  currentUser,
  communities,
  events,
  onViewCommunity,
  onViewProfile,
}) {
  const recUsers = getRecommendedUsers(currentUser.tags, MOCK_USERS);
  const recCommunities = getRecommendedCommunities(
    currentUser.tags,
    communities
  ).slice(0, 3);
  const recEvents = getRecommendedEvents(currentUser.tags, events).slice(0, 3);

  return (
    <div style={{ padding: "20px", paddingBottom: "100px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <div style={{ fontSize: "22px", fontWeight: 900, color: C.text }}>
            Hey {currentUser.name} 👋
          </div>
          <div
            style={{ fontSize: "13px", color: C.textMuted, marginTop: "2px" }}
          >
            Discover your community in London
          </div>
        </div>
        <Avatar letter={currentUser.name[0]} size={44} online={true} />
      </div>

      {/* Stats Bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "10px",
          marginBottom: "28px",
        }}
      >
        {[
          {
            label: "Communities",
            value: communities.filter((c) => c.joined).length,
            icon: "🏘️",
          },
          {
            label: "Events",
            value: events.filter((e) => e.going).length,
            icon: "📅",
          },
          { label: "Connections", value: 0, icon: "🤝" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: "14px",
              padding: "14px 10px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "22px", marginBottom: "4px" }}>
              {stat.icon}
            </div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: C.text }}>
              {stat.value}
            </div>
            <div style={{ fontSize: "11px", color: C.textMuted }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Recommended People */}
      <div style={{ marginBottom: "28px" }}>
        <SectionHeader
          title="People You'll Vibe With ✨"
          subtitle="Based on your interests"
        />
        <div
          style={{
            display: "flex",
            gap: "12px",
            overflowX: "auto",
            paddingBottom: "8px",
          }}
        >
          {recUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => onViewProfile(user)}
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: "16px",
                padding: "16px",
                minWidth: "150px",
                cursor: "pointer",
                flexShrink: 0,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "10px",
                }}
              >
                <Avatar letter={user.avatar} size={52} online={user.online} />
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: C.text,
                  marginBottom: "4px",
                }}
              >
                {user.name}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: C.textMuted,
                  marginBottom: "8px",
                }}
              >
                📍 {user.area}
              </div>
              <ScoreBadge score={user.score} />
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Communities */}
      <div style={{ marginBottom: "28px" }}>
        <SectionHeader
          title="Top Communities For You 🏘️"
          subtitle="Matched to your interests"
          action="See all"
          onAction={() => {}}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {recCommunities.map((c) => (
            <div
              key={c.id}
              onClick={() => onViewCommunity(c)}
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              <div style={{ height: "6px", background: c.banner }} />
              <div
                style={{
                  padding: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: c.banner,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    flexShrink: 0,
                  }}
                >
                  {c.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{ fontSize: "15px", fontWeight: 700, color: C.text }}
                  >
                    {c.name}
                  </div>
                  <div style={{ fontSize: "12px", color: C.textMuted }}>
                    👥 {c.members.toLocaleString()} members
                  </div>
                </div>
                <ScoreBadge score={c.score} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div style={{ marginBottom: "28px" }}>
        <SectionHeader
          title="Events You'll Love 📅"
          subtitle="Happening soon in London"
          action="See all"
          onAction={() => {}}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {recEvents.map((event) => (
            <div
              key={event.id}
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: "16px",
                padding: "14px",
                display: "flex",
                gap: "14px",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: C.surface3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  flexShrink: 0,
                }}
              >
                {event.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: C.text,
                    marginBottom: "4px",
                  }}
                >
                  {event.title}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: C.textMuted,
                    marginBottom: "4px",
                  }}
                >
                  📅 {event.date} · {event.time}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: C.textMuted,
                    marginBottom: "8px",
                  }}
                >
                  📍 {event.location}
                </div>
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: "10px",
                      background: C.purpleGlow,
                      color: C.purpleLight,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    {event.price}
                  </span>
                  <span style={{ fontSize: "11px", color: C.textMuted }}>
                    {event.attendees}/{event.capacity} going
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 🏘️ COMMUNITIES SCREEN
// ============================================================

function CommunitiesScreen({
  currentUser,
  communities,
  onViewCommunity,
  onJoinCommunity,
}) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = [
    "All",
    "Music",
    "Food",
    "Tech",
    "Sports",
    "Arts",
    "Wellness",
  ];

  const scored = getRecommendedCommunities(currentUser.tags, communities);
  const filtered = scored.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === "All" || c.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const joined = filtered.filter((c) => c.joined);
  const discover = filtered.filter((c) => !c.joined);

  return (
    <div style={{ padding: "20px", paddingBottom: "100px" }}>
      <div
        style={{
          fontSize: "22px",
          fontWeight: 900,
          color: C.text,
          marginBottom: "16px",
        }}
      >
        Communities 🏘️
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "14px" }}>
        <span
          style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "16px",
          }}
        >
          🔍
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search communities..."
          style={{
            width: "100%",
            padding: "12px 16px 12px 40px",
            borderRadius: "14px",
            background: C.surface,
            border: `1px solid ${C.border}`,
            color: C.text,
            fontSize: "14px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "8px",
          marginBottom: "20px",
        }}
      >
        {filters.map((f) => (
          <span
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              padding: "7px 16px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              flexShrink: 0,
              background: activeFilter === f ? C.purple : C.surface,
              color: activeFilter === f ? "#fff" : C.textMuted,
              border: `1px solid ${activeFilter === f ? C.purple : C.border}`,
              transition: "all 0.2s",
            }}
          >
            {f}
          </span>
        ))}
      </div>

      {/* Joined Communities */}
      {joined.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <SectionHeader
            title="Your Communities ✅"
            subtitle={`${joined.length} joined`}
          />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {joined.map((c) => (
              <CommunityCard
                key={c.id}
                community={c}
                onView={() => onViewCommunity(c)}
                onJoin={() => onJoinCommunity(c.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Discover */}
      <div>
        <SectionHeader
          title="Discover Communities 🔥"
          subtitle={`${discover.length} communities · sorted by match`}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {discover.map((c) => (
            <CommunityCard
              key={c.id}
              community={c}
              onView={() => onViewCommunity(c)}
              onJoin={() => onJoinCommunity(c.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CommunityCard({ community: c, onView, onJoin }) {
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: "18px",
        overflow: "hidden",
      }}
    >
      <div style={{ height: "8px", background: c.banner }} />
      <div style={{ padding: "16px" }}>
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "flex-start",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: c.banner,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              flexShrink: 0,
            }}
          >
            {c.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ fontSize: "15px", fontWeight: 700, color: C.text }}>
                {c.name}
              </div>
              {c.score && <ScoreBadge score={c.score} />}
            </div>
            <div
              style={{ fontSize: "12px", color: C.textMuted, marginTop: "3px" }}
            >
              👥 {c.members.toLocaleString()} members · 📅 {c.events} events
            </div>
          </div>
        </div>
        <p
          style={{
            fontSize: "13px",
            color: C.textMuted,
            lineHeight: 1.5,
            marginBottom: "12px",
          }}
        >
          {c.description}
        </p>
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "14px",
          }}
        >
          {c.tags.map((tag) => (
            <Tag key={tag} label={tag} small />
          ))}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button onClick={onView} variant="ghost" small>
            View Group
          </Button>
          <Button
            onClick={onJoin}
            small
            variant={c.joined ? "success" : "primary"}
          >
            {c.joined ? "✓ Joined" : "Join Community"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 💬 COMMUNITY DETAIL + GROUP CHAT
// ============================================================

function CommunityDetailScreen({
  community,
  currentUser,
  onBack,
  onJoin,
  events,
}) {
  const [tab, setTab] = useState("chat");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(community.messages || []);
  const messagesEndRef = useRef(null);
  const communityEvents = events.filter((e) => e.communityId === community.id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: currentUser.name,
        avatar: currentUser.name[0],
        text: message.trim(),
        time: "just now",
        reactions: [],
        isOwn: true,
      },
    ]);
    setMessage("");
  };

  const addReaction = (msgId, emoji) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId
          ? {
              ...m,
              reactions: m.reactions.includes(emoji)
                ? m.reactions.filter((r) => r !== emoji)
                : [...m.reactions, emoji],
            }
          : m
      )
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: C.bg,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: C.surface,
          borderBottom: `1px solid ${C.border}`,
          padding: "16px 20px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "14px",
          }}
        >
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              color: C.purple,
              fontSize: "20px",
              cursor: "pointer",
              padding: "0",
            }}
          >
            ←
          </button>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: community.banner,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            {community.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: C.text }}>
              {community.name}
            </div>
            <div style={{ fontSize: "12px", color: C.textMuted }}>
              👥 {community.members.toLocaleString()} members
            </div>
          </div>
          <Button
            onClick={() => onJoin(community.id)}
            variant={community.joined ? "success" : "primary"}
            small
          >
            {community.joined ? "✓ Joined" : "Join"}
          </Button>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            background: C.surface2,
            borderRadius: "12px",
            padding: "4px",
          }}
        >
          {["chat", "events", "about"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "10px",
                background: tab === t ? C.purple : "transparent",
                color: tab === t ? "#fff" : C.textMuted,
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                textTransform: "capitalize",
                transition: "all 0.2s",
              }}
            >
              {t === "chat"
                ? "💬 Chat"
                : t === "events"
                ? "📅 Events"
                : "ℹ️ About"}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Tab */}
      {tab === "chat" && (
        <>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: msg.isOwn ? "row-reverse" : "row",
                  alignItems: "flex-end",
                }}
              >
                {!msg.isOwn && <Avatar letter={msg.avatar} size={34} />}
                <div style={{ maxWidth: "75%" }}>
                  {!msg.isOwn && (
                    <div
                      style={{
                        fontSize: "11px",
                        color: C.textMuted,
                        marginBottom: "4px",
                        paddingLeft: "4px",
                      }}
                    >
                      {msg.user}
                    </div>
                  )}
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: msg.isOwn
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                      background: msg.isOwn
                        ? `linear-gradient(135deg, ${C.purple}, ${C.pink})`
                        : C.surface2,
                      color: C.text,
                      fontSize: "14px",
                      lineHeight: 1.5,
                      border: msg.isOwn ? "none" : `1px solid ${C.border}`,
                    }}
                  >
                    {msg.text}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                      marginTop: "6px",
                      flexWrap: "wrap",
                      justifyContent: msg.isOwn ? "flex-end" : "flex-start",
                    }}
                  >
                    {msg.reactions.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          gap: "3px",
                          background: C.surface2,
                          borderRadius: "10px",
                          padding: "3px 8px",
                          border: `1px solid ${C.border}`,
                          fontSize: "12px",
                        }}
                      >
                        {msg.reactions.map((r, i) => (
                          <span key={i}>{r}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: "3px" }}>
                      {["❤️", "🔥", "😂", "🙌"].map((emoji) => (
                        <span
                          key={emoji}
                          onClick={() => addReaction(msg.id, emoji)}
                          style={{
                            fontSize: "14px",
                            cursor: "pointer",
                            padding: "2px 4px",
                            borderRadius: "6px",
                            background: C.surface3,
                            border: `1px solid ${C.border}`,
                            lineHeight: 1.4,
                          }}
                        >
                          {emoji}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: C.textDim,
                      marginTop: "4px",
                      textAlign: msg.isOwn ? "right" : "left",
                      paddingLeft: "4px",
                    }}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div
            style={{
              padding: "12px 16px",
              background: C.surface,
              borderTop: `1px solid ${C.border}`,
              flexShrink: 0,
            }}
          >
            {!community.joined && (
              <div
                style={{
                  textAlign: "center",
                  padding: "10px",
                  marginBottom: "10px",
                  background: C.purpleGlow,
                  borderRadius: "12px",
                  border: `1px solid ${C.border}`,
                  fontSize: "13px",
                  color: C.textMuted,
                }}
              >
                Join this community to send messages 👋
              </div>
            )}
            <div
              style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}
            >
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && sendMessage()
                }
                placeholder={
                  community.joined ? "Say something... 💬" : "Join to chat..."
                }
                disabled={!community.joined}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: "14px",
                  background: C.surface2,
                  border: `1px solid ${C.borderBright}`,
                  color: C.text,
                  fontSize: "14px",
                  outline: "none",
                  opacity: community.joined ? 1 : 0.5,
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!community.joined || !message.trim()}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "14px",
                  background:
                    message.trim() && community.joined
                      ? `linear-gradient(135deg, ${C.purple}, ${C.pink})`
                      : C.surface3,
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
              >
                🚀
              </button>
            </div>
          </div>
        </>
      )}

      {/* Events Tab */}
      {tab === "events" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          {communityEvents.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: C.textMuted,
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📅</div>
              <div style={{ fontSize: "16px", fontWeight: 600 }}>
                No events yet
              </div>
              <div style={{ fontSize: "13px", marginTop: "8px" }}>
                Check back soon!
              </div>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              {communityEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* About Tab */}
      {tab === "about" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          <div
            style={{
              height: "120px",
              background: community.banner,
              borderRadius: "18px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "52px",
            }}
          >
            {community.emoji}
          </div>

          <Card style={{ marginBottom: "14px" }}>
            <div
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: C.text,
                marginBottom: "8px",
              }}
            >
              {community.name}
            </div>
            <p
              style={{ fontSize: "14px", color: C.textMuted, lineHeight: 1.6 }}
            >
              {community.description}
            </p>
          </Card>

          <Card style={{ marginBottom: "14px" }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: C.text,
                marginBottom: "12px",
              }}
            >
              📊 Stats
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              {[
                {
                  label: "Members",
                  value: community.members.toLocaleString(),
                  icon: "👥",
                },
                { label: "Events", value: community.events, icon: "📅" },
                { label: "Posts", value: community.posts, icon: "💬" },
                { label: "Category", value: community.category, icon: "🏷️" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: C.surface2,
                    borderRadius: "12px",
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "20px", marginBottom: "4px" }}>
                    {stat.icon}
                  </div>
                  <div
                    style={{ fontSize: "16px", fontWeight: 700, color: C.text }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ fontSize: "11px", color: C.textMuted }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: C.text,
                marginBottom: "12px",
              }}
            >
              🏷️ Topics
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {community.tags.map((tag) => (
                <Tag key={tag} label={tag} active />
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 📅 EVENTS SCREEN
// ============================================================

function EventsScreen({ currentUser, events, onToggleGoing }) {
  const [filter, setFilter] = useState("All");
  const [tab, setTab] = useState("discover");
  const filters = [
    "All",
    "Free",
    "This Week",
    "Sports",
    "Food",
    "Music",
    "Tech",
  ];

  const scored = getRecommendedEvents(currentUser.tags, events);
  const myEvents = scored.filter((e) => e.going);
  const discover = scored.filter((e) => !e.going);

  const applyFilter = (evts) => {
    if (filter === "All") return evts;
    if (filter === "Free") return evts.filter((e) => e.price === "Free");
    if (filter === "This Week") return evts.slice(0, 4);
    return evts.filter((e) =>
      e.tags.some((t) => t.toLowerCase().includes(filter.toLowerCase()))
    );
  };

  return (
    <div style={{ padding: "20px", paddingBottom: "100px" }}>
      <div
        style={{
          fontSize: "22px",
          fontWeight: 900,
          color: C.text,
          marginBottom: "16px",
        }}
      >
        Events 📅
      </div>

      {/* Tab Toggle */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          background: C.surface,
          borderRadius: "14px",
          padding: "4px",
          marginBottom: "16px",
          border: `1px solid ${C.border}`,
        }}
      >
        {["discover", "going"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "12px",
              background: tab === t ? C.purple : "transparent",
              color: tab === t ? "#fff" : C.textMuted,
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              transition: "all 0.2s",
            }}
          >
            {t === "discover" ? "🔍 Discover" : `✅ Going (${myEvents.length})`}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "8px",
          marginBottom: "20px",
        }}
      >
        {filters.map((f) => (
          <span
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "7px 16px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              flexShrink: 0,
              background: filter === f ? C.purple : C.surface,
              color: filter === f ? "#fff" : C.textMuted,
              border: `1px solid ${filter === f ? C.purple : C.border}`,
              transition: "all 0.2s",
            }}
          >
            {f}
          </span>
        ))}
      </div>

      {tab === "discover" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {applyFilter(discover).map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onToggleGoing={() => onToggleGoing(event.id)}
              showGoing
            />
          ))}
        </div>
      )}

      {tab === "going" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {myEvents.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: C.textMuted,
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📅</div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: C.text,
                  marginBottom: "8px",
                }}
              >
                No events yet!
              </div>
              <div style={{ fontSize: "14px" }}>
                Browse and RSVP to events you love
              </div>
            </div>
          ) : (
            applyFilter(myEvents).map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onToggleGoing={() => onToggleGoing(event.id)}
                showGoing
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function EventCard({ event, onToggleGoing, showGoing }) {
  const spotsLeft = event.capacity - event.attendees;
  const isFull = spotsLeft <= 0;
  const almostFull = spotsLeft <= 5 && !isFull;

  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: "18px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px",
          display: "flex",
          gap: "14px",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "16px",
            background: C.surface3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            flexShrink: 0,
            border: `1px solid ${C.border}`,
          }}
        >
          {event.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: C.text,
              marginBottom: "4px",
            }}
          >
            {event.title}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: C.purple,
              fontWeight: 600,
              marginBottom: "4px",
            }}
          >
            {event.community}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: C.textMuted,
              marginBottom: "2px",
            }}
          >
            📅 {event.date} · {event.time}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: C.textMuted,
              marginBottom: "10px",
            }}
          >
            📍 {event.location}
          </div>

          {/* Capacity Bar */}
          <div style={{ marginBottom: "10px" }}>
            <div
              style={
                {
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }

                // START GENAI
              }
            >
              <span style={{ fontSize: "11px", color: C.textMuted }}>
                {event.attendees}/{event.capacity} going
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: almostFull
                    ? C.warning
                    : isFull
                    ? "#ef4444"
                    : C.success,
                }}
              >
                {isFull
                  ? "Full 😔"
                  : almostFull
                  ? `Only ${spotsLeft} left!`
                  : `${spotsLeft} spots left`}
              </span>
            </div>
            <ProgressBar
              value={event.attendees}
              max={event.capacity}
              color={isFull ? "#ef4444" : almostFull ? C.warning : undefined}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: "10px",
                background: C.purpleGlow,
                color: C.purpleLight,
                border: `1px solid ${C.border}`,
              }}
            >
              {event.price}
            </span>
            {event.score && <ScoreBadge score={event.score} />}
            {showGoing && (
              <button
                onClick={onToggleGoing}
                disabled={isFull && !event.going}
                style={{
                  marginLeft: "auto",
                  padding: "7px 16px",
                  borderRadius: "12px",
                  background: event.going
                    ? `${C.success}22`
                    : isFull
                    ? C.surface3
                    : `linear-gradient(135deg, ${C.purple}, ${C.pink})`,
                  color: event.going ? C.success : isFull ? C.textDim : "#fff",
                  border: event.going ? `1px solid ${C.success}44` : "none",
                  cursor: isFull && !event.going ? "not-allowed" : "pointer",
                  fontSize: "12px",
                  fontWeight: 700,
                  transition: "all 0.2s",
                }}
              >
                {event.going ? "✓ Going" : isFull ? "Full" : "RSVP →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 👤 PROFILE SCREEN
// ============================================================

function ProfileScreen({
  currentUser,
  setCurrentUser,
  communities,
  events,
  onEditInterests,
}) {
  const joinedCommunities = communities.filter((c) => c.joined);
  const goingEvents = events.filter((e) => e.going);

  return (
    <div style={{ padding: "20px", paddingBottom: "100px" }}>
      {/* Profile Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${C.purpleDark}, ${C.pink}33)`,
          border: `1px solid ${C.border}`,
          borderRadius: "20px",
          padding: "24px",
          marginBottom: "16px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "14px",
          }}
        >
          <Avatar letter={currentUser.name[0]} size={80} online={true} />
        </div>
        <div
          style={{
            fontSize: "22px",
            fontWeight: 900,
            color: C.text,
            marginBottom: "4px",
          }}
        >
          {currentUser.name}
        </div>
        <div
          style={{ fontSize: "14px", color: C.textMuted, marginBottom: "4px" }}
        >
          🌏 {currentUser.heritage} · 📍 {currentUser.area}
        </div>
        <div
          style={{ fontSize: "13px", color: C.textMuted, marginBottom: "16px" }}
        >
          Part of the Asian community in London 🇬🇧
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "24px" }}>
          {[
            { label: "Communities", value: joinedCommunities.length },
            { label: "Events", value: goingEvents.length },
            { label: "Interests", value: currentUser.tags.length },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "22px", fontWeight: 800, color: C.text }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "11px", color: C.textMuted }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interests */}
      <Card style={{ marginBottom: "14px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <div style={{ fontSize: "15px", fontWeight: 700, color: C.text }}>
            🎯 My Interests
          </div>
          <span
            onClick={onEditInterests}
            style={{
              fontSize: "12px",
              color: C.purple,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Edit
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {currentUser.tags.map((tag) => (
            <Tag key={tag} label={tag} active />
          ))}
        </div>
      </Card>

      {/* My Communities */}
      <Card style={{ marginBottom: "14px" }}>
        <div
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: C.text,
            marginBottom: "12px",
          }}
        >
          🏘️ My Communities
        </div>
        {joinedCommunities.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              color: C.textMuted,
              fontSize: "13px",
            }}
          >
            You haven't joined any communities yet!
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {joinedCommunities.map((c) => (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px",
                  background: C.surface2,
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: c.banner,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                  }}
                >
                  {c.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{ fontSize: "14px", fontWeight: 600, color: C.text }}
                  >
                    {c.name}
                  </div>
                  <div style={{ fontSize: "11px", color: C.textMuted }}>
                    👥 {c.members.toLocaleString()} members
                  </div>
                </div>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: C.success,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Upcoming Events */}
      <Card style={{ marginBottom: "14px" }}>
        <div
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: C.text,
            marginBottom: "12px",
          }}
        >
          📅 My Events
        </div>
        {goingEvents.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              color: C.textMuted,
              fontSize: "13px",
            }}
          >
            No events RSVP'd yet! Browse events to join some.
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {goingEvents.map((e) => (
              <div
                key={e.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px",
                  background: C.surface2,
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: C.surface3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                  }}
                >
                  {e.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{ fontSize: "14px", fontWeight: 600, color: C.text }}
                  >
                    {e.title}
                  </div>
                  <div style={{ fontSize: "11px", color: C.textMuted }}>
                    📅 {e.date} · {e.time}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    padding: "3px 8px",
                    borderRadius: "8px",
                    background: `${C.success}22`,
                    color: C.success,
                    border: `1px solid ${C.success}44`,
                    fontWeight: 600,
                  }}
                >
                  Going ✓
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Settings */}
      <Card>
        <div
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: C.text,
            marginBottom: "12px",
          }}
        >
          ⚙️ Settings
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {[
            { icon: "🔔", label: "Notifications", value: "On" },
            { icon: "🔒", label: "Privacy", value: "Friends only" },
            { icon: "🌍", label: "Location", value: currentUser.area },
            { icon: "🎨", label: "Theme", value: "Dark Purple" },
          ].map((setting) => (
            <div
              key={setting.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span style={{ fontSize: "18px" }}>{setting.icon}</span>
                <span style={{ fontSize: "14px", color: C.text }}>
                  {setting.label}
                </span>
              </div>
              <span style={{ fontSize: "13px", color: C.textMuted }}>
                {setting.value} →
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// 👤 USER PROFILE MODAL
// ============================================================

function UserProfileModal({ user, currentUser, onClose }) {
  const [connected, setConnected] = useState(false);
  const sharedTags = currentUser.tags.filter((t) => user.tags.includes(t));
  const score = getMatchScore(currentUser.tags, user.tags);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          background: C.surface,
          borderRadius: "24px 24px 0 0",
          padding: "24px",
          width: "100%",
          maxWidth: "480px",
          border: `1px solid ${C.border}`,
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        {/* Handle */}
        <div
          style={{
            width: "40px",
            height: "4px",
            borderRadius: "2px",
            background: C.surface3,
            margin: "0 auto 20px",
          }}
        />

        {/* Profile Info */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "12px",
            }}
          >
            <Avatar letter={user.avatar} size={80} online={user.online} />
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: C.text }}>
            {user.name}
          </div>
          <div
            style={{ fontSize: "14px", color: C.textMuted, marginTop: "4px" }}
          >
            🌏 {user.heritage} · 📍 {user.area}
          </div>
          <div
            style={{
              fontSize: "14px",
              color: C.textMuted,
              marginTop: "6px",
              fontStyle: "italic",
            }}
          >
            "{user.bio}"
          </div>
          <div style={{ marginTop: "12px" }}>
            <ScoreBadge score={score} />
          </div>
        </div>

        {/* Shared Interests */}
        {sharedTags.length > 0 && (
          <div
            style={{
              background: C.purpleGlow,
              border: `1px solid ${C.border}`,
              borderRadius: "14px",
              padding: "14px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: C.purpleLight,
                marginBottom: "10px",
              }}
            >
              ✨ You both love
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {sharedTags.map((tag) => (
                <Tag key={tag} label={tag} active small />
              ))}
            </div>
          </div>
        )}

        {/* All Interests */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: C.text,
              marginBottom: "10px",
            }}
          >
            🎯 Their Interests
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {user.tags.map((tag) => (
              <Tag key={tag} label={tag} small />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
          <Button
            onClick={() => setConnected(!connected)}
            variant={connected ? "success" : "primary"}
            full
          >
            {connected ? "✓ Connected!" : "Connect 🤝"}
          </Button>
          <Button variant="secondary" onClick={onClose} full>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 🔧 EDIT INTERESTS MODAL
// ============================================================

function EditInterestsModal({ currentUser, onSave, onClose }) {
  const [selected, setSelected] = useState([...currentUser.tags]);

  const toggle = (tag) => {
    setSelected((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : prev.length < 6
        ? [...prev, tag]
        : prev
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          background: C.surface,
          borderRadius: "24px 24px 0 0",
          padding: "24px",
          width: "100%",
          maxWidth: "480px",
          border: `1px solid ${C.border}`,
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "4px",
            borderRadius: "2px",
            background: C.surface3,
            margin: "0 auto 20px",
          }}
        />
        <div
          style={{
            fontSize: "18px",
            fontWeight: 800,
            color: C.text,
            marginBottom: "6px",
          }}
        >
          🎯 Edit Interests
        </div>
        <div
          style={{ fontSize: "13px", color: C.textMuted, marginBottom: "20px" }}
        >
          Pick up to 6 interests to power your recommendations
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          {INTEREST_TAGS.map((tag) => (
            <span
              key={tag}
              onClick={() => toggle(tag)}
              style={{
                padding: "10px 14px",
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: 600,
                background: selected.includes(tag) ? C.purple : C.surface2,
                color: selected.includes(tag) ? "#fff" : C.textMuted,
                border: `1px solid ${
                  selected.includes(tag) ? C.purple : C.border
                }`,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: C.textMuted,
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          {selected.length}/6 selected
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            onClick={() => onSave(selected)}
            variant="primary"
            full
            disabled={selected.length === 0}
          >
            Save Interests ✨
          </Button>
          <Button onClick={onClose} variant="secondary" full>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 🔍 DISCOVER PEOPLE SCREEN
// ============================================================

function DiscoverScreen({ currentUser, communities }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [filter, setFilter] = useState("All");
  const areas = [
    "All",
    "East London",
    "North London",
    "South London",
    "West London",
    "Central London",
  ];
  const recUsers = getRecommendedUsers(currentUser.tags, MOCK_USERS);

  const filtered =
    filter === "All"
      ? recUsers
      : recUsers.filter((u) => u.area.includes(filter.replace(" London", "")));

  return (
    <div style={{ padding: "20px", paddingBottom: "100px" }}>
      <div
        style={{
          fontSize: "22px",
          fontWeight: 900,
          color: C.text,
          marginBottom: "6px",
        }}
      >
        Discover People 🌏
      </div>
      <div
        style={{ fontSize: "13px", color: C.textMuted, marginBottom: "16px" }}
      >
        Matched to your interests · {recUsers.length} people found
      </div>

      {/* Area Filter */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "8px",
          marginBottom: "20px",
        }}
      >
        {areas.map((a) => (
          <span
            key={a}
            onClick={() => setFilter(a)}
            style={{
              padding: "7px 16px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              flexShrink: 0,
              background: filter === a ? C.purple : C.surface,
              color: filter === a ? "#fff" : C.textMuted,
              border: `1px solid ${filter === a ? C.purple : C.border}`,
              transition: "all 0.2s",
            }}
          >
            {a}
          </span>
        ))}
      </div>

      {/* People Grid */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}
      >
        {filtered.map((user) => {
          const sharedTags = currentUser.tags.filter((t) =>
            user.tags.includes(t)
          );
          return (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: "18px",
                padding: "16px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "12px",
                }}
              >
                <Avatar letter={user.avatar} size={56} online={user.online} />
              </div>
              <div style={{ textAlign: "center", marginBottom: "8px" }}>
                <div
                  style={{ fontSize: "15px", fontWeight: 700, color: C.text }}
                >
                  {user.name}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: C.textMuted,
                    marginTop: "2px",
                  }}
                >
                  🌏 {user.heritage}
                </div>
                <div style={{ fontSize: "11px", color: C.textMuted }}>
                  📍 {user.area}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "10px",
                }}
              >
                <ScoreBadge score={user.score} />
              </div>
              {sharedTags.length > 0 && (
                <div
                  style={{
                    background: C.purpleGlow,
                    borderRadius: "10px",
                    padding: "6px 8px",
                    textAlign: "center",
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      color: C.purpleLight,
                      fontWeight: 600,
                    }}
                  >
                    ✨ {sharedTags.length} shared interest
                    {sharedTags.length > 1 ? "s" : ""}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* User Profile Modal */}
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          currentUser={currentUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}

// ============================================================
// 🧭 BOTTOM NAVIGATION
// ============================================================

function BottomNav({ active, onChange, joinedCount }) {
  const tabs = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "discover", icon: "🌏", label: "Discover" },
    { id: "communities", icon: "🏘️", label: "Groups" },
    { id: "events", icon: "📅", label: "Events" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: C.surface,
        borderTop: `1px solid ${C.border}`,
        display: "flex",
        padding: "8px 0 12px",
        boxShadow: `0 -8px 32px rgba(0,0,0,0.4)`,
        zIndex: 100,
        maxWidth: "480px",
        margin: "0 auto",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px 4px",
            transition: "all 0.2s",
          }}
        >
          <span style={{ fontSize: "22px", lineHeight: 1 }}>{tab.icon}</span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: active === tab.id ? 700 : 500,
              color: active === tab.id ? C.purple : C.textDim,
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </span>
          {active === tab.id && (
            <div
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: C.purple,
                marginTop: "1px",
              }}
            />
          )}
        </button>
      ))}
    </nav>
  );
}

// ============================================================
// 🚀 MAIN APP
// ============================================================

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const [appState, setAppState] = useState("auth"); // auth | onboard | app
  const [screen, setScreen] = useState("home");
  const [activeCommunity, setActiveCommunity] = useState(null);
  const [showEditInterests, setShowEditInterests] = useState(false);

  // Real data hooks
  const {
    profile,
    loading: profileLoading,
    createProfile,
    updateProfile,
  } = useProfile(user?.id);
  const { communities, joinCommunity, leaveCommunity } = useCommunities(
    user?.id
  );
  const { events, rsvpEvent, unrsvpEvent } = useEvents(user?.id);
  const { connections, connect, disconnect, isConnected } = useConnections(
    user?.id
  );

  // Determine app state based on auth + profile
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setAppState("auth");
    } else if (user && !profileLoading && !profile) {
      setAppState("onboard");
    } else if (user && profile) {
      setAppState("app");
    }
  }, [user, profile, authLoading, profileLoading]);

  const handleAuthComplete = (nextState, authUser) => {
    setAppState(nextState);
  };

  const handleOnboardingComplete = async (userData) => {
    const { error } = await createProfile({
      name: userData.name,
      heritage: userData.heritage,
      area: userData.area,
      tags: userData.tags,
      bio: `${userData.heritage} · ${userData.area}`,
    });

    if (!error) {
      setAppState("app"); // ✅ THIS WAS MISSING OR NEVER REACHED
    } else {
      console.error("Profile creation failed", error);
    }
  };

  const handleJoinCommunity = async (communityId) => {
    const community = communities.find((c) => c.id === communityId);
    if (community?.joined) {
      await leaveCommunity(communityId);
    } else {
      await joinCommunity(communityId);
    }
  };

  const handleToggleGoing = async (eventId) => {
    const event = events.find((e) => e.id === eventId);
    if (event?.going) {
      await unrsvpEvent(eventId);
    } else {
      await rsvpEvent(eventId);
    }
  };

  const handleSaveInterests = async (newTags) => {
    await updateProfile({ tags: newTags });
    setShowEditInterests(false);
  };

  const handleViewCommunity = (community) => {
    const fresh = communities.find((c) => c.id === community.id);
    setActiveCommunity(fresh || community);
    setScreen("communityDetail");
  };

  // Keep activeCommunity in sync
  useEffect(() => {
    if (activeCommunity) {
      const updated = communities.find((c) => c.id === activeCommunity.id);
      if (updated) setActiveCommunity(updated);
    }
  }, [communities]);

  // Loading screen
  if (authLoading || (user && profileLoading)) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ fontSize: "48px" }}>🌏</div>
        <div style={{ color: C.textMuted, fontSize: "14px" }}>
          Loading AsianConnect...
        </div>
        <div
          style={{
            width: "40px",
            height: "4px",
            background: C.surface2,
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "60%",
              background: `linear-gradient(90deg, ${C.purple}, ${C.pink})`,
              borderRadius: "2px",
              animation: "pulse 1s infinite",
            }}
          />
        </div>
      </div>
    );
  }

  // Auth screen
  if (appState === "auth") {
    return <AuthScreen onComplete={handleAuthComplete} />;
  }

  // Onboarding screen
  if (appState === "onboard") {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // Build currentUser from real profile
  const currentUser = {
    id: user?.id,
    name: profile?.name || "User",
    heritage: profile?.heritage || "",
    area: profile?.area || "",
    tags: profile?.tags || [],
    bio: profile?.bio || "",
  };

  // Main app
  return (
    <div
      style={{
        maxWidth: "480px",
        margin: "0 auto",
        minHeight: "100vh",
        background: C.bg,
        position: "relative",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: C.text,
      }}
    >
      {screen === "home" && (
        <HomeScreen
          currentUser={currentUser}
          communities={communities}
          events={events}
          onViewCommunity={handleViewCommunity}
          onViewProfile={() => {}}
        />
      )}
      {screen === "discover" && (
        <DiscoverScreen
          currentUser={currentUser}
          communities={communities}
          connections={{ connect, disconnect, isConnected }}
        />
      )}
      {screen === "communities" && (
        <CommunitiesScreen
          currentUser={currentUser}
          communities={communities}
          onViewCommunity={handleViewCommunity}
          onJoinCommunity={handleJoinCommunity}
        />
      )}
      {screen === "events" && (
        <EventsScreen
          currentUser={currentUser}
          events={events}
          onToggleGoing={handleToggleGoing}
        />
      )}
      {screen === "profile" && (
        <ProfileScreen
          currentUser={currentUser}
          communities={communities}
          events={events}
          onEditInterests={() => setShowEditInterests(true)}
          onSignOut={async () => {
            await supabase.auth.signOut();
            setAppState("auth");
          }}
        />
      )}
      {screen === "communityDetail" && activeCommunity && (
        <CommunityDetailScreen
          community={activeCommunity}
          currentUser={currentUser}
          events={events}
          onBack={() => setScreen("communities")}
          onJoin={handleJoinCommunity}
        />
      )}

      {/* Bottom Navigation */}
      {screen !== "communityDetail" && (
        <BottomNav
          active={screen}
          onChange={setScreen}
          joinedCount={communities.filter((c) => c.joined).length}
        />
      )}

      {/* Edit Interests Modal */}
      {showEditInterests && (
        <EditInterestsModal
          currentUser={currentUser}
          onSave={handleSaveInterests}
          onClose={() => setShowEditInterests(false)}
        />
      )}
    </div>
  );
}

// END GENAI
