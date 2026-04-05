import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PRIORITIES = ["Low", "Medium", "High"];

const ACCENT = "#ff008c";
const ACCENT_SOFT = "#ff72a1";
const ACCENT_ORANGE = "#ff9a4c";
const BORDER = "rgba(255, 255, 255, 0.5)";
const MUTED = "rgba(26, 26, 26, 0.5)";
const PAGE_BG = "linear-gradient(135deg, #ffe770 0%, #ffc337 40%, #ff8f3a 100%)";
const GLASS = "hsla(313, 60%, 98%, 0.72)";
const TINT = "rgba(255, 114, 161, 0.22)";

function extrasStorageKey(taskId) {
  return `dopaminder:task-extras:${taskId}`;
}

function loadExtras(taskId) {
  try {
    const raw = localStorage.getItem(extrasStorageKey(taskId));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveExtras(taskId, data) {
  localStorage.setItem(extrasStorageKey(taskId), JSON.stringify(data));
}

function clearExtras(taskId) {
  localStorage.removeItem(extrasStorageKey(taskId));
}

const styles = {
  overlay: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: PAGE_BG,
    fontFamily: "'Nunito', sans-serif",
    padding: 24,
    boxSizing: "border-box",
  },
  card: {
    background: GLASS,
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.55)",
    boxShadow: "0 8px 40px rgba(255, 80, 0, 0.28)",
    width: 400,
    maxWidth: "100%",
    overflow: "hidden",
  },
  cardWide: {
    width: 840,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 20px 14px",
    borderBottom: "1px solid rgba(255,255,255,0.4)",
  },
  headerTitle: {
    fontWeight: 800,
    fontSize: 18,
    letterSpacing: "-0.3px",
    color: "#1a1a1a",
  },
  closeBtn: {
    background: "rgba(255,255,255,0.5)",
    border: "1px solid rgba(255,255,255,0.6)",
    borderRadius: 10,
    width: 34,
    height: 34,
    cursor: "pointer",
    fontSize: 15,
    color: "#555",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tabs: {
    display: "flex",
    borderBottom: "1px solid rgba(255,255,255,0.4)",
    padding: "0 20px",
    gap: 4,
  },
  tab: {
    background: "none",
    border: "none",
    borderBottom: "3px solid transparent",
    cursor: "pointer",
    fontSize: 14,
    fontFamily: "inherit",
    fontWeight: 700,
    color: MUTED,
    padding: "10px 8px 8px",
    marginBottom: -1,
    transition: "all 0.15s",
  },
  activeTab: {
    color: ACCENT,
    borderBottom: `3px solid ${ACCENT}`,
    fontWeight: 800,
  },
  body: {
    padding: "20px 20px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  subtasksShell: {
    display: "grid",
    gridTemplateColumns: "1fr 250px",
    gap: 14,
    alignItems: "start",
  },
  subtasksMain: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  questionCard: {
    background: "rgba(255,255,255,0.55)",
    border: "1px dashed rgba(255, 114, 161, 0.55)",
    borderRadius: 14,
    padding: "12px 12px 10px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  questionTitle: {
    margin: 0,
    fontSize: 13,
    fontWeight: 800,
    color: "#222",
    fontFamily: "inherit",
  },
  questionList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  questionItem: {
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(255,255,255,0.8)",
    borderRadius: 10,
    padding: "8px 10px",
    fontSize: 12,
    color: "#2a2a2a",
    fontWeight: 600,
    lineHeight: 1.35,
    fontFamily: "inherit",
  },
  questionInputCard: {
    background: "rgba(255,255,255,0.78)",
    border: "1px solid rgba(255,255,255,0.9)",
    borderRadius: 10,
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  questionInputLabel: {
    margin: 0,
    fontSize: 11,
    fontWeight: 800,
    color: ACCENT,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    fontFamily: "inherit",
  },
  questionInput: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid rgba(255,100,120,0.35)",
    borderRadius: 8,
    padding: "8px 10px",
    fontSize: 12,
    fontFamily: "inherit",
    color: "#222",
    minHeight: 64,
    resize: "vertical",
    outline: "none",
    background: "rgba(255,255,255,0.95)",
  },
  regenerateBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #ff72a1, #ff9a4c)",
    color: "#fff",
    border: "none",
    borderRadius: 999,
    padding: "9px 12px",
    fontSize: 12,
    fontWeight: 800,
    fontFamily: "inherit",
    cursor: "pointer",
    boxShadow: "0 3px 10px rgba(255, 60, 0, 0.28)",
  },
  label: {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.08em",
    color: "rgba(26,26,26,0.55)",
    fontFamily: "inherit",
    marginBottom: 2,
  },
  input: {
    border: "1px solid rgba(255,100,120,0.35)",
    borderRadius: 12,
    padding: "10px 12px",
    fontSize: 14,
    fontFamily: "inherit",
    fontWeight: 600,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    color: "#1a1a1a",
    background: "rgba(255,255,255,0.95)",
  },
  textarea: {
    border: "1px solid rgba(255,100,120,0.35)",
    borderRadius: 12,
    padding: "10px 12px",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: 72,
    color: "#1a1a1a",
    background: "rgba(255,255,255,0.95)",
  },
  select: {
    border: "1px solid rgba(255,100,120,0.35)",
    borderRadius: 12,
    padding: "10px 12px",
    fontSize: 14,
    fontFamily: "inherit",
    fontWeight: 600,
    outline: "none",
    background: "rgba(255,255,255,0.95)",
    cursor: "pointer",
    width: "100%",
    color: "#1a1a1a",
  },
  pomodoros: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
  },
  pomodoro: {
    width: 32,
    height: 32,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    background: "rgba(255,255,255,0.5)",
    transition: "all 0.15s",
  },
  pomodoroDone: {
    background: `linear-gradient(135deg, ${ACCENT_SOFT}, ${ACCENT_ORANGE})`,
    border: "1px solid rgba(255,80,120,0.5)",
  },
  pomodoroCheck: {
    color: "#fff",
    fontSize: 14,
    fontWeight: 800,
  },
  actions: {
    display: "flex",
    gap: 10,
    marginTop: 6,
  },
  saveBtn: {
    flex: 1,
    background: "linear-gradient(135deg, #ff72a1, #ff9a4c)",
    color: "#fff",
    border: "none",
    borderRadius: 50,
    padding: "12px 0",
    fontSize: 15,
    fontWeight: 800,
    fontFamily: "inherit",
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(255, 60, 0, 0.4)",
  },
  deleteBtn: {
    flex: 1,
    background: "rgba(255,255,255,0.85)",
    color: "#c62828",
    border: "2px solid rgba(198, 40, 40, 0.35)",
    borderRadius: 50,
    padding: "11px 0",
    fontSize: 15,
    fontWeight: 800,
    fontFamily: "inherit",
    cursor: "pointer",
  },
  taskContext: {
    background: TINT,
    borderRadius: 12,
    padding: "10px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    marginBottom: 2,
    border: "1px solid rgba(255,255,255,0.45)",
  },
  taskContextLabel: {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.08em",
    color: ACCENT,
    fontFamily: "inherit",
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
    background: "rgba(255,255,255,0.45)",
    border: "1.5px dashed rgba(255, 100, 140, 0.45)",
    borderRadius: 14,
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
    fontWeight: 800,
    letterSpacing: "0.08em",
    color: ACCENT_ORANGE,
    fontFamily: "inherit",
  },
  aiSparkle: {
    color: ACCENT_SOFT,
    fontSize: 16,
  },
  aiDesc: {
    fontSize: 12,
    color: "rgba(26,26,26,0.55)",
    margin: 0,
    fontFamily: "inherit",
    fontWeight: 600,
  },
  generateBtn: {
    background: "linear-gradient(135deg, #ff72a1, #ff9a4c)",
    color: "#fff",
    border: "none",
    borderRadius: 50,
    padding: "10px 18px",
    fontSize: 13,
    fontWeight: 800,
    fontFamily: "inherit",
    cursor: "pointer",
    alignSelf: "flex-start",
    transition: "opacity 0.15s",
    boxShadow: "0 4px 14px rgba(255, 60, 0, 0.35)",
  },
  generateBtnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  spinner: {
    display: "inline-block",
  },
  aiError: {
    color: "#b71c1c",
    fontSize: 12,
    margin: 0,
    fontFamily: "inherit",
    fontWeight: 700,
  },
  divider: {
    height: 1,
    background: "rgba(255,255,255,0.5)",
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
    color: "rgba(26,26,26,0.5)",
    fontStyle: "italic",
    margin: 0,
    fontFamily: "inherit",
    fontWeight: 600,
  },
  subtaskRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 4px",
    borderRadius: 6,
  },
  checkbox: {
    accentColor: ACCENT,
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
    border: `2px solid ${ACCENT_SOFT}`,
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
    background: "rgba(255,255,255,0.9)",
    color: ACCENT,
    border: `2px solid ${ACCENT_SOFT}`,
    borderRadius: 8,
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "inherit",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  loading: {
    textAlign: "center",
    padding: 40,
    color: "#1a1a1a",
    fontFamily: "inherit",
    fontWeight: 700,
  },
  errorBox: {
    padding: "20px",
    textAlign: "center",
    color: "#b71c1c",
    fontFamily: "inherit",
    fontSize: 14,
    fontWeight: 700,
  },
  saveError: {
    color: "#b71c1c",
    fontSize: 13,
    margin: 0,
    fontFamily: "inherit",
    fontWeight: 700,
  },
};

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const taskId = Number(id);

  const [apiLoading, setApiLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const [activeTab, setActiveTab] = useState("task");
  const [task, setTask] = useState({
    name: "",
    notes: "",
    priority: "Medium",
    pomodorosDone: 0,
    totalPomodoros: 4,
  });
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [aiQuestions, setAiQuestions] = useState([]);
  const [questionAnswerInput, setQuestionAnswerInput] = useState("");
  const showQuestionsPanel = activeTab === "subtasks" && aiQuestions.length > 0;

  const fetchTask = useCallback(async () => {
    if (!id || Number.isNaN(taskId)) {
      setFetchError("Invalid task.");
      setApiLoading(false);
      return;
    }
    try {
      setApiLoading(true);
      setFetchError(null);
      const response = await fetch(`/tasks/${taskId}`);
      if (!response.ok) {
        throw new Error("Task not found.");
      }
      const taskData = await response.json();
      const extras = loadExtras(taskId);
      setTask({
        name: taskData.title || "",
        notes: taskData.description || "",
        priority: extras?.priority ?? "Medium",
        pomodorosDone: extras?.pomodorosDone ?? 0,
        totalPomodoros: extras?.totalPomodoros ?? 4,
      });
      setSubtasks(
        Array.isArray(extras?.subtasks) && extras.subtasks.length
          ? extras.subtasks
          : []
      );
    } catch (err) {
      setFetchError(err.message || "Could not load task.");
    } finally {
      setApiLoading(false);
    }
  }, [id, taskId]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const persistExtras = useCallback(() => {
    if (!taskId || Number.isNaN(taskId)) return;
    saveExtras(taskId, {
      priority: task.priority,
      pomodorosDone: task.pomodorosDone,
      totalPomodoros: task.totalPomodoros,
      subtasks,
    });
  }, [taskId, task.priority, task.pomodorosDone, task.totalPomodoros, subtasks]);

  const handleSave = async () => {
    setSaveError(null);
    if (!task.name.trim()) {
      setSaveError("Task name is required.");
      return;
    }
    try {
      const response = await fetch(`/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.name.trim(),
          description: task.notes.trim() || null,
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Failed to save.");
      }
      persistExtras();
    } catch (err) {
      setSaveError(err.message || "Failed to save.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;
    try {
      const response = await fetch(`/tasks/${taskId}`, { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Failed to delete.");
      }
      clearExtras(taskId);
      navigate("/tasks");
    } catch (err) {
      setSaveError(err.message || "Failed to delete.");
    }
  };

  const handleClose = () => navigate("/tasks");

  const toggleSubtask = (sid) =>
    setSubtasks((prev) =>
      prev.map((s) => (s.id === sid ? { ...s, done: !s.done } : s))
    );

  const deleteSubtask = (sid) =>
    setSubtasks((prev) => prev.filter((s) => s.id !== sid));

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      { id: Date.now(), text: newSubtask.trim(), done: false },
    ]);
    setNewSubtask("");
  };

  const startEdit = (sid, text) => {
    setEditingId(sid);
    setEditingText(text);
  };

  const saveEdit = (sid) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === sid ? { ...s, text: editingText } : s))
    );
    setEditingId(null);
  };

  const generateSubtasks = useCallback(async (extraContext = "") => {
    if (!task.name.trim()) return;
    setIsGenerating(true);
    setAiError(null);
    try {
      const details = extraContext.trim();
      const notesForAi = details
        ? [
            task.notes ? `Original task notes:\n${task.notes}` : "",
            `User-provided details (treat as constraints):\n${details}`,
          ]
            .filter(Boolean)
            .join("\n\n")
        : task.notes || "";
      const response = await fetch("/ai/generate_subtasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_name: task.name,
          task_notes: notesForAi,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Failed to generate subtasks.");
      }
      if (Array.isArray(data.subtasks)) {
        const generated = data.subtasks.map((text, i) => ({
          id: Date.now() + i,
          text,
          done: false,
        }));
        setSubtasks(generated);
        const questions = Array.isArray(data.questions)
          ? data.questions.filter((q) => typeof q === "string" && q.trim().length > 0).slice(0, 2)
          : [];
        setAiQuestions(questions);
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (err) {
      setAiError(err.message || "Could not generate subtasks.");
      setAiQuestions([]);
    } finally {
      setIsGenerating(false);
    }
  }, [task.name, task.notes]);

  const pomodoros = Array.from(
    { length: task.totalPomodoros },
    (_, i) => i < task.pomodorosDone
  );

  const fontImport = (
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>
  );

  if (apiLoading) {
    return (
      <div style={styles.overlay}>
        {fontImport}
        <div style={styles.card}>
          <div style={styles.loading}>Loading task…</div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div style={styles.overlay}>
        {fontImport}
        <div style={styles.card}>
          <div style={styles.header}>
            <span style={styles.headerTitle}>Task details</span>
            <button type="button" style={styles.closeBtn} onClick={handleClose} aria-label="Close">
              ✕
            </button>
          </div>
          <div style={styles.errorBox}>{fetchError}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay}>
      {fontImport}
      <div style={{ ...styles.card, ...(showQuestionsPanel ? styles.cardWide : {}) }}>
        <div style={styles.header}>
          <span style={styles.headerTitle}>Task details</span>
          <button type="button" style={styles.closeBtn} onClick={handleClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div style={styles.tabs}>
          {["task", "subtasks"].map((tab) => (
            <button
              key={tab}
              type="button"
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

        {saveError && (
          <p style={{ ...styles.saveError, padding: "0 20px", marginTop: 10 }}>{saveError}</p>
        )}

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
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <label style={styles.label}>POMODOROS DONE</label>
            <div style={styles.pomodoros}>
              {pomodoros.map((done, i) => (
                <div
                  key={i}
                  role="button"
                  tabIndex={0}
                  style={{
                    ...styles.pomodoro,
                    ...(done ? styles.pomodoroDone : {}),
                  }}
                  onClick={() =>
                    setTask((t) => ({
                      ...t,
                      pomodorosDone: i < t.pomodorosDone ? i : i + 1,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setTask((t) => ({
                        ...t,
                        pomodorosDone: i < t.pomodorosDone ? i : i + 1,
                      }));
                    }
                  }}
                >
                  {done && <span style={styles.pomodoroCheck}>✓</span>}
                </div>
              ))}
            </div>

            <div style={styles.actions}>
              <button type="button" style={styles.saveBtn} onClick={handleSave}>
                Save
              </button>
              <button type="button" style={styles.deleteBtn} onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        )}

        {activeTab === "subtasks" && (
          <div style={styles.body}>
            <div style={{ ...styles.subtasksShell, gridTemplateColumns: showQuestionsPanel ? "1fr 250px" : "1fr" }}>
              <div style={styles.subtasksMain}>
                <div style={styles.taskContext}>
                  <span style={styles.taskContextLabel}>Task</span>
                  <span style={styles.taskContextName}>{task.name || "Untitled task"}</span>
                </div>

                <div style={styles.aiSection}>
                  <div style={styles.aiHeader}>
                    <span style={styles.aiLabel}>AI SUGGESTIONS</span>
                    <span style={styles.aiSparkle} aria-hidden>
                      ✦
                    </span>
                  </div>
                  <p style={styles.aiDesc}>Generate subtasks from the task name and notes.</p>
                  <button
                    type="button"
                    style={{
                      ...styles.generateBtn,
                      ...(isGenerating ? styles.generateBtnDisabled : {}),
                    }}
                    onClick={() => generateSubtasks()}
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
                            type="button"
                            style={styles.iconBtn}
                            title="Edit"
                            onClick={() => startEdit(s.id, s.text)}
                          >
                            ✎
                          </button>
                        )}
                        <button
                          type="button"
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

                <div style={styles.addRow}>
                  <input
                    style={styles.addInput}
                    placeholder="+ Add subtask"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSubtask()}
                  />
                  <button type="button" style={styles.addBtn} onClick={addSubtask}>
                    Add
                  </button>
                </div>

                <div style={styles.actions}>
                  <button type="button" style={styles.saveBtn} onClick={handleSave}>
                    Save
                  </button>
                  <button type="button" style={styles.deleteBtn} onClick={handleDelete}>
                    Delete
                  </button>
                </div>
              </div>

              {showQuestionsPanel && (
                <aside style={styles.questionCard}>
                  <p style={styles.questionTitle}>A couple quick questions ✨</p>
                  <ul style={styles.questionList}>
                    {aiQuestions.map((question, idx) => (
                      <li key={idx} style={styles.questionItem}>{question}</li>
                    ))}
                  </ul>
                  <div style={styles.questionInputCard}>
                    <p style={styles.questionInputLabel}>Your details</p>
                    <textarea
                      style={styles.questionInput}
                      value={questionAnswerInput}
                      onChange={(e) => setQuestionAnswerInput(e.target.value)}
                    />
                    <button
                      type="button"
                      style={{
                        ...styles.regenerateBtn,
                        ...(isGenerating || !questionAnswerInput.trim() ? styles.generateBtnDisabled : {}),
                      }}
                      disabled={isGenerating || !questionAnswerInput.trim()}
                      onClick={() => generateSubtasks(questionAnswerInput)}
                    >
                      {isGenerating ? "Regenerating…" : "Regenerate subtasks"}
                    </button>
                  </div>
                </aside>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
