import { useState, useEffect, useRef } from "react";

const MODES = { "Short Break": 5 * 60, Focus: 25 * 60, "Long Break": 15 * 60 };

const MOODS = ["😄", "🙂", "😐", "😟", "😠"];

const TASKS = [
  { id: 1, title: "Math Chapter 5", due: "Due Today 11:59 PM", starred: true, done: true },
  { id: 2, title: "Math Chapter 5", due: "Due Tomorrow 11:59 PM", starred: false, done: false },
];

const NOTES = [
  { id: 1, title: "Office Hours", body: "Attend office hours @ little hall" },
  { id: 2, title: "Lunch", body: "Lunch with Alanna" },
];

function TimerRing({ pct }) {
  const R = 80, C = 2 * Math.PI * R;
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: "rotate(-90deg)", position: "absolute", top: 0, left: 0 }}>
      <defs>
        <linearGradient id="tg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff2290" />
          <stop offset="100%" stopColor="#faa404" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r={R} fill="none" stroke="#ffd4d4" strokeWidth="14" />
      <circle
        cx="100" cy="100" r={R} fill="none" stroke="url(#tg)" strokeWidth="14"
        strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct)}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

export default function Dopaminder() {
  const date = new Date().toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isHidden: document.hidden,
  });

  // Timer
  const [mode, setMode] = useState("Focus");
  const [secs, setSecs] = useState(MODES.Focus);
  const [running, setRunning] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const onResize = () => {
      setViewport((prev) => ({ ...prev, width: window.innerWidth, height: window.innerHeight }));
    };

    const onVisibilityChange = () => {
      setViewport((prev) => ({ ...prev, isHidden: document.hidden }));
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSecs(s => { if (s <= 1) { setRunning(false); return 0; } return s - 1; }), 1000);
    } else clearInterval(ref.current);
    return () => clearInterval(ref.current);
  }, [running]);

  // Pause timer when the tab/window is hidden (e.g., minimized or switched away).
  useEffect(() => {
    if (viewport.isHidden && running) {
      setRunning(false);
    }
  }, [viewport.isHidden, running]);

  const switchMode = m => { setMode(m); setSecs(MODES[m]); setRunning(false); };
  const m = String(Math.floor(secs / 60)).padStart(2, "0"), s = String(secs % 60).padStart(2, "0");

  // Tasks & Notes
  const [tasks, setTasks] = useState(TASKS);
  const [notes] = useState(NOTES);
  const [mood, setMood] = useState(null);
  const done = tasks.filter(t => t.done).length;
  const isTablet = viewport.width < 1050;
  const isMobile = viewport.width < 760;

  const styles = {
    page: { minHeight: "100vh", width: "100%", background: "linear-gradient(135deg, #ffe770 0%, #ffc337 40%, #ff8f3a 100%)", fontFamily: "'Nunito', sans-serif", padding: isMobile ? "16px 12px" : "28px 24px", display: "flex", flexDirection: "column" },
    header: { display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? 12 : 0, marginBottom: 28, maxWidth: 980, width: "100%", margin: "0 auto 28px" },
    card: { background: "hsla(313, 60%, 92%, 0.25)", borderRadius: 22, padding: "22px", boxShadow: "0 4px 24px rgba(255, 100, 0, 0.2)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.4)" },
    taskCard: (done) => ({ background: "linear-gradient(135deg, #ff72a1, #ff9a4c)", borderRadius: 14, padding: "14px 16px", marginBottom: 12, opacity: done ? 0.7 : 1, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 14px rgba(255, 60, 0, 0.3)" }),
    noteCard: { background: "linear-gradient(135deg, #FF6090, #FFA030)", borderRadius: 14, padding: "12px 16px", marginBottom: 12, boxShadow: "0 4px 14px rgba(255, 100, 30, 0.25)" },
    pill: (active) => ({ border: "none", borderRadius: 50, padding: "8px 18px", fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", background: active ? "linear-gradient(135deg, #FF4081, #FF6D00)" : "rgba(240, 78, 78, 0.35)", color: active ? "#fff" : "#fff", boxShadow: active ? "0 4px 12px rgba(255, 60, 0, 0.4)" : "none", transition: "all 0.2s" }),
    iconBtn: { background: "none", border: "none", cursor: "pointer", fontSize: 22, padding: "0 2px", color: "#ff153c", transition: "transform 0.15s" },
    startBtn: { background: "linear-gradient(135deg, #ff72a1, #ff9a4c)", border: "none", borderRadius: 50, padding: "12px 32px", color: "#ffffff", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px rgba(255, 60, 0, 0.45)", transition: "transform 0.15s" },
    resetBtn: { background: "rgba(255, 255, 255, 0.3)", border: "none", borderRadius: 50, padding: "10px 14px", cursor: "pointer", fontSize: 16, transition: "transform 0.15s" },
    moodBtn: { background: "none", border: "none", cursor: "pointer", fontSize: 30, transition: "transform 0.2s" },
  };
  return (
    <div style={styles.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');*{box-sizing:border-box}`}</style>

      {(viewport.isHidden || isMobile) && (
        <div style={{ maxWidth: 1000, width: "100%", margin: "0 auto 14px", background: "rgba(0,0,0,0.25)", color: "#fff", borderRadius: 10, padding: "8px 12px", fontWeight: 700, fontSize: 13 }}>
          {viewport.isHidden
            ? "Window/tab is hidden. Timer auto-paused to keep progress accurate."
            : `Compact view enabled (${viewport.width}x${viewport.height}).`}
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 1l2.5 6H19l-5.2 3.8 2 6.2L10 13l-5.8 4 2-6.2L1 7h6.5z" fill="#fff" /></svg>
            <span style={{ fontWeight: 900, fontSize: 18, color: "#fff" }}>Dopaminder</span>
          </div>
          <h1 style={{ fontWeight: 900, fontSize: isMobile ? 24 : 32, color: "#fff", lineHeight: 1.1 }}>Your Dashboard</h1>
          <p style={{ color: "#ffffff", fontSize: 14, marginTop: 4 }}>{date}</p>
        </div>
        <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#FFD05C", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }} />
      </div>

      {/* Main Grid */}
      <div style={{ maxWidth: 1000, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: isMobile ? "1fr" : (isTablet ? "1fr 1fr" : "1fr 1fr 1fr"), gridTemplateRows: "auto auto", gap: 20 }}>

        {/* Homework */}
        <div style={{ ...styles.card, gridRow: isMobile ? "auto" : "1/3" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontWeight: 800, fontSize: 16, color: "#fff", background: "rgba(255, 0, 0, 0.43)", padding: "4px 12px", borderRadius: 20, backdropFilter: "blur(4px)" }}>Homework</span>
            <div style={{ display: "flex", gap: 6 }}>
            </div>
          </div>
          {tasks.map(t => (
            <div key={t.id} style={styles.taskCard(t.done)}>
              <div>
                <p style={{ fontWeight: 800, fontSize: 14, color: "#fff", textDecoration: t.done ? "line-through" : "none" }}>{t.title}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>{t.due}</p>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <button style={styles.iconBtn} onClick={() => setTasks(ts => ts.map(x => x.id === t.id ? { ...x, done: !x.done } : x))}>{t.done ? "✅" : "⭕"}</button>
                <button style={styles.iconBtn} onClick={() => setTasks(ts => ts.map(x => x.id === t.id ? { ...x, starred: !x.starred } : x))}>{t.starred ? "⭐" : "☆"}</button>
              </div>
            </div>
          ))}
        </div>

        {/* Timer */}
        <div style={{ ...styles.card, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", gap: 10 }}>
            {Object.keys(MODES).map(m => (
              <button key={m} style={styles.pill(mode === m)} onClick={() => switchMode(m)}>{m}</button>
            ))}
          </div>
          <div style={{ position: "relative", width: 200, height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TimerRing pct={secs / MODES[mode]} />
            <div style={{ position: "absolute", background: "#ff9f9f", width: 135, height: 135, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontWeight: 900, fontSize: 28, color: "#ff008c", letterSpacing: 2 }}>{m}:{s}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button style={styles.startBtn} onClick={() => setRunning(r => !r)}>{running ? "Pause" : "Start"}</button>
          </div>
        </div>

        {/* Quick Notes */}
        <div style={{ ...styles.card, background: "#fcbe62" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontWeight: 800, fontSize: 16, color: "#fff", background: "rgba(255, 0, 0, 0.43)", padding: "4px 12px", borderRadius: 20, backdropFilter: "blur(4px)" }}>Quick Notes</span>
            <button style={styles.iconBtn}>＋</button>
          </div>
          {notes.map(n => (
            <div key={n.id} style={styles.noteCard}>
              <p style={{ fontWeight: 800, fontSize: 13, color: "#fff" }}>{n.title}</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>{n.body}</p>
            </div>
          ))}
        </div>

        {/* Mood */}
        <div style={{ ...styles.card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontWeight: 800, fontSize: 16, color: "#fff", marginBottom: 12 }}>How are you feeling?</p>
          <div style={{ display: "flex", justifyContent: "space-around", width: "100%" }}>
            {MOODS.map((mo, i) => <button key={i} style={styles.moodBtn} onClick={() => setMood(i)}>{mo}</button>)}
          </div>
        </div>
          {/* Break Reward */}
        <div style={{ ...styles.card, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <p style={{ fontWeight: 800, fontSize: 16, color: "#fff", textShadow: "0 2px 8px rgba(255, 0, 0, 0.2)", marginBottom: 10 }}>
              Break Reward {done >= tasks.length ? "🔓" : "🔒"}
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.9)" }}>
              {done >= tasks.length
                ? "Enjoy your break!"
                : <><strong style={{ color: "#fff" }}>{tasks.length - done} task{tasks.length - done !== 1 ? "s" : ""}</strong> left to unlock</>}
            </p>
          </div>
          <span style={{ fontSize: 48, filter: done >= tasks.length ? "none" : "grayscale(1) opacity(0.5)", transition: "filter 0.4s" }}>🎮</span>
        </div>
      </div>
    </div>
  );
}