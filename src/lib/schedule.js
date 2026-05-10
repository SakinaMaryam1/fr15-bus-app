// ─── STOPS ────────────────────────────────────────────────────────────────────
// offset = seconds after trip start time when bus arrives at this stop

export const FORWARD_STOPS = [
  { name: "Khanna Pul",           offset: 0    },
  { name: "Fazaia",               offset: 90   },
  { name: "Gangal",               offset: 215  },
  { name: "Koral Town",           offset: 350  },
  { name: "Gulberg",              offset: 460  },
  { name: "Pagh Chowk",          offset: 585  },
  { name: "PWD Housing Society",  offset: 720  },
  { name: "Soan Gardens E Block", offset: 830  },
  { name: "Soan Gardens G Block", offset: 955  },
  { name: "Soan Gardens H Block", offset: 1090 },
  { name: "River Gardens",        offset: 1200 },
  { name: "Kaak Pul",             offset: 1325 },
  { name: "DHA Gate 08",          offset: 1460 },
  { name: "DHA Gate 07",          offset: 1570 },
  { name: "SUPARCO",              offset: 1695 },
  { name: "T-Chowk",             offset: 1830 },
];

export const BACKWARD_STOPS = [
  { name: "T-Chowk",             offset: 0    },
  { name: "SUPARCO",              offset: 120  },
  { name: "DHA Gate 07",          offset: 260  },
  { name: "DHA Gate 08",          offset: 400  },
  { name: "Kaak Pul",             offset: 540  },
  { name: "River Gardens",        offset: 680  },
  { name: "Soan Gardens H Block", offset: 820  },
  { name: "Soan Gardens G Block", offset: 960  },
  { name: "Soan Gardens E Block", offset: 1100 },
  { name: "PWD Housing Society",  offset: 1240 },
  { name: "Pagh Chowk",          offset: 1380 },
  { name: "Gulberg",              offset: 1520 },
  { name: "Koral Town",           offset: 1660 },
  { name: "Gangal",               offset: 1800 },
  { name: "Fazaia",               offset: 1940 },
  { name: "Khanna Pul",           offset: 2080 },
];

// ─── TRIP START TIMES (minutes from midnight) ─────────────────────────────────

export const FORWARD_TRIPS = [
  360, 390, 420, 450, 480, 510, 540, 570, 600, 630, 660, 690,
  720, 750, 780, 810, 840, 870, 900, 930, 960, 990, 1020, 1050,
  1080, 1110, 1140, 1170, 1200, 1230, 1260, 1290, 1320,
];

export const BACKWARD_TRIPS = [
  410, 440, 470, 500, 530, 560, 590, 620, 650, 680, 710, 740,
  770, 800, 830, 860, 890, 920, 950, 980, 1010, 1040, 1070, 1100,
  1130, 1160, 1190, 1220, 1250, 1280, 1310, 1320,
];

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

// Convert minutes-from-midnight to "HH:MM" string
export function minsToHHMM(mins) {
  const h = Math.floor(mins / 60) % 24;
  const m = Math.floor(mins % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// Get current time as minutes from midnight (with seconds as decimal)
export function nowMins() {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes() + n.getSeconds() / 60;
}

// Get arrival time (in minutes) for a bus at a specific stop
export function getArrivalMins(tripStartMin, stopOffsetSec) {
  return tripStartMin + stopOffsetSec / 60;
}

// Format a countdown (seconds remaining) into "Xm Ys" string
export function formatCountdown(diffSeconds) {
  if (diffSeconds < 0) return "Departed";
  const m = Math.floor(diffSeconds / 60);
  const s = Math.floor(diffSeconds % 60);
  if (m === 0) return `${s}s`;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

// Get all arrivals for a stop, sorted by time
export function getArrivalsForStop(direction, stopIndex) {
  const trips   = direction === "forward" ? FORWARD_TRIPS   : BACKWARD_TRIPS;
  const stops   = direction === "forward" ? FORWARD_STOPS   : BACKWARD_STOPS;
  const stop    = stops[stopIndex];

  return trips.map((startMin, i) => {
    const arrMins = getArrivalMins(startMin, stop.offset);
    const endMins = getArrivalMins(startMin, stops[stops.length - 1].offset);
    return {
      index:   i + 1,
      arrMins,
      endMins,
      arrSecs: arrMins * 60,
    };
  });
}
