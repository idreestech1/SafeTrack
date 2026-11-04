import React, { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Route as RouteIcon,
  Download,
  Plus,
  Search,
  Clock,
  TriangleAlert,
  MapPin,
  Bus,
  CheckCircle2,
  Navigation,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  Share2,
  BellRing,
  X,
  Gauge,
  CircleDollarSign,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

import "./routes.css";

/* ================================================================== */
/*  Static Route & Corridor Dataset (KPK Metropolitan Transit)        */
/* ================================================================== */

const INITIAL_ROUTES = [
  {
    id: "RT-01",
    code: "RT-01",
    name: "Peshawar Cantonment ⇄ Mardan Central",
    corridor: "N-5 Grand Trunk National Highway",
    origin: "Peshawar Cantt Terminal",
    destination: "Mardan Central Station",
    type: "Express Intercity",
    typeCode: "express",
    distanceKm: 58.4,
    avgTimeMin: 62,
    stopsCount: 18,
    activeBuses: 14,
    adherence: 94.2,
    congestion: "Moderate",
    congestionTone: "amber",
    bottleneck: "Chamkani Flyover Interchange",
    headwayMin: 8,
    fare: "PKR 180",
    serviceHours: "06:00 – 22:30",
    color: "#2563eb",
    polyline: [
      [34.0045, 71.5361],
      [34.0152, 71.5812],
      [34.0189, 71.6421],
      [34.0125, 71.7952],
      [34.0721, 71.9741],
      [34.1989, 72.0231],
    ],
    stops: [
      [34.0045, 71.5361, "Peshawar Cantt Terminal", "terminal", "00m"],
      [34.0152, 71.5812, "Gulbahar Flyover", "stop", "+12m"],
      [34.0189, 71.6421, "Chamkani Intercity Hub", "hub", "+24m"],
      [34.0125, 71.7952, "Pabbi Station", "stop", "+38m"],
      [34.0721, 71.9741, "Risalpur Military Gate", "stop", "+50m"],
      [34.1989, 72.0231, "Mardan Central Station", "terminal", "+62m"],
    ],
  },
  {
    id: "RT-02",
    code: "RT-02",
    name: "Peshawar City ⇄ Nowshera Cantt",
    corridor: "GT Road Eastern Transit Corridor",
    origin: "City Railway Terminal",
    destination: "Nowshera Cantt Hub",
    type: "BRT Feeder",
    typeCode: "brt",
    distanceKm: 42.1,
    avgTimeMin: 48,
    stopsCount: 14,
    activeBuses: 12,
    adherence: 97.8,
    congestion: "Optimal",
    congestionTone: "green",
    bottleneck: "None reported",
    headwayMin: 10,
    fare: "PKR 140",
    serviceHours: "05:30 – 23:00",
    color: "#059669",
    polyline: [
      [34.0151, 71.5249],
      [34.0165, 71.6120],
      [34.0182, 71.7450],
      [34.0153, 71.9747],
    ],
    stops: [
      [34.0151, 71.5249, "City Railway Terminal", "terminal", "00m"],
      [34.0165, 71.6120, "Taru Jabba Station", "stop", "+18m"],
      [34.0182, 71.7450, "Pabbi Industrial Zone", "stop", "+32m"],
      [34.0153, 71.9747, "Nowshera Cantt Hub", "terminal", "+48m"],
    ],
  },
  {
    id: "RT-03",
    code: "RT-03",
    name: "Peshawar City ⇄ Charsadda Bazaar",
    corridor: "Charsadda Northern Road",
    origin: "Shama Chowk Terminal",
    destination: "Charsadda Main Chowk",
    type: "Urban Intercity",
    typeCode: "urban",
    distanceKm: 32.5,
    avgTimeMin: 38,
    stopsCount: 12,
    activeBuses: 9,
    adherence: 91.5,
    congestion: "Moderate",
    congestionTone: "amber",
    bottleneck: "Naguman Bridge Sector",
    headwayMin: 12,
    fare: "PKR 110",
    serviceHours: "06:00 – 21:30",
    color: "#d97706",
    polyline: [
      [34.0151, 71.5249],
      [34.0750, 71.6100],
      [34.1120, 71.6850],
      [34.1453, 71.7308],
    ],
    stops: [
      [34.0151, 71.5249, "Shama Chowk Terminal", "terminal", "00m"],
      [34.0750, 71.6100, "Naguman River Bypass", "stop", "+15m"],
      [34.1120, 71.6850, "Sardaryab Recreation Point", "hub", "+27m"],
      [34.1453, 71.7308, "Charsadda Main Chowk", "terminal", "+38m"],
    ],
  },
  {
    id: "RT-04",
    code: "RT-04",
    name: "Ring Road Circular Expressway",
    corridor: "Peshawar Peripheral Ring Corridor",
    origin: "Hayatabad Phase 3",
    destination: "Ring Road Loop (Circular)",
    type: "Radial Belt",
    typeCode: "radial",
    distanceKm: 36.8,
    avgTimeMin: 52,
    stopsCount: 22,
    activeBuses: 16,
    adherence: 88.4,
    congestion: "Heavy",
    congestionTone: "red",
    bottleneck: "Gulbahar Junction Underpass",
    headwayMin: 6,
    fare: "PKR 90",
    serviceHours: "05:00 – 00:00",
    color: "#dc2626",
    polyline: [
      [33.9840, 71.4290],
      [34.0480, 71.5380],
      [34.0220, 71.6370],
      [33.9550, 71.5950],
      [33.9840, 71.4290],
    ],
    stops: [
      [33.9840, 71.4290, "Hayatabad Phase 3 Junction", "terminal", "00m"],
      [34.0480, 71.5380, "Warsak Road Interchange", "stop", "+16m"],
      [34.0220, 71.6370, "Pajaggi Road Crossing", "stop", "+32m"],
      [33.9550, 71.5950, "Kohat Road Bridge", "hub", "+44m"],
      [33.9840, 71.4290, "Hayatabad Circular Return", "terminal", "+52m"],
    ],
  },
  {
    id: "RT-05",
    code: "RT-05",
    name: "BRT Feeder Line 2 (Karkhano - Chamkani)",
    corridor: "Zu Peshawar Dedicated Transit Spine",
    origin: "Karkhano Market Station",
    destination: "Chamkani BRT Depot",
    type: "BRT Feeder",
    typeCode: "brt",
    distanceKm: 27.5,
    avgTimeMin: 44,
    stopsCount: 28,
    activeBuses: 18,
    adherence: 98.9,
    congestion: "Optimal",
    congestionTone: "green",
    bottleneck: "None (Dedicated Guideway)",
    headwayMin: 4,
    fare: "PKR 50",
    serviceHours: "06:00 – 23:00",
    color: "#2563eb",
    polyline: [
      [33.9980, 71.4150],
      [34.0080, 71.4850],
      [34.0130, 71.5450],
      [34.0190, 71.6450],
    ],
    stops: [
      [33.9980, 71.4150, "Karkhano Market Terminal", "terminal", "00m"],
      [34.0080, 71.4850, "University of Peshawar Station", "hub", "+14m"],
      [34.0130, 71.5450, "Saddar Post Office Hub", "hub", "+28m"],
      [34.0190, 71.6450, "Chamkani East Depot", "terminal", "+44m"],
    ],
  },
  {
    id: "RT-06",
    code: "RT-06",
    name: "University Road Academic Sector",
    corridor: "University Road Arterial Corridor",
    origin: "Khyber Teaching Hospital",
    destination: "Saddar Bazaar Center",
    type: "Academic Shuttle",
    typeCode: "shuttle",
    distanceKm: 14.2,
    avgTimeMin: 26,
    stopsCount: 16,
    activeBuses: 10,
    adherence: 93.1,
    congestion: "Optimal",
    congestionTone: "green",
    bottleneck: "Board Bazar Pedestrian Crossing",
    headwayMin: 7,
    fare: "PKR 60",
    serviceHours: "07:00 – 21:00",
    color: "#0284c7",
    polyline: [
      [34.0010, 71.4720],
      [34.0040, 71.4980],
      [34.0080, 71.5240],
      [34.0120, 71.5420],
    ],
    stops: [
      [34.0010, 71.4720, "KTH Main Emergency Gate", "terminal", "00m"],
      [34.0040, 71.4980, "Islamia College Quad", "hub", "+08m"],
      [34.0080, 71.5240, "Tehkal Payan Stop", "stop", "+17m"],
      [34.0120, 71.5420, "Saddar Cantonment Bazaar", "terminal", "+26m"],
    ],
  },
  {
    id: "RT-07",
    code: "RT-07",
    name: "Charsadda Express Direct (Tangi Link)",
    corridor: "KPK Regional Northern Highway",
    origin: "Peshawar Central Bus Stand",
    destination: "Tangi Chowk Charsadda",
    type: "Regional Radial",
    typeCode: "regional",
    distanceKm: 41.0,
    avgTimeMin: 46,
    stopsCount: 10,
    activeBuses: 8,
    adherence: 95.0,
    congestion: "Optimal",
    congestionTone: "green",
    bottleneck: "None reported",
    headwayMin: 15,
    fare: "PKR 150",
    serviceHours: "06:30 – 20:00",
    color: "#4f46e5",
    polyline: [
      [34.0150, 71.5600],
      [34.0900, 71.6500],
      [34.1800, 71.7400],
      [34.2500, 71.7900],
    ],
    stops: [
      [34.0150, 71.5600, "Central Bus Stand (Haji Camp)", "terminal", "00m"],
      [34.0900, 71.6500, "Taru Road Junction", "stop", "+18m"],
      [34.1800, 71.7400, "Charsadda Bypass", "hub", "+34m"],
      [34.2500, 71.7900, "Tangi Tehsil Chowk", "terminal", "+46m"],
    ],
  },
  {
    id: "RT-08",
    code: "RT-08",
    name: "Hayatabad Integrated Township Shuttle",
    corridor: "Hayatabad Township Ring Loop",
    origin: "Phase 1 Commercial Terminal",
    destination: "Phase 7 Jamrud Road Link",
    type: "Township Local",
    typeCode: "local",
    distanceKm: 18.6,
    avgTimeMin: 30,
    stopsCount: 15,
    activeBuses: 7,
    adherence: 96.5,
    congestion: "Optimal",
    congestionTone: "green",
    bottleneck: "Phase 5 Tatara Park Turn",
    headwayMin: 9,
    fare: "PKR 70",
    serviceHours: "06:00 – 22:00",
    color: "#059669",
    polyline: [
      [33.9920, 71.4380],
      [33.9850, 71.4250],
      [33.9740, 71.4180],
      [33.9880, 71.4020],
    ],
    stops: [
      [33.9920, 71.4380, "Phase 1 Commercial Terminal", "terminal", "00m"],
      [33.9850, 71.4250, "Phase 3 Police Station", "stop", "+10m"],
      [33.9740, 71.4180, "Phase 5 Sports Complex", "hub", "+21m"],
      [33.9880, 71.4020, "Phase 7 Jamrud Gateway", "terminal", "+30m"],
    ],
  },
];

/* Helper to generate Leaflet pin icons */
const createStopIcon = (type) => {
  const isTerminal = type === "terminal";
  const isHub = type === "hub";
  const bg = isTerminal ? "#dc2626" : isHub ? "#2563eb" : "#475569";
  const size = isTerminal ? 14 : isHub ? 12 : 9;

  return L.divIcon({
    className: "rt-divicon",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${bg};
      border: 2px solid #ffffff;
      box-shadow: 0 1px 4px rgba(0,0,0,0.3);
    "></div>`,
  });
};

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

const RoutesPage = () => {
  const [routes, setRoutes] = useState(INITIAL_ROUTES);
  const [selectedId, setSelectedId] = useState("RT-01");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [triageFilter, setTriageFilter] = useState("all");

  // Add Route Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newOrigin, setNewOrigin] = useState("");
  const [newDestination, setNewDestination] = useState("");
  const [newType, setNewType] = useState("Express Intercity");
  const [newDistance, setNewDistance] = useState("25.0");
  const [newTime, setNewTime] = useState("35");

  // Selected Route
  const selectedRoute = useMemo(
    () => routes.find((r) => r.id === selectedId) || routes[0],
    [routes, selectedId]
  );

  // Filters
  const filteredRoutes = useMemo(() => {
    const q = search.trim().toLowerCase();
    return routes.filter((r) => {
      const matchSearch =
        !q ||
        r.code.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.corridor.toLowerCase().includes(q) ||
        r.origin.toLowerCase().includes(q) ||
        r.destination.toLowerCase().includes(q);

      const matchType = typeFilter === "all" || r.type === typeFilter;
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "optimal" && r.congestionTone === "green") ||
        (statusFilter === "moderate" && r.congestionTone === "amber") ||
        (statusFilter === "congested" && r.congestionTone === "red");

      const matchTriage =
        triageFilter === "all" ||
        (triageFilter === "active" && r.activeBuses >= 12) ||
        (triageFilter === "congested" && r.congestionTone !== "green") ||
        (triageFilter === "brt" && r.typeCode === "brt");

      return matchSearch && matchType && matchStatus && matchTriage;
    });
  }, [routes, search, typeFilter, statusFilter, triageFilter]);

  // Summary Metrics for 4 KPI Cards
  const kpis = useMemo(() => {
    const totalCorridors = routes.length;
    const avgAdherence = (
      routes.reduce((acc, r) => acc + r.adherence, 0) / routes.length
    ).toFixed(1);
    const congestedCount = routes.filter((r) => r.congestionTone !== "green").length;
    const totalStops = routes.reduce((acc, r) => acc + r.stopsCount, 0);

    return [
      {
        id: "corridors",
        label: "TOTAL REGISTERED ROUTES",
        icon: RouteIcon,
        value: `${totalCorridors}`,
        unit: "corridors active",
        foot: "100% Geo-Fenced GPS Tracking",
        dot: "blue",
        accent: "blue",
      },
      {
        id: "adherence",
        label: "SCHEDULE ADHERENCE",
        icon: Clock,
        value: `${avgAdherence}%`,
        chip: "+1.8% vs last week",
        foot: "Target SLA benchmark > 92.0%",
        dot: "green",
        accent: "emerald",
      },
      {
        id: "congestion",
        label: "CORRIDOR CONGESTION",
        icon: TriangleAlert,
        value: `${congestedCount}`,
        unit: "bottlenecks",
        chip: "Chamkani & Gulbahar",
        foot: "Police traffic coordination active",
        dot: "amber",
        accent: "amber",
      },
      {
        id: "stops",
        label: "DESIGNATED TRANSIT STOPS",
        icon: MapPin,
        value: `${totalStops}`,
        unit: "stops cataloged",
        foot: "42 smart digital display shelters",
        dot: "cyan",
        accent: "cyan",
      },
    ];
  }, [routes]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "Route Code",
      "Route Name",
      "Corridor",
      "Origin",
      "Destination",
      "Type",
      "Distance (km)",
      "Avg Time (min)",
      "Stops Count",
      "Active Fleet",
      "Adherence (%)",
      "Congestion",
    ];
    const lines = filteredRoutes.map((r) => [
      r.code,
      `"${r.name}"`,
      `"${r.corridor}"`,
      `"${r.origin}"`,
      `"${r.destination}"`,
      `"${r.type}"`,
      r.distanceKm,
      r.avgTimeMin,
      r.stopsCount,
      r.activeBuses,
      r.adherence,
      r.congestion,
    ]);
    const csvContent = [headers.join(","), ...lines.map((l) => l.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kpk-routes-corridors-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Add Route
  const handleAddRoute = (e) => {
    e.preventDefault();
    if (!newCode || !newName) return;

    const newRouteItem = {
      id: newCode.toUpperCase(),
      code: newCode.toUpperCase(),
      name: newName,
      corridor: `${newOrigin} – ${newDestination} Arterial`,
      origin: newOrigin || "Peshawar Hub",
      destination: newDestination || "Transit Stop",
      type: newType,
      typeCode: newType.toLowerCase().includes("brt") ? "brt" : "urban",
      distanceKm: parseFloat(newDistance) || 20.0,
      avgTimeMin: parseInt(newTime, 10) || 30,
      stopsCount: 12,
      activeBuses: 6,
      adherence: 95.0,
      congestion: "Optimal",
      congestionTone: "green",
      bottleneck: "None reported",
      headwayMin: 10,
      fare: "PKR 100",
      serviceHours: "06:00 – 22:00",
      color: "#2563eb",
      polyline: [
        [34.0151, 71.5249],
        [34.0500, 71.6000],
        [34.1000, 71.7000],
      ],
      stops: [
        [34.0151, 71.5249, newOrigin || "Origin Station", "terminal", "00m"],
        [34.0500, 71.6000, "Intermediate Waypoint Hub", "hub", "+15m"],
        [34.1000, 71.7000, newDestination || "Terminus Station", "terminal", `+${newTime}m`],
      ],
    };

    setRoutes([newRouteItem, ...routes]);
    setSelectedId(newRouteItem.id);
    setIsModalOpen(false);
    setNewCode("");
    setNewName("");
    setNewOrigin("");
    setNewDestination("");
  };

  return (
    <div className="rt-page">
      {/* ---------- Header ---------- */}
      <header className="rt-header">
        <div className="rt-header__text">
          <div className="rt-kicker">
            <RouteIcon size={12} /> TRANSIT CORRIDOR NETWORK • SECTOR 01-NW
          </div>
          <div className="rt-header__title-row">
            <h1>Transit Routes &amp; Corridors</h1>
            <span className="rt-header__sep">•</span>
            <p className="rt-header__sub">
              Master registry of KPK urban transit lines, BRT feeder corridors, geo-fenced stops, and timetable adherence
            </p>
          </div>
        </div>

        <div className="rt-header__actions">
          <Button
            variant="outline"
            size="sm"
            className="rt-btn-soft"
            onClick={handleExportCSV}
          >
            <Download size={13} /> Export Corridors (CSV)
          </Button>
          <Button
            size="sm"
            className="rt-btn-add"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={14} /> Add Route
          </Button>
        </div>
      </header>

      {/* ---------- 4 KPI Cards ---------- */}
      <section className="rt-kpis">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.id} className="rt-card rt-kpi">
              <div className="rt-kpi__top">
                <span className="rt-kpi__label">{k.label}</span>
                <span className={`rt-kpi__icon rt-kpi__icon--${k.accent}`}>
                  <Icon size={12} strokeWidth={2.2} />
                </span>
              </div>

              <div className="rt-kpi__value">
                <strong>{k.value}</strong>
                {k.unit && <span>{k.unit}</span>}
                {k.chip && <em className="rt-kpi__chip">{k.chip}</em>}
              </div>

              <p className="rt-kpi__foot">
                <i className={`rt-dot rt-dot--${k.dot}`} />
                {k.foot}
              </p>

              <div className="rt-kpi__bar">
                <div className={`rt-kpi__bar-fill rt-kpi__bar-fill--${k.accent}`} />
              </div>
            </Card>
          );
        })}
      </section>

      {/* ---------- Filter Control Card ---------- */}
      <Card className="rt-card rt-filters">
        <div className="rt-filters__row">
          <div className="rt-search">
            <Search size={13} />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search route code, corridor name, origin or destination…"
              className="rt-search__input"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="rt-select">
              <SelectValue placeholder="All Route Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Type: All Corridors</SelectItem>
              <SelectItem value="Express Intercity">Express Intercity</SelectItem>
              <SelectItem value="BRT Feeder">BRT Feeder</SelectItem>
              <SelectItem value="Radial Belt">Radial Belt</SelectItem>
              <SelectItem value="Academic Shuttle">Academic Shuttle</SelectItem>
              <SelectItem value="Urban Intercity">Urban Intercity</SelectItem>
              <SelectItem value="Township Local">Township Local</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="rt-select">
              <SelectValue placeholder="Flow Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Flow: All Conditions</SelectItem>
              <SelectItem value="optimal">Optimal Traffic Flow</SelectItem>
              <SelectItem value="moderate">Moderate Congestion</SelectItem>
              <SelectItem value="congested">Heavy Bottlenecks</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rt-filters__subrow">
          <div className="rt-triage">
            <span className="rt-triage__label">QUICK FILTERS:</span>
            <button
              type="button"
              className={"rt-triage__chip" + (triageFilter === "all" ? " is-active" : "")}
              onClick={() => setTriageFilter("all")}
            >
              All Corridors ({routes.length})
            </button>
            <button
              type="button"
              className={"rt-triage__chip" + (triageFilter === "active" ? " is-active" : "")}
              onClick={() => setTriageFilter("active")}
            >
              High Fleet Density ({routes.filter((r) => r.activeBuses >= 12).length})
            </button>
            <button
              type="button"
              className={"rt-triage__chip" + (triageFilter === "congested" ? " is-active" : "")}
              onClick={() => setTriageFilter("congested")}
            >
              Congestion Alert ({routes.filter((r) => r.congestionTone !== "green").length})
            </button>
            <button
              type="button"
              className={"rt-triage__chip" + (triageFilter === "brt" ? " is-active" : "")}
              onClick={() => setTriageFilter("brt")}
            >
              BRT Feeder Lines ({routes.filter((r) => r.typeCode === "brt").length})
            </button>
          </div>

          <div className="rt-record-count">
            Showing <strong>{filteredRoutes.length}</strong> of <strong>{routes.length}</strong> active corridors
          </div>
        </div>
      </Card>

      {/* ---------- Main Grid: Routes Table (Left) + Selected Dossier (Right) ---------- */}
      <div className="rt-grid">
        {/* ===== Left Table Column ===== */}
        <div className="rt-col-main">
          <Card className="rt-card rt-tablecard">
            <div className="rt-tablewrap">
              <Table className="rt-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="rt-th-code">CODE</TableHead>
                    <TableHead>CORRIDOR &amp; TERMINALS</TableHead>
                    <TableHead>TYPE &amp; STOPS</TableHead>
                    <TableHead>FLEET</TableHead>
                    <TableHead>TIME / SLA</TableHead>
                    <TableHead>FLOW CONDITION</TableHead>
                    <TableHead className="rt-th-act" />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredRoutes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="rt-empty">
                        No transit routes match your search criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRoutes.map((r) => {
                      const isSelected = selectedRoute.id === r.id;
                      return (
                        <TableRow
                          key={r.id}
                          className={"rt-row" + (isSelected ? " rt-row--selected" : "")}
                          onClick={() => setSelectedId(r.id)}
                        >
                          <TableCell>
                            <span className="rt-code-badge">{r.code}</span>
                          </TableCell>

                          <TableCell>
                            <div className="rt-route-title">
                              <strong>{r.name}</strong>
                              <span>{r.corridor}</span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="rt-route-meta">
                              <span className="rt-type-tag">{r.type}</span>
                              <small>{r.stopsCount} stops • {r.distanceKm} km</small>
                            </div>
                          </TableCell>

                          <TableCell>
                            <span className="rt-fleet-pill">
                              <Bus size={11} /> {r.activeBuses} Units
                            </span>
                          </TableCell>

                          <TableCell>
                            <div className="rt-time-cell">
                              <strong>{r.avgTimeMin} mins</strong>
                              <span className="rt-adherence">{r.adherence}% On-time</span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="rt-flow-pill">
                              <i className={`rt-dot rt-dot--${r.congestionTone}`} />
                              <span>{r.congestion}</span>
                            </div>
                          </TableCell>

                          <TableCell className="rt-th-act" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rt-more-btn"
                              onClick={() => setSelectedId(r.id)}
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

        {/* ===== Right Route Corridor Dossier Panel ===== */}
        <div className="rt-col-side">
          <Card className="rt-card rt-dossier">
            {/* Dossier Header */}
            <div className="rt-dossier__head">
              <div className="rt-dossier__tag-row">
                <span className="rt-code-badge rt-code-badge--lg">{selectedRoute.code}</span>
                <span className={`rt-status-pill rt-status-pill--${selectedRoute.congestionTone}`}>
                  <i className={`rt-dot rt-dot--${selectedRoute.congestionTone}`} />
                  {selectedRoute.congestion.toUpperCase()} FLOW
                </span>
                <span className="rt-fare-badge">{selectedRoute.fare}</span>
              </div>
              <h3>{selectedRoute.name}</h3>
              <p>{selectedRoute.corridor}</p>
            </div>

            {/* Interactive Leaflet Map Preview */}
            <div className="rt-map-container">
              <MapContainer
                key={selectedRoute.id}
                center={selectedRoute.polyline[0]}
                zoom={10}
                scrollWheelZoom={false}
                className="rt-map__canvas"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                />
                <Polyline
                  positions={selectedRoute.polyline}
                  color={selectedRoute.color || "#2563eb"}
                  weight={4}
                  opacity={0.85}
                />
                {selectedRoute.stops.map(([lat, lng, name, type], i) => (
                  <Marker
                    key={i}
                    position={[lat, lng]}
                    icon={createStopIcon(type)}
                  >
                    <Popup className="rt-popup">
                      <strong>{name}</strong>
                      <div>Stop #{i + 1} ({type.toUpperCase()})</div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              <div className="rt-map-overlay-badge">
                <Navigation size={11} /> Live GPS Corridor Stream
              </div>
            </div>

            {/* Quick Corridor Telemetry Strip */}
            <div className="rt-telemetry-grid">
              <div className="rt-telemetry-item">
                <span className="rt-tel-lbl">CORRIDOR LENGTH</span>
                <strong>{selectedRoute.distanceKm} <small>km</small></strong>
              </div>
              <div className="rt-telemetry-item">
                <span className="rt-tel-lbl">AVG TRANSIT TIME</span>
                <strong>{selectedRoute.avgTimeMin} <small>min</small></strong>
              </div>
              <div className="rt-telemetry-item">
                <span className="rt-tel-lbl">DISPATCH HEADWAY</span>
                <strong>{selectedRoute.headwayMin} <small>min</small></strong>
              </div>
              <div className="rt-telemetry-item">
                <span className="rt-tel-lbl">SCHEDULE SLA</span>
                <strong className="es-green">{selectedRoute.adherence}%</strong>
              </div>
            </div>

            {/* Stop Sequence Breakdown */}
            <div className="rt-stops-section">
              <div className="rt-stops-header">
                <span className="rt-stops-title">
                  <MapPin size={12} /> STOP SEQUENCE TIMELINE ({selectedRoute.stops.length} STOPS)
                </span>
                <span className="rt-operating-hours">{selectedRoute.serviceHours}</span>
              </div>

              <div className="rt-stops-timeline">
                {selectedRoute.stops.map(([lat, lng, stopName, stopType, offsetTime], idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === selectedRoute.stops.length - 1;
                  return (
                    <div key={idx} className="rt-stop-node">
                      <div className="rt-stop-left">
                        <span className={`rt-stop-marker ${isFirst || isLast ? "is-terminus" : ""}`}>
                          {idx + 1}
                        </span>
                        {!isLast && <div className="rt-stop-line" />}
                      </div>

                      <div className="rt-stop-info">
                        <div className="rt-stop-name-row">
                          <strong>{stopName}</strong>
                          <span className="rt-stop-time">{offsetTime}</span>
                        </div>
                        <span className="rt-stop-type">
                          {stopType === "terminal" ? "Origin / Terminus Station" : stopType === "hub" ? "Transit Transfer Hub" : "En-route Local Stop"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottleneck Alert Notice */}
            {selectedRoute.bottleneck !== "None reported" && selectedRoute.bottleneck !== "None (Dedicated Guideway)" && (
              <div className="rt-bottleneck-alert">
                <TriangleAlert size={13} />
                <div>
                  <strong>Active Bottleneck:</strong> {selectedRoute.bottleneck}
                </div>
              </div>
            )}

            {/* Operational Action Buttons */}
            <div className="rt-dossier-actions">
              <Button
                variant="outline"
                size="sm"
                className="rt-btn-act"
                onClick={() => alert(`Notice broadcasted to all passengers on ${selectedRoute.code}`)}
              >
                <BellRing size={12} /> Broadcast Notice
              </Button>
              <Button
                size="sm"
                className="rt-btn-primary"
                onClick={() => alert(`Opening telemetry feed for ${selectedRoute.code}`)}
              >
                <Activity size={12} /> Focus Telemetry
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* ---------- Add Route Modal Dialog ---------- */}
      {isModalOpen && (
        <div className="rt-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="rt-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="rt-modal-head">
              <div className="rt-modal-title">
                <RouteIcon size={16} />
                <h3>Add New Transit Corridor</h3>
              </div>
              <button
                type="button"
                className="rt-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleAddRoute} className="rt-modal-form">
              <div className="rt-form-row">
                <label>
                  <span>ROUTE CODE *</span>
                  <Input
                    required
                    placeholder="e.g. RT-09"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="rt-modal-input"
                  />
                </label>
                <label>
                  <span>CORRIDOR TYPE</span>
                  <Select value={newType} onValueChange={setNewType}>
                    <SelectTrigger className="rt-modal-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Express Intercity">Express Intercity</SelectItem>
                      <SelectItem value="BRT Feeder">BRT Feeder</SelectItem>
                      <SelectItem value="Radial Belt">Radial Belt</SelectItem>
                      <SelectItem value="Academic Shuttle">Academic Shuttle</SelectItem>
                      <SelectItem value="Urban Intercity">Urban Intercity</SelectItem>
                      <SelectItem value="Township Local">Township Local</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
              </div>

              <label>
                <span>ROUTE / CORRIDOR NAME *</span>
                <Input
                  required
                  placeholder="e.g. Peshawar Cantt ⇄ Hayatabad Sector Phase 7"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="rt-modal-input"
                />
              </label>

              <div className="rt-form-row">
                <label>
                  <span>ORIGIN TERMINAL</span>
                  <Input
                    placeholder="e.g. Cantt Station Hub"
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    className="rt-modal-input"
                  />
                </label>
                <label>
                  <span>DESTINATION TERMINAL</span>
                  <Input
                    placeholder="e.g. Phase 7 Terminal"
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    className="rt-modal-input"
                  />
                </label>
              </div>

              <div className="rt-form-row">
                <label>
                  <span>DISTANCE (KM)</span>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="25.0"
                    value={newDistance}
                    onChange={(e) => setNewDistance(e.target.value)}
                    className="rt-modal-input"
                  />
                </label>
                <label>
                  <span>AVG TRANSIT TIME (MINS)</span>
                  <Input
                    type="number"
                    placeholder="35"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="rt-modal-input"
                  />
                </label>
              </div>

              <div className="rt-modal-actions">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="rt-btn-add">
                  Register Route Corridor
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutesPage;
