import { useState, useEffect, useCallback } from "react";
import { Link, NavLink } from "react-router-dom";

async function errorMessageFromResponse(response) {
  try {
    const data = await response.json();
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail)) {
      return data.detail.map((d) => d.msg || JSON.stringify(d)).join(" ");
    }
    if (data.message) return data.message;
  } catch {
    /* ignore */
  }
  return response.statusText || "Something went wrong.";
}

export default function ManageTasks() {
  const [viewport, setViewport] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1000,
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const onResize = () => setViewport({ width: window.innerWidth });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const isMobile = viewport.width < 760;
  const isTablet = viewport.width < 1050;
  const date = new Date().toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setListError(null);
      const response = await fetch("/tasks/");
      if (!response.ok) {
        throw new Error(await errorMessageFromResponse(response));
      }
      const data = await response.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setListError(err.message || "Could not load tasks. Is the API and database running?");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createTask = async (e) => {
    e.preventDefault();
    if (!title.trim() || creating) return;
    setCreating(true);
    setFormError(null);
    try {
      const response = await fetch("/tasks/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
        }),
      });
      if (!response.ok) {
        throw new Error(await errorMessageFromResponse(response));
      }
      setTitle("");
      setDescription("");
      setToast("Task added");
      await load();
    } catch (err) {
      setFormError(err.message || "Could not create task.");
    } finally {
      setCreating(false);
    }
  };

  const deleteTask = async (taskId, taskTitle) => {
    if (!window.confirm(`Delete “${taskTitle || "this task"}”?`)) return;
    setDeletingId(taskId);
    setListError(null);
    try {
      const response = await fetch(`/tasks/${taskId}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error(await errorMessageFromResponse(response));
      }
      setToast("Task deleted");
      await load();
    } catch (err) {
      setListError(err.message || "Could not delete task.");
    } finally {
      setDeletingId(null);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      width: "100%",
      background: "linear-gradient(135deg, #ffe770 0%, #ffc337 40%, #ff8f3a 100%)",
      fontFamily: "'Nunito', sans-serif",
      padding: isMobile ? "16px 12px 32px" : "28px 24px 40px",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
    },
    header: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      alignItems: isMobile ? "flex-start" : "center",
      gap: isMobile ? 12 : 0,
      marginBottom: 24,
      maxWidth: 1000,
      width: "100%",
      margin: "0 auto 24px",
    },
    tabs: {
      maxWidth: 1000,
      width: "100%",
      margin: "0 auto 20px",
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
    glassCard: {
      background: "hsla(313, 60%, 92%, 0.25)",
      borderRadius: 22,
      padding: "22px",
      boxShadow: "0 4px 24px rgba(255, 100, 0, 0.2)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.4)",
    },
    sectionLabel: {
      fontWeight: 800,
      fontSize: 16,
      color: "#fff",
      background: "rgba(255, 0, 0, 0.43)",
      padding: "4px 12px",
      borderRadius: 20,
      backdropFilter: "blur(4px)",
      display: "inline-block",
      marginBottom: 16,
    },
    grid: {
      maxWidth: 1000,
      margin: "0 auto",
      width: "100%",
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "1fr 1.15fr",
      gap: 20,
      alignItems: "start",
    },
    fieldLabel: {
      fontSize: 11,
      fontWeight: 800,
      color: "rgba(255,255,255,0.95)",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      marginBottom: 6,
      display: "block",
    },
    input: {
      width: "100%",
      boxSizing: "border-box",
      border: "1px solid rgba(255,255,255,0.45)",
      borderRadius: 12,
      padding: "12px 14px",
      fontSize: 15,
      fontFamily: "'Nunito', sans-serif",
      fontWeight: 600,
      outline: "none",
      background: "rgba(255,255,255,0.88)",
      color: "#1a1a1a",
    },
    textarea: {
      width: "100%",
      boxSizing: "border-box",
      border: "1px solid rgba(255,255,255,0.45)",
      borderRadius: 12,
      padding: "12px 14px",
      fontSize: 14,
      fontFamily: "'Nunito', sans-serif",
      outline: "none",
      minHeight: 96,
      resize: "vertical",
      background: "rgba(255,255,255,0.88)",
      color: "#1a1a1a",
    },
    primaryBtn: {
      marginTop: 10,
      background: "linear-gradient(135deg, #ff72a1, #ff9a4c)",
      border: "none",
      borderRadius: 50,
      padding: "12px 24px",
      color: "#fff",
      fontFamily: "'Nunito', sans-serif",
      fontWeight: 800,
      fontSize: 15,
      cursor: "pointer",
      boxShadow: "0 6px 20px rgba(255, 60, 0, 0.45)",
      opacity: 1,
    },
    primaryBtnDisabled: {
      opacity: 0.55,
      cursor: "not-allowed",
      boxShadow: "none",
    },
    secondaryBtn: {
      background: "rgba(255, 255, 255, 0.35)",
      border: "1px solid rgba(255,255,255,0.5)",
      borderRadius: 50,
      padding: "8px 18px",
      color: "#fff",
      fontWeight: 800,
      fontSize: 13,
      cursor: "pointer",
      fontFamily: "'Nunito', sans-serif",
    },
    taskRow: {
      background: "linear-gradient(135deg, #ff72a1, #ff9a4c)",
      borderRadius: 14,
      padding: "14px 16px",
      marginBottom: 12,
      display: "flex",
      alignItems: "stretch",
      gap: 12,
      boxShadow: "0 4px 14px rgba(255, 60, 0, 0.3)",
    },
    taskMain: {
      flex: 1,
      minWidth: 0,
      textDecoration: "none",
      color: "inherit",
      display: "block",
    },
    taskTitle: {
      fontWeight: 800,
      fontSize: 15,
      color: "#fff",
      margin: 0,
    },
    taskDesc: {
      fontSize: 12,
      color: "rgba(255,255,255,0.9)",
      margin: "6px 0 0",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      lineHeight: 1.35,
    },
    taskMeta: {
      fontSize: 11,
      fontWeight: 700,
      color: "rgba(255,255,255,0.75)",
      marginTop: 8,
      letterSpacing: 0.02,
    },
    iconBtn: {
      background: "rgba(255,255,255,0.2)",
      border: "none",
      borderRadius: 10,
      cursor: "pointer",
      fontSize: 18,
      padding: "6px 10px",
      color: "#fff",
      alignSelf: "center",
      flexShrink: 0,
      transition: "background 0.15s",
    },
    iconBtnDisabled: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
    errorBox: {
      background: "rgba(180, 0, 40, 0.25)",
      border: "1px solid rgba(255,255,255,0.4)",
      borderRadius: 12,
      padding: "12px 14px",
      color: "#fff",
      fontSize: 13,
      fontWeight: 700,
      marginBottom: 14,
    },
    formError: {
      color: "#fff",
      fontSize: 13,
      fontWeight: 700,
      marginTop: 8,
      textShadow: "0 1px 2px rgba(0,0,0,0.2)",
    },
    empty: {
      color: "rgba(255,255,255,0.95)",
      fontSize: 14,
      fontWeight: 700,
      margin: 0,
    },
    toast: {
      position: "fixed",
      bottom: 24,
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(0,0,0,0.82)",
      color: "#fff",
      padding: "12px 22px",
      borderRadius: 999,
      fontWeight: 800,
      fontSize: 14,
      zIndex: 9999,
      boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
    },
    listHeaderRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 4,
    },
  };

  return (
    <div style={styles.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');*{box-sizing:border-box}`}</style>

      {toast && <div style={styles.toast}>{toast}</div>}

      <div style={styles.header}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
              <path d="M10 1l2.5 6H19l-5.2 3.8 2 6.2L10 13l-5.8 4 2-6.2L1 7h6.5z" fill="#fff" />
            </svg>
            <span style={{ fontWeight: 900, fontSize: 18, color: "#fff" }}>Dopaminder</span>
          </div>
          <h1 style={{ fontWeight: 900, fontSize: isMobile ? 26 : 32, color: "#fff", lineHeight: 1.1, margin: 0 }}>
            Tasks manager
          </h1>
          <p style={{ color: "#ffffff", fontSize: 14, marginTop: 6, marginBottom: 0 }}>{date}</p>
        </div>
        <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#FFD05C", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }} />
      </div>

      <nav style={styles.tabs} aria-label="Main navigation">
        <NavLink to="/home" style={({ isActive }) => ({ ...styles.tab, ...(isActive ? styles.activeTab : {}) })}>
          Home
        </NavLink>
        <NavLink to="/tasks" style={({ isActive }) => ({ ...styles.tab, ...(isActive ? styles.activeTab : {}) })}>
          Tasks Manager
        </NavLink>
        <NavLink to="/mood" style={({ isActive }) => ({ ...styles.tab, ...(isActive ? styles.activeTab : {}) })}>
          Mood
        </NavLink>
        <NavLink to="/login" style={({ isActive }) => ({ ...styles.tab, ...(isActive ? styles.activeTab : {}) })}>
          Login
        </NavLink>
      </nav>

      <div style={styles.grid}>
        <section style={styles.glassCard}>
          <span style={styles.sectionLabel}>New task</span>
          <form onSubmit={createTask}>
            <label style={styles.fieldLabel} htmlFor="task-title">
              Title
            </label>
            <input
              id="task-title"
              style={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you need to do?"
              autoComplete="off"
            />
            <label style={{ ...styles.fieldLabel, marginTop: 14 }} htmlFor="task-desc">
              Description
            </label>
            <textarea
              id="task-desc"
              style={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional notes…"
            />
            {formError && <p style={styles.formError}>{formError}</p>}
            <button
              type="submit"
              style={{
                ...styles.primaryBtn,
                ...(creating || !title.trim() ? styles.primaryBtnDisabled : {}),
              }}
              disabled={creating || !title.trim()}
            >
              {creating ? "Adding…" : "Add task"}
            </button>
          </form>
        </section>

        <section style={styles.glassCard}>
          <div style={styles.listHeaderRow}>
            <span style={styles.sectionLabel}>Your tasks</span>
            <button type="button" style={styles.secondaryBtn} onClick={load} disabled={loading}>
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>

          {listError && (
            <div style={styles.errorBox}>
              <p style={{ margin: "0 0 10px" }}>{listError}</p>
              <button type="button" style={{ ...styles.secondaryBtn, marginTop: 4 }} onClick={load}>
                Try again
              </button>
            </div>
          )}

          {loading && !listError ? (
            <p style={styles.empty}>Loading tasks…</p>
          ) : !loading && tasks.length === 0 && !listError ? (
            <p style={styles.empty}>
              No tasks yet. Add one in the card {isMobile ? "above" : "to the left"}.
            </p>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {tasks.map((t) => (
                <li key={t.id} style={styles.taskRow}>
                  <Link to={`/tasks/${t.id}`} style={styles.taskMain}>
                    <p style={styles.taskTitle}>{t.title || "Untitled"}</p>
                    {t.description ? (
                      <p style={styles.taskDesc}>{t.description}</p>
                    ) : (
                      <p style={{ ...styles.taskDesc, opacity: 0.85 }}>Tap to add notes & subtasks →</p>
                    )}
                    <p style={styles.taskMeta}>Open details</p>
                  </Link>
                  <button
                    type="button"
                    style={{
                      ...styles.iconBtn,
                      ...(deletingId === t.id ? styles.iconBtnDisabled : {}),
                    }}
                    title="Delete task"
                    aria-label={`Delete ${t.title || "task"}`}
                    disabled={deletingId === t.id}
                    onClick={(e) => {
                      e.preventDefault();
                      deleteTask(t.id, t.title);
                    }}
                  >
                    {deletingId === t.id ? "…" : "🗑"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
