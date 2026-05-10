import { useState, useEffect, useRef } from "react";
import { FORWARD_STOPS, BACKWARD_STOPS, nowMins, minsToHHMM, getArrivalsForStop } from "./lib/schedule";
import DirectionToggle from "./components/DirectionToggle";
import StopPicker      from "./components/StopPicker";
import NextBusPanel    from "./components/NextBusPanel";
import Timetable       from "./components/Timetable";
import "./index.css";

const SCREEN = { SPLASH: "splash", PICKER: "picker", NEXT: "next" };

function loadFavourite() {
  try {
    const saved = localStorage.getItem("fr15_favourite");
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
}

export default function App() {
  const favourite = loadFavourite();

  const [screen,      setScreen]      = useState(favourite ? SCREEN.NEXT : SCREEN.SPLASH);
  const [direction,   setDirection]   = useState(favourite?.direction ?? "backward");
  const [stopIndex,   setStopIndex]   = useState(favourite?.stopIndex ?? 0);
  const [activeTab,   setActiveTab]   = useState("home");
  const [timeStr,     setTimeStr]     = useState("");
  const [nowSecs,     setNowSecs]     = useState(nowMins() * 60);
  const [isFav,       setIsFav]       = useState(!!favourite);
  const [notifStatus, setNotifStatus] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const notifiedRef = useRef(new Set());

  function toggleFavourite() {
    if (isFav) {
      localStorage.removeItem("fr15_favourite");
      setIsFav(false);
    } else {
      localStorage.setItem("fr15_favourite", JSON.stringify({ direction, stopIndex }));
      setIsFav(true);
    }
  }

  async function requestNotifications() {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setNotifStatus(result);
  }

  useEffect(() => {
    function tick() {
      const n = new Date();
      const h = String(n.getHours()).padStart(2, "0");
      const m = String(n.getMinutes()).padStart(2, "0");
      const s = String(n.getSeconds()).padStart(2, "0");
      setTimeStr(`${h}:${m}:${s}`);
      const secs = n.getHours() * 3600 + n.getMinutes() * 60 + n.getSeconds();
      setNowSecs(secs);

      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        const arr   = getArrivalsForStop(direction, stopIndex);
        const stops = direction === "forward" ? FORWARD_STOPS : BACKWARD_STOPS;
        arr.forEach((bus) => {
          const diff = bus.arrSecs - secs;
          const key  = `${direction}-${stopIndex}-${bus.index}`;
          if (diff > 270 && diff <= 310 && !notifiedRef.current.has(key)) {
            notifiedRef.current.add(key);
            new Notification("🚌 FR-15 arriving in 5 min!", {
              body: `Bus #${bus.index} at ${stops[stopIndex].name} · ${minsToHHMM(Math.round(bus.arrMins))}`,
            });
          }
        });
      }
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [direction, stopIndex]);

  const stops    = direction === "forward" ? FORWARD_STOPS : BACKWARD_STOPS;
  const arrivals = getArrivalsForStop(direction, stopIndex);

  function handleDirectionChange(newDir) {
    setDirection(newDir);
    setStopIndex(0);
    setIsFav(false);
    localStorage.removeItem("fr15_favourite");
  }

  function handleStopPick(idx) {
    setStopIndex(idx);
    setScreen(SCREEN.NEXT);
    setActiveTab("home");
    if (isFav) {
      localStorage.setItem("fr15_favourite", JSON.stringify({ direction, stopIndex: idx }));
    }
  }

  const NavIcon = ({ name, active, onClick }) => {
    const icons = {
      home: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
      times: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      stops: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
    };
    return (
      <div className={`nav-item ${active ? "active" : ""}`} onClick={onClick}>
        {icons[name]}
        {name === "stops" ? "Stops" : name.charAt(0).toUpperCase() + name.slice(1)}
      </div>
    );
  };

  // ── SPLASH ─────────────────────────────────────────────────────────────────
  if (screen === SCREEN.SPLASH) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "0 28px 40px",
        }}>
          <div style={{
            width: "140px", height: "140px", borderRadius: "50%",
            background: "#111f12", border: "0.5px solid #2a4a2e",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "32px", boxShadow: "0 0 48px rgba(74,222,128,.1)",
          }}>
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none"
              stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="2"/>
              <path d="M16 8h4l3 4v3h-7V8z"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
              <path d="M1 13h15M16 13h7"/>
            </svg>
          </div>
          <div style={{
            background: "#162a18", border: "0.5px solid #2a4a2e", borderRadius: "20px",
            padding: "4px 14px", fontSize: "11px", color: "#4ade80",
            letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "16px",
          }}>
            Route FR-15 · Islamabad
          </div>
          <h1 style={{
            fontSize: "28px", fontWeight: 600, color: "#e8f5e9",
            textAlign: "center", lineHeight: 1.3, marginBottom: "14px",
          }}>
            Your bus,<br />on time. Always.
          </h1>
          <p style={{
            fontSize: "13px", color: "#5a7a5e", textAlign: "center",
            lineHeight: 1.7, marginBottom: "40px",
          }}>
            Real-time arrivals for<br />
            Khanna Pul ↔ T-Chowk<br />
            Pick your stop. Never wait blind.
          </p>
          <button className="btn-primary" onClick={() => setScreen(SCREEN.PICKER)}>
            Get Started
          </button>
          <button className="btn-ghost" onClick={() => { setScreen(SCREEN.NEXT); setActiveTab("times"); }}>
            View Full Timetable
          </button>
        </div>
        <div style={{ padding: "12px", textAlign: "center", fontSize: "10px", color: "#2d4a30" }}>
          32–33 daily trips · avg. 30 min headway
        </div>
      </div>
    );
  }

  // ── STOP PICKER ────────────────────────────────────────────────────────────
  if (screen === SCREEN.PICKER) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <div style={{ padding: "16px 18px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{
            background: "#162a18", border: "0.5px solid #2a4a2e", borderRadius: "20px",
            padding: "5px 14px", fontSize: "12px", color: "#4ade80", fontWeight: 500,
          }}>
            🚌 FR-15 — Pick your stop
          </div>
          <div style={{
            fontFamily: "monospace", fontSize: "13px", color: "#4a9c5a",
            background: "#111f12", border: "0.5px solid #1e3320",
            borderRadius: "10px", padding: "5px 12px",
          }}>
            {timeStr}
          </div>
        </div>
        <DirectionToggle direction={direction} onChange={handleDirectionChange} />
        <div style={{ flex: 1, overflowY: "auto" }}>
          <StopPicker direction={direction} stopIndex={stopIndex} onChange={handleStopPick} />
        </div>
        <nav className="bottom-nav">
          <NavIcon name="home"  active={false} onClick={() => setScreen(SCREEN.NEXT)} />
          <NavIcon name="times" active={false} onClick={() => { setScreen(SCREEN.NEXT); setActiveTab("times"); }} />
          <NavIcon name="stops" active={true}  onClick={() => {}} />
        </nav>
      </div>
    );
  }

  // ── NEXT BUS / TIMETABLE ───────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>

      {/* Top bar */}
      <div style={{
        padding: "14px 16px 4px", display: "flex",
        alignItems: "center", gap: "8px", flexShrink: 0,
      }}>
        <button onClick={() => setScreen(SCREEN.PICKER)} style={{
          width: "32px", height: "32px", background: "#162a18",
          border: "0.5px solid #2a4a2e", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="#4a9c5a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "14px", fontWeight: 500, color: "#c8e6c9" }}>
            {stops[stopIndex].name}
          </div>
          <div style={{ fontSize: "10px", color: "#3d6b42", marginTop: "1px" }}>
            {direction === "forward" ? "Khanna Pul → T-Chowk" : "T-Chowk → Khanna Pul"}
          </div>
        </div>

        {/* Favourite star */}
        <button onClick={toggleFavourite} title={isFav ? "Remove favourite" : "Save stop"} style={{
          width: "32px", height: "32px",
          background: isFav ? "#1e3a20" : "#111f12",
          border: `0.5px solid ${isFav ? "#4ade80" : "#1e3320"}`,
          borderRadius: "50%", display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer", fontSize: "15px",
        }}>
          {isFav ? "⭐" : "☆"}
        </button>

        {/* Notification bell */}
        <button onClick={requestNotifications} title="5-min bus alerts" style={{
          width: "32px", height: "32px",
          background: notifStatus === "granted" ? "#1e3a20" : "#111f12",
          border: `0.5px solid ${notifStatus === "granted" ? "#4ade80" : "#1e3320"}`,
          borderRadius: "50%", display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer", fontSize: "15px",
        }}>
          {notifStatus === "granted" ? "🔔" : "🔕"}
        </button>

        {/* Clock */}
        <div style={{
          fontFamily: "monospace", fontSize: "12px", color: "#4a9c5a",
          background: "#111f12", border: "0.5px solid #1e3320",
          borderRadius: "8px", padding: "4px 10px",
        }}>
          {timeStr}
        </div>
      </div>

      {/* Banners */}
      {isFav && (
        <div style={{
          margin: "4px 14px 0", background: "#162a18", border: "0.5px solid #2a4a2e",
          borderRadius: "10px", padding: "7px 12px", fontSize: "11px", color: "#4ade80",
        }}>
          ⭐ Saved — app opens here next time
        </div>
      )}
      {notifStatus === "granted" && (
        <div style={{
          margin: "4px 14px 0", background: "#162a18", border: "0.5px solid #2a4a2e",
          borderRadius: "10px", padding: "7px 12px", fontSize: "11px", color: "#4ade80",
        }}>
          🔔 You'll be alerted 5 min before each bus
        </div>
      )}

      <DirectionToggle direction={direction} onChange={handleDirectionChange} />

      {/* Tab switcher */}
      <div style={{
        margin: "0 14px 10px", background: "#111f12",
        border: "0.5px solid #1e3320", borderRadius: "10px",
        padding: "3px", display: "flex", gap: "3px", flexShrink: 0,
      }}>
        {[["home", "Next Bus"], ["times", "All Times"]].map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, padding: "8px", borderRadius: "8px", fontSize: "11px",
            fontWeight: activeTab === tab ? 600 : 400, border: "none", cursor: "pointer",
            background: activeTab === tab ? "#1e3a20" : "transparent",
            color:      activeTab === tab ? "#4ade80" : "#3d6b42",
            transition: "all 0.2s",
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {activeTab === "home" ? (
          <>
            <NextBusPanel arrivals={arrivals} nowSecs={nowSecs} direction={direction} stopIndex={stopIndex} />
            <div style={{
              padding: "8px 16px 6px", fontSize: "10px", color: "#3d6b42",
              letterSpacing: ".08em", textTransform: "uppercase",
            }}>
              Coming up
            </div>
            {arrivals.filter((a) => a.arrSecs >= nowSecs - 30).slice(1, 4).map((bus, i) => {
              const diff = bus.arrSecs - nowSecs;
              return (
                <div key={i} style={{
                  margin: "0 14px 8px", background: "#111f12",
                  border: "0.5px solid #1e3320", borderRadius: "13px",
                  padding: "12px 14px", display: "flex", alignItems: "center",
                  gap: "12px", opacity: 1 - i * 0.2,
                }}>
                  <div style={{
                    width: "30px", height: "30px", borderRadius: "8px",
                    background: "#0f1a0f", border: "0.5px solid #1e3320",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "10px", color: "#2d4a30", fontWeight: 600, flexShrink: 0,
                  }}>#{bus.index}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "16px", fontWeight: 500, fontFamily: "monospace", color: "#7a9e7e" }}>
                      {minsToHHMM(Math.round(bus.arrMins))}
                    </div>
                    <div style={{ fontSize: "10px", color: "#2d4a30", marginTop: "2px" }}>
                      → {stops[stops.length - 1].name}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#3d6b42" }}>
                      {minsToHHMM(Math.round(diff / 60))}
                    </div>
                    <div style={{ fontSize: "9px", color: "#2d4a30" }}>away</div>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <Timetable arrivals={arrivals} nowSecs={nowSecs} direction={direction} stopIndex={stopIndex} />
        )}
      </div>

      <nav className="bottom-nav">
        <NavIcon name="home"  active={activeTab === "home"}  onClick={() => setActiveTab("home")} />
        <NavIcon name="times" active={activeTab === "times"} onClick={() => setActiveTab("times")} />
        <NavIcon name="stops" active={false} onClick={() => setScreen(SCREEN.PICKER)} />
      </nav>
    </div>
  );
}
