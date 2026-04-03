import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = () => {
    setMessage("");

    if (email === "sierra" && password === "1234") {
      navigate("/home");
    } else {
      setMessage("Invalid username or password.");
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #ff72a1, #ff9a4c)",
      fontFamily: "'Nunito', sans-serif",
    },

    card: {
      width: 400,
      padding: 40,
      borderRadius: 22,
      display: "flex",
      flexDirection: "column",
      gap: 14,
      alignItems: "center",
      backgroundColor: "#fdfdfd",
      boxShadow: "0 20px 45px rgba(0,0,0,0.12)",
    },

    logo: {
      width: 100,
      marginBottom: 5,
    },

    title: {
      fontWeight: 900,
      fontSize: 32,
      marginBottom: 35,
      background: "linear-gradient(135deg, #ff72a1, #ff9a4c)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },

    inputWrapper: {
      width: "100%",
      padding: 2,
      borderRadius: 12,
      background: "linear-gradient(135deg, #ff72a1, #ff9a4c)",
    },

    input: {
      width: "100%",
      padding: 14,
      borderRadius: 10,
      border: "none",
      fontSize: 14,
      backgroundColor: "white",
      outline: "none",
      boxSizing: "border-box",
    },

    button: {
      width: "100%",
      padding: 13,
      borderRadius: 999,
      border: "none",
      color: "white",
      fontWeight: 800,
      fontSize: 15,
      cursor: "pointer",
      background: "linear-gradient(135deg, #f7d55c, #ff9a3d)",
      boxShadow: "0 8px 18px rgba(255, 154, 61, 0.3)",
      marginTop: 6,
    },

    message: {
      color: "#d94b4b",
      fontSize: 14,
      margin: 0,
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <img src={logo} alt="Logo" style={styles.logo} />

        <h1 style={styles.title}>Dopaminder</h1>

        <div style={styles.inputWrapper}>
          <input
            style={styles.input}
            type="text"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={styles.inputWrapper}>
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}