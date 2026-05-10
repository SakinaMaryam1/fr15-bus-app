import { FORWARD_STOPS, BACKWARD_STOPS, minsToHHMM, formatCountdown } from "../lib/schedule";

export default function NextBusPanel({ arrivals, nowSecs, direction, stopIndex }) {
  const stops    = direction === "forward" ? FORWARD_STOPS : BACKWARD_STOPS;
  const stopName = stops[stopIndex].name;
  const terminus = stops[stops.length - 1].name;

  // Find the next upcoming bus
  const upcoming = arrivals.filter((a) => a.arrSecs >= nowSecs - 30);
  const next     = upcoming[0];

  if (!next) {
    return (
      <div className="card" style={{ margin: "12px 14px", textAlign: "center" }}>
        <div style={{ fontSize: "14px", color: "#3d6b42", padding: "20px 0" }}>
          No more buses today for this stop.
        </div>
        <div style={{ fontSize: "12px", color: "#2d4a30", marginTop: "4px" }}>
          Service resumes tomorrow from 06:00
        </div>
      </div>
    );
  }

  const diffSecs    = next.arrSecs - nowSecs;
  const isImminent  = diffSecs < 90;
  const progressPct = Math.min(100, Math.max(0, ((nowSecs - (next.arrSecs - 1800)) / 1800) * 100));

  return (
    <div className="card" style={{ margin: "12px 14px" }}>

      {/* Live row */}
      <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "14px" }}>
        <div className="live-dot" />
        <span style={{ fontSize: "10px", color: "#ef4444", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }}>
          Live Schedule
        </span>
      </div>

      {/* Big countdown */}
      <div style={{ fontSize: "42px", fontWeight: 700, color: "#4ade80", lineHeight: 1, letterSpacing: "-2px" }}>
        {isImminent && diffSecs > 0 ? "Now" : formatCountdown(diffSecs)}
      </div>

      <div style={{ fontSize: "12px", color: "#4a9c5a", marginTop: "5px", marginBottom: "16px" }}>
        {isImminent && diffSecs > 0
          ? `Arriving at ${stopName} now!`
          : `Arrives at ${minsToHHMM(Math.round(next.arrMins))} · on schedule`
        }
      </div>

      {/* Progress bar */}
      <div className="progress-track" style={{ marginBottom: "12px" }}>
        <div className="progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Trip info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "10px", color: "#3d6b42" }}>Current trip</span>
        <span style={{ fontSize: "10px", color: "#4ade80", fontWeight: 500 }}>
          {stops[0].name} → {terminus}
        </span>
      </div>
    </div>
  );
}
