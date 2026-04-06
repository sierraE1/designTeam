import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();

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
      marginBottom: 30,
    },

    title: {
      fontSize: 28,
      fontWeight: 900,
      color: "#fff",
    },

    profileBubble: {
      width: 50,
      height: 50,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.78)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    card: {
      background: "hsla(313, 60%, 92%, 0.25)",
      borderRadius: 22,
      padding: 22,
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.4)",
      boxShadow: "0 4px 24px rgba(255, 100, 0, 0.2)",
      maxWidth: 500,
      margin: "0 auto",
      width: "100%",
    },

    userInfo: {
      textAlign: "center",
      marginBottom: 20,
    },

    userIcon: {
      width: 90,
      height: 90,
      borderRadius: "50%",
      background: "#fff",
      margin: "0 auto 10px",
    },

    name: {
      fontSize: 22,
      fontWeight: 800,
      color: "#fff",
    },

    username: {
      color: "#fff",
      opacity: 0.9,
    },

    points: {
      color: "#fff",
      fontWeight: 600,
    },

    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "12px",
      borderRadius: 6,
      border: "none",
      outline: "none",
    },

    button: {
      width: "100%",
      padding: "12px",
      background: "linear-gradient(135deg, #ff72a1, #ff9a4c)",
      border: "none",
      borderRadius: 50,
      color: "white",
      fontWeight: 800,
      cursor: "pointer",
      boxShadow: "0 6px 20px rgba(255, 60, 0, 0.45)",
    },
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.header}>Profile Page</h2>
    </div>
  );
}