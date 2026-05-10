import { FORWARD_STOPS, BACKWARD_STOPS, minsToHHMM, formatCountdown } from "../lib/schedule";

export default function Timetable({ arrivals, nowSecs, direction, stopIndex }) {
  const stops    = direction === "forward" ? FORWARD_STOPS : BACKWARD_STOPS;
  const terminus = stops[stops.length - 1].name;

  return (
    <div style={{ padding: "0 0 8px" }}>

      {/* Section title */}
      <div style={{
        padding: "10px 16px 8px",
        fontSize: "18px",
        color: "#3d6b42",
        letterSpacing: ".08em",
        textTransform: "uppercase",
      }}>
        All buses today — {arrivals.length} trips
      </div>

      {arrivals.map((bus, i) => {
        const diffSecs = bus.arrSecs - nowSecs;
        const isPast   = diffSecs < -30;
        const isCurrent = diffSecs >= -30 && diffSecs < 90;
        const isNext   = !isPast && !isCurrent && arrivals.findIndex((b) => b.arrSecs >= nowSecs - 30) === i;

        return (
          <div
            key={i}
            style={{
              margin: "0 14px 7px",
              background:   isCurrent ? "#0f2a12"
                          : isPast    ? "#0a140a"
                          : "#111f12",
              border: `0.5px solid ${
                isCurrent ? "#2a6a30"
              : isNext    ? "#1e4a22"
              : "#1e3320"
              }`,
              borderRadius: "13px",
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              opacity: isPast ? 0.35 : 1,
              transition: "opacity 0.3s",
            }}
          >
            {/* Trip number badge */}
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "9px",
              background:   isCurrent ? "#1e4a22"
                          : isNext    ? "#162a18"
                          : "#0f1a0f",
              border: `0.5px solid ${isCurrent ? "#2a6a30" : "#1e3320"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              color:  isCurrent ? "#4ade80" : isNext ? "#4a9c5a" : "#2d4a30",
              fontWeight: 600,
              flexShrink: 0,
            }}>
              #{bus.index}
            </div>

            {/* Time + destination */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: "18px",
                fontWeight: 500,
                fontFamily: "monospace",
                color:  isCurrent ? "#4ade80"
                      : isPast    ? "#2d4a30"
                      : "#c8e6c9",
                letterSpacing: "0.5px",
              }}>
                {minsToHHMM(Math.round(bus.arrMins))}
              </div>
              <div style={{ fontSize: "18px", color: "#3d6b42", marginTop: "2px" }}>
                → {terminus} at {minsToHHMM(Math.round(bus.endMins))}
              </div>
            </div>

            {/* Countdown / status */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              {isPast ? (
                <div style={{ fontSize: "18px", color: "#2d4a30" }}>Done</div>
              ) : isCurrent ? (
                <div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#4ade80" }}>Now</div>
                  <div style={{ fontSize: "18px", color: "#4a9c5a" }}>arriving</div>
                </div>
              ) : (
                <div>
                  <div style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: isNext ? "#4ade80" : "#3d6b42",
                  }}>
                    {formatCountdown(diffSecs)}
                  </div>
                  <div style={{ fontSize: "18px", color: "#2d4a30" }}>away</div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <div style={{ height: "16px" }} />
    </div>
  );
}
