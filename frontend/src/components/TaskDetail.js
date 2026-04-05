import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "500px",
    maxHeight: "80vh",
    overflow: "auto",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderBottom: "1px solid #e1e5e9",
  },
  headerTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a1a",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#666",
    padding: "4px",
  },
  body: {
    padding: "20px",
  },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: "600",
    color: "#666",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    marginBottom: "20px",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    marginBottom: "20px",
    minHeight: "100px",
    outline: "none",
    resize: "vertical",
  },
  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
  },
  saveBtn: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
  },
  deleteBtn: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    color: "#666",
  },
  error: {
    textAlign: "center",
    padding: "40px",
    color: "#dc3545",
  },
};

function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ title: "", description: "" });

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:8000/tasks/${id}`);
      if (!response.ok) {
        throw new Error("Task not found");
      }
      const taskData = await response.json();
      setTask(taskData);
      setEditedTask({ title: taskData.title, description: taskData.description || "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedTask),
      });
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      const updatedTask = await response.json();
      setTask(updatedTask);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/tasks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      navigate("/tasks");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClose = () => {
    navigate("/tasks");
  };

  if (loading) {
    return (
      <div style={styles.overlay}>
        <div style={styles.card}>
          <div style={styles.loading}>Loading task...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.overlay}>
        <div style={styles.card}>
          <div style={styles.header}>
            <span style={styles.headerTitle}>Task Details</span>
            <button style={styles.closeBtn} onClick={handleClose}>✕</button>
          </div>
          <div style={styles.error}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.headerTitle}>Task Details</span>
          <button style={styles.closeBtn} onClick={handleClose}>✕</button>
        </div>

        <div style={styles.body}>
          <label style={styles.label}>TASK TITLE</label>
          <input
            style={styles.input}
            value={isEditing ? editedTask.title : task.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            disabled={!isEditing}
          />

          <label style={styles.label}>DESCRIPTION</label>
          <textarea
            style={styles.textarea}
            value={isEditing ? editedTask.description : (task.description || "")}
            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
            disabled={!isEditing}
          />

          <div style={styles.actions}>
            {isEditing ? (
              <>
                <button style={styles.saveBtn} onClick={handleSave}>Save Changes</button>
                <button
                  style={{ ...styles.deleteBtn, backgroundColor: "#6c757d" }}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button style={styles.saveBtn} onClick={() => setIsEditing(true)}>Edit</button>
                <button style={styles.deleteBtn} onClick={handleDelete}>Delete</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;
