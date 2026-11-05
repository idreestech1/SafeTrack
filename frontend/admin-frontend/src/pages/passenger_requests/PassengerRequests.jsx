import React, { useEffect, useMemo, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Circle, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  Hand,
  Navigation,
  Gauge,
  BadgeCheck,
  Radio,
  SlidersHorizontal,
  ListFilter,
  Search,
  Download,
  RefreshCw,
  Compass,
  Phone,
  Repeat,
  Star,
  LockKeyhole,
  MousePointerClick,
  Target,
  ClipboardCheck,
  LocateFixed,
  QrCode,
  BarChart3,
  Bus,
  PersonStanding,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { highlightText } from "@/lib/highlightText";

import "./passengerRequests.css";

/*
  ─── Setup ───────────────────────────────────────────────────────
  npm install leaflet react-leaflet lucide-react
      (React 18 → react-leaflet@4 ; React 19 → react-leaflet@5)
  npx shadcn@latest add avatar badge button card input table tabs

  REAL: the radar map, tiles and the 1.5 km dispatch geofence circle.
  PLACEHOLDER: requests, KPI numbers and tab counts below – replace
  REQUESTS / KPIS / TAB_COUNTS with your API data (same field names).
  Pickup coordinates are approximate landmark positions.
  ─────────────────────────────────────────────────────────────────
*/

/* ================================================================== */
/*  Placeholder data                                                   */
/* ================================================================== */

const GEOFENCE_M = 1500;

const TAB_COUNTS = {
  all: "1,240",
  pending: "6",
  accepted: "28",
  arrived: "12",
  completed: "1,180",
  cancelled: "14",
};

const TABS = [
  { value: "all", label: "All Requests", tone: "blue" },
  { value: "pending", label: "Pending", tone: "amber" },
  { value: "accepted", label: "Accepted", tone: "grey" },
  { value: "arrived", label: "Driver Arrived", tone: "green" },
  { value: "completed", label: "Completed", tone: "grey" },
  { value: "cancelled", label: "Cancelled", tone: "red" },
];

const REQUESTS = [
  {
    id: "PR-1024", time: "2:43 PM", status: "accepted",
    passenger: { name: "Ahmad Khan", code: "P-234", rating: 4.8 },
    stop: "University Road", stopNote: "Opp. Islamia College", pos: [34.0079, 71.4894], bearing: 50,
    vehicle: { id: "PK-102", driver: "Muhammad Ali", note: "Seat 12 Handshake", route: "Route 1 - Urban Express Line", seatsFree: "12/36", speed: 32 },
    distanceM: 120, eta: "1 min ETA", etaTone: "good", corridor: "University Road Sector 4",
  },
  {
    id: "PR-1025", time: "2:44 PM", status: "pending",
    passenger: { name: "Sana Gul", code: "P-882", rating: 5.0 },
    stop: "Saddar Road", stopNote: "Cantt Post Office Stop", pos: [34.0004, 71.5388], bearing: 120,
    vehicle: { id: "PK-105", driver: "Gul Nawaz", note: "Route 3 Express", route: "Route 3 - Cantt Express", seatsFree: "14/36", speed: 28 },
    distanceM: 350, eta: "3 mins ETA", etaTone: "good", corridor: "Saddar Road Sector 2",
  },
  {
    id: "PR-1026", time: "2:41 PM", status: "arrived",
    passenger: { name: "Dr. Farooq", code: "P-419", rating: 4.9 },
    stop: "Hayatabad Phase 3", stopNote: "Commercial Market Bay 2", pos: [33.9863, 71.4326], bearing: 200,
    vehicle: { id: "PK-112", driver: "Dawood Shah", note: "Priority Seating Resv.", route: "Route 5 - Hayatabad Link", seatsFree: "9/36", speed: 22 },
    distanceM: 500, eta: "4 mins ETA", etaTone: "good", corridor: "Hayatabad Phase 3 Sector 1",
  },
  {
    id: "PR-1027", time: "2:45 PM", status: "accepted",
    passenger: { name: "Maria Bibi", code: "P-910", rating: 4.7 },
    stop: "Peshawar Ring Road", stopNote: "Charsadda Exit Terminal", pos: [34.0535, 71.5405], bearing: 300,
    vehicle: { id: "PK-145", driver: "Zubair Shah", note: "Corridor Feeder", route: "Ring Road Feeder", seatsFree: "10/29", speed: 41 },
    distanceM: 1200, eta: "8 mins ETA", etaTone: "warn", corridor: "Ring Road North Sector",
  },
  {
    id: "PR-1028", time: "2:38 PM", status: "completed",
    passenger: { name: "Usman Tariq", code: "P-104", rating: 4.6 },
    stop: "Dabgari Gardens", stopNote: "Hospital Gate 1 Shelter", pos: [34.0066, 71.5602], bearing: 80,
    vehicle: { id: "PK-331", driver: "Kamran Jan", note: "Boarded via QR #883", route: "City Terminal Shuttles", seatsFree: "1/45", speed: 0 },
    distanceM: 210, eta: "Arrived", etaNote: "2:40 PM", etaTone: "done", boarded: true, corridor: "Dabgari Sector 3",
  },
  {
    id: "PR-1029", time: "2:39 PM", status: "completed",
    passenger: { name: "Ayesha Noor", code: "P-771", rating: 5.0 },
    stop: "Karkhano Market", stopNote: "Gateway Plaza Terminal", pos: [33.9958, 71.4747], bearing: 20,
    vehicle: { id: "PK-108", driver: "Naveed Qureshi", note: "Boarded via NFC Tap", route: "BRT Feeder Line 2", seatsFree: "12/50", speed: 0 },
    distanceM: 420, eta: "Arrived", etaNote: "2:42 PM", etaTone: "done", boarded: true, corridor: "Karkhano Sector 1",
  },
];

const KPIS = {
  demand: { active: 46, change: "+8.4%", unassigned: 6, enRoute: 28, arriving: 12 },
  pickup: { meters: 240, vs: "-45m vs avg", target: "< 400m target" },
  response: { seconds: 18, label: "High Velocity", limit: "30s Max" },
  fulfilment: { pct: 98.2, drops: "14 drops (1.8%)", threshold: "97.0% Threshold" },
};

const STANDBY = "4 Fleet Buses / 2 Minibuses";
const BOARDING_WAIT = "1.4 mins avg";

const PROTOCOL = [
  { n: 1, icon: MousePointerClick, title: "Digital Hailing Request", text: "Passenger activates pickup request via mobile app or physical smart bus stop kiosk terminal.", meta: "TELEMETRY: BROADCAST EVENT" },
  { n: 2, icon: Target, title: "Geofenced Dispatch", text: "Central telematics detects vehicles within 1.5km radius and computes optimal ETA corridor.", meta: "SPATIAL: 1.5KM RADIAL QUERY" },
  { n: 3, icon: ClipboardCheck, title: "Driver Acceptance", text: "Onboard Driver Tablet chimes; driver confirms acceptance and allocates seat inventory.", meta: "HANDSHAKE: 18S MAX SLA" },
  { n: 4, icon: LocateFixed, title: "Live GPS Tracking", text: "Sub-second bus telemetry streams to passenger phone with real-time ETA and lane marker cues.", meta: "SYNC: WEBSOCKETS 1000MS" },
  { n: 5, icon: QrCode, title: "Boarding Verification", text: "Rapid boarding authenticated via rotating dynamic QR or NFC turnstile validation.", meta: "AUTH: DUAL-TOKEN RSA" },
  { n: 6, icon: BarChart3, title: "Trip Telemetry Logged", text: "Passenger manifested into manifest ledger; ride status auto-switches to In-Transit.", meta: "AUDIT: IMMUTABLE LEDGER", done: true },
];

/* ================================================================== */
/*  Helpers                                                            */
/* ================================================================== */

const initials = (name) =>
  name.replace(/^Dr\.\s*/, "").split(" ").map((w) => w[0]).slice(0, 2).join("");

const dotFor = (status) => (status === "accepted" ? "amber" : status === "arrived" ? "green" : null);

/* Offset a lat/lng by `meters` along `bearing` degrees */
const offsetLatLng = ([lat, lng], meters, bearing) => {
  const rad = (bearing * Math.PI) / 180;
  const dLat = (meters * Math.cos(rad)) / 111320;
  const dLng = (meters * Math.sin(rad)) / (111320 * Math.cos((lat * Math.PI) / 180));
  return [lat + dLat, lng + dLng];
};

const PERSON_SVG = renderToStaticMarkup(<PersonStanding size={14} strokeWidth={2.2} color="#d97706" />);
const BUS_SVG = renderToStaticMarkup(<Bus size={14} strokeWidth={2.2} color="#ffffff" />);

const requestIcon = (label) =>
  L.divIcon({
    className: "pr-divicon",
    iconSize: [0, 0],
    html: `<div class="pr-pin pr-pin--req"><span class="pr-pin__pulse"></span>${PERSON_SVG}<b>${label}</b></div>`,
  });

const vehicleIcon = (label) =>
  L.divIcon({
    className: "pr-divicon",
    iconSize: [0, 0],
    html: `<div class="pr-pin pr-pin--bus">${BUS_SVG}<b>${label}</b></div>`,
  });

/* ================================================================== */
/*  Geo-radar                                                          */
/* ================================================================== */

const GeoRadar = ({ request }) => {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(request.pos);

  const vehiclePos = useMemo(
    () => offsetLatLng(request.pos, request.distanceM, request.bearing),
    [request]
  );

  /* Re-centre on the selected request */
  useEffect(() => {
    if (!map) return;
    map.setView(request.pos, 14, { animate: true });
  }, [map, request]);

  /* Keep the coordinate read-out in sync with the map centre */
  useEffect(() => {
    if (!map) return undefined;
    const update = () => {
      const c = map.getCenter();
      setCenter([c.lat, c.lng]);
    };
    update();
    map.on("moveend", update);
    return () => map.off("moveend", update);
  }, [map]);

  const distLabel = request.distanceM >= 1000 ? `${(request.distanceM / 1000).toFixed(1)}km` : `${request.distanceM}m`;

  return (
    <div className="pr-radar__map">
      <MapContainer
        ref={setMap}
        center={request.pos}
        zoom={14}
        minZoom={9}
        zoomControl={false}
        attributionControl
        className="pr-radar__canvas"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Circle
          center={request.pos}
          radius={GEOFENCE_M}
          pathOptions={{ color: "#1d4ed8", weight: 1.5, dashArray: "6 6", fillColor: "#1d4ed8", fillOpacity: 0.06 }}
        />
        <Polyline positions={[request.pos, vehiclePos]} pathOptions={{ color: "#1d4ed8", weight: 3, dashArray: "2 7", lineCap: "round" }} />
        <Marker position={request.pos} icon={requestIcon(`${request.id} (${distLabel})`)} />
        <Marker position={vehiclePos} icon={vehicleIcon(`${request.vehicle.id} (${request.boarded ? "Boarded" : "En-route"})`)} />
      </MapContainer>

      <div className="pr-radar__coords">
        GPS Lat: {center[0].toFixed(4)}° N, Lon: {center[1].toFixed(4)}° E
      </div>
    </div>
  );
};

/* ================================================================== */
/*  Page                                                               */
/* ================================================================== */

const PassengerRequests = ({
  totalPages = 3,
  liveTotal = 46,
  onBroadcastStopAlert,
  onDispatchRules,
  onCallCabRadio,
  onReassignUnit,
}) => {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [nearestFirst, setNearestFirst] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(REQUESTS[0].id);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = REQUESTS.filter(
      (r) =>
        (tab === "all" || r.status === tab) &&
        (!q ||
          `${r.id} ${r.passenger.name} ${r.passenger.code} ${r.stop} ${r.stopNote} ${r.vehicle.id} ${r.vehicle.driver}`
            .toLowerCase()
            .includes(q))
    );
    return nearestFirst ? [...list].sort((a, b) => a.distanceM - b.distanceM) : list;
  }, [tab, query, nearestFirst]);

  const pageRows = page === 1 ? rows : [];
  const selected = REQUESTS.find((r) => r.id === selectedId) ?? REQUESTS[0];

  const exportQueue = () => {
    const header = ["Request ID", "Time", "Status", "Passenger", "Passenger ID", "Pickup", "Landmark", "Vehicle", "Driver", "Distance (m)", "ETA"];
    const lines = rows.map((r) => [
      r.id, r.time, r.status, r.passenger.name, r.passenger.code, r.stop, r.stopNote,
      r.vehicle.id, r.vehicle.driver, r.distanceM, r.eta,
    ]);
    const csv = [header, ...lines]
      .map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `hailing-queue-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const { demand, pickup, response, fulfilment } = KPIS;
  const demandTotal = demand.unassigned + demand.enRoute + demand.arriving;

  return (
    <div className="pr-page">
      {/* ---------- Unified Command Control Card ---------- */}
      <Card className="pr-card pr-control-card">
        {/* Row 1: Header title, badge & actions */}
        <div className="pr-control-row pr-control-row--header">
          <div className="pr-control-title-block">
            <div className="pr-control-kicker">
              <span>TRANSIT TELEMATICS</span>
              <span className="pr-control-sep">•</span>
              <span>DEMAND RESPONSIVE TRANSIT (DRT)</span>
            </div>
            <div className="pr-control-main-title">
              <h1>Passenger Requests</h1>
              <span className="pr-badge-live">
                <span className="pr-pulse-dot" /> Live Telemetry
              </span>
            </div>
          </div>

          <div className="pr-control-actions">
            <span className="pr-geofence-chip">
              <span className="pr-geofence-dot" /> Auto-Dispatch Geofence: {GEOFENCE_M / 1000}km
            </span>
            <Button size="sm" className="pr-btn-broadcast" onClick={onBroadcastStopAlert}>
              <Radio size={14} /> Broadcast Stop Alert
            </Button>
            <Button size="sm" variant="outline" className="pr-btn-rules" onClick={onDispatchRules}>
              <SlidersHorizontal size={13} /> Dispatch Rules
            </Button>
          </div>
        </div>

        {/* Row 2: Status tabs & stream controls */}
        <div className="pr-control-row pr-control-row--toolbar">
          <Tabs value={tab} onValueChange={(v) => { setTab(v); setPage(1); }} className="pr-tabs-root">
            <TabsList className="pr-tabs">
              {TABS.map((t) => (
                <TabsTrigger key={t.value} value={t.value} className="pr-tab">
                  {t.label}
                  <span className={`pr-count pr-count--${t.tone}`}>{TAB_COUNTS[t.value]}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="pr-stream-controls">
            <span className="pr-stream-tag">
              <span className="pr-stream-dot" /> Refresh: 1s
            </span>
            <Button
              variant="outline"
              size="sm"
              className={"pr-btn-sort" + (nearestFirst ? " is-active" : "")}
              onClick={() => setNearestFirst((s) => !s)}
            >
              <ListFilter size={13} />
              {nearestFirst ? "Nearest First" : "Default Order"}
            </Button>
            <Button variant="outline" size="sm" className="pr-btn-export" onClick={exportQueue}>
              <Download size={13} /> Export CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* ---------- Compact Executive KPI Cards ---------- */}
      <section className="pr-kpis">
        {/* 1. Live Hailing Demand */}
        <Card className="pr-card pr-kpi pr-kpi--blue">
          <div className="pr-kpi__header">
            <span className="pr-kpi__label">LIVE HAILING DEMAND</span>
            <span className="pr-kpi__pill pr-kpi__pill--green">{demand.change}</span>
          </div>
          <div className="pr-kpi__main">
            <h2 className="pr-kpi__value">
              {demand.active} <span className="pr-kpi__unit">Active</span>
            </h2>
          </div>
          <div className="pr-kpi__meta">
            <span>{demand.unassigned} Unassigned</span>
            <span>•</span>
            <span>{demand.enRoute} En-Route</span>
            <span>•</span>
            <span>{demand.arriving} Arriving</span>
          </div>
          <div className="pr-kpi__bar">
            <div className="pr-kpi__bar-fill pr-kpi__bar-fill--blue" style={{ width: "88%" }} />
          </div>
        </Card>

        {/* 2. Avg Pickup Distance */}
        <Card className="pr-card pr-kpi pr-kpi--indigo">
          <div className="pr-kpi__header">
            <span className="pr-kpi__label">AVG. PICKUP DISTANCE</span>
            <span className="pr-kpi__pill pr-kpi__pill--green">{pickup.vs}</span>
          </div>
          <div className="pr-kpi__main">
            <h2 className="pr-kpi__value">
              {pickup.meters} <span className="pr-kpi__unit">meters</span>
            </h2>
          </div>
          <div className="pr-kpi__meta">
            <span>Optimal Corridor</span>
            <span>•</span>
            <span className="pr-kpi__accent">Target {pickup.target}</span>
          </div>
          <div className="pr-kpi__bar">
            <div className="pr-kpi__bar-fill pr-kpi__bar-fill--indigo" style={{ width: "60%" }} />
          </div>
        </Card>

        {/* 3. Avg Driver Response */}
        <Card className="pr-card pr-kpi pr-kpi--emerald">
          <div className="pr-kpi__header">
            <span className="pr-kpi__label">AVG. DRIVER RESPONSE</span>
            <span className="pr-kpi__pill pr-kpi__pill--blue">{response.label}</span>
          </div>
          <div className="pr-kpi__main">
            <h2 className="pr-kpi__value">
              {response.seconds} <span className="pr-kpi__unit">seconds</span>
            </h2>
          </div>
          <div className="pr-kpi__meta">
            <span>SLA Handshake Limit</span>
            <span>•</span>
            <span className="pr-kpi__accent">{response.limit}</span>
          </div>
          <div className="pr-kpi__bar">
            <div className="pr-kpi__bar-fill pr-kpi__bar-fill--emerald" style={{ width: "60%" }} />
          </div>
        </Card>

        {/* 4. Request Fulfillment */}
        <Card className="pr-card pr-kpi pr-kpi--green">
          <div className="pr-kpi__header">
            <span className="pr-kpi__label">REQUEST FULFILLMENT</span>
            <span className="pr-kpi__pill pr-kpi__pill--green">Goal &gt; 97%</span>
          </div>
          <div className="pr-kpi__main">
            <h2 className="pr-kpi__value">
              {fulfilment.pct}<span className="pr-kpi__percent">%</span>
            </h2>
          </div>
          <div className="pr-kpi__meta">
            <span>{fulfilment.drops}</span>
            <span>•</span>
            <span className="pr-kpi__accent">Standard Exceeded</span>
          </div>
          <div className="pr-kpi__bar">
            <div className="pr-kpi__bar-fill pr-kpi__bar-fill--green" style={{ width: `${fulfilment.pct}%` }} />
          </div>
        </Card>
      </section>

      {/* ---------- Queue + radar ---------- */}
      <section className="pr-main">
        {/* Queue */}
        <Card className="pr-card pr-queue">
          <div className="pr-queue__head">
            <div className="pr-queue__title">
              <h2>Active Hailing Queue</h2>
              <span className="pr-live-tag">
                <span className="pr-live-dot" /> {rows.length || 0} Units Monitored
              </span>
            </div>
            <div className="pr-queue__tools">
              <div className="pr-search">
                <Search size={13} />
                <Input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                  placeholder="Search passenger, stop, ID..."
                  className="pr-search__input"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="pr-btn-refresh"
                title="Reset / Refresh queue"
                onClick={() => { setQuery(""); setPage(1); }}
              >
                <RefreshCw size={12} />
              </Button>
            </div>
          </div>

          <Table className="pr-table">
            <TableHeader>
              <TableRow>
                <TableHead className="pr-th-id">REQUEST ID</TableHead>
                <TableHead className="pr-th-pax">PASSENGER</TableHead>
                <TableHead className="pr-th-stop">PICKUP LANDMARK</TableHead>
                <TableHead className="pr-th-veh">VEHICLE / DRIVER</TableHead>
                <TableHead className="pr-th-eta pr-right">DISTANCE &amp; ETA</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pageRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="pr-empty">
                    {rows.length === 0
                      ? "No requests match the current filters."
                      : "No records on this page — connect your API to load the live queue."}
                  </TableCell>
                </TableRow>
              )}

              {pageRows.map((r) => {
                const dot = dotFor(r.status);
                const isSel = r.id === selectedId;
                return (
                  <TableRow
                    key={r.id}
                    className={"pr-row" + (isSel ? " is-selected" : "")}
                    onClick={() => setSelectedId(r.id)}
                  >
                    <TableCell className="pr-td-id">
                      <div className="pr-req">
                        <div className="pr-req__line">
                          <strong className={r.boarded ? "pr-req__id pr-req__id--done" : "pr-req__id"}>{highlightText(r.id, query)}</strong>
                          {dot && <i className={`pr-req__dot pr-req__dot--${dot}`} />}
                        </div>
                        <span className="pr-req__time">{r.time}</span>
                      </div>
                    </TableCell>

                    <TableCell className="pr-td-pax">
                      <div className="pr-pax">
                        <Avatar className="pr-avatar">
                          <AvatarFallback>{initials(r.passenger.name)}</AvatarFallback>
                        </Avatar>
                        <div className="pr-pax__info">
                          <strong>{highlightText(r.passenger.name, query)}</strong>
                          <span>
                            #{highlightText(r.passenger.code, query)} <i>•</i>
                            <b><Star size={10} fill="currentColor" /> {r.passenger.rating.toFixed(1)}</b>
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="pr-td-stop">
                      <div className="pr-stop">
                        <strong>{highlightText(r.stop, query)}</strong>
                        <span>{highlightText(r.stopNote, query)}</span>
                      </div>
                    </TableCell>

                    <TableCell className="pr-td-veh">
                      <div className="pr-veh">
                        <div className="pr-veh__line">
                          <span className="pr-plate">{highlightText(r.vehicle.id, query)}</span>
                          <strong>{highlightText(r.vehicle.driver, query)}</strong>
                        </div>
                        <span className={r.boarded ? "pr-veh__note pr-veh__note--ok" : "pr-veh__note"}>
                          {r.vehicle.note}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="pr-td-eta pr-right">
                      <div className="pr-dist">
                        <strong>{r.distanceM >= 1000 ? `${(r.distanceM / 1000).toFixed(1)} km` : `${r.distanceM} m`}</strong>
                        <span className={`pr-dist__eta pr-dist__eta--${r.etaTone}`}>{r.eta}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="pr-queue__foot">
            <p>
              Showing <strong>{pageRows.length}</strong> of <strong>{liveTotal}</strong> live requests
              <i>•</i>
              <span className="pr-mesh"><Radio size={12} /> Dispatcher Telemetry Mesh Synced</span>
            </p>

            <nav className="pr-pager" aria-label="Pagination">
              <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft size={12} /> Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  className={n === page ? "is-active" : ""}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button type="button" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                Next <ChevronRight size={12} />
              </button>
            </nav>
          </div>
        </Card>

        {/* Right column: Unified Tactical Dispatch Dossier */}
        <Card className="pr-card pr-dossier">
          <div className="pr-dossier__head">
            <div className="pr-dossier__title">
              <Compass size={14} className="pr-dossier__icon" />
              <h3>Tactical Dispatch Dossier</h3>
            </div>
            <div className="pr-dossier__badges">
              <span className="pr-dossier__req-badge">{selected.id}</span>
              <Badge className="pr-zone">Peshawar Central</Badge>
            </div>
          </div>

          {/* Compact Geo-Radar Map */}
          <div className="pr-dossier__map-wrap">
            <GeoRadar request={selected} />
          </div>

          {/* Handshake & Active Unit Telemetry */}
          <div className="pr-dossier__body">
            {/* Passenger & Vehicle Quick Glance */}
            <div className="pr-dossier__glance">
              <div className="pr-glance-item">
                <span className="pr-glance-label">PASSENGER</span>
                <div className="pr-glance-user">
                  <Avatar className="pr-avatar-mini">
                    <AvatarFallback>{initials(selected.passenger.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <strong>{selected.passenger.name}</strong>
                    <span>#{selected.passenger.code} • ⭐ {selected.passenger.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="pr-glance-item">
                <span className="pr-glance-label">ASSIGNED UNIT</span>
                <div className="pr-glance-user">
                  <Avatar className="pr-avatar-mini pr-avatar-mini--blue">
                    <AvatarFallback>{initials(selected.vehicle.driver)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <strong>{selected.vehicle.driver}</strong>
                    <span>Bus <b className="text-blue-700">{selected.vehicle.id}</b> • {selected.vehicle.seatsFree} Seat Free</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Route & Stop Corridor info */}
            <div className="pr-dossier__corridor">
              <div className="pr-corridor-row">
                <span className="pr-corridor-label">Pickup Stop:</span>
                <span className="pr-corridor-val">{selected.stop} ({selected.stopNote})</span>
              </div>
              <div className="pr-corridor-row">
                <span className="pr-corridor-label">Live Corridor:</span>
                <span className="pr-corridor-val">{selected.corridor}</span>
              </div>
            </div>

            {/* Telemetry Quick Badges */}
            <div className="pr-dossier__pills">
              <span className="pr-tele-pill pr-tele-pill--green">
                Standby: {STANDBY.split("/")[0].trim()}
              </span>
              <span className="pr-tele-pill pr-tele-pill--blue">
                Boarding Wait: {BOARDING_WAIT}
              </span>
              <span className="pr-tele-pill pr-tele-pill--speed">
                Speed: {selected.vehicle.speed} km/h
              </span>
            </div>

            {/* Operational Direct Actions */}
            <div className="pr-dossier__actions">
              <Button size="sm" className="pr-btn-call" onClick={() => onCallCabRadio?.(selected)}>
                <Phone size={13} /> Call Cab Radio
              </Button>
              <Button size="sm" variant="outline" className="pr-btn-reassign" onClick={() => onReassignUnit?.(selected)}>
                <Repeat size={13} /> Reassign Unit
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* ---------- SOP flow ---------- */}
      <Card className="pr-card pr-sop">
        <div className="pr-sop__head">
          <div>
            <p className="pr-sop__kicker">STANDARD OPERATING PROTOCOL</p>
            <h2>Demand-Responsive Transit (DRT) Hailing Handshake Flow</h2>
          </div>
          <p className="pr-sop__lock">
            <LockKeyhole size={20} />
            End-to-End Cryptographic PIN Handshake
          </p>
        </div>

        <div className="pr-steps">
          {PROTOCOL.map((s) => {
            const Icon = s.icon;
            return (
              <article key={s.n} className="pr-step">
                <div className="pr-step__top">
                  <span className={"pr-step__n" + (s.done ? " pr-step__n--done" : "")}>{s.n}</span>
                  <Icon size={20} strokeWidth={1.8} />
                </div>
                <h4>{s.title}</h4>
                <p>{s.text}</p>
                <code>{s.meta}</code>
              </article>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default PassengerRequests;