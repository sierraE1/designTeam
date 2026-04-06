import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import userIcon from "../assets/userIcon.png";

const MOODS = [
  { emoji: "😄", label: "Great" },
  { emoji: "🙂", label: "Good" },
  { emoji: "😐", label: "Okay" },
  { emoji: "😟", label: "Bad" },
  { emoji: "😠", label: "Awful" },
];

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

const SAMPLE_DATA = [3, 2, 1, 0, 2, 4, 3];

function ProfileBubble() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/profile")}
      style={{
        width: 50,
        height: 50,
        borderRadius: "50%",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        cursor: "pointer",
      }}
    >
      <img
        src={userIcon}
        alt="profile"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "50%",
        }}
      />
    </div>
  );
}
export default function MoodTracker() {
  const date = new Date().toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });

  const [selectedMood, setSelectedMood] = useState(null);
  const [weekData, setWeekData] = useState(SAMPLE_DATA);

  const handleMoodSelect = (index) => {
    setSelectedMood(index);
    const today = new Date().getDay();
    const dayIndex = today === 0 ? 6 : today - 1;
    const updated = [...weekData];
    updated[dayIndex] = index;
    setWeekData(updated);
  };

  const styles = {
    page: {
      minHeight: "100vh",
      width: "100%",
      background: "linear-gradient(135deg, #ffe770 0%, #ffc337 40%, #ff8f3a 100%)",
      fontFamily: "'Nunito', sans-serif",
      padding: "28px 24px",
      display: "flex",
      flexDirection: "column",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 28,
      maxWidth: 980,
      width: "100%",
      margin: "0 auto 28px",
    },
    tabs: {
      maxWidth: 1000,
      width: "100%",
      margin: "0 auto 18px",
      display: "flex",
      flexWrap: "wrap",
      gap: 10,
    },
    tab: {
      textDecoration: "none",
      color: "#fff",
      background: "rgba(255, 255, 255, 0.22)",
      border: "1px solid rgba(255, 255, 255, 0.38)",
      borderRadius: 999,
      padding: "8px 16px",
      fontWeight: 800,
      fontSize: 13,
      letterSpacing: 0.2,
      transition: "all 0.2s ease",
    },
    activeTab: {
      background: "linear-gradient(135deg, #ff72a1, #ff9a4c)",
      boxShadow: "0 4px 12px rgba(255, 80, 0, 0.35)",
      borderColor: "rgba(255, 255, 255, 0.7)",
    },
    card: {
      background: "hsla(313, 60%, 92%, 0.25)",
      borderRadius: 22,
      padding: "22px",
      boxShadow: "0 4px 24px rgba(255, 100, 0, 0.2)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.4)",
    },
    moodBtn: (selected) => ({
      background: selected
        ? "linear-gradient(135deg, #ff72a1, #ff9a4c)"
        : "rgba(255,255,255,0.3)",
      border: selected
        ? "2px solid rgba(255,255,255,0.8)"
        : "2px solid transparent",
      borderRadius: 16,
      padding: "14px 10px",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
      flex: 1,
      transition: "all 0.2s",
      transform: selected ? "scale(1.08)" : "scale(1)",
      boxShadow: selected ? "0 6px 18px rgba(255, 60, 0, 0.4)" : "none",
    }),
    moodEmoji: {
      fontSize: 32,
    },
    moodLabel: {
      fontSize: 11,
      fontWeight: 800,
      color: "#fff",
    },
    barContainer: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 8,
      height: 160,
      padding: "0 4px",
    },
    barWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      flex: 1,
      height: "100%",
      justifyContent: "flex-end",
      gap: 6,
    },
    dayLabel: {
      fontSize: 12,
      fontWeight: 800,
      color: "rgba(255,255,255,0.9)",
    },
  };

  const getMoodColor = (moodIndex) => {
    const colors = ["#ff72a1", "#ff8fbf", "#ffc337", "#ff9a4c", "#ff6030"];
    return colors[moodIndex] ?? "rgba(255,255,255,0.3)";
  };

  const getBarHeight = (moodIndex) => {
    const heights = [140, 110, 80, 50, 30];
    return heights[moodIndex] ?? 20;
  };

  return (
    <div style={styles.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');*{box-sizing:border-box}`}</style>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M10 1l2.5 6H19l-5.2 3.8 2 6.2L10 13l-5.8 4 2-6.2L1 7h6.5z" fill="#fff" />
            </svg>
            <span style={{ fontWeight: 900, fontSize: 18, color: "#fff" }}>Dopaminder</span>
          </div>
          <h1 style={{ fontWeight: 900, fontSize: 32, color: "#fff", lineHeight: 1.1 }}>
            Mood Tracker
          </h1>
          <p style={{ color: "#ffffff", fontSize: 14, marginTop: 4 }}>{date}</p>
        </div>
        <ProfileBubble />
      </div>

      {/* Nav Tabs */}
      <nav style={styles.tabs}>
        <NavLink to="/home" style={({ isActive }) => ({ ...styles.tab, ...(isActive ? styles.activeTab : {}) })}>Home</NavLink>
        <NavLink to="/tasks" style={({ isActive }) => ({ ...styles.tab, ...(isActive ? styles.activeTab : {}) })}>Tasks Manager</NavLink>
        <NavLink to="/mood" style={({ isActive }) => ({ ...styles.tab, ...(isActive ? styles.activeTab : {}) })}>Mood</NavLink>
      </nav>

      {/* Main Content */}
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        {/* How are you feeling? */}
        <div style={styles.card}>
          <span
            style={{
              fontWeight: 800,
              fontSize: 16,
              color: "#fff",
              background: "rgba(255, 0, 0, 0.43)",
              padding: "4px 12px",
              borderRadius: 20,
              backdropFilter: "blur(4px)",
              display: "inline-block",
              marginBottom: 20,
            }}
          >
            How are you feeling?
          </span>

          {selectedMood !== null && (
            <p style={{ color: "#fff", fontWeight: 800, fontSize: 15, marginBottom: 16 }}>
              You selected: {MOODS[selectedMood].emoji} {MOODS[selectedMood].label}
            </p>
          )}

          <div style={{ display: "flex", gap: 8 }}>
            {MOODS.map((mood, i) => (
              <button
                key={i}
                style={styles.moodBtn(selectedMood === i)}
                onClick={() => handleMoodSelect(i)}
              >
                <span style={styles.moodEmoji}>{mood.emoji}</span>
                <span style={styles.moodLabel}>{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Weekly Chart */}
        <div style={styles.card}>
          <span
            style={{
              fontWeight: 800,
              fontSize: 16,
              color: "#fff",
              background: "rgba(255, 0, 0, 0.43)",
              padding: "4px 12px",
              borderRadius: 20,
              backdropFilter: "blur(4px)",
              display: "inline-block",
              marginBottom: 20,
            }}
          >
            Weekly Average
          </span>

          <div style={styles.barContainer}>
            {DAYS.map((day, i) => (
              <div key={i} style={styles.barWrapper}>
                <div
                  style={{
                    width: "100%",
                    height: getBarHeight(weekData[i]),
                    background: getMoodColor(weekData[i]),
                    borderRadius: "8px 8px 0 0",
                    transition: "height 0.4s ease",
                    boxShadow: "0 4px 12px rgba(255, 60, 0, 0.3)",
                  }}
                />
                <span style={styles.dayLabel}>{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mood History */}
        <div style={{ ...styles.card, gridColumn: "1 / -1" }}>
          <span
            style={{
              fontWeight: 800,
              fontSize: 16,
              color: "#fff",
              background: "rgba(255, 0, 0, 0.43)",
              padding: "4px 12px",
              borderRadius: 20,
              backdropFilter: "blur(4px)",
              display: "inline-block",
              marginBottom: 16,
            }}
          >
            This Week
          </span>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {DAYS.map((day, i) => (
              <div
                key={i}
                style={{
                  background: "linear-gradient(135deg, #ff72a1, #ff9a4c)",
                  borderRadius: 14,
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flex: "1 1 100px",
                  boxShadow: "0 4px 14px rgba(255, 60, 0, 0.3)",
                }}
              >
                <span style={{ fontWeight: 800, color: "#fff", fontSize: 13 }}>{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</span>
                <span style={{ fontSize: 22 }}>{MOODS[weekData[i]]?.emoji ?? "—"}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>
                  {MOODS[weekData[i]]?.label ?? "No data"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}