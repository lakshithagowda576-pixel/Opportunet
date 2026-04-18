export function LoadingScreen() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      fontSize: "24px",
      fontWeight: "bold"
    }}>
      <div style={{
        textAlign: "center",
        background: "rgba(0,0,0,0.2)",
        padding: "40px",
        borderRadius: "10px"
      }}>
        <h1>OpportuNet</h1>
        <p>Connecting Talent Beyond Boundaries</p>
        <p style={{ fontSize: "14px", marginTop: "20px", opacity: 0.8 }}>Loading...</p>
      </div>
    </div>
  );
}
