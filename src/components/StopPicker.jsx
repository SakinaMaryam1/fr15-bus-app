import { useState } from "react";
import { FORWARD_STOPS, BACKWARD_STOPS } from "../lib/schedule";

export default function StopPicker({ direction, stopIndex, onChange }) {
  const [search, setSearch] = useState("");
  const stops = direction === "forward" ? FORWARD_STOPS : BACKWARD_STOPS;

  const filtered = stops
    .map((s, i) => ({ ...s, originalIndex: i }))
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: "0 0 4px" }}>

      {/* Search bar */}
      <div style={{
        margin: "0 14px 10px",
        background: "#111f12",
        border: "0.5px solid #2a4a2e",
        borderRadius: "10px",
        padding: "10px 13px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="#3d6b42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Search stops…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#c8e6c9",
            fontSize: "18px",
            width: "100%",
          }}
        />
        {search && (
          <button onClick={() => setSearch("")} style={{
            background: "none", border: "none", color: "#3d6b42",
            cursor: "pointer", fontSize: "18px", lineHeight: 1,
          }}>×</button>
        )}
      </div>

      {/* Section label */}
      <div style={{
        padding: "0 16px 8px",
        fontSize: "18px",
        color: "#3d6b42",
        letterSpacing: ".08em",
        textTransform: "uppercase",
      }}>
        All stops
      </div>

      {/* Stop list */}
      <div style={{ overflowY: "auto", maxHeight: "340px" }}>
        {filtered.map((stop, fi) => {
          const isActive    = stop.originalIndex === stopIndex;
          const isTerminus  = stop.originalIndex === 0 || stop.originalIndex === stops.length - 1;
          const isLast      = fi === filtered.length - 1;

          return (
            <div
              key={stop.originalIndex}
              onClick={() => onChange(stop.originalIndex)}
              style={{
                padding: "11px 16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                borderBottom: isLast ? "none" : "0.5px solid #111f12",
                background: isActive ? "#111f12" : "transparent",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#0f1a0f"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              {/* Dot indicator */}
              <div style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                flexShrink: 0,
                background:  isActive   ? "#4ade80"
                           : isTerminus ? "#2a5a30"
                           : "#1e3320",
                border: `1.5px solid ${
                  isActive   ? "#4ade80"
                : isTerminus ? "#4a9c5a"
                : "#2a4a2e"
                }`,
                boxShadow: isActive ? "0 0 8px rgba(74,222,128,.5)" : "none",
                transition: "all 0.2s",
              }} />

              {/* Stop name */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: "18px",
                  color:      isActive   ? "#e8f5e9"
                            : isTerminus ? "#4a9c5a"
                            : "#7a9e7e",
                  fontWeight: isActive ? 500 : 400,
                }}>
                  {stop.name}
                </div>
                {isActive && (
                  <div style={{ fontSize: "18px", color: "#4ade80", marginTop: "2px" }}>
                    Your stop
                  </div>
                )}
              </div>

              {/* Arrow for active */}
              {isActive && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
