import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  Bus,
  Clock,
  Split,
  Siren,
  HeartPulse,
  Route as RouteIcon,
  Fuel,
  Download,
  Megaphone,
  Search,
  ChevronRight,
  Map as MapIcon,
  List,
  Columns2,
  Maximize,
  Minimize,
  Crosshair,
  Layers,
  Satellite,
  Plus,
  Minus,
  Radio,
  User,
  Navigation,
  TriangleAlert,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { highlightText } from "@/lib/highlightText";

import "./livefleet.css";

/*
  ─── Setup ───────────────────────────────────────────────────────
  npm install leaflet react-leaflet lucide-react
      (React 18 → use  react-leaflet@4 ;  React 19 → react-leaflet@5)
  npx shadcn@latest add badge button card input select tabs

  WHAT IS REAL IN THIS FILE
  • The map, tiles (CARTO / OpenStreetMap, Esri satellite), zoom, pan.
  • Route lines: real road geometry fetched from the OSRM routing
    service between real KPK locations (Peshawar, Mardan, Nowshera,
    Charsadda…). Falls back to straight lines if OSRM is unreachable.
  • Vehicle movement is computed along those real road lines.

  WHAT YOU MUST CONNECT FOR PRODUCTION
  • `useFleetSimulation()` stands in for your GPS feed. Replace it with
    a WebSocket / API hook that returns vehicles in the same shape
    (id, driver, lat, lng, speed, seats, capacity, fuel, status…).
  • The public OSRM demo server is fine for an FYP. For production,
    host your own OSRM or use OpenRouteService.
  ─────────────────────────────────────────────────────────────────
*/

/* ================================================================== */
/*  Config & static data                                               */
/* ================================================================== */

const MAP_CENTER = [34.09, 71.76];
const TIME_SCALE = 20; // simulation speed-up so movement is visible
const SPEED_LIMIT = 75;

const TILES = {
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics",
  },
};

const ROUTE_COLORS = {
  normal: "#16a34a",
  congestion: "#f59e0b",
  brt: "#3b82f6",
};

/* Real locations (lat, lng). Roads are snapped to by OSRM. */
const ROUTES = [
  {
    id: "peshawar-mardan",
    name: "Peshawar → Mardan",
    type: "normal",
    loop: false,
    waypoints: [
      [34.0151, 71.5249],
      [34.1989, 72.0231],
    ],
  },
  {
    id: "peshawar-nowshera",
    name: "Peshawar → Nowshera",
    type: "brt",
    loop: false,
    waypoints: [
      [34.0151, 71.5249],
      [34.0153, 71.9747],
    ],
  },
  {
    id: "peshawar-charsadda",
    name: "Peshawar → Charsadda",
    type: "normal",
    loop: false,
    waypoints: [
      [34.0151, 71.5249],
      [34.1453, 71.7308],
    ],
  },
  {
    id: "ring-road",
    name: "Ring Road Circular",
    type: "congestion",
    loop: true,
    waypoints: [
      [33.984, 71.429],
      [34.048, 71.538],
      [34.022, 71.637],
      [33.955, 71.595],
      [33.984, 71.429],
    ],
  },
];

const ROUTE_BY_ID = Object.fromEntries(ROUTES.map((r) => [r.id, r]));

const TERMINALS = [
  {
    id: "mardan",
    kicker: "TRANSIT HUB",
    name: "Mardan Terminal",
    pos: [34.1989, 72.0231],
  },
  {
    id: "depot",
    kicker: "DEPOT ALPHA",
    name: "City Terminal",
    pos: [34.005, 71.548],
  },
];

/* Starting state for the simulated fleet – replace with your live feed */
const FLEET_SEED = [
  { id: "PK-102", driver: "Muhammad Ali", routeId: "peshawar-mardan", progress: 0.32, dir: 1, baseSpeed: 54, seats: 32, capacity: 45, fuel: 68, sos: true },
  { id: "PK-101", driver: "Arshad Khan", routeId: "peshawar-nowshera", progress: 0.22, dir: 1, baseSpeed: 62, seats: 28, capacity: 45, fuel: 84 },
  { id: "PK-145", driver: "Zubair Shah", routeId: "peshawar-charsadda", progress: 0.55, dir: 1, baseSpeed: 48, seats: 22, capacity: 45, fuel: 72, deviation: true },
  { id: "PK-221", driver: "Bilal Ahmad", routeId: "ring-road", progress: 0.4, dir: 1, baseSpeed: 77, seats: 45, capacity: 45, fuel: 45 },
  { id: "PK-108", driver: "Naveed Qureshi", routeId: "peshawar-nowshera", progress: 0.72, dir: -1, baseSpeed: 58, seats: 30, capacity: 45, fuel: 80 },
  { id: "PK-331", driver: "Kamran Jan", routeId: "peshawar-charsadda", progress: 0.12, dir: 1, baseSpeed: 0, seats: 0, capacity: 45, fuel: 90, stopped: true },
];

/* Fleet-wide numbers normally supplied by your backend */
const DEFAULT_SUMMARY = {
  total: 135,
  active: 128,
  full: 14,
  stopped: 5,
  offRoute: 3,
  onTimeIndex: "94.8%",
  deviations: 3,
  priorityAlarms: 3,
  healthScore: "96.4%",
  kmToday: "18,420 km",
  fuelIndex: "94%",
};

const DEFAULT_CORRIDOR = { name: "Peshawar Basin", code: "GT-N5", units: 92 };

const STATUS_UI = {
  sos: { label: "EMERGENCY SOS", tone: "danger", tag: "SOS", rank: 0 },
  deviated: { label: "OFF ROUTE", tone: "warning", tag: "DEV", rank: 1 },
  full: { label: "FULL", tone: "warning", tag: "FULL", rank: 2 },
  active: { label: "ACTIVE", tone: "success", tag: null, rank: 3 },
  stopped: { label: "STOPPED", tone: "muted", tag: null, rank: 4 },
};

/* ================================================================== */
/*  Geometry helpers                                                   */
/* ================================================================== */

const toRad = (d) => (d * Math.PI) / 180;

const haversineKm = ([lat1, lng1], [lat2, lng2]) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
};

const buildPath = (line) => {
  const cum = [0];
  for (let i = 1; i < line.length; i++) {
    cum.push(cum[i - 1] + haversineKm(line[i - 1], line[i]));
  }
  return { line, cum, total: cum[cum.length - 1] || 1 };
};

const pointAt = ({ line, cum, total }, km) => {
  const d = Math.min(Math.max(km, 0), total);
  let lo = 0;
  let hi = cum.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] <= d) lo = mid;
    else hi = mid;
  }
  const seg = cum[hi] - cum[lo] || 1;
  const t = (d - cum[lo]) / seg;
  return [
    line[lo][0] + (line[hi][0] - line[lo][0]) * t,
    line[lo][1] + (line[hi][1] - line[lo][1]) * t,
  ];
};

/* ================================================================== */
/*  Real road routing (OSRM)                                           */
/* ================================================================== */

async function fetchRoadRoute(waypoints) {
  const key = "lf-route:" + waypoints.map((p) => p.join(",")).join("|");
  try {
    const cached = sessionStorage.getItem(key);
    if (cached) return JSON.parse(cached);
  } catch {
    /* storage unavailable – ignore */
  }

  const coords = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OSRM ${res.status}`);

  const data = await res.json();
  const line = data?.routes?.[0]?.geometry?.coordinates?.map(([lng, lat]) => [lat, lng]);
  if (!line || line.length < 2) throw new Error("No route geometry");

  try {
    sessionStorage.setItem(key, JSON.stringify(line));
  } catch {
    /* ignore */
  }
  return line;
}

function useRoadRoutes() {
  const [geo, setGeo] = useState(() =>
    Object.fromEntries(ROUTES.map((r) => [r.id, r.waypoints]))
  );
  const [status, setStatus] = useState("loading"); // loading | ready | partial | fallback

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled(ROUTES.map((r) => fetchRoadRoute(r.waypoints))).then((results) => {
      if (cancelled) return;
      const next = {};
      let failed = 0;
      results.forEach((res, i) => {
        if (res.status === "fulfilled") next[ROUTES[i].id] = res.value;
        else {
          next[ROUTES[i].id] = ROUTES[i].waypoints;
          failed += 1;
        }
      });
      setGeo(next);
      setStatus(failed === 0 ? "ready" : failed === ROUTES.length ? "fallback" : "partial");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { geo, status };
}

/* ================================================================== */
/*  Fleet feed (SIMULATED – replace with WebSocket / API)              */
/* ================================================================== */

function useFleetSimulation(paths) {
  const pathsRef = useRef(paths);
  pathsRef.current = paths;

  const simRef = useRef(FLEET_SEED.map((v) => ({ ...v, noise: 0 })));

  const compute = useCallback(
    () =>
      simRef.current.map((v) => {
        const path = pathsRef.current[v.routeId];
        const route = ROUTE_BY_ID[v.routeId];
        const [routeLat, routeLng] = pointAt(path, v.progress * path.total);

        // A deviating bus is displaced from its assigned road
        const lat = v.deviation ? routeLat - 0.006 : routeLat;
        const lng = v.deviation ? routeLng + 0.007 : routeLng;

        const speed = v.stopped ? 0 : Math.max(0, Math.round(v.baseSpeed + v.noise));

        let status = "active";
        if (v.sos) status = "sos";
        else if (v.deviation) status = "deviated";
        else if (v.stopped) status = "stopped";
        else if (v.seats >= v.capacity) status = "full";

        return {
          id: v.id,
          driver: v.driver,
          routeId: v.routeId,
          routeName: route.name,
          lat,
          lng,
          routeLat,
          routeLng,
          speed,
          speedWarning: speed >= SPEED_LIMIT,
          seats: v.seats,
          capacity: v.capacity,
          fuel: v.fuel,
          status,
        };
      }),
    []
  );

  const [vehicles, setVehicles] = useState(compute);
  const [syncedAt, setSyncedAt] = useState(Date.now());

  useEffect(() => {
    let animId;
    let lastTime = performance.now();
    let lastSync = Date.now();

    const loop = (time) => {
      const dtMs = Math.min(time - lastTime, 100);
      lastTime = time;
      const dtHours = dtMs / 3600000;

      let moved = false;
      simRef.current.forEach((v) => {
        if (v.stopped) return;
        const path = pathsRef.current[v.routeId];
        if (!path || !path.total) return;

        const speed = v.baseSpeed + v.noise;
        const dKm = speed * dtHours * TIME_SCALE;
        let p = v.progress + (v.dir * dKm) / path.total;

        if (ROUTE_BY_ID[v.routeId]?.loop) {
          p = (p + 1) % 1;
        } else if (p >= 1) {
          p = 1;
          v.dir = -1;
        } else if (p <= 0) {
          p = 0;
          v.dir = 1;
        }
        v.progress = p;
        moved = true;
      });

      if (moved) {
        setVehicles(compute());
      }

      const now = Date.now();
      if (now - lastSync >= 2000) {
        lastSync = now;
        setSyncedAt(now);
        simRef.current.forEach((v) => {
          if (!v.stopped) {
            v.noise = Math.round(Math.random() * 4 - 2);
          }
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [compute]);

  return { vehicles, syncedAt };
}

/* ================================================================== */
/*  Leaflet icons                                                      */
/* ================================================================== */

const BUS_SVG = renderToStaticMarkup(<Bus size={14} strokeWidth={2.2} color="#ffffff" />);
const ALERT_SVG = renderToStaticMarkup(
  <TriangleAlert size={15} strokeWidth={2.4} color="#ffffff" />
);

const iconCache = {};

const vehicleIcon = (v) => {
  const key = `${v.status}|${v.id}`;
  if (iconCache[key]) return iconCache[key];

  const tag = STATUS_UI[v.status].tag;
  const label = tag ? `${v.id} (${tag})` : v.id;
  const glyph = v.status === "sos" ? ALERT_SVG : BUS_SVG;

  iconCache[key] = L.divIcon({
    className: "lf-divicon",
    iconSize: [90, 52],
    iconAnchor: [45, 16],
    html: `
      <div class="lf-pin lf-pin--${v.status}">${glyph}</div>
      <span class="lf-pin__label lf-pin__label--${v.status}">${label}</span>
    `,
  });
  return iconCache[key];
};

const terminalIcon = (t) =>
  L.divIcon({
    className: "lf-divicon",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `
      <div class="lf-terminal">
        <span class="lf-terminal__kicker">${t.kicker}</span>
        <span class="lf-terminal__name">${t.name}</span>
      </div>
    `,
  });

/* ================================================================== */
/*  Small components                                                   */
/* ================================================================== */

const StatCard = ({ icon: Icon, tone = "blue", label, value, sub, note }) => (
  <Card className={`lf-card lf-stat lf-stat--${tone}`}>
    <div className="lf-stat__top">
      <span className="lf-stat__label">{label}</span>
      <div className={`lf-stat__icon lf-stat__icon--${tone}`}>
        <Icon size={14} strokeWidth={2.2} />
      </div>
    </div>
    <div className="lf-stat__main">
      <strong className={`lf-stat__value${tone === "red" ? " lf-stat__value--red" : ""}`}>
        {value}
        {sub && <small>{sub}</small>}
      </strong>
      {note && <span className="lf-stat__note">{note}</span>}
    </div>
    <div className={`lf-stat__bar lf-stat__bar--${tone}`} />
  </Card>
);

const VehicleCard = ({ v, query, selected, tracking, onSelect, onTrack, onInspect }) => {
  const ui = STATUS_UI[v.status];
  const pct = v.capacity ? Math.round((v.seats / v.capacity) * 100) : 0;
  const atCapacity = pct >= 100;
  const barTone = atCapacity ? "danger" : pct >= 85 ? "warning" : "blue";

  const note =
    v.status === "sos"
      ? { text: "Panic Button", tone: "danger", icon: TriangleAlert }
      : v.status === "deviated"
        ? { text: "Route Deviation", tone: "warning" }
        : v.status === "stopped"
          ? { text: "Parked", tone: "muted" }
          : v.speedWarning
            ? { text: "Speed Warning", tone: "warning" }
            : { text: "On Schedule", tone: "success" };
  const NoteIcon = note.icon;

  return (
    <article
      className={`lf-unit lf-unit--${ui.tone}${selected ? " lf-unit--selected" : ""}`}
      onClick={onSelect}
    >
      <div className="lf-unit__top">
        <div className="lf-unit__title">
          <h4>Unit {highlightText(v.id, query)}</h4>
          <Badge className={`lf-pill lf-pill--${ui.tone}`}>
            {v.status === "sos" && <Siren size={10} strokeWidth={2.4} />}
            {v.status === "active" && <span className="lf-pill__dot" />}
            {ui.label}
          </Badge>
        </div>

        <div className={`lf-unit__speed${v.speedWarning ? " lf-unit__speed--warn" : ""}${v.status === "sos" ? " lf-unit__speed--sos" : ""}`}>
          <div>
            <strong>{v.speed}</strong>
            <span>km/h</span>
          </div>
          {v.speedWarning && <em>Speed Warning</em>}
        </div>
      </div>

      <div className="lf-unit__meta">
        <span>
          <User size={11} /> {highlightText(v.driver, query)}
        </span>
        <span>
          <Navigation size={11} /> {highlightText(v.routeName, query)}
        </span>
      </div>

      <div className="lf-unit__occ">
        <div className="lf-unit__occ-head">
          <span>Occupancy Load</span>
          <strong className={atCapacity ? "lf-text-danger" : ""}>
            {v.seats} / {v.capacity} seats ({pct}%{atCapacity ? " AT CAPACITY" : ""})
          </strong>
        </div>
        <div className="lf-bar">
          <div className={`lf-bar__fill lf-bar__fill--${barTone}`} style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="lf-unit__foot">
        <span className="lf-unit__fuel">
          <Fuel size={11} /> Fuel: {v.fuel}%
        </span>
        <span className={`lf-unit__note lf-unit__note--${note.tone}`}>
          {NoteIcon && <NoteIcon size={11} />}
          {note.text}
        </span>
        <div className="lf-unit__actions">
          <Button
            className={`lf-btn-track${tracking ? " lf-btn-track--on" : ""}`}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onTrack();
            }}
          >
            {tracking ? "Tracking…" : "Track Live"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="lf-btn-inspect"
            onClick={(e) => {
              e.stopPropagation();
              onInspect?.(v);
            }}
          >
            Inspect
          </Button>
        </div>
      </div>
    </article>
  );
};

/* ================================================================== */
/*  Page                                                               */
/* ================================================================== */

const LiveFleet = ({
  summary = DEFAULT_SUMMARY,
  corridor = DEFAULT_CORRIDOR,
  onInspect,
  onBroadcast,
  onOpenDirectory,
}) => {
  const { geo, status: routeStatus } = useRoadRoutes();
  const paths = useMemo(
    () => Object.fromEntries(ROUTES.map((r) => [r.id, buildPath(geo[r.id])])),
    [geo]
  );
  const { vehicles, syncedAt } = useFleetSimulation(paths);

  const [viewMode, setViewMode] = useState("map"); // map | list | split
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [routeFilter, setRouteFilter] = useState("all");
  const [satellite, setSatellite] = useState(false);
  const [showRoutes, setShowRoutes] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [trackedId, setTrackedId] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [map, setMap] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [now, setNow] = useState(Date.now());
  const wrapRef = useRef(null);

  /* "synced Xs ago" ticker */
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, []);
  const secondsAgo = Math.max(1, Math.round((now - syncedAt) / 1000));

  /* Track what is in the map viewport */
  useEffect(() => {
    if (!map) return;
    const update = () => setBounds(map.getBounds());
    update();
    map.on("moveend", update);
    return () => map.off("moveend", update);
  }, [map]);

  /* Stop following when the user drags the map */
  useEffect(() => {
    if (!map) return;
    const stop = () => setTrackedId(null);
    map.on("dragstart", stop);
    return () => map.off("dragstart", stop);
  }, [map]);

  /* Initial focus when trackedId changes */
  useEffect(() => {
    if (!map || !trackedId) return;
    const v = vehicles.find((x) => x.id === trackedId);
    if (v) map.setView([v.lat, v.lng], Math.max(map.getZoom(), 13), { animate: true });
  }, [map, trackedId]);

  /* Follow the tracked vehicle smoothly every frame like Google Maps */
  useEffect(() => {
    if (!map || !trackedId) return;
    const v = vehicles.find((x) => x.id === trackedId);
    if (v) map.panTo([v.lat, v.lng], { animate: false });
  }, [map, trackedId, vehicles]);

  /* Re-measure the map when the layout changes */
  useEffect(() => {
    if (!map) return;
    const t = setTimeout(() => map.invalidateSize(), 150);
    return () => clearTimeout(t);
  }, [map, viewMode, isFullscreen]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  /* Filtering */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vehicles.filter((v) => {
      if (filter === "active" && v.status === "stopped") return false;
      if (filter === "full" && v.status !== "full") return false;
      if (filter === "stopped" && v.status !== "stopped") return false;
      if (filter === "off-route" && v.status !== "deviated") return false;
      if (routeFilter !== "all" && v.routeId !== routeFilter) return false;
      if (q && !`${v.id} ${v.driver} ${v.routeName}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [vehicles, filter, routeFilter, query]);

  const panelList = useMemo(() => {
    const base =
      viewMode === "list" || !bounds
        ? filtered
        : filtered.filter((v) => bounds.contains([v.lat, v.lng]));
    return [...base].sort((a, b) => STATUS_UI[a.status].rank - STATUS_UI[b.status].rank);
  }, [filtered, bounds, viewMode]);

  /* Map actions */
  const fitFleet = () => {
    if (!map || filtered.length === 0) return;
    setTrackedId(null);
    map.fitBounds(
      L.latLngBounds(filtered.map((v) => [v.lat, v.lng])).pad(0.4),
      { animate: true, maxZoom: 12 }
    );
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else wrapRef.current?.requestFullscreen?.();
  };

  const exportCsv = () => {
    const header = ["Unit", "Driver", "Route", "Status", "Speed (km/h)", "Seats", "Capacity", "Fuel %", "Lat", "Lng"];
    const rows = vehicles.map((v) => [
      v.id,
      v.driver,
      v.routeName,
      STATUS_UI[v.status].label,
      v.speed,
      v.seats,
      v.capacity,
      v.fuel,
      v.lat.toFixed(5),
      v.lng.toFixed(5),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fleet-telemetry-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const chips = [
    { value: "all", label: "All", count: summary.total },
    { value: "active", label: "Active", count: summary.active },
    { value: "full", label: "Full", count: summary.full },
    { value: "stopped", label: "Stopped", count: summary.stopped },
    { value: "off-route", label: "Off Route", count: summary.offRoute },
  ];

  const tile = satellite ? TILES.satellite : TILES.street;
  const showMap = viewMode !== "list";

  return (
    <div className="lf-page">
      {/* ---------- Executive Control Panel ---------- */}
      <div className="lf-control-card">
        {/* Top Row: Title, Status, and View Mode Tabs */}
        <div className="lf-control-top">
          <div className="lf-control-title-block">
            <div className="lf-control-heading">
              <span className="lf-kicker">DIVISION KP-01</span>
              <span className="lf-sep">•</span>
              <h1 className="lf-title">Live Fleet</h1>
              <Badge className="lf-badge-live">
                <span className="lf-live-dot" /> Live Telemetry
              </Badge>
            </div>
            <p className="lf-subtitle">
              Comprehensive real-time geospatial tracking, route adherence, and vehicle telemetry.
            </p>
          </div>

          <div className="lf-control-top-right">
            <div className="lf-feed">
              <span className="lf-feed__dot" />
              <strong className="lf-feed__text">Live Feed (Streaming)</strong>
              <span className="lf-feed__sync">synced {secondsAgo}s ago</span>
            </div>

            <Tabs value={viewMode} onValueChange={setViewMode} className="lf-tabs-root">
              <TabsList className="lf-viewtabs">
                <TabsTrigger value="map" className="lf-viewtab">
                  <MapIcon size={13} /> Map View
                </TabsTrigger>
                <TabsTrigger value="list" className="lf-viewtab">
                  <List size={13} /> List View
                </TabsTrigger>
                <TabsTrigger value="split" className="lf-viewtab">
                  <Columns2 size={13} /> Split View
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Bottom Row: Filter Chips, Search, and Route Filter */}
        <div className="lf-control-bottom">
          <div className="lf-chips">
            {chips.map((c) => (
              <button
                key={c.value}
                type="button"
                className={"lf-chip" + (filter === c.value ? " lf-chip--active" : "")}
                onClick={() => setFilter(c.value)}
              >
                <span className="lf-chip__label">{c.label}</span>
                <span className="lf-chip__count">{c.count}</span>
              </button>
            ))}
          </div>

          <div className="lf-bottom-controls">
            <div className="lf-search">
              <Search size={13} className="lf-search-icon" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search unit, driver, route..."
                className="lf-search__input"
              />
              {query && (
                <button
                  type="button"
                  className="lf-search-clear"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <div className="lf-route-box">
              <RouteIcon size={13} className="lf-route-icon" />
              <select
                value={routeFilter}
                onChange={(e) => setRouteFilter(e.target.value)}
                className="lf-route-select"
              >
                <option value="all">All Routes (KP Provincial)</option>
                {ROUTES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Map + telemetry panel ---------- */}
      <div className={`lf-main lf-main--${viewMode}`}>
        <div ref={wrapRef} className={"lf-map-wrap" + (showMap ? "" : " lf-map-wrap--hidden")}>
          <MapContainer
            ref={setMap}
            center={MAP_CENTER}
            zoom={10}
            minZoom={7}
            zoomControl={false}
            scrollWheelZoom
            className="lf-map"
          >
            <TileLayer key={satellite ? "sat" : "street"} url={tile.url} attribution={tile.attribution} />

            {/* Real road routes with a white casing underneath */}
            {showRoutes &&
              ROUTES.map((r) => (
                <React.Fragment key={r.id}>
                  <Polyline
                    positions={geo[r.id]}
                    pathOptions={{ color: "#ffffff", weight: 9, opacity: 0.75, lineCap: "round" }}
                  />
                  <Polyline
                    positions={geo[r.id]}
                    pathOptions={{ color: ROUTE_COLORS[r.type], weight: 5, opacity: 0.95, lineCap: "round" }}
                  />
                </React.Fragment>
              ))}

            {/* Deviation link: where the bus is vs where it should be */}
            {filtered
              .filter((v) => v.status === "deviated")
              .map((v) => (
                <Polyline
                  key={`dev-${v.id}`}
                  positions={[
                    [v.lat, v.lng],
                    [v.routeLat, v.routeLng],
                  ]}
                  pathOptions={{ color: "#dc2626", weight: 2, dashArray: "4 6" }}
                />
              ))}

            {TERMINALS.map((t) => (
              <Marker key={t.id} position={t.pos} icon={terminalIcon(t)} interactive={false} />
            ))}

            {filtered.map((v) => (
              <Marker
                key={v.id}
                position={[v.lat, v.lng]}
                icon={vehicleIcon(v)}
                zIndexOffset={v.status === "sos" ? 1000 : 0}
                eventHandlers={{ click: () => setSelectedId(v.id) }}
              >
                <Popup>
                  <div className="lf-popup">
                    <strong>Unit {v.id}</strong>
                    <span>{v.driver}</span>
                    <span>{v.routeName}</span>
                    <span>
                      {v.speed} km/h • {v.seats}/{v.capacity} seats
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Corridor card */}
          <div className="lf-corridor">
            <div className="lf-corridor__head">
              <span>ACTIVE CORRIDOR</span>
              <Badge className="lf-corridor__code">{corridor.code}</Badge>
            </div>
            <h3>{corridor.name}</h3>
            <p>• {corridor.units} Units Active</p>
            <div className="lf-legend">
              <span><i style={{ background: ROUTE_COLORS.normal }} /> Normal Traffic</span>
              <span><i style={{ background: ROUTE_COLORS.congestion }} /> Congestion</span>
              <span><i style={{ background: ROUTE_COLORS.brt }} /> BRT Track</span>
            </div>
          </div>

          {/* Routing status */}
          {routeStatus !== "ready" && (
            <div className={`lf-routing lf-routing--${routeStatus}`}>
              {routeStatus === "loading" && "Snapping routes to the road network…"}
              {routeStatus === "partial" && "Some routes could not be snapped to roads."}
              {routeStatus === "fallback" && "Routing service unreachable — showing straight lines."}
            </div>
          )}

          {/* Bottom-left tools */}
          <div className="lf-tools">
            <button type="button" aria-label="Fullscreen" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
            </button>
            <button type="button" aria-label="Fit whole fleet" onClick={fitFleet}>
              <Crosshair size={14} />
            </button>
            <button
              type="button"
              aria-label="Toggle route layer"
              className={showRoutes ? "is-on" : ""}
              onClick={() => setShowRoutes((s) => !s)}
            >
              <Layers size={14} />
            </button>
            <span className="lf-tools__sep" />
            <button
              type="button"
              className={"lf-tools__sat" + (satellite ? " is-on" : "")}
              onClick={() => setSatellite((s) => !s)}
            >
              <Satellite size={14} /> Satellite
            </button>
          </div>

          {/* Zoom */}
          <div className="lf-zoom">
            <button type="button" aria-label="Zoom in" onClick={() => map?.zoomIn()}>
              <Plus size={15} />
            </button>
            <button type="button" aria-label="Zoom out" onClick={() => map?.zoomOut()}>
              <Minus size={15} />
            </button>
          </div>
        </div>

        {/* Telemetry panel */}
        <Card className="lf-card lf-panel">
          <div className="lf-panel__head">
            <div className="lf-panel__title">
              <Radio size={15} />
              <h3>Active Units Telemetry</h3>
            </div>
            <Badge className="lf-chip-info">
              {panelList.length} {viewMode === "list" ? "Listed" : "Live In-View"}
            </Badge>
          </div>

          <div className="lf-panel__list">
            {panelList.length === 0 && (
              <p className="lf-panel__empty">No units match the current view or filters.</p>
            )}
            {panelList.map((v) => (
              <VehicleCard
                key={v.id}
                v={v}
                query={query}
                selected={selectedId === v.id}
                tracking={trackedId === v.id}
                onSelect={() => setSelectedId(v.id)}
                onTrack={() => {
                  setSelectedId(v.id);
                  setTrackedId((cur) => (cur === v.id ? null : v.id));
                }}
                onInspect={onInspect}
              />
            ))}
          </div>

          <div className="lf-panel__foot">
            <span>
              Showing {panelList.length} of {summary.total} monitored units
            </span>
            <button type="button" onClick={onOpenDirectory}>
              Fleet Directory <ChevronRight size={13} />
            </button>
          </div>
        </Card>
      </div>

      {/* ---------- Summary stats (Balanced 4x2 Grid) ---------- */}
      <div className="lf-stats-grid">
        <StatCard
          icon={Bus}
          tone="blue"
          label="Active Transit Units"
          value={summary.active}
          sub={`/ ${summary.total}`}
          note="94.8% Operational Capacity"
        />
        <StatCard
          icon={Clock}
          tone="green"
          label="On-Time Adherence"
          value={summary.onTimeIndex}
          note="Benchmark Target > 90%"
        />
        <StatCard
          icon={Split}
          tone="orange"
          label="Route Deviations"
          value={summary.deviations}
          sub="Buses"
          note="1 Off-Corridor Investigating"
        />
        <StatCard
          icon={Siren}
          tone="red"
          label="Priority Alarms"
          value={summary.priorityAlarms}
          sub="Units"
          note="1 Critical SOS Ongoing"
        />

        <StatCard
          icon={HeartPulse}
          tone="green"
          label="Fleet Health Score"
          value={summary.healthScore}
          note="Optimal Engine & Brakes"
        />
        <StatCard
          icon={RouteIcon}
          tone="blue"
          label="Total Distance Today"
          value={summary.kmToday}
          note="Across 4 Provincial Routes"
        />
        <StatCard
          icon={Fuel}
          tone="blue"
          label="Fuel Efficiency Index"
          value={summary.fuelIndex}
          note="Avg. 3.8 km/L Fleet Economy"
        />

        <Card className="lf-card lf-stat-actions">
          <div className="lf-stat-actions__head">
            <div className="lf-stat-actions__title">
              <Megaphone size={12} className="lf-actions-icon" />
              <span>OPERATIONS COMMAND</span>
            </div>
            <span className="lf-actions-pulse" />
          </div>
          <div className="lf-stat-actions__btns">
            <Button variant="outline" className="lf-btn-csv" onClick={exportCsv}>
              <Download size={12} strokeWidth={2} /> Export CSV
            </Button>
            <Button className="lf-btn-broadcast" onClick={onBroadcast}>
              <Megaphone size={12} strokeWidth={2} /> Broadcast
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LiveFleet;