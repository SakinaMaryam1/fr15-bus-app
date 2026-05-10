export default function Header({ currentTime }) {
  return (
    <div style={{
      padding: "16px 18px 10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      {/* Route badge */}
      <div style={{
        background: "#162a18",
        border: "0.5px solid #2a4a2e",
        borderRadius: "20px",
        padding: "5px 14px",
        fontSize: "12px",
        color: "#4ade80",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontWeight: 500,
      }}>
        {/* Bus icon */}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" rx="2"/>
          <path d="M16 8h4l3 4v3h-7V8z"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
          <path d="M1 13h15M16 13h7"/>
        </svg>
        FR-15
      </div>

      {/* Live clock */}
      <div style={{
        fontFamily: "monospace",
        fontSize: "13px",
        color: "#4a9c5a",
        background: "#111f12",
        border: "0.5px solid #1e3320",
        borderRadius: "10px",
        padding: "5px 12px",
      }}>
        {currentTime}
      </div>
    </div>
  );
}
