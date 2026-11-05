import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  Bus,
  IdCard,
  Navigation,
  Users,
  Siren,
  WifiOff,
  Calendar,
  RefreshCw,
  Download,
  Search,
  Map as MapIcon,
  List,
  Plus,
  Minus,
  Phone,
  Star,
  TriangleAlert,
  ShieldAlert,
  Eye,
  Video,
  Bell,
  Gauge,
  Split,
  Hand,
  MapPin,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

import "./dashboard.css";

/*
  ─── Setup ───────────────────────────────────────────────────────
  npm install leaflet react-leaflet lucide-react
      (React 18 → react-leaflet@4 ; React 19 → react-leaflet@5)
  npx shadcn@latest add avatar badge button card input select tabs

  REAL: the map, tiles and the road geometry of the corridors
        (fetched from OSRM between real KPK locations).
  PLACEHOLDER: KPI numbers, vehicle telemetry, alerts and hail
        requests below. Replace the constants with your API data
        (same field names) when your backend is ready.
  ─────────────────────────────────────────────────────────────────
*/

/* ================================================================== */
/*  Placeholder data                                                   */
/* ================================================================== */

const KPIS = [
  { id: "vehicles", label: "Active Vehicles", value: "128", icon: Bus, chip: "+8.2%", chipIcon: TrendingUp, note: "vs yesterday", accent: "blue" },
  { id: "drivers", label: "Active Drivers", value: "132", icon: IdCard, chip: "98.5%", note: "shift attendance", accent: "emerald" },
  { id: "trips", label: "Active Trips", value: "86", icon: Navigation, chip: "14 soon", note: "completing", accent: "indigo" },
  { id: "pax", label: "Passengers Today", value: "4,821", icon: Users, chip: "+12.4%", note: "vs last Tue", accent: "cyan" },
  { id: "alerts", label: "Emergency Alerts", value: "3", icon: Siren, danger: true, chip: "CRITICAL", note: "Immediate Action", accent: "red" },
  { id: "offline", label: "Offline Vehicles", value: "7", icon: WifiOff, chip: "2 maint • 5 depot", accent: "slate" },
];

const ROUTES = [
  { id: "peshawar-mardan", name: "Peshawar → Mardan", load: 88, waypoints: [[34.0151, 71.5249], [34.1989, 72.0231]] },
  { id: "peshawar-nowshera", name: "Peshawar → Nowshera", load: 64, waypoints: [[34.0151, 71.5249], [34.0153, 71.9747]] },
];

/* t = position along the route (0 = Peshawar, 1 = far end) */
const VEHICLES = [
  {
    id: "PK-102", model: "Higer AeroBus 2022", status: "sos", routeId: "peshawar-mardan", t: 0.36,
    speed: 54, limit: 65, seats: 32, capacity: 45, fuel: 68, rangeKm: 240, heartbeat: "4s ago", sats: 12,
    corridor: "RT-04", origin: "Peshawar Cantonment", nextStop: "Nowshera Junction (4.2 km)", destination: "Mardan Central Terminal",
    driver: { name: "Muhammad Ali", rating: 4.9, badge: "DRV-4412", grade: "Grade A Senior", phone: "+92 300 5541920" },
  },
  {
    id: "PK-221", model: "Yutong ZK6122", status: "full", routeId: "peshawar-mardan", t: 0.2,
    speed: 47, limit: 60, seats: 45, capacity: 45, fuel: 45, rangeKm: 130, heartbeat: "2s ago", sats: 11,
    corridor: "RT-04", origin: "Peshawar Cantonment", nextStop: "Chamkani Interchange (2.1 km)", destination: "Mardan Central Terminal",
    driver: { name: "Bilal Ahmad", rating: 4.7, badge: "DRV-3190", grade: "Grade A", phone: "+92 301 2294410" },
  },
  {
    id: "PK-104", model: "Hino Urban Liner", status: "active", routeId: "peshawar-nowshera", t: 0.28,
    speed: 58, limit: 65, seats: 24, capacity: 45, fuel: 74, rangeKm: 310, heartbeat: "3s ago", sats: 12,
    corridor: "RT-02", origin: "Peshawar Cantonment", nextStop: "Pabbi Stop (6.0 km)", destination: "Nowshera Junction",
    driver: { name: "Arshad Khan", rating: 4.8, badge: "DRV-2087", grade: "Grade A", phone: "+92 333 8801274" },
  },
  {
    id: "PK-101", model: "Toyota Coaster", status: "active", routeId: "peshawar-nowshera", t: 0.08,
    speed: 42, limit: 50, seats: 18, capacity: 30, fuel: 83, rangeKm: 360, heartbeat: "5s ago", sats: 10,
    corridor: "RT-02", origin: "Peshawar Cantonment", nextStop: "Chamkani Interchange (3.4 km)", destination: "Nowshera Junction",
    driver: { name: "Zubair Shah", rating: 4.6, badge: "DRV-5521", grade: "Grade B", phone: "+92 345 7710982" },
  },
  {
    id: "PK-309", model: "Hino Urban Liner", status: "depot", routeId: "peshawar-mardan", t: 1,
    speed: 0, limit: 65, seats: 0, capacity: 45, fuel: 90, rangeKm: 420, heartbeat: "9s ago", sats: 9,
    corridor: "RT-04", origin: "Mardan Central Terminal", nextStop: "—", destination: "Standby",
    driver: { name: "Kamran Jan", rating: 4.5, badge: "DRV-1124", grade: "Grade B", phone: "+92 321 4400765" },
  },
];

/* Approximate landmark positions used for map labels */
const LANDMARKS = [
  { id: "mardan", name: "MARDAN CENTRAL TERMINAL", pos: [34.1989, 72.0231] },
  { id: "nowshera", name: "NOWSHERA JUNCTION", pos: [34.0153, 71.9747] },
  { id: "chamkani", name: "CHAMKANI INTERCHANGE", pos: [34.0105, 71.6275] },
  { id: "cantt", name: "PESHAWAR CANTONMENT", pos: [34.0003, 71.542] },
];

const ALERTS = [
  {
    id: 1, cat: "sos", tag: "SOS TRIGGERED", tone: "danger", icon: Siren,
    title: "Driver Muhammad Ali", time: "2 mins ago",
    detail: "Vehicle PK-102 on Peshawar → Mardan Corridor. Silent emergency switch pressed.",
    actions: [{ label: "View SOS", kind: "danger", focus: "PK-102" }, { label: "Resolve", kind: "soft", resolves: true }],
  },
  {
    id: 2, cat: "violations", tag: "SPEED EXCEEDED", tone: "muted", icon: Gauge,
    title: "PK-221 (78 km/h in 60 zone)", time: "8 mins ago",
    detail: "Ring Road East section near Gulbahar flyover. Driver warned via cabin display.",
    actions: [{ label: "Acknowledge", kind: "ghost", resolves: true }],
  },
  {
    id: 3, cat: "violations", tag: "ROUTE DEVIATION", tone: "info", icon: Split,
    title: "PK-145 (450m off corridor)", time: "14 mins ago",
    detail: "Charsadda Express corridor. Left corridor near Naguman bypass.",
    actions: [{ label: "Review Path", kind: "ghost", resolves: true }],
  },
  {
    id: 4, cat: "operational", tag: "FULL CAPACITY", tone: "info", icon: Users,
    title: "PK-331 (100% full)", time: "21 mins ago",
    detail: "City Bus Terminal. 45 seated + 15 standees. Next bus in 6 mins.",
    actions: [{ label: "View Route", kind: "ghost", resolves: true }],
  },
];

const ALERT_COUNTS = { all: 14, sos: 3, violations: 6, operational: 5 };

const HAILS = [
  { id: "PR-1024", pax: "P234", status: "Driver Accepted", tone: "blue", place: "University Rd @ Islamia College", unit: "PK-102 (120m)" },
  { id: "PR-1025", pax: "P882", status: "Pending Response", tone: "grey", place: "Saddar Bazaar Main Gate", unit: "PK-105 (350m)" },
  { id: "PR-1026", pax: "P419", status: "Arriving in 3m", tone: "blue", place: "Hayatabad Phase 3 Square", unit: "PK-112 (500m)" },
];

const CORRIDORS = [
  { name: "Peshawar → Mardan (N-5)", load: 88, label: "88% Load" },
  { name: "Peshawar → Charsadda", load: 64, label: "64% Load" },
  { name: "BRT Trunk Corridor", load: 92, label: "92% High Demand" },
];

const STATUS_UI = {
  sos: { label: "SOS ALERT", tone: "danger" },
  full: { label: "100% FULL", tone: "muted" },
  active: { label: "IN SERVICE", tone: "success" },
  depot: { label: "DEPOT", tone: "muted" },
};

const TILES = {
  transit: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics",
  },
};

/* ================================================================== */
/*  Geometry + real road routing (OSRM)                                */
/* ================================================================== */

const toRad = (d) => (d * Math.PI) / 180;

const haversineKm = ([lat1, lng1], [lat2, lng2]) => {
  const a =
    Math.sin(toRad(lat2 - lat1) / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(toRad(lng2 - lng1) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(a));
};

const buildPath = (line) => {
  const cum = [0];
  for (let i = 1; i < line.length; i++) cum.push(cum[i - 1] + haversineKm(line[i - 1], line[i]));
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
  const t = (d - cum[lo]) / (cum[hi] - cum[lo] || 1);
  return [
    line[lo][0] + (line[hi][0] - line[lo][0]) * t,
    line[lo][1] + (line[hi][1] - line[lo][1]) * t,
  ];
};

const sliceLine = (path, fromKm, toKm, steps = 30) =>
  Array.from({ length: steps + 1 }, (_, i) => pointAt(path, fromKm + ((toKm - fromKm) * i) / steps));

async function fetchRoadRoute(waypoints) {
  const key = "db-route:" + waypoints.map((p) => p.join(",")).join("|");
  try {
    const cached = sessionStorage.getItem(key);
    if (cached) return JSON.parse(cached);
  } catch {
    /* ignore */
  }
  const coords = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(";");
  const res = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`
  );
  if (!res.ok) throw new Error(`OSRM ${res.status}`);
  const data = await res.json();
  const line = data?.routes?.[0]?.geometry?.coordinates?.map(([lng, lat]) => [lat, lng]);
  if (!line || line.length < 2) throw new Error("No geometry");
  try {
    sessionStorage.setItem(key, JSON.stringify(line));
  } catch {
    /* ignore */
  }
  return line;
}

function useRoadRoutes() {
  const [geo, setGeo] = useState(() => Object.fromEntries(ROUTES.map((r) => [r.id, r.waypoints])));
  useEffect(() => {
    let cancelled = false;
    Promise.allSettled(ROUTES.map((r) => fetchRoadRoute(r.waypoints))).then((results) => {
      if (cancelled) return;
      const next = {};
      results.forEach((res, i) => {
        next[ROUTES[i].id] = res.status === "fulfilled" ? res.value : ROUTES[i].waypoints;
      });
      setGeo(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return geo;
}

/* ================================================================== */
/*  Leaflet icons                                                      */
/* ================================================================== */

const ALERT_SVG = renderToStaticMarkup(<TriangleAlert size={16} strokeWidth={2.2} color="#ffffff" />);
const SHIELD_SVG = renderToStaticMarkup(<ShieldAlert size={13} strokeWidth={2.2} color="#ffffff" />);

const vehicleIcon = (v, selected) => {
  if (v.status === "sos") {
    return L.divIcon({
      className: "db-divicon",
      iconSize: [0, 0],
      html: `
        <span class="db-dot db-dot--sos"></span>
        <div class="db-sos${selected ? " is-selected" : ""}">
          <span class="db-sos__icon">${ALERT_SVG}</span>
          <div><strong>${v.id} • SOS ACTIVE</strong><span>Patrol Unit 04 Dispatched</span></div>
        </div>`,
    });
  }
  const meta =
    v.status === "full" ? `<em>FULL</em>` : v.status === "depot" ? `<em>Depot</em>` : `<em>${v.speed}km/h</em>`;
  return L.divIcon({
    className: "db-divicon",
    iconSize: [0, 0],
    html: `
      <div class="db-pill db-pill--${v.status}${selected ? " is-selected" : ""}">
        <i></i><strong>${v.id}</strong>${meta}
      </div>`,
  });
};

const landmarkIcon = (name) =>
  L.divIcon({
    className: "db-divicon",
    iconSize: [0, 0],
    html: `<span class="db-landmark">${name}</span>`,
  });

const patrolIcon = L.divIcon({
  className: "db-divicon",
  iconSize: [0, 0],
  html: `<span class="db-patrol">${SHIELD_SVG}<b>Patrol 04</b></span>`,
});

/* ================================================================== */
/*  Fleet map                                                          */
/* ================================================================== */

const FleetMap = ({ vehicles, paths, geo, selectedId, onSelect }) => {
  const [map, setMap] = useState(null);
  const [mode, setMode] = useState("transit"); // transit | traffic | satellite

  const tile = mode === "satellite" ? TILES.satellite : TILES.transit;

  const routeColor = (r) => {
    if (mode === "traffic") return r.load >= 85 ? "#dc2626" : r.load >= 60 ? "#f59e0b" : "#16a34a";
    if (mode === "satellite") return "#7db3ff";
    return "#2563eb";
  };

  const positioned = useMemo(
    () =>
      vehicles.map((v) => {
        const path = paths[v.routeId];
        return { ...v, pos: pointAt(path, v.t * path.total) };
      }),
    [vehicles, paths]
  );

  const sos = positioned.find((v) => v.status === "sos");
  const patrolLine = useMemo(() => {
    if (!sos) return null;
    const path = paths[sos.routeId];
    const sosKm = sos.t * path.total;
    return sliceLine(path, Math.max(0, sosKm - path.total * 0.14), sosKm);
  }, [sos, paths]);

  /* Fit the map to the visible fleet on first load */
  useEffect(() => {
    if (!map) return;
    const pts = positioned.map((v) => v.pos);
    if (pts.length) map.fitBounds(L.latLngBounds(pts).pad(0.12), { animate: false, maxZoom: 12 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  /* Pan to the selected vehicle */
  useEffect(() => {
    if (!map || !selectedId) return;
    const v = positioned.find((x) => x.id === selectedId);
    if (v) map.panTo(v.pos, { animate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, selectedId]);

  return (
    <div className="db-map">
      <MapContainer
        ref={setMap}
        center={[34.08, 71.75]}
        zoom={10}
        minZoom={7}
        zoomControl={false}
        className="db-map__canvas"
      >
        <TileLayer key={mode === "satellite" ? "sat" : "street"} url={tile.url} attribution={tile.attribution} />

        {ROUTES.map((r) => (
          <React.Fragment key={r.id}>
            <Polyline positions={geo[r.id]} pathOptions={{ color: "#ffffff", weight: 11, opacity: 0.7, lineCap: "round" }} />
            <Polyline positions={geo[r.id]} pathOptions={{ color: routeColor(r), weight: 5, opacity: 0.9, lineCap: "round" }} />
          </React.Fragment>
        ))}

        {patrolLine && (
          <>
            <Polyline positions={patrolLine} pathOptions={{ color: "#1d4ed8", weight: 4, dashArray: "2 8", lineCap: "round" }} />
            <Marker position={patrolLine[0]} icon={patrolIcon} interactive={false} />
          </>
        )}

        {LANDMARKS.map((l) => (
          <Marker key={l.id} position={l.pos} icon={landmarkIcon(l.name)} interactive={false} />
        ))}

        {positioned.map((v) => (
          <Marker
            key={v.id}
            position={v.pos}
            icon={vehicleIcon(v, v.id === selectedId)}
            zIndexOffset={v.status === "sos" ? 1000 : 0}
            eventHandlers={{ click: () => onSelect(v.id) }}
          />
        ))}
      </MapContainer>

      <div className="db-map__feed">
        <span className="db-map__feed-dot" />
        <strong>Live GPS Feed</strong>
        <span>• 3s latency (128 units active)</span>
      </div>

      <div className="db-map__controls">
        <div className="db-seg">
          {[
            ["transit", "Transit"],
            ["traffic", "Traffic"],
            ["satellite", "Satellite"],
          ].map(([k, label]) => (
            <button key={k} type="button" className={mode === k ? "is-on" : ""} onClick={() => setMode(k)}>
              {label}
            </button>
          ))}
        </div>
        <span className="db-map__sep" />
        <button type="button" aria-label="Zoom in" onClick={() => map?.zoomIn()}>
          <Plus size={15} />
        </button>
        <button type="button" aria-label="Zoom out" onClick={() => map?.zoomOut()}>
          <Minus size={15} />
        </button>
      </div>

      <div className="db-legend">
        <strong>TRANSIT LEGEND:</strong>
        <span><i className="db-legend__dot db-legend__dot--ok" /> In-Service (Normal)</span>
        <span><i className="db-legend__dot db-legend__dot--full" /> 100% Full</span>
        <span><i className="db-legend__dot db-legend__dot--sos" /> Active SOS / Deviation</span>
        <span><i className="db-legend__dot db-legend__dot--off" /> Offline / Depot</span>
      </div>
    </div>
  );
};

/* ================================================================== */
/*  Vehicle dossier panel                                              */
/* ================================================================== */

const initials = (name) => name.split(" ").map((w) => w[0]).slice(0, 2).join("");

const VehiclePanel = ({ v, onContactPolice, onViewDetails, onTrackCctv }) => {
  if (!v) return <aside className="db-vpanel db-vpanel--empty">No vehicle matches the current filters.</aside>;

  const ui = STATUS_UI[v.status];
  const pct = v.capacity ? Math.round((v.seats / v.capacity) * 100) : 0;
  const overLimit = v.speed > v.limit;

  return (
    <aside className="db-vpanel">
      <div className="db-vpanel__head">
        <h3>{v.id}</h3>
        <Badge className={`db-tag db-tag--${ui.tone}`}>
          {v.status === "sos" && <Siren size={11} />} {ui.label}
        </Badge>
        <span className="db-vpanel__model">{v.model}</span>
      </div>

      <div className="db-driver">
        <Avatar className="db-driver__avatar">
          <AvatarFallback>{initials(v.driver.name)}</AvatarFallback>
        </Avatar>
        <div className="db-driver__info">
          <div className="db-driver__top">
            <strong>{v.driver.name}</strong>
            <span className="db-driver__rating">
              <Star size={11} fill="currentColor" /> {v.driver.rating}
            </span>
          </div>
          <p>Badge #{v.driver.badge} • {v.driver.grade}</p>
          <p className="db-driver__phone"><Phone size={12} /> {v.driver.phone}</p>
        </div>
      </div>

      <div className="db-vpanel__row">
        <span className="db-label">ASSIGNED ROUTE</span>
        <span className="db-vpanel__corridor">Corridor {v.corridor}</span>
      </div>
      <dl className="db-route">
        <div><dt>Origin:</dt><dd>{v.origin}</dd></div>
        <div><dt>Next Stop:</dt><dd className="db-accent">{v.nextStop}</dd></div>
        <div><dt>Destination:</dt><dd>{v.destination}</dd></div>
      </dl>

      <div className="db-metrics">
        <div>
          <span className="db-label">SPEED</span>
          <strong className={overLimit ? "db-text-danger" : ""}>{v.speed} <small>km/h</small></strong>
          <em>Limit: {v.limit} km/h</em>
        </div>
        <div>
          <span className="db-label">PASSENGER LOAD</span>
          <strong>{v.seats} <small>/ {v.capacity}</small></strong>
          <em className="db-accent">{pct}% (Seated)</em>
        </div>
        <div>
          <span className="db-label">FUEL / BATTERY</span>
          <strong>{v.fuel}%</strong>
          <em>Est. {v.rangeKm} km left</em>
        </div>
        <div>
          <span className="db-label">HEARTBEAT</span>
          <strong className="db-teal">{v.heartbeat}</strong>
          <em>GPS Lock: {v.sats} Sats</em>
        </div>
      </div>

      {v.status === "sos" && (
        <div className="db-sos-box">
          <p className="db-sos-box__title"><TriangleAlert size={14} /> Silent Emergency Switch Pressed</p>
          <p>
            Driver initiated emergency panic relay 2m 14s ago at coordinates 34.0151° N, 71.5249° E. Patrol Unit 04 en route.
          </p>
        </div>
      )}

      {v.status === "sos" ? (
        <Button className="db-btn-police" onClick={onContactPolice}>
          <ShieldAlert size={16} /> Contact Police Patrol Unit 04
        </Button>
      ) : (
        <Button className="db-btn-police db-btn-police--calm" onClick={onContactPolice}>
          <Phone size={16} /> Message Driver
        </Button>
      )}

      <div className="db-vpanel__actions">
        <Button variant="outline" className="db-btn-soft" onClick={onViewDetails}>
          <Eye size={14} /> View Details
        </Button>
        <Button variant="outline" className="db-btn-soft" onClick={onTrackCctv}>
          <Video size={14} /> Track Live CCTV
        </Button>
      </div>
    </aside>
  );
};

/* ================================================================== */
/*  Page                                                               */
/* ================================================================== */

const Dashboard = ({
  onRefresh,
  onContactPolice,
  onViewDetails,
  onTrackCctv,
  onViewAllAlerts,
  onRouteBalancer,
}) => {
  const navigate = useNavigate();
  const geo = useRoadRoutes();
  const paths = useMemo(
    () => Object.fromEntries(ROUTES.map((r) => [r.id, buildPath(geo[r.id])])),
    [geo]
  );

  /* header clock + auto refresh */
  const [now, setNow] = useState(new Date());
  const [auto, setAuto] = useState(true);
  const [spin, setSpin] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!auto) return undefined;
    const t = setInterval(() => {
      setSpin(true);
      onRefresh?.();
      setTimeout(() => setSpin(false), 700);
    }, 3000);
    return () => clearInterval(t);
  }, [auto, onRefresh]);

  const dateLabel = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Karachi",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(now);
  const timeLabel = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Karachi",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);

  /* fleet monitoring state */
  const [query, setQuery] = useState("");
  const [routeFilter, setRouteFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView] = useState("map");
  const [selectedId, setSelectedId] = useState("PK-102");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VEHICLES.filter(
      (v) =>
        (routeFilter === "all" || v.routeId === routeFilter) &&
        (statusFilter === "all" || v.status === statusFilter) &&
        (!q || `${v.id} ${v.driver.name}`.toLowerCase().includes(q))
    );
  }, [query, routeFilter, statusFilter]);

  const selected = visible.find((v) => v.id === selectedId) ?? visible[0] ?? null;

  /* alerts */
  const [alertTab, setAlertTab] = useState("all");
  const [resolved, setResolved] = useState([]);

  const alertsLeft = ALERTS.filter((a) => !resolved.includes(a.id));
  const shownAlerts = alertsLeft.filter((a) => alertTab === "all" || a.cat === alertTab);
  const removedIn = (cat) => ALERTS.filter((a) => resolved.includes(a.id) && (cat === "all" || a.cat === cat)).length;
  const count = (cat) => Math.max(0, ALERT_COUNTS[cat] - removedIn(cat));

  const handleKpiClick = (id) => {
    if (id === "vehicles" || id === "offline") navigate("/vehicles");
    else if (id === "drivers") navigate("/drivers");
    else if (id === "trips") navigate("/trips");
    else if (id === "pax") navigate("/passengers");
    else if (id === "alerts") navigate("/emergency");
  };

  const handleAlertAction = (alert, action) => {
    if (action.label.includes("SOS")) {
      navigate("/emergency");
      return;
    }
    if (action.label.includes("Path")) {
      navigate("/routes");
      return;
    }
    if (action.focus) {
      setStatusFilter("all");
      setQuery("");
      setSelectedId(action.focus);
    }
    if (action.resolves) setResolved((r) => [...r, alert.id]);
  };

  const exportReport = () => {
    const rows = [
      ["Metric", "Value", "Note"],
      ...KPIS.map((k) => [k.label, k.value, `${k.chip ?? ""} ${k.note ?? ""}`.trim()]),
      [],
      ["Vehicle", "Driver", "Route", "Status", "Speed (km/h)", "Seats", "Capacity"],
      ...VEHICLES.map((v) => [v.id, v.driver.name, ROUTES.find((r) => r.id === v.routeId)?.name, STATUS_UI[v.status].label, v.speed, v.seats, v.capacity]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="db-page">
      {/* ---------- Header ---------- */}
      <header className="db-header">
        <div className="db-header__text">
          <div className="db-kicker">
            <span className="db-kicker__dot" /> NATIONAL TRANSIT COMMAND CORE
          </div>
          <div className="db-header__title-row">
            <h1>Dashboard</h1>
            <span className="db-header__sep">•</span>
            <p className="db-header__sub">
              Real-time overview of public transport operations, fleet activity, and safety protocols
            </p>
          </div>
        </div>

        <div className="db-header__actions">
          <div className="db-chip db-chip--time">
            <Calendar size={13} />
            <strong>Today, {dateLabel}</strong>
            <span>{timeLabel} PKT</span>
          </div>
          <button
            type="button"
            className={"db-chip db-chip--btn" + (auto ? "" : " is-off")}
            onClick={() => setAuto((a) => !a)}
            aria-pressed={auto}
            title={auto ? "Click to pause 3s live stream" : "Click to resume live stream"}
          >
            <span className="db-chip__dot" />
            <strong>{auto ? "Auto (3s)" : "Paused"}</strong>
            <RefreshCw size={12} className={spin ? "db-spin" : ""} />
          </button>
          <Button size="sm" className="db-btn-export" onClick={exportReport}>
            <Download size={13} /> Export Report
          </Button>
        </div>
      </header>

      {/* ---------- KPI cards ---------- */}
      <section className="db-kpis">
        {KPIS.map((k) => {
          const Icon = k.icon;
          const ChipIcon = k.chipIcon;
          const isSuccess = k.chip && (k.chip.startsWith("+") || k.chip.includes("%"));
          const isDanger = k.danger;
          const chipClass = isDanger
            ? "db-kpi__chip--danger"
            : isSuccess
            ? "db-kpi__chip--success"
            : k.id === "offline"
            ? "db-kpi__chip--slate"
            : "db-kpi__chip--neutral";

          return (
            <Card
              key={k.id}
              className={"db-card db-kpi" + (k.danger ? " db-kpi--danger" : "")}
              onClick={() => handleKpiClick(k.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="db-kpi__top">
                <span className="db-kpi__label">
                  {k.danger && <i className="db-kpi__pulse" />}
                  {k.label}
                </span>
                <span className={"db-kpi__icon" + (k.danger ? " db-kpi__icon--danger" : "")}>
                  <Icon size={12} strokeWidth={2.2} />
                </span>
              </div>
              <strong className="db-kpi__value">{k.value}</strong>
              <div className="db-kpi__foot">
                {k.chip && (
                  <span className={`db-kpi__chip ${chipClass}`}>
                    {ChipIcon && <ChipIcon size={9} />} {k.chip}
                  </span>
                )}
                {k.note && (
                  <span className={"db-kpi__note" + (k.danger ? " db-kpi__note--danger" : "")}>
                    {k.note}
                  </span>
                )}
              </div>
              <div className="db-kpi__bar">
                <div className={`db-kpi__bar-fill db-kpi__bar-fill--${k.accent || "blue"}`} />
              </div>
            </Card>
          );
        })}
      </section>

      {/* ---------- Live fleet monitoring ---------- */}
      <Card className="db-card db-monitor">
        <div className="db-monitor__head">
          <div className="db-monitor__title">
            <span className="db-monitor__bar" />
            <div>
              <h2>Live Fleet Monitoring</h2>
              <p>Peshawar Metropolitan Transit &amp; KP Regional Corridors (GT Road, M-1, Ring Road)</p>
            </div>
          </div>

          <div className="db-filters">
            <div className="db-search">
              <Search size={15} />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search vehicle or driver"
                className="db-search__input"
              />
            </div>

            <Select value={routeFilter} onValueChange={setRouteFilter}>
              <SelectTrigger className="db-select"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Corridors</SelectItem>
                {ROUTES.map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="db-select"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="sos">Emergency / SOS</SelectItem>
                <SelectItem value="full">100% Full</SelectItem>
                <SelectItem value="active">In Service</SelectItem>
                <SelectItem value="depot">Offline / Depot</SelectItem>
              </SelectContent>
            </Select>

            <Tabs value={view} onValueChange={setView}>
              <TabsList className="db-viewtabs">
                <TabsTrigger value="map" className="db-viewtab"><MapIcon size={13} /> Map</TabsTrigger>
                <TabsTrigger value="list" className="db-viewtab"><List size={13} /> List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="db-monitor__body">
          {view === "map" ? (
            <FleetMap
              vehicles={visible}
              paths={paths}
              geo={geo}
              selectedId={selected?.id}
              onSelect={setSelectedId}
            />
          ) : (
            <div className="db-list">
              <table>
                <thead>
                  <tr>
                    <th>Unit</th><th>Driver</th><th>Route</th><th>Status</th><th>Speed</th><th>Load</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((v) => (
                    <tr key={v.id} className={v.id === selected?.id ? "is-selected" : ""} onClick={() => setSelectedId(v.id)}>
                      <td><strong>{highlightText(v.id, query)}</strong></td>
                      <td>{highlightText(v.driver.name, query)}</td>
                      <td>{highlightText(ROUTES.find((r) => r.id === v.routeId)?.name, query)}</td>
                      <td><Badge className={`db-tag db-tag--${STATUS_UI[v.status].tone}`}>{STATUS_UI[v.status].label}</Badge></td>
                      <td>{v.speed} km/h</td>
                      <td>{v.seats}/{v.capacity}</td>
                    </tr>
                  ))}
                  {visible.length === 0 && (
                    <tr><td colSpan={6} className="db-list__empty">No vehicles match the current filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <VehiclePanel
            v={selected}
            onContactPolice={() => (onContactPolice ? onContactPolice(selected) : navigate("/emergency"))}
            onViewDetails={() => (onViewDetails ? onViewDetails(selected) : navigate("/vehicles"))}
            onTrackCctv={() => (onTrackCctv ? onTrackCctv(selected) : navigate("/camera"))}
          />
        </div>
      </Card>

      {/* ---------- Alerts + hail requests ---------- */}
      <section className="db-bottom">
        <Card className="db-card db-alerts">
          <div className="db-card__head">
            <h2><Bell size={18} /> Critical Alerts &amp; Telemetry Events</h2>
            <button
              type="button"
              className="db-link"
              onClick={() => (onViewAllAlerts ? onViewAllAlerts() : navigate("/alerts"))}
            >
              View All ({count("all")})
            </button>
          </div>

          <Tabs value={alertTab} onValueChange={setAlertTab}>
            <TabsList className="db-alert-tabs">
              <TabsTrigger value="all" className="db-alert-tab">All ({count("all")})</TabsTrigger>
              <TabsTrigger value="sos" className="db-alert-tab db-alert-tab--sos">
                <i /> SOS / Emergency ({count("sos")})
              </TabsTrigger>
              <TabsTrigger value="violations" className="db-alert-tab">Violations ({count("violations")})</TabsTrigger>
              <TabsTrigger value="operational" className="db-alert-tab">Operational ({count("operational")})</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="db-alert-list">
            {shownAlerts.length === 0 && <p className="db-empty">No alerts in this category.</p>}
            {shownAlerts.map((a) => {
              const Icon = a.icon;
              return (
                <article key={a.id} className={`db-alert db-alert--${a.tone}`}>
                  <span className="db-alert__icon"><Icon size={18} strokeWidth={1.9} /></span>
                  <div className="db-alert__body">
                    <div className="db-alert__line">
                      <Badge className={`db-alert__tag db-alert__tag--${a.tone}`}>{a.tag}</Badge>
                      <strong>{a.title}</strong>
                      <span className="db-alert__time">• {a.time}</span>
                    </div>
                    <p>{a.detail}</p>
                  </div>
                  <div className="db-alert__actions">
                    {a.actions.map((act) => (
                      <Button
                        key={act.label}
                        size="sm"
                        className={`db-act db-act--${act.kind}`}
                        onClick={() => handleAlertAction(a, act)}
                      >
                        {act.label}
                      </Button>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="db-card__foot">
            <span>Incident Logging Engine Active</span>
            <span>Police Dispatch Link: OK (Secure UDP)</span>
          </div>
        </Card>

        <Card className="db-card db-hail">
          <div className="db-card__head">
            <h2><Hand size={18} /> Live Hail Requests</h2>
            <Badge
              className="db-pending"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/passenger-requests")}
            >
              6 Pending
            </Badge>
          </div>

          <div className="db-hail__list">
            {HAILS.map((h) => (
              <article
                key={h.id}
                className="db-req"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/passenger-requests")}
              >
                <div className="db-req__top">
                  <strong>Req #{h.id}</strong>
                  <span className="db-req__pax">Pax #{h.pax}</span>
                  <Badge className={`db-req__status db-req__status--${h.tone}`}>{h.status}</Badge>
                </div>
                <div className="db-req__bottom">
                  <span className="db-req__place"><MapPin size={13} /> {h.place}</span>
                  <span className="db-req__unit">{h.unit}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="db-corridors">
            <div className="db-corridors__head">
              <span>REAL-TIME CORRIDOR LOAD</span>
              <span>Congestion Index</span>
            </div>
            {CORRIDORS.map((c) => {
              const hot = c.load >= 85;
              return (
                <div key={c.name} className="db-corridor">
                  <div className="db-corridor__row">
                    <span>{c.name}</span>
                    <strong className={hot ? "db-text-danger" : "db-accent"}>{c.label}</strong>
                  </div>
                  <div className="db-bar">
                    <div className={"db-bar__fill" + (hot ? " db-bar__fill--hot" : "")} style={{ width: `${c.load}%` }} />
                  </div>
                </div>
              );
            })}
            <div className="db-corridors__foot">
              <span>Fleet Utilization: 87.4%</span>
              <button
                type="button"
                className="db-link"
                onClick={() => (onRouteBalancer ? onRouteBalancer() : navigate("/routes"))}
              >
                Route Balancer <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;