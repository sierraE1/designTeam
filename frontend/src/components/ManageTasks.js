import { useState, useCallback } from "react";

const PRIORITIES = ["Low", "Medium", "High"];

const initialTask = {
  name: "Read Chapter 7 — Organic Chemistry",
  notes: "Review reaction mechanisms before class tomorrow.",
  priority: "Medium",
  pomodorosDone: 2,
  totalPomodoros: 4,
};

const initialSubtasks = [
  { id: 1, text: "Read pages 120–140", done: true },
  { id: 2, text: "Take margin notes", done: false },
  { id: 3, text: "Review end-of-chapter questions", done: false },
];

export default function TaskDetails() {
  const [activeTab, setActiveTab] = useState("task");
  const [task, setTask] = useState(initialTask);
  const [subtasks, setSubtasks] = useState(initialSubtasks);
  const [newSubtask, setNewSubtask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState(null);

  const toggleSubtask = (id) =>
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s))
    );

  const deleteSubtask = (id) =>
    setSubtasks((prev) => prev.filter((s) => s.id !== id));

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      { id: Date.now(), text: newSubtask.trim(), done: false },
    ]);
    setNewSubtask("");
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = (id) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, text: editingText } : s))
    );
    setEditingId(null);
  };

  const generateSubtasks = useCallback(async () => {
    if (!task.name.trim()) return;
    setIsGenerating(true);
    setAiError(null);

    try {
      const response = await fetch("/api/ai/generate_subtasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_name: task.name, task_notes: task.notes }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Failed to generate subtasks");
      }

      if (Array.isArray(data.subtasks)) {
        const generated = data.subtasks.map((text, i) => ({
          id: Date.now() + i,
          text,
          done: false,
        }));
        setSubtasks(generated);
      } else {
        throw new Error("Unexpected response format from server.");
      }
    } catch (err) {
      setAiError(err.message || "Couldn't generate subtasks. Try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [task.name, task.notes]);

  const pomodoros = Array.from({ length: task.totalPomodoros }, (_, i) => i < task.pomodorosDone);

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.headerTitle}>Task details</span>
          <button style={styles.closeBtn}>✕</button>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {["task", "subtasks"].map((tab) => (
            <button
              key={tab}
              style={{
                ...styles.tab,
                ...(activeTab === tab ? styles.activeTab : {}),
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab: Task */}
        {activeTab === "task" && (
          <div style={styles.body}>
            <label style={styles.label}>TASK NAME</label>
            <input
              style={styles.input}
              value={task.name}
              onChange={(e) => setTask({ ...task, name: e.target.value })}
            />

            <label style={styles.label}>NOTES</label>
            <textarea
              style={styles.textarea}
              value={task.notes}
              onChange={(e) => setTask({ ...task, notes: e.target.value })}
            />

            <label style={styles.label}>PRIORITY</label>
            <select
              style={styles.select}
              value={task.priority}
              onChange={(e) => setTask({ ...task, priority: e.target.value })}
            >
              {PRIORITIES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>

            <label style={styles.label}>POMODOROS DONE</label>
            <div style={styles.pomodoros}>
              {pomodoros.map((done, i) => (
                <div
                  key={i}
                  style={{ ...styles.pomodoro, ...(done ? styles.pomodoroDone : {}) }}
                  onClick={() =>
                    setTask((t) => ({ ...t, pomodorosDone: i < t.pomodorosDone ? i : i + 1 }))
                  }
                >
                  {done && <span style={styles.pomodoroCheck}>✓</span>}
                </div>
              ))}
            </div>

            <div style={styles.actions}>
              <button style={styles.saveBtn}>Save</button>
              <button style={styles.deleteBtn}>Delete</button>
            </div>
          </div>
        )}

        {/* Tab: Subtasks */}
        {activeTab === "subtasks" && (
          <div style={styles.body}>
            {/* Task context reminder */}
            <div style={styles.taskContext}>
              <span style={styles.taskContextLabel}>Task</span>
              <span style={styles.taskContextName}>{task.name || "Untitled task"}</span>
            </div>

            {/* AI Generate */}
            <div style={styles.aiSection}>
              <div style={styles.aiHeader}>
                <span style={styles.aiLabel}>AI SUGGESTIONS</span>
                <div style={styles.aiSparkle}>✦</div>
              </div>
              <p style={styles.aiDesc}>
                Generate subtasks based on your task name and notes.
              </p>
              <button
                style={{
                  ...styles.generateBtn,
                  ...(isGenerating ? styles.generateBtnDisabled : {}),
                }}
                onClick={generateSubtasks}
                disabled={isGenerating || !task.name.trim()}
              >
                {isGenerating ? (
                  <span style={styles.spinner}>⟳ Generating…</span>
                ) : (
                  "✦ Generate subtasks"
                )}
              </button>
              {aiError && <p style={styles.aiError}>{aiError}</p>}
            </div>

            <div style={styles.divider} />

            {/* Subtask list */}
            <label style={styles.label}>SUBTASKS</label>
            <div style={styles.subtaskList}>
              {subtasks.length === 0 && (
                <p style={styles.emptyMsg}>No subtasks yet. Add one below or generate with AI.</p>
              )}
              {subtasks.map((s) => (
                <div key={s.id} style={styles.subtaskRow}>
                  <input
                    type="checkbox"
                    checked={s.done}
                    onChange={() => toggleSubtask(s.id)}
                    style={styles.checkbox}
                  />
                  {editingId === s.id ? (
                    <input
                      style={styles.editInput}
                      value={editingText}
                      autoFocus
                      onChange={(e) => setEditingText(e.target.value)}
                      onBlur={() => saveEdit(s.id)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(s.id)}
                    />
                  ) : (
                    <span
                      style={{
                        ...styles.subtaskText,
                        ...(s.done ? styles.subtaskDone : {}),
                      }}
                      onDoubleClick={() => startEdit(s.id, s.text)}
                    >
                      {s.text}
                    </span>
                  )}
                  <div style={styles.subtaskActions}>
                    {editingId !== s.id && (
                      <button
                        style={styles.iconBtn}
                        title="Edit"
                        onClick={() => startEdit(s.id, s.text)}
                      >
                        ✎
                      </button>
                    )}
                    <button
                      style={styles.iconBtn}
                      title="Delete"
                      onClick={() => deleteSubtask(s.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add subtask */}
            <div style={styles.addRow}>
              <input
                style={styles.addInput}
                placeholder="+ Add subtask"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSubtask()}
              />
              <button style={styles.addBtn} onClick={addSubtask}>
                Add
              </button>
            </div>

            <div style={styles.actions}>
              <button style={styles.saveBtn}>Save</button>
              <button style={styles.deleteBtn}>Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────── */
const GREEN = "#2e7d5e";
const LIGHT_GREEN = "#e8f5ef";
const BORDER = "#e0e0e0";
const MUTED = "#888";
const BG = "#f7f7f5";

const styles = {
  overlay: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: BG,
    fontFamily: "'Georgia', serif",
    padding: 24,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
    width: 380,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 20px 14px",
    borderBottom: `1px solid ${BORDER}`,
  },
  headerTitle: {
    fontWeight: 700,
    fontSize: 17,
    letterSpacing: "-0.3px",
  },
  closeBtn: {
    background: "none",
    border: `1.5px solid ${BORDER}`,
    borderRadius: 8,
    width: 30,
    height: 30,
    cursor: "pointer",
    fontSize: 13,
    color: MUTED,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tabs: {
    display: "flex",
    borderBottom: `1px solid ${BORDER}`,
    padding: "0 20px",
    gap: 4,
  },
  tab: {
    background: "none",
    border: "none",
    borderBottom: "2.5px solid transparent",
    cursor: "pointer",
    fontSize: 14,
    fontFamily: "inherit",
    color: MUTED,
    padding: "10px 8px 8px",
    marginBottom: -1,
    transition: "all 0.15s",
  },
  activeTab: {
    color: GREEN,
    borderBottom: `2.5px solid ${GREEN}`,
    fontWeight: 600,
  },
  body: {
    padding: "20px 20px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: MUTED,
    fontFamily: "'Arial', sans-serif",
    marginBottom: 2,
  },
  input: {
    border: `1.5px solid ${BORDER}`,
    borderRadius: 8,
    padding: "9px 12px",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    color: "#222",
  },
  textarea: {
    border: `1.5px solid ${BORDER}`,
    borderRadius: 8,
    padding: "9px 12px",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: 72,
    color: "#222",
  },
  select: {
    border: `1.5px solid ${BORDER}`,
    borderRadius: 8,
    padding: "9px 12px",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    background: "#fff",
    cursor: "pointer",
    width: "100%",
    color: "#222",
  },
  pomodoros: {
    display: "flex",
    gap: 6,
  },
  pomodoro: {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: `1.5px solid ${BORDER}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    background: "#fafafa",
    transition: "all 0.15s",
  },
  pomodoroDone: {
    background: LIGHT_GREEN,
    border: `1.5px solid ${GREEN}`,
  },
  pomodoroCheck: {
    color: GREEN,
    fontSize: 14,
    fontWeight: 700,
  },
  actions: {
    display: "flex",
    gap: 10,
    marginTop: 6,
  },
  saveBtn: {
    flex: 1,
    background: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "11px 0",
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "inherit",
    cursor: "pointer",
    letterSpacing: "-0.2px",
  },
  deleteBtn: {
    flex: 1,
    background: "#fff",
    color: "#c0392b",
    border: `1.5px solid #f0c0bb`,
    borderRadius: 10,
    padding: "11px 0",
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "inherit",
    cursor: "pointer",
    letterSpacing: "-0.2px",
  },
  taskContext: {
    background: LIGHT_GREEN,
    borderRadius: 8,
    padding: "8px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    marginBottom: 2,
  },
  taskContextLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: GREEN,
    fontFamily: "'Arial', sans-serif",
    textTransform: "uppercase",
  },
  taskContextName: {
    fontSize: 13,
    color: "#222",
    fontWeight: 500,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  aiSection: {
    background: "#fafaf7",
    border: `1.5px dashed ${BORDER}`,
    borderRadius: 10,
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  aiHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  aiLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "#b8860b",
    fontFamily: "'Arial', sans-serif",
  },
  aiSparkle: {
    color: "#b8860b",
    fontSize: 16,
  },
  aiDesc: {
    fontSize: 12,
    color: MUTED,
    margin: 0,
    fontFamily: "'Arial', sans-serif",
  },
  generateBtn: {
    background: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "9px 14px",
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "inherit",
    cursor: "pointer",
    alignSelf: "flex-start",
    letterSpacing: "-0.1px",
    transition: "opacity 0.15s",
  },
  generateBtnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  spinner: {
    display: "inline-block",
    animation: "spin 1s linear infinite",
  },
  aiError: {
    color: "#c0392b",
    fontSize: 12,
    margin: 0,
    fontFamily: "'Arial', sans-serif",
  },
  divider: {
    height: 1,
    background: BORDER,
    margin: "2px 0",
  },
  subtaskList: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minHeight: 20,
  },
  emptyMsg: {
    fontSize: 13,
    color: MUTED,
    fontStyle: "italic",
    margin: 0,
    fontFamily: "'Arial', sans-serif",
  },
  subtaskRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 4px",
    borderRadius: 6,
    transition: "background 0.1s",
  },
  checkbox: {
    accentColor: GREEN,
    width: 16,
    height: 16,
    cursor: "pointer",
    flexShrink: 0,
  },
  subtaskText: {
    flex: 1,
    fontSize: 14,
    color: "#222",
    cursor: "pointer",
    userSelect: "none",
  },
  subtaskDone: {
    textDecoration: "line-through",
    color: MUTED,
  },
  editInput: {
    flex: 1,
    border: `1.5px solid ${GREEN}`,
    borderRadius: 6,
    padding: "3px 8px",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
  },
  subtaskActions: {
    display: "flex",
    gap: 4,
    opacity: 0.6,
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    color: MUTED,
    padding: "2px 4px",
    borderRadius: 4,
    lineHeight: 1,
  },
  addRow: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  addInput: {
    flex: 1,
    border: `1.5px solid ${BORDER}`,
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 13,
    fontFamily: "inherit",
    outline: "none",
    color: "#222",
  },
  addBtn: {
    background: LIGHT_GREEN,
    color: GREEN,
    border: `1.5px solid ${GREEN}`,
    borderRadius: 8,
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "inherit",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
};
