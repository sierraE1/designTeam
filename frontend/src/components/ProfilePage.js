import { useNavigate } from "react-router-dom";
import { useState } from "react";
import userIcon from "../assets/userIcon.png";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "Sierra",
    username: "designTeam",
    email: "designTeam@ufl.edu",
  });

  const [editName, setEditName] = useState(user.name);
  const [editUsername, setEditUsername] = useState(user.username);
  const [editEmail, setEditEmail] = useState(user.email);

  const handleSave = () => {
    setUser({
      ...user,
      name: editName,
      username: editUsername,
      email: editEmail,
    });
    alert("Profile saved!");
  };

  const styles = {
    page: {
      minHeight: "100vh",
      width: "100%",
      background: "linear-gradient(135deg, #ffe770 0%, #ffc337 40%, #ff8f3a 100%)",
      fontFamily: "'Nunito', sans-serif",
      padding: "28px 24px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      boxSizing: "border-box",
    },

    profileIcon: {
      position: "absolute",
      top: 28,
      right: 28,
      width: 50,
      height: 50,
      borderRadius: "50%",
      overflow: "hidden",
      border: "2px solid white",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      cursor: "pointer",
    },

    card: {
      background: "hsla(313, 60%, 92%, 0.25)",
      borderRadius: 22,
      padding: "32px 28px 28px",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.4)",
      boxShadow: "0 4px 24px rgba(255, 100, 0, 0.2)",
      width: "100%",
      maxWidth: 620,
      minHeight: 560,
      textAlign: "center",
    },

    title: {
      fontSize: 35,
      fontWeight: 900,
      color:  "white",
      marginBottom: 24,
    },

    userIcon: {
      width: 110,
      height: 110,
      borderRadius: "50%",
      overflow: "hidden",
      margin: "0 auto 14px",
      border: "3px solid white",
    },

    name: {
      fontSize: 22,
      fontWeight: 800,
      color: "#fff",
      margin: "0 0 6px",
    },

    username: {
      color: "#fff",
      opacity: 0.9,
      marginBottom: 24,
    },

    form: {
      display: "flex",
      flexDirection: "column",
      gap: 16,
    },

    input: {
      width: "100%",
      maxWidth: 420,
      padding: "12px 14px",
      margin: "0 auto",
      borderRadius: 8,
      border: "none",
      outline: "none",
      display: "block",
      boxSizing: "border-box",
    },

    buttons: {
      width: "100%",
      maxWidth: 520,
      margin: "30px auto 0",
      display: "flex",
      flexDirection: "column",
      gap: 14,
    },

    button: {
      width: "100%",
      padding: "14px",
      background: "linear-gradient( #ff72a1, #ff9a4c)",
      border: "none",
      borderRadius: 50,
      color: "white",
      fontWeight: 800,
      cursor: "pointer",
     
    },

    backButton: {
      width: "100%",
      padding: "14px",
      background: "#fff",
      border: "none",
      borderRadius: 50,
      color: "white",
      fontWeight: 800,
      cursor: "pointer",
      background: "linear-gradient(#ff9a4c, #ff72a1)",
    },
  };

  return (
    <div style={styles.page}>
      <div
        style={styles.profileIcon}
        onClick={() => navigate("/profile")}
      >
        <img
          src={userIcon}
          alt="profile"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      <div style={styles.card}>
        <h1 style={styles.title}>Profile</h1>

        <div style={styles.userIcon}>
          <img
            src={userIcon}
            alt="profile"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        <h2 style={styles.name}>{user.name}</h2>
        <p style={styles.username}>@{user.username}</p>

        <div style={styles.form}>
          <input
            style={styles.input}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Name"
          />
          <input
            style={styles.input}
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            style={styles.input}
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            placeholder="Email"
          />
        </div>

        <div style={styles.buttons}>
          <button style={styles.button} onClick={handleSave}>
            Save Changes
          </button>
          <button
            style={styles.backButton}
            onClick={() => navigate("/home")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}