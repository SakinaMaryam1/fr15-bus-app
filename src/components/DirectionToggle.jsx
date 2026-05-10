export default function DirectionToggle({ direction, onChange }) {
  const options = [
    { value: "backward", label: "← T-Chowk to Khanna Pul" },
    { value: "forward",  label: "→ Khanna Pul to T-Chowk" },
  ];

  return (
    <div style={{
      margin: "0 14px 12px",
      background: "#111f12",
      border: "0.5px solid #1e3320",
      borderRadius: "12px",
      padding: "4px",
      display: "flex",
      gap: "3px",
    }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            flex: 1,
            padding: "9px 4px",
            borderRadius: "9px",
            fontSize: "18px",
            textAlign: "center",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s",
            background:   direction === opt.value ? "#1e3a20" : "transparent",
            color:        direction === opt.value ? "#4ade80"  : "#3d6b42",
            fontWeight:   direction === opt.value ? 600        : 400,
            lineHeight: 1.4,
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
