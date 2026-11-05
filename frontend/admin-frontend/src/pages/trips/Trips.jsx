import React, { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Navigation,
  Clock,
  Bus,
  CheckCircle2,
  AlertTriangle,
  Download,
  Plus,
  Search,
  MapPin,
  Calendar,
  ChevronRight,
  TrendingUp,
  User,
  Phone,
  Video,
  Radio,
  SlidersHorizontal,
  X,
  Gauge,
  CircleDot,
  Check,
  Activity,
  ArrowRight,
  Users,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { highlightText } from "@/lib/highlightText";

import "./trips.css";

/* ================================================================== */
/*  Trips Dataset (KPK Transit Core)                                  */
/* ================================================================== */

const INITIAL_TRIPS = [
  {
    id: "TRP-8012",
    routeCode: "RT-01",
    routeName: "Peshawar Cantt ⇄ Mardan Central",
    corridor: "N-5 Grand Trunk National Highway",
    vehicleId: "PK-102",
    vehicleReg: "KP-LE-4091",
    driver: "Muhammad Ali",
    driverCode: "DRV-4412",
    driverPhone: "+92 300 5541920",
    departureTime: "08:00",
    estimatedArrival: "09:02",
    status: "in-transit",
    statusLabel: "In Transit",
    statusTone: "green",
    progressPct: 68,
    distanceKm: 58.4,
    distanceCoveredKm: 39.7,
    currentSpeed: 54,
    passengers: 32,
    capacity: 45,
    nextStop: "Pabbi Intercity Station",
    nextStopEta: "3 mins",
    scheduleOffset: "On Schedule (0m)",
    currentPos: [34.0125, 71.7952],
    polyline: [
      [34.0045, 71.5361],
      [34.0152, 71.5812],
      [34.0189, 71.6421],
      [34.0125, 71.7952],
      [34.0721, 71.9741],
      [34.1989, 72.0231],
    ],
    stops: [
      { name: "Peshawar Cantt Terminal", passed: true, time: "08:00" },
      { name: "Gulbahar Flyover Stop", passed: true, time: "08:12" },
      { name: "Chamkani Intercity Hub", passed: true, time: "08:24" },
      { name: "Pabbi Station", passed: false, isNext: true, time: "08:38" },
      { name: "Risalpur Military Gate", passed: false, time: "08:50" },
      { name: "Mardan Central Station", passed: false, time: "09:02" },
    ],
  },
  {
    id: "TRP-8015",
    routeCode: "RT-02",
    routeName: "Peshawar City ⇄ Nowshera Cantt",
    corridor: "GT Road Eastern Corridor",
    vehicleId: "PK-101",
    vehicleReg: "KP-LE-2180",
    driver: "Arshad Khan",
    driverCode: "DRV-3810",
    driverPhone: "+92 301 9922334",
    departureTime: "08:15",
    estimatedArrival: "09:03",
    status: "in-transit",
    statusLabel: "In Transit",
    statusTone: "green",
    progressPct: 52,
    distanceKm: 42.1,
    distanceCoveredKm: 21.9,
    currentSpeed: 62,
    passengers: 28,
    capacity: 36,
    nextStop: "Taru Jabba Station",
    nextStopEta: "5 mins",
    scheduleOffset: "Ahead +2m",
    currentPos: [34.0165, 71.6120],
    polyline: [
      [34.0151, 71.5249],
      [34.0165, 71.6120],
      [34.0182, 71.7450],
      [34.0153, 71.9747],
    ],
    stops: [
      { name: "City Railway Terminal", passed: true, time: "08:15" },
      { name: "Taru Jabba Station", passed: false, isNext: true, time: "08:33" },
      { name: "Pabbi Industrial Zone", passed: false, time: "08:47" },
      { name: "Nowshera Cantt Hub", passed: false, time: "09:03" },
    ],
  },
  {
    id: "TRP-8018",
    routeCode: "RT-04",
    routeName: "Ring Road Circular Belt",
    corridor: "Peshawar Ring Road Expressway",
    vehicleId: "PK-221",
    vehicleReg: "KP-MN-9921",
    driver: "Bilal Ahmad",
    driverCode: "DRV-5012",
    driverPhone: "+92 312 8844221",
    departureTime: "08:05",
    estimatedArrival: "09:09",
    status: "delayed",
    statusLabel: "Delayed (+12m)",
    statusTone: "amber",
    progressPct: 40,
    distanceKm: 36.8,
    distanceCoveredKm: 14.7,
    currentSpeed: 78,
    passengers: 45,
    capacity: 45,
    nextStop: "Gulbahar Flyover Underpass",
    nextStopEta: "8 mins",
    scheduleOffset: "Delayed +12m (Traffic)",
    currentPos: [34.0480, 71.5380],
    polyline: [
      [33.9840, 71.4290],
      [34.0480, 71.5380],
      [34.0220, 71.6370],
      [33.9550, 71.5950],
      [33.9840, 71.4290],
    ],
    stops: [
      { name: "Hayatabad Phase 3", passed: true, time: "08:05" },
      { name: "Warsak Road Interchange", passed: true, time: "08:21" },
      { name: "Gulbahar Underpass", passed: false, isNext: true, time: "08:45" },
      { name: "Kohat Road Crossing", passed: false, time: "09:01" },
      { name: "Hayatabad Loop Return", passed: false, time: "09:21" },
    ],
  },
  {
    id: "TRP-8021",
    routeCode: "RT-03",
    routeName: "Peshawar ⇄ Charsadda Road",
    corridor: "Charsadda Northern Arterial",
    vehicleId: "PK-145",
    vehicleReg: "KP-CD-3301",
    driver: "Zubair Shah",
    driverCode: "DRV-1982",
    driverPhone: "+92 333 4455667",
    departureTime: "08:30",
    estimatedArrival: "09:08",
    status: "in-transit",
    statusLabel: "In Transit",
    statusTone: "green",
    progressPct: 25,
    distanceKm: 32.5,
    distanceCoveredKm: 8.1,
    currentSpeed: 48,
    passengers: 19,
    capacity: 29,
    nextStop: "Naguman River Bypass",
    nextStopEta: "6 mins",
    scheduleOffset: "On Schedule (0m)",
    currentPos: [34.0750, 71.6100],
    polyline: [
      [34.0151, 71.5249],
      [34.0750, 71.6100],
      [34.1120, 71.6850],
      [34.1453, 71.7308],
    ],
    stops: [
      { name: "Shama Chowk Terminal", passed: true, time: "08:30" },
      { name: "Naguman River Bypass", passed: false, isNext: true, time: "08:45" },
      { name: "Sardaryab Point", passed: false, time: "08:57" },
      { name: "Charsadda Main Chowk", passed: false, time: "09:08" },
    ],
  },
  {
    id: "TRP-8024",
    routeCode: "RT-05",
    routeName: "BRT Feeder Line 2 (Karkhano - Chamkani)",
    corridor: "Zu Peshawar Priority Guideway",
    vehicleId: "PK-108",
    vehicleReg: "KP-LE-1144",
    driver: "Naveed Qureshi",
    driverCode: "DRV-6120",
    driverPhone: "+92 345 6677889",
    departureTime: "08:40",
    estimatedArrival: "09:24",
    status: "in-transit",
    statusLabel: "In Transit",
    statusTone: "green",
    progressPct: 15,
    distanceKm: 27.5,
    distanceCoveredKm: 4.1,
    currentSpeed: 42,
    passengers: 38,
    capacity: 50,
    nextStop: "University of Peshawar Station",
    nextStopEta: "4 mins",
    scheduleOffset: "On Schedule (0m)",
    currentPos: [34.0080, 71.4850],
    polyline: [
      [33.9980, 71.4150],
      [34.0080, 71.4850],
      [34.0130, 71.5450],
      [34.0190, 71.6450],
    ],
    stops: [
      { name: "Karkhano Market Station", passed: true, time: "08:40" },
      { name: "University of Peshawar", passed: false, isNext: true, time: "08:54" },
      { name: "Saddar Post Office Hub", passed: false, time: "09:08" },
      { name: "Chamkani East Depot", passed: false, time: "09:24" },
    ],
  },
  {
    id: "TRP-8028",
    routeCode: "RT-06",
    routeName: "University Road Academic Sector",
    corridor: "University Road Arterial Corridor",
    vehicleId: "PK-331",
    vehicleReg: "KP-PE-8812",
    driver: "Kamran Jan",
    driverCode: "DRV-7719",
    driverPhone: "+92 345 1199887",
    departureTime: "09:00",
    estimatedArrival: "09:26",
    status: "scheduled",
    statusLabel: "Scheduled",
    statusTone: "blue",
    progressPct: 0,
    distanceKm: 14.2,
    distanceCoveredKm: 0,
    currentSpeed: 0,
    passengers: 0,
    capacity: 45,
    nextStop: "KTH Emergency Gate (Origin)",
    nextStopEta: "Depot Boarding",
    scheduleOffset: "Departing in 15m",
    currentPos: [34.0010, 71.4720],
    polyline: [
      [34.0010, 71.4720],
      [34.0040, 71.4980],
      [34.0080, 71.5240],
      [34.0120, 71.5420],
    ],
    stops: [
      { name: "KTH Main Gate", passed: false, isNext: true, time: "09:00" },
      { name: "Islamia College Quad", passed: false, time: "09:08" },
      { name: "Tehkal Payan Stop", passed: false, time: "09:17" },
      { name: "Saddar Bazaar", passed: false, time: "09:26" },
    ],
  },
];

/* Custom Leaflet Pin */
const createBusPin = (tone) => {
  const bg = tone === "amber" ? "#f59e0b" : tone === "blue" ? "#3b82f6" : "#16a34a";
  return L.divIcon({
    className: "trp-divicon",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `<div style="
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: ${bg};
      border: 2px solid #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    ">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 6v6"/>
        <path d="M15 6v6"/>
        <path d="M2 12h19.6"/>
        <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.2 6 18.2 6H5.8C4.8 6 3.9 6.8 3.6 7.8L2.2 12.8c-.1.4-.2.8-.2 1.2 0 .4.1.8.2 1.2.3 1.1.8 2.8.8 2.8h3"/>
        <circle cx="7" cy="18" r="2"/>
        <path d="M9 18h5"/>
        <circle cx="16" cy="18" r="2"/>
      </svg>
    </div>`,
  });
};

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

const Trips = () => {
  const [trips, setTrips] = useState(INITIAL_TRIPS);
  const [selectedId, setSelectedId] = useState("TRP-8012");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [routeFilter, setRouteFilter] = useState("all");
  const [triageFilter, setTriageFilter] = useState("in-transit");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRoute, setModalRoute] = useState("RT-01");
  const [modalVehicle, setModalVehicle] = useState("PK-102");
  const [modalDriver, setModalDriver] = useState("Muhammad Ali");
  const [modalDeparture, setModalDeparture] = useState("09:30");

  // Selected Trip
  const selectedTrip = useMemo(
    () => trips.find((t) => t.id === selectedId) || trips[0],
    [trips, selectedId]
  );

  // Filters
  const filteredTrips = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return trips.filter((t) => {
      const matchSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.vehicleId.toLowerCase().includes(q) ||
        t.driver.toLowerCase().includes(q) ||
        t.routeName.toLowerCase().includes(q) ||
        t.corridor.toLowerCase().includes(q) ||
        t.nextStop.toLowerCase().includes(q);

      const matchStatus = statusFilter === "all" || t.status === statusFilter;
      const matchRoute = routeFilter === "all" || t.routeCode === routeFilter;

      const matchTriage =
        triageFilter === "all" ||
        (triageFilter === "in-transit" && t.status === "in-transit") ||
        (triageFilter === "delayed" && t.status === "delayed") ||
        (triageFilter === "scheduled" && t.status === "scheduled");

      return matchSearch && matchStatus && matchRoute && matchTriage;
    });
  }, [trips, searchQuery, statusFilter, routeFilter, triageFilter]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Trip ID",
      "Route",
      "Corridor",
      "Vehicle ID",
      "Driver",
      "Departure",
      "ETA",
      "Status",
      "Progress (%)",
      "Passengers",
      "Next Stop",
    ];
    const lines = filteredTrips.map((t) => [
      t.id,
      `"${t.routeName}"`,
      `"${t.corridor}"`,
      t.vehicleId,
      `"${t.driver}"`,
      t.departureTime,
      t.estimatedArrival,
      t.statusLabel,
      t.progressPct,
      `${t.passengers}/${t.capacity}`,
      `"${t.nextStop}"`,
    ]);
    const csvContent = [headers.join(","), ...lines.map((l) => l.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kpk-fleet-trips-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Dispatch New Trip
  const handleDispatchTrip = (e) => {
    e.preventDefault();
    const newTripItem = {
      id: `TRP-${Math.floor(8030 + Math.random() * 50)}`,
      routeCode: modalRoute,
      routeName: "Peshawar Cantt ⇄ Mardan Central",
      corridor: "N-5 Grand Trunk National Highway",
      vehicleId: modalVehicle,
      vehicleReg: "KP-LE-4091",
      driver: modalDriver,
      driverCode: "DRV-4412",
      driverPhone: "+92 300 5541920",
      departureTime: modalDeparture,
      estimatedArrival: "10:32",
      status: "scheduled",
      statusLabel: "Scheduled",
      statusTone: "blue",
      progressPct: 0,
      distanceKm: 58.4,
      distanceCoveredKm: 0,
      currentSpeed: 0,
      passengers: 0,
      capacity: 45,
      nextStop: "Peshawar Cantt Terminal (Origin)",
      nextStopEta: "Standby Depot",
      scheduleOffset: "On-Time Dispatch",
      currentPos: [34.0045, 71.5361],
      polyline: [
        [34.0045, 71.5361],
        [34.0152, 71.5812],
        [34.0189, 71.6421],
        [34.0125, 71.7952],
        [34.0721, 71.9741],
        [34.1989, 72.0231],
      ],
      stops: [
        { name: "Peshawar Cantt Terminal", passed: false, isNext: true, time: modalDeparture },
        { name: "Gulbahar Flyover", passed: false, time: "+12m" },
        { name: "Chamkani Hub", passed: false, time: "+24m" },
        { name: "Mardan Central", passed: false, time: "+62m" },
      ],
    };

    setTrips([newTripItem, ...trips]);
    setSelectedId(newTripItem.id);
    setIsModalOpen(false);
  };

  // 4 Top KPI Cards
  const kpis = [
    {
      id: "activeTrips",
      label: "ACTIVE TRIPS IN TRANSIT",
      icon: Navigation,
      value: "86",
      unit: "active",
      chip: "14 soon completing",
      foot: "100% Geo-fenced live telemetry",
      dot: "blue",
      accent: "blue",
    },
    {
      id: "adherence",
      label: "ON-TIME SLA ADHERENCE",
      icon: Clock,
      value: "95.4%",
      unit: "on-time",
      chip: "+2.1% vs avg",
      foot: "Corridor timetable SLA maintained",
      dot: "green",
      accent: "emerald",
    },
    {
      id: "paxMoved",
      label: "PASSENGERS MOVED TODAY",
      icon: Users,
      value: "4,821",
      unit: "pax",
      chip: "+12.4% vs last Tue",
      foot: "High-density intercity transit volume",
      dot: "cyan",
      accent: "cyan",
    },
    {
      id: "delayed",
      label: "HEADWAY DELAY ALERTS",
      icon: AlertTriangle,
      value: "03",
      unit: "delayed units",
      chip: "Chamkani Bottleneck",
      foot: "Automatic dispatch adjustment active",
      dot: "amber",
      accent: "amber",
    },
  ];

  return (
    <div className="trp-page">
      {/* ---------- Header ---------- */}
      <header className="trp-header">
        <div className="trp-header__text">
          <div className="trp-kicker">
            <Navigation size={12} /> TRANSIT OPERATIONS &amp; SCHEDULING • CORRIDOR DISPATCH ENGINE
          </div>
          <div className="trp-header__title-row">
            <h1>Fleet Trips &amp; Schedule Tracking</h1>
            <span className="trp-header__sep">•</span>
            <p className="trp-header__sub">
              Real-time public transit line operations, schedule headway adherence, waypoint tracking, and terminal dispatch logs
            </p>
          </div>
        </div>

        <div className="trp-header__actions">
          <Button
            variant="outline"
            size="sm"
            className="trp-btn-soft"
            onClick={handleExportCSV}
          >
            <Download size={13} /> Export Trips (CSV)
          </Button>
          <Button
            size="sm"
            className="trp-btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={14} /> Dispatch New Trip
          </Button>
        </div>
      </header>

      {/* ---------- 4 KPI Cards ---------- */}
      <section className="trp-kpis">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.id} className="trp-card trp-kpi">
              <div className="trp-kpi__top">
                <span className="trp-kpi__label">{k.label}</span>
                <span className={`trp-kpi__icon trp-kpi__icon--${k.accent}`}>
                  <Icon size={12} strokeWidth={2.2} />
                </span>
              </div>

              <div className="trp-kpi__value">
                <strong>{k.value}</strong>
                {k.unit && <span>{k.unit}</span>}
                {k.chip && <em className={`trp-kpi__chip trp-kpi__chip--${k.accent}`}>{k.chip}</em>}
              </div>

              <p className="trp-kpi__foot">
                <i className={`trp-dot trp-dot--${k.dot}`} />
                {k.foot}
              </p>

              <div className="trp-kpi__bar">
                <div className={`trp-kpi__bar-fill trp-kpi__bar-fill--${k.accent}`} />
              </div>
            </Card>
          );
        })}
      </section>

      {/* ---------- Filters Control Bar ---------- */}
      <Card className="trp-card trp-filters">
        <div className="trp-filters__row">
          <div className="trp-search">
            <Search size={13} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trip ID, vehicle, driver, route name, or landmark…"
              className="trp-search__input"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="trp-select">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Status: All Trips</SelectItem>
              <SelectItem value="in-transit">In Transit (Active)</SelectItem>
              <SelectItem value="delayed">Delayed / Traffic</SelectItem>
              <SelectItem value="scheduled">Scheduled (Depot Ready)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={routeFilter} onValueChange={setRouteFilter}>
            <SelectTrigger className="trp-select">
              <SelectValue placeholder="All Corridors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Corridor: All Routes</SelectItem>
              <SelectItem value="RT-01">RT-01: Peshawar ⇄ Mardan</SelectItem>
              <SelectItem value="RT-02">RT-02: Peshawar ⇄ Nowshera</SelectItem>
              <SelectItem value="RT-03">RT-03: Peshawar ⇄ Charsadda</SelectItem>
              <SelectItem value="RT-04">RT-04: Ring Road Circular</SelectItem>
              <SelectItem value="RT-05">RT-05: BRT Feeder Line 2</SelectItem>
              <SelectItem value="RT-06">RT-06: University Road Radial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="trp-filters__subrow">
          <div className="trp-triage">
            <span className="trp-triage__label">QUICK TRIAGE:</span>
            <button
              type="button"
              className={"trp-triage__chip" + (triageFilter === "in-transit" ? " is-active" : "")}
              onClick={() => setTriageFilter("in-transit")}
            >
              In Transit ({trips.filter((t) => t.status === "in-transit").length})
            </button>
            <button
              type="button"
              className={"trp-triage__chip" + (triageFilter === "delayed" ? " is-active" : "")}
              onClick={() => setTriageFilter("delayed")}
            >
              Delayed ({trips.filter((t) => t.status === "delayed").length})
            </button>
            <button
              type="button"
              className={"trp-triage__chip" + (triageFilter === "scheduled" ? " is-active" : "")}
              onClick={() => setTriageFilter("scheduled")}
            >
              Scheduled ({trips.filter((t) => t.status === "scheduled").length})
            </button>
            <button
              type="button"
              className={"trp-triage__chip" + (triageFilter === "all" ? " is-active" : "")}
              onClick={() => setTriageFilter("all")}
            >
              All Trips ({trips.length})
            </button>
          </div>

          <div className="trp-record-count">
            Showing <strong>{filteredTrips.length}</strong> of <strong>{trips.length}</strong> trips
          </div>
        </div>
      </Card>

      {/* ---------- Main Split Grid: Trips Table (Left) + Selected Dossier (Right) ---------- */}
      <div className="trp-grid">
        {/* ===== Left: Trips Registry Table ===== */}
        <div className="trp-col-main">
          <Card className="trp-card trp-tablecard">
            <div className="trp-tablewrap">
              <Table className="trp-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="trp-th-id">TRIP ID</TableHead>
                    <TableHead>ROUTE &amp; CORRIDOR</TableHead>
                    <TableHead>VEHICLE &amp; DRIVER</TableHead>
                    <TableHead>TIMETABLE / ETA</TableHead>
                    <TableHead>JOURNEY PROGRESS</TableHead>
                    <TableHead>LOAD</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead className="trp-th-act" />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredTrips.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="trp-empty">
                        No transit trips match your search criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTrips.map((t) => {
                      const isSelected = selectedTrip.id === t.id;
                      const isDelayed = t.status === "delayed";
                      const isSched = t.status === "scheduled";

                      return (
                        <TableRow
                          key={t.id}
                          className={
                            "trp-row" +
                            (isSelected ? " trp-row--selected" : "") +
                            (isDelayed ? " trp-row--delayed" : "")
                          }
                          onClick={() => setSelectedId(t.id)}
                        >
                          <TableCell>
                            <span className="trp-code-badge">{highlightText(t.id, searchQuery)}</span>
                          </TableCell>

                          <TableCell>
                            <div className="trp-route-cell">
                              <strong>{highlightText(t.routeName, searchQuery)}</strong>
                              <span>{highlightText(t.corridor, searchQuery)}</span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="trp-vehicle-cell">
                              <span className="trp-veh-tag">{highlightText(t.vehicleId, searchQuery)}</span>
                              <small>{highlightText(t.driver, searchQuery)}</small>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="trp-time-cell">
                              <strong>{t.departureTime} → {t.estimatedArrival}</strong>
                              <small className={isDelayed ? "alt-amber" : "alt-green"}>
                                {t.scheduleOffset}
                              </small>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="trp-progress-cell">
                              <div className="trp-prog-top">
                                <span>{t.progressPct}%</span>
                                <small>{t.distanceCoveredKm}/{t.distanceKm} km</small>
                              </div>
                              <div className="trp-bar-track">
                                <div
                                  className={`trp-bar-fill trp-bar-fill--${t.statusTone}`}
                                  style={{ width: `${t.progressPct}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <span className="trp-pax-tag">
                              {t.passengers}/{t.capacity}
                            </span>
                          </TableCell>

                          <TableCell>
                            <span className={`trp-status-pill trp-status-pill--${t.statusTone}`}>
                              <i className={`trp-dot trp-dot--${t.statusTone}`} />
                              {t.statusLabel}
                            </span>
                          </TableCell>

                          <TableCell className="trp-th-act" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="trp-btn-arrow"
                              onClick={() => setSelectedId(t.id)}
                            >
                              <ChevronRight size={14} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        {/* ===== Right: Selected Trip Dossier & Leaflet Map Tracker ===== */}
        <div className="trp-col-side">
          <Card className="trp-card trp-dossier">
            {/* Header */}
            <div className="trp-dossier__head">
              <div className="trp-dossier__tag-row">
                <span className="trp-code-badge trp-code-badge--lg">{selectedTrip.id}</span>
                <span className={`trp-status-pill trp-status-pill--${selectedTrip.statusTone}`}>
                  <i className={`trp-dot trp-dot--${selectedTrip.statusTone}`} />
                  {selectedTrip.statusLabel.toUpperCase()}
                </span>
                <span className="trp-route-badge">{selectedTrip.routeCode}</span>
              </div>
              <h3>{selectedTrip.routeName}</h3>
              <p>{selectedTrip.corridor}</p>
            </div>

            {/* Interactive Leaflet Map Preview */}
            <div className="trp-map-container">
              <MapContainer
                key={selectedTrip.id}
                center={selectedTrip.currentPos}
                zoom={11}
                scrollWheelZoom={false}
                className="trp-map__canvas"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                />
                <Polyline
                  positions={selectedTrip.polyline}
                  color={selectedTrip.statusTone === "amber" ? "#f59e0b" : "#2563eb"}
                  weight={4}
                  opacity={0.8}
                />
                <Marker position={selectedTrip.currentPos} icon={createBusPin(selectedTrip.statusTone)}>
                  <Popup className="trp-popup">
                    <strong>{selectedTrip.vehicleId} • {selectedTrip.id}</strong>
                    <div>Speed: {selectedTrip.currentSpeed} km/h</div>
                    <div>Next: {selectedTrip.nextStop}</div>
                  </Popup>
                </Marker>
              </MapContainer>

              <div className="trp-map-overlay">
                <Navigation size={11} /> Next: <strong>{selectedTrip.nextStop}</strong> ({selectedTrip.nextStopEta})
              </div>
            </div>

            {/* Telemetry Matrix Strip */}
            <div className="trp-telemetry-grid">
              <div className="trp-telemetry-item">
                <span className="trp-tel-lbl">LIVE SPEED</span>
                <strong>{selectedTrip.currentSpeed} <small>km/h</small></strong>
              </div>
              <div className="trp-telemetry-item">
                <span className="trp-tel-lbl">PROGRESS</span>
                <strong>{selectedTrip.progressPct}%</strong>
              </div>
              <div className="trp-telemetry-item">
                <span className="trp-tel-lbl">PASSENGERS</span>
                <strong>{selectedTrip.passengers} <small>/{selectedTrip.capacity}</small></strong>
              </div>
              <div className="trp-telemetry-item">
                <span className="trp-tel-lbl">TIMETABLE</span>
                <strong className={selectedTrip.status === "delayed" ? "alt-amber" : "alt-green"}>
                  {selectedTrip.scheduleOffset.split(" ")[0]}
                </strong>
              </div>
            </div>

            {/* Vehicle & Assigned Driver Details */}
            <div className="trp-driver-card">
              <div className="trp-driver-top">
                <User size={13} />
                <span>OPERATOR IN CHARGE</span>
              </div>
              <div className="trp-driver-grid">
                <div>
                  <span className="trp-lbl">DRIVER</span>
                  <strong>{selectedTrip.driver} ({selectedTrip.driverCode})</strong>
                </div>
                <div>
                  <span className="trp-lbl">CABIN PHONE</span>
                  <a href={`tel:${selectedTrip.driverPhone.replace(/\s/g, "")}`}>
                    {selectedTrip.driverPhone}
                  </a>
                </div>
                <div>
                  <span className="trp-lbl">ASSIGNED BUS</span>
                  <span>{selectedTrip.vehicleId} ({selectedTrip.vehicleReg})</span>
                </div>
                <div>
                  <span className="trp-lbl">DEPARTURE / ARRIVAL</span>
                  <span>{selectedTrip.departureTime} → {selectedTrip.estimatedArrival}</span>
                </div>
              </div>
            </div>

            {/* Stop Sequence Breakdown */}
            <div className="trp-stops-card">
              <div className="trp-stops-head">
                <span className="trp-stops-title">
                  <MapPin size={12} /> WAYPOINT STOPS TIMELINE
                </span>
                <span className="trp-stops-dist">{selectedTrip.distanceCoveredKm} / {selectedTrip.distanceKm} km</span>
              </div>

              <div className="trp-stops-list">
                {selectedTrip.stops.map((st, i) => (
                  <div key={i} className={"trp-stop-item" + (st.passed ? " is-passed" : "") + (st.isNext ? " is-next" : "")}>
                    <div className="trp-stop-node">
                      {st.passed ? <Check size={10} /> : <CircleDot size={10} />}
                      {i < selectedTrip.stops.length - 1 && <div className="trp-stop-line" />}
                    </div>
                    <div className="trp-stop-text">
                      <strong>{highlightText(st.name, searchQuery)}</strong>
                      <small>{st.time} {st.isNext ? "• Approaching Next" : ""}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Operational Actions */}
            <div className="trp-dossier-actions">
              <Button
                variant="outline"
                size="sm"
                className="trp-btn-act"
                onClick={() => (window.location.href = `tel:${selectedTrip.driverPhone.replace(/\s/g, "")}`)}
              >
                <Phone size={12} /> Call Cabin
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="trp-btn-act"
                onClick={() => alert(`Opening live CCTV feed for ${selectedTrip.vehicleId}`)}
              >
                <Video size={12} /> CCTV Feed
              </Button>
              <Button
                size="sm"
                className="trp-btn-primary"
                onClick={() => alert(`Telemetry broadcast logged for ${selectedTrip.id}`)}
              >
                <Radio size={12} /> Telemetry
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* ---------- Dispatch Trip Modal Dialog ---------- */}
      {isModalOpen && (
        <div className="trp-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="trp-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="trp-modal-head">
              <div className="trp-modal-title">
                <Navigation size={15} />
                <h3>Dispatch Transit Line Trip</h3>
              </div>
              <button
                type="button"
                className="trp-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleDispatchTrip} className="trp-modal-form">
              <label>
                <span>ROUTE CORRIDOR *</span>
                <Select value={modalRoute} onValueChange={setModalRoute}>
                  <SelectTrigger className="trp-modal-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RT-01">RT-01: Peshawar ⇄ Mardan (N-5 Highway)</SelectItem>
                    <SelectItem value="RT-02">RT-02: Peshawar ⇄ Nowshera Cantt</SelectItem>
                    <SelectItem value="RT-03">RT-03: Peshawar ⇄ Charsadda Road</SelectItem>
                    <SelectItem value="RT-04">RT-04: Ring Road Circular Belt</SelectItem>
                    <SelectItem value="RT-05">RT-05: BRT Feeder Line 2</SelectItem>
                  </SelectContent>
                </Select>
              </label>

              <div className="trp-form-row">
                <label>
                  <span>ASSIGNED VEHICLE *</span>
                  <Select value={modalVehicle} onValueChange={setModalVehicle}>
                    <SelectTrigger className="trp-modal-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PK-102">PK-102 (Hino Metro 45-Seater)</SelectItem>
                      <SelectItem value="PK-101">PK-101 (Isuzu Journey 36-Seater)</SelectItem>
                      <SelectItem value="PK-145">PK-145 (Toyota Coaster 29-Seater)</SelectItem>
                      <SelectItem value="PK-221">PK-221 (Hino Metro AC Coach)</SelectItem>
                      <SelectItem value="PK-108">PK-108 (Daewoo City Bus 50-Seater)</SelectItem>
                    </SelectContent>
                  </Select>
                </label>

                <label>
                  <span>ASSIGNED OPERATOR *</span>
                  <Select value={modalDriver} onValueChange={setModalDriver}>
                    <SelectTrigger className="trp-modal-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Muhammad Ali">Muhammad Ali (DRV-4412)</SelectItem>
                      <SelectItem value="Arshad Khan">Arshad Khan (DRV-3810)</SelectItem>
                      <SelectItem value="Bilal Ahmad">Bilal Ahmad (DRV-5012)</SelectItem>
                      <SelectItem value="Zubair Shah">Zubair Shah (DRV-1982)</SelectItem>
                      <SelectItem value="Naveed Qureshi">Naveed Qureshi (DRV-6120)</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
              </div>

              <label>
                <span>DEPARTURE TIMETABLE *</span>
                <Input
                  type="time"
                  required
                  value={modalDeparture}
                  onChange={(e) => setModalDeparture(e.target.value)}
                  className="trp-modal-input"
                />
              </label>

              <div className="trp-modal-actions">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="trp-btn-primary">
                  Confirm Dispatch
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trips;
