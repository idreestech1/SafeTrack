import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Circle, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  Asterisk,
  Shield,
  ShieldCheck,
  ShieldAlert,
  BellRing,
  CircleCheck,
  Timer,
  Target,
  Route as RouteIcon,
  Focus,
  Volume2,
  VolumeX,
  Plus,
  Minus,
  LocateFixed,
  Triangle,
  Bike,
  Power,
  Siren,
  Phone,
  Video,
  MousePointerClick,
  BriefcaseMedical,
  Headset,
  ExternalLink,
  Info,
  ClipboardList,
  Send,
  Bus,
  TriangleAlert,
  Bell,
  AlarmClock,
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

import "./emergency.css";

/*
  ─── Setup ───────────────────────────────────────────────────────
  npm install leaflet react-leaflet lucide-react
      (React 18 → react-leaflet@4 ; React 19 → react-leaflet@5)
  npx shadcn@latest add badge button card input select

  REAL: the tactical map + tiles, the red radius around the distress
        point, the road route + ETA for Patrol 04 (OSRM), live
        "triggered X mins ago" timers, the siren tone (Web Audio),
        the audit log (new entries are written with real timestamps)
        and the Dispatch / Resolve / Log Note actions.
  PLACEHOLDER: incidents, units and the top-bar statistics below –
        replace INCIDENTS / UNITS / STATS with your API data.
  Coordinates are approximate landmark positions.
  ─────────────────────────────────────────────────────────────────
*/

/* ================================================================== */
/*  Placeholder data                                                   */
/* ================================================================== */

const BOOT = Date.now();
const minsAgo = (m) => BOOT - m * 60 * 1000;

const STATS = { resolvedToday: 14, avgResponse: "3.8", unattended: 0 };

const INCIDENTS = [
  {
    id: "INC-2024-089",
    kind: "sos",
    priority: "P1",
    status: "active",
    vehicle: "PK-102",
    title: "CRITICAL SOS — Vehicle PK-102",
    triggeredAt: minsAgo(2),
    pos: [34.015, 71.5805],
    location: "GT Road KM 14",
    speed: 54,
    pax: 32,
    fire: "Normal",
    driver: { name: "Muhammad Ali", license: "KPK-88910", phone: "+92 300 5541920" },
    route: { from: "Peshawar Central", to: "Mardan" },
    source: "Dual Trigger: Driver Front Console + Passenger Row 04 Emergency Lever",
  },
  {
    id: "INC-2024-091",
    kind: "medical",
    status: "en-route",
    vehicle: "PK-118",
    title: "Medical Emergency — Vehicle PK-118",
    triggeredAt: minsAgo(11),
    pos: [33.9863, 71.4326],
    place: "Hayatabad Phase 3 (Ring Road)",
    statusLabel: "MEDICAL STATUS",
    detail: "Passenger reported severe acute chest pain.",
    responder: { unit: "Rescue 1122 Unit 08", note: "ETA 3 mins to Hayatabad Stop", tone: "blue" },
  },
  {
    id: "INC-2024-087",
    kind: "alarm",
    status: "assessing",
    vehicle: "PK-205",
    title: "Panic Alarm Alert — Vehicle PK-205",
    triggeredAt: minsAgo(18),
    pos: [34.0025, 71.488],
    place: "University Road (Board Bazar)",
    statusLabel: "FIELD ASSESSMENT",
    detail: "Police Patrol Unit on site, assessing situation. Possible false alarm.",
    responder: { unit: "Patrol Unit 09 On-Scene", note: "Awaiting Clearance", tone: "blue" },
  },
];

/* Hospital used for the "Trauma Center" callout (approximate position) */
const HOSPITAL = { name: "LRH Trauma Center", pos: [34.0028, 71.5612] };

const UNITS = [
  { id: "patrol-04", name: "Patrol Unit 04 (Chamkani)", sub: "Officer Rashid | Toyota Hilux Interceptor", type: "patrol", footer: "Closing 68 km/h", live: true },
  { id: "warden-12", name: "Traffic Warden 12", sub: "Sergeant Farooq | Motor Rapid Unit", type: "bike", etaFixed: "4m 15s", footer: "Corridor Divert" },
  { id: "rescue-08", name: "Rescue 1122 Unit 08", sub: "Paramedic Crew | Ambulance", type: "patrol", etaFixed: "3m 00s", footer: "Responding" },
  { id: "patrol-09", name: "Patrol Unit 09", sub: "Inspector Hamid | Toyota Corolla", type: "patrol", etaFixed: "On-Scene", footer: "Assessing" },
];

const ESCALATIONS = [
  "1122 Rescue (Paramedic + Fire)",
  "Police Quick Response Force",
  "Traffic Police Diversion",
  "Counter-Terrorism / Special Branch",
];
const OFFICERS = ["Cmdr. Tariq Rehman (Base)", "Insp. Rashid (Field)", "SP Operations (Duty)"];
const SEVERITIES = [
  { value: "red", label: "CODE RED — Hijack / Physical Threat" },
  { value: "amber", label: "CODE AMBER — Medical / Accident" },
  { value: "yellow", label: "CODE YELLOW — Suspicious Activity" },
];

/* ================================================================== */
/*  Helpers                                                            */
/* ================================================================== */

const fmtTime = (ms) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Karachi",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(ms);

const fmtDuration = (s) => `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;

const haversineKm = ([lat1, lng1], [lat2, lng2]) => {
  const r = (d) => (d * Math.PI) / 180;
  const a =
    Math.sin(r(lat2 - lat1) / 2) ** 2 +
    Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(r(lng2 - lng1) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(a));
};

const offsetLatLng = ([lat, lng], meters, bearing) => {
  const rad = (bearing * Math.PI) / 180;
  return [
    lat + (meters * Math.cos(rad)) / 111320,
    lng + (meters * Math.sin(rad)) / (111320 * Math.cos((lat * Math.PI) / 180)),
  ];
};

const agoLabel = (ms, now) => {
  const m = Math.max(0, Math.floor((now - ms) / 60000));
  return m <= 1 ? `${m || 1} minute${m <= 1 ? "" : "s"} ago`.replace("1 minute ago", m === 0 ? "just now" : "1 minute ago") : `${m} mins ago`;
};

/* Real driving route (OSRM) – returns line + duration in seconds */
function useDrivingRoute(from, to) {
  const [route, setRoute] = useState({ line: [from, to], seconds: null });
  useEffect(() => {
    let cancelled = false;
    fetch(
      `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`
    )
      .then((r) => r.json())
      .then((d) => {
        const rt = d?.routes?.[0];
        if (!cancelled && rt) {
          setRoute({
            line: rt.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
            seconds: Math.round(rt.duration),
          });
        }
      })
      .catch(() => { });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from[0], from[1], to[0], to[1]]);
  return route;
}

/* Soft two-tone siren while there is an unresolved SOS (needs a user click first) */
function useSiren(active) {
  useEffect(() => {
    if (!active) return undefined;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return undefined;
    const ctx = new Ctx();

    const beep = (freq, start, dur) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.05);
    };

    const timer = setInterval(() => {
      if (ctx.state === "suspended") ctx.resume().catch(() => { });
      if (ctx.state === "running") {
        beep(880, 0, 0.25);
        beep(660, 0.3, 0.25);
      }
    }, 2500);

    return () => {
      clearInterval(timer);
      ctx.close().catch(() => { });
    };
  }, [active]);
}

/* ================================================================== */
/*  Leaflet icons                                                      */
/* ================================================================== */

const svg = (Icon, size, color = "#ffffff") =>
  renderToStaticMarkup(<Icon size={size} strokeWidth={2.2} color={color} />);

const sosIcon = (incident) =>
  L.divIcon({
    className: "es-divicon",
    iconSize: [0, 0],
    html: `
      <div class="es-sosmark">
        <span class="es-sosmark__ring"></span>
        <span class="es-sosmark__box">${svg(Bus, 20)}</span>
        <div class="es-callout">
          <b>● ${incident.vehicle} SOS</b>
          <span>Speed: ${incident.speed} km/h • ${incident.pax} Pax</span>
        </div>
      </div>`,
  });

const patrolIcon = (eta) =>
  L.divIcon({
    className: "es-divicon",
    iconSize: [0, 0],
    html: `
      <div class="es-patrol">
        <span class="es-patrol__box">${svg(Shield, 18)}</span>
        <div class="es-patrol__label"><b>PATROL 04</b><span>ETA: ${eta}</span></div>
      </div>`,
  });

const hospitalIcon = (label) =>
  L.divIcon({
    className: "es-divicon",
    iconSize: [0, 0],
    html: `<div class="es-hosp"><span class="es-hosp__h">H</span><b>${label}</b></div>`,
  });

const smallIcon = (kind, vehicle, focused) =>
  L.divIcon({
    className: "es-divicon",
    iconSize: [0, 0],
    html: `
      <div class="es-small es-small--${kind}${focused ? " is-focused" : ""}">
        <span>${svg(kind === "medical" ? BriefcaseMedical : Bell, 16)}</span>
        <b>${vehicle}</b>
      </div>`,
  });

/* ================================================================== */
/*  Tactical map                                                       */
/* ================================================================== */

const TacticalMap = ({ incidents, focused, onFocus, showCorridor, patrol, patrolRoute, etaLabel }) => {
  const [map, setMap] = useState(null);
  const critical = incidents.find((i) => i.kind === "sos" && i.status !== "resolved");
  const hospKm = critical ? haversineKm(critical.pos, HOSPITAL.pos) : null;

  useEffect(() => {
    if (map && focused) map.flyTo(focused.pos, 14, { duration: 0.8 });
  }, [map, focused]);

  return (
    <div className="es-map">
      <MapContainer ref={setMap} center={focused.pos} zoom={14} minZoom={9} zoomControl={false} className="es-map__canvas">
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {critical && (
          <>
            <Circle
              center={critical.pos}
              radius={500}
              pathOptions={{ color: "#dc2626", weight: 2, dashArray: "6 6", fillColor: "#dc2626", fillOpacity: 0.12 }}
            />
            <Polyline positions={patrolRoute.line} pathOptions={{ color: "#1d4ed8", weight: 4, dashArray: "3 9", lineCap: "round" }} />
            {showCorridor && (
              <Polyline
                positions={[critical.pos, HOSPITAL.pos]}
                pathOptions={{ color: "#16a34a", weight: 5, opacity: 0.85, lineCap: "round" }}
              />
            )}
            <Marker position={critical.pos} icon={sosIcon(critical)} zIndexOffset={1000} eventHandlers={{ click: () => onFocus(critical.id) }} />
            <Marker position={patrol} icon={patrolIcon(etaLabel)} zIndexOffset={900} />
          </>
        )}

        <Marker position={HOSPITAL.pos} icon={hospitalIcon(`${HOSPITAL.name}${hospKm ? ` (${hospKm.toFixed(1)} km)` : ""}`)} />

        {incidents
          .filter((i) => i.kind !== "sos" && i.status !== "resolved")
          .map((i) => (
            <Marker
              key={i.id}
              position={i.pos}
              icon={smallIcon(i.kind, i.vehicle, focused.id === i.id)}
              eventHandlers={{ click: () => onFocus(i.id) }}
            />
          ))}
      </MapContainer>

      {/* Geo-corridor telemetry */}
      <div className="es-geo">
        <div className="es-geo__head">
          <span>GEO-CORRIDOR TELEMETRY</span>
          <b>ACTIVE RADAR</b>
        </div>
        <dl>
          <div><dt>Distress Point:</dt><dd>{critical?.location ?? focused.place}</dd></div>
          <div><dt>Nearest Interceptor:</dt><dd className="es-blue">Patrol 04 (0.8km away)</dd></div>
          <div><dt>Hospital Corridor:</dt><dd className="es-green">Green Wave Cleared</dd></div>
        </dl>
      </div>

      <div className="es-map__ctrls">
        <button type="button" aria-label="Zoom in" onClick={() => map?.zoomIn()}><Plus size={17} /></button>
        <button type="button" aria-label="Zoom out" onClick={() => map?.zoomOut()}><Minus size={17} /></button>
        <button type="button" aria-label="Re-centre" onClick={() => map?.flyTo(focused.pos, 14)}><LocateFixed size={16} /></button>
      </div>
    </div>
  );
};

/* ================================================================== */
/*  Page                                                               */
/* ================================================================== */

const EmergencySOS = ({ onCallDriver, onCctv, onRadioParamedic }) => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState(INCIDENTS);
  const [focusedId, setFocusedId] = useState(INCIDENTS[0].id);
  const [traffic, setTraffic] = useState(true);
  const [siren, setSiren] = useState(true);
  const [now, setNow] = useState(Date.now());
  const [dispatched, setDispatched] = useState(false);
  const [resolvedLocal, setResolvedLocal] = useState(0);

  /* ICS form */
  const [escalation, setEscalation] = useState(ESCALATIONS[0]);
  const [officer, setOfficer] = useState(OFFICERS[0]);
  const [severity, setSeverity] = useState("red");
  const [note, setNote] = useState("");

  /* audit log */
  const sosIncident = INCIDENTS[0];
  const [log, setLog] = useState([
    { t: sosIncident.triggeredAt, tone: "red", bold: "Panic Button Triggered", text: " in Vehicle PK-102 console." },
    { t: sosIncident.triggeredAt + 2000, tone: "blue", text: "Telemetry & GPS coordinates broadcast to Central Police Control." },
    { t: sosIncident.triggeredAt + 35000, tone: "green", text: "Cmdr. Tariq Rehman acknowledged distress signal." },
  ]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(t);
  }, []);

  const unresolved = incidents.filter((i) => i.status !== "resolved");
  const critical = incidents.find((i) => i.kind === "sos");
  const criticalActive = critical && critical.status !== "resolved";
  const focused = incidents.find((i) => i.id === focusedId) ?? incidents[0];

  useSiren(siren && criticalActive);

  /* Patrol 04 position + real driving route / ETA */
  const patrolPos = useMemo(() => offsetLatLng(sosIncident.pos, 800, 285), [sosIncident]);
  const patrolRoute = useDrivingRoute(patrolPos, sosIncident.pos);
  const etaLabel = patrolRoute.seconds ? fmtDuration(patrolRoute.seconds) : "2m 40s";

  const addLog = (entry) => setLog((l) => [...l, { t: Date.now(), ...entry }]);

  const dispatchInterceptor = () => {
    if (dispatched) return;
    setDispatched(true);
    addLog({ tone: "blue", bold: "Interceptor dispatched:", text: ` Patrol Unit 04 routed to ${sosIncident.location} (ETA ${etaLabel}).` });
  };

  const resolveIncident = (id) => {
    const inc = incidents.find((i) => i.id === id);
    setIncidents((list) => list.map((i) => (i.id === id ? { ...i, status: "resolved" } : i)));
    setResolvedLocal((n) => n + 1);
    if (id === sosIncident.id) addLog({ tone: "green", bold: "Incident resolved:", text: ` ${inc.id} closed by Cmdr. Tariq Rehman.` });
    const next = incidents.find((i) => i.id !== id && i.status !== "resolved");
    if (next && focusedId === id) setFocusedId(next.id);
  };

  const logNote = () => {
    const text = note.trim();
    if (!text) return;
    addLog({ tone: "blue", bold: `[${officer.split(" (")[0]} • ${escalation}]`, text: ` ${text}` });
    setNote("");
  };

  const callDriver = () => {
    onCallDriver?.(critical);
    if (!onCallDriver) window.location.href = `tel:${critical.driver.phone.replace(/\s/g, "")}`;
  };

  const severityLabel = SEVERITIES.find((s) => s.value === severity)?.label;
  const resolvedTotal = STATS.resolvedToday + resolvedLocal;

  return (
    <div className="es-page">
      {/* ---------- Alert banner ---------- */}
      <div className={"es-banner" + (unresolved.length === 0 ? " es-banner--clear" : "")} role="alert">
        <div className="es-banner__left">
          <i className="es-banner__dot" />
          <Siren size={13} strokeWidth={2.4} />
          <span className="es-banner__text">
            {unresolved.length === 0
              ? "ALL CLEAR — NO ACTIVE EMERGENCIES IN PROGRESS"
              : `${unresolved.length} ACTIVE EMERGENCIES DETECTED — POLICE PATROL UNITS COORDINATING`}
          </span>
        </div>
        <div className="es-banner__chips">
          <span className="es-banner__region">METRO COMMAND REGION: PESHAWAR</span>
          <span className="es-banner__defcon">DEFCON 2 TACTICAL</span>
        </div>
      </div>

      {/* ---------- Header ---------- */}
      <header className="es-header">
        <div className="es-header__text">
          <div className="es-kicker">
            <Shield size={12} /> TACTICAL OPERATIONS DIVISION
            <span className="es-kicker__sep">•</span>
            INCIDENT COMMAND SYSTEM (ICS-200)
          </div>
          <div className="es-header__title-row">
            <h1>Emergency / SOS Control Center</h1>
            <span className="es-header__sep">•</span>
            <p className="es-header__sub">
              High-priority incident command, live distress dispatch, and police coordination unit
            </p>
          </div>
        </div>

        <div className="es-header__actions">
          <Button
            variant="outline"
            size="sm"
            className={"es-btn-soft" + (siren ? " is-active" : "")}
            onClick={() => setSiren((s) => !s)}
          >
            {siren ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>Siren: {siren ? "Active" : "Muted"}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={"es-btn-soft" + (traffic ? " is-active" : "")}
            onClick={() => setTraffic((t) => !t)}
          >
            <RouteIcon size={13} />
            <span>Traffic Flow</span>
          </Button>
        </div>
      </header>

      {/* ---------- KPI cards ---------- */}
      <section className="es-kpis">
        <Card className="es-card es-kpi">
          <div className="es-kpi__top">
            <span className="es-kpi__label">ACTIVE SOS</span>
            <span className="es-kpi__icon es-kpi__icon--red"><BellRing size={12} strokeWidth={2.2} /></span>
          </div>
          <div className="es-kpi__value">
            <strong className="es-red">{String(unresolved.length).padStart(2, "0")}</strong>
            <em className="es-kpi__chip es-kpi__chip--red">PRIORITY 1</em>
          </div>
          <p className="es-kpi__foot">
            <i className="es-dot es-dot--red" />
            Requires immediate tactical intervention
          </p>
          <div className="es-kpi__bar">
            <div className="es-kpi__bar-fill es-kpi__bar-fill--red" />
          </div>
        </Card>

        <Card className="es-card es-kpi">
          <div className="es-kpi__top">
            <span className="es-kpi__label">RESOLVED TODAY</span>
            <span className="es-kpi__icon es-kpi__icon--blue"><CircleCheck size={12} strokeWidth={2.2} /></span>
          </div>
          <div className="es-kpi__value">
            <strong>{resolvedTotal}</strong>
            <span>units</span>
          </div>
          <p className="es-kpi__foot">
            <i className="es-dot es-dot--blue" />
            100% incident closure rate
          </p>
          <div className="es-kpi__bar">
            <div className="es-kpi__bar-fill es-kpi__bar-fill--blue" />
          </div>
        </Card>

        <Card className="es-card es-kpi">
          <div className="es-kpi__top">
            <span className="es-kpi__label">AVG RESPONSE</span>
            <span className="es-kpi__icon es-kpi__icon--emerald"><Timer size={12} strokeWidth={2.2} /></span>
          </div>
          <div className="es-kpi__value">
            <strong>{STATS.avgResponse}</strong>
            <span>mins</span>
            <em className="es-kpi__chip es-kpi__chip--green">-42s vs target</em>
          </div>
          <p className="es-kpi__foot">
            <i className="es-dot es-dot--green" />
            Target benchmark &lt; 5.0 mins
          </p>
          <div className="es-kpi__bar">
            <div className="es-kpi__bar-fill es-kpi__bar-fill--emerald" />
          </div>
        </Card>

        <Card className="es-card es-kpi">
          <div className="es-kpi__top">
            <span className="es-kpi__label">UNATTENDED</span>
            <span className="es-kpi__icon es-kpi__icon--cyan"><ShieldCheck size={12} strokeWidth={2.2} /></span>
          </div>
          <div className="es-kpi__value">
            <strong>{String(STATS.unattended).padStart(2, "0")}</strong>
            <em className="es-kpi__chip es-kpi__chip--green">ZERO BACKLOG</em>
          </div>
          <p className="es-kpi__foot">
            <i className="es-dot es-dot--green" />
            All distress streams triaged
          </p>
          <div className="es-kpi__bar">
            <div className="es-kpi__bar-fill es-kpi__bar-fill--cyan" />
          </div>
        </Card>
      </section>

      {/* ---------- Main grid ---------- */}
      <div className="es-grid">
        {/* ===== Left column ===== */}
        <div className="es-col">
          <Card className="es-card es-mapcard">
            <div className="es-mapcard__head">
              <Target size={22} className="es-blue" />
              <div>
                <h2>Live GIS Tactical Map</h2>
                <p>
                  GT Road Chamkani &amp; Ring Road Sector • {focused.pos[0].toFixed(4)}° N, {focused.pos[1].toFixed(4)}° E
                </p>
              </div>
            </div>

            <div className="es-toggles">
              <button type="button" className={traffic ? "is-on" : ""} onClick={() => setTraffic((t) => !t)} aria-pressed={traffic}>
                <RouteIcon size={15} /> Traffic Flow
              </button>
              <button type="button" className="is-focus" onClick={() => setFocusedId(focused.id)}>
                <Focus size={15} /> Focus {focused.vehicle}
              </button>
              <button type="button" className={siren ? "is-on" : ""} onClick={() => setSiren((s) => !s)} aria-pressed={siren}>
                {siren ? <Volume2 size={15} /> : <VolumeX size={15} />} Audio Siren: {siren ? "Active" : "Muted"}
              </button>
            </div>

            <TacticalMap
              incidents={incidents}
              focused={focused}
              onFocus={setFocusedId}
              showCorridor={traffic}
              patrol={patrolPos}
              patrolRoute={patrolRoute}
              etaLabel={etaLabel}
            />

            <div className="es-units">
              <div className="es-units__head">
                <span><Triangle size={14} /> COORDINATED UNITS IN VICINITY ({UNITS.length} ACTIVE)</span>
                <b>Live GPS Telemetry Sync</b>
              </div>

              <div className="es-units__grid">
                {UNITS.map((u) => (
                  <article key={u.id} className="es-unit">
                    <span className="es-unit__icon">
                      {u.type === "bike" ? <Bike size={20} /> : <Shield size={20} />}
                    </span>
                    <div className="es-unit__info">
                      <strong>{u.name}</strong>
                      <span>{u.sub}</span>
                    </div>
                    <div className="es-unit__eta">
                      <b>ETA {u.live ? etaLabel : u.etaFixed}</b>
                      <span className={u.live ? "es-green" : ""}>{u.footer}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </Card>

          {/* ICS logging */}
          <Card className="es-card es-ics">
            <div className="es-ics__head">
              <div className="es-ics__title">
                <ClipboardList size={22} className="es-blue" />
                <h2>Incident ICS Command Logging &amp; Dispatch</h2>
              </div>
              <span className="es-ics__id">Incident: {focused.id}</span>
            </div>

            <div className="es-ics__form">
              <label>
                <span>DISPATCH ESCALATION</span>
                <Select value={escalation} onValueChange={setEscalation}>
                  <SelectTrigger className="es-select"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ESCALATIONS.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              </label>

              <label>
                <span>OFFICER DIRECT COMMAND</span>
                <Select value={officer} onValueChange={setOfficer}>
                  <SelectTrigger className="es-select"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {OFFICERS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </label>

              <label>
                <span>INCIDENT SEVERITY CODE</span>
                <Select value={severity} onValueChange={setSeverity}>
                  <SelectTrigger className={`es-select es-select--${severity}`}><SelectValue>{severityLabel}</SelectValue></SelectTrigger>
                  <SelectContent>
                    {SEVERITIES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </label>
            </div>

            <p className="es-ics__label">OPERATIONAL DISPATCH NOTES</p>
            <div className="es-ics__note">
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && logNote()}
                placeholder="Add real-time radio report, tactical instructions, or perimeter updates…"
                className="es-ics__input"
              />
              <Button className="es-btn-log" onClick={logNote}>
                <Send size={15} /> Log Note
              </Button>
            </div>
          </Card>
        </div>

        {/* ===== Right column ===== */}
        <div className="es-col">
          <div className="es-queue__head">
            <div className="es-queue__title">
              <Power size={24} />
              <h2>Distress Queue ({unresolved.length} Unresolved)</h2>
            </div>
            <span>Auto-triaged by ICS Severity</span>
          </div>

          {unresolved.length === 0 && <Card className="es-card es-empty">All incidents resolved. Queue is clear.</Card>}

          {incidents.map((inc) => {
            if (inc.status === "resolved") return null;
            const isFocused = focusedId === inc.id;

            /* ----- Critical SOS ----- */
            if (inc.kind === "sos") {
              return (
                <Card key={inc.id} className={"es-card es-sos" + (isFocused ? " is-focused" : "")}>
                  <div className="es-sos__head" onClick={() => setFocusedId(inc.id)}>
                    <span className="es-sos__icon"><Siren size={26} /></span>
                    <div className="es-sos__title">
                      <h3>{inc.title.replace("CRITICAL SOS — ", "CRITICAL SOS — ")}</h3>
                      <p><AlarmClock size={14} /> Triggered {agoLabel(inc.triggeredAt, now)} • ID: {inc.id}</p>
                    </div>
                    <Badge className="es-p1">{inc.priority}<br />ACTIVE</Badge>
                  </div>

                  <div className="es-sos__body">
                    <div className="es-driver">
                      <div>
                        <span className="es-tiny">DRIVER IN COMMAND</span>
                        <strong>{inc.driver.name}</strong>
                        <em>Lic: {inc.driver.license}</em>
                        <a href={`tel:${inc.driver.phone.replace(/\s/g, "")}`}>{inc.driver.phone}</a>
                      </div>
                      <div>
                        <span className="es-tiny">ROUTE TRANSIT</span>
                        <strong>{inc.route.from} → {inc.route.to}</strong>
                        <em>{inc.location}</em>
                        <code>{inc.pos[0].toFixed(4)}° N, {inc.pos[1].toFixed(4)}° E</code>
                      </div>
                    </div>

                    <div className="es-metrics">
                      <div><span>VEHICLE SPEED</span><strong>{inc.speed} <small>km/h</small></strong></div>
                      <div><span>PASSENGERS</span><strong>{inc.pax} <small>onboard</small></strong></div>
                      <div><span>FIRE / SMOKE</span><strong className="es-green">{inc.fire}</strong></div>
                    </div>

                    <div className="es-source">
                      <MousePointerClick size={18} />
                      <div>
                        <span>PANIC BUTTON TRIGGER SOURCE</span>
                        <p>{inc.source}</p>
                      </div>
                    </div>

                    <p className="es-section">IMMEDIATE COMMANDER ACTIONS</p>
                    <div className="es-actions">
                      <Button className="es-act es-act--call" onClick={callDriver}>
                        <Phone size={17} /> Call Driver Direct
                      </Button>
                      <Button className="es-act es-act--cctv" onClick={() => (onCctv ? onCctv(inc) : navigate("/camera"))}>
                        <Video size={17} /> CCTV Live Feed
                      </Button>
                      <Button className="es-act es-act--dispatch" onClick={dispatchInterceptor} disabled={dispatched}>
                        <ShieldAlert size={17} /> {dispatched ? "Interceptor Dispatched" : "Dispatch Interceptor"}
                      </Button>
                      <Button className="es-act es-act--resolve" onClick={() => resolveIncident(inc.id)}>
                        <CircleCheck size={17} /> Resolve / Close
                      </Button>
                    </div>

                    <div className="es-log__head">
                      <span>REAL-TIME ICS AUDIT LOG</span>
                      <b>Encrypted Live Stream</b>
                    </div>
                    <ul className="es-log">
                      {log.map((l, i) => (
                        <li key={i}>
                          <time>{fmtTime(l.t)}</time>
                          <i className={`es-log__dot es-log__dot--${l.tone}`} />
                          <p>
                            {l.bold && <strong className={l.tone === "red" ? "es-red" : ""}>{l.bold}</strong>}
                            {l.text}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              );
            }

            /* ----- Medical / alarm incidents ----- */
            const isMedical = inc.kind === "medical";
            return (
              <Card key={inc.id} className={"es-card es-inc" + (isFocused ? " is-focused" : "")}>
                <div className="es-inc__head" onClick={() => setFocusedId(inc.id)}>
                  <span className={`es-inc__icon es-inc__icon--${inc.kind}`}>
                    {isMedical ? <BriefcaseMedical size={22} /> : <BellRing size={22} />}
                  </span>
                  <div className="es-inc__title">
                    <h3>{inc.title}</h3>
                    <p>Triggered {agoLabel(inc.triggeredAt, now)} • {inc.place}</p>
                  </div>
                  <Badge className={`es-tag es-tag--${isMedical ? "amber" : "grey"}`}>
                    {isMedical ? <>EN<br />ROUTE</> : "ASSESSING"}
                  </Badge>
                </div>

                <div className="es-inc__panel">
                  <div>
                    <span className="es-tiny">{inc.statusLabel}</span>
                    <p>{inc.detail}</p>
                  </div>
                  <div className="es-inc__resp">
                    <b>{inc.responder.unit}</b>
                    <span>{inc.responder.note}</span>
                  </div>
                </div>

                <div className="es-inc__actions">
                  {isMedical ? (
                    <>
                      <Button
                        variant="outline"
                        className="es-btn-soft"
                        onClick={() => {
                          if (onRadioParamedic) onRadioParamedic(inc);
                          else addLog({ tone: "amber", bold: "1122 Paramedics Dispatched:", text: ` Medical unit radio link confirmed for incident ${inc.id}.` });
                        }}
                      >
                        <Headset size={15} /> Radio Paramedic
                      </Button>
                      <Button className="es-btn-blue" onClick={() => setFocusedId(inc.id)}>
                        <ExternalLink size={15} /> Expand Case
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="es-btn-soft" onClick={() => resolveIncident(inc.id)}>
                        <CircleCheck size={15} /> Request Clear Signal
                      </Button>
                      <Button className="es-btn-dark" onClick={() => setFocusedId(inc.id)}>
                        <Info size={15} /> Case Log
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmergencySOS;