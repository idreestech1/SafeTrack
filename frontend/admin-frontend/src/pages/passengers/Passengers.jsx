import React, { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Users,
  CreditCard,
  GraduationCap,
  AlertTriangle,
  Download,
  Plus,
  Search,
  CheckCircle2,
  Phone,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  User,
  Radio,
  SlidersHorizontal,
  X,
  MapPin,
  Clock,
  CircleDot,
  DollarSign,
  Ban,
  Activity,
  Award,
  Sparkles,
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

import "./passengers.css";

/* ================================================================== */
/*  KPK Transit Passengers Dataset                                    */
/* ================================================================== */

const INITIAL_PASSENGERS = [
  {
    id: "KP-PAX-8921",
    name: "Taimoor Shah",
    cnic: "17301-4492102-1",
    phone: "+92 312 9944112",
    email: "taimoor.shah@gmail.com",
    gender: "Male",
    district: "Peshawar Cantt",
    tier: "Student Concession",
    tierDiscount: "50% Subsidized",
    smartcardNo: "8920 4410 8821 0012",
    walletBalance: 1450,
    totalTrips: 248,
    safetyRating: "99.8%",
    compliance: "NADRA Bio-Verified",
    frequentRoute: "RT-01: Peshawar ⇄ Mardan",
    status: "active",
    statusLabel: "Active Valid",
    statusTone: "green",
    emergencyContact: {
      name: "Qasim Shah (Father)",
      relation: "Father",
      phone: "+92 300 4488219",
    },
    lastTapIn: {
      station: "Peshawar Cantt Terminal",
      time: "Today, 08:14 PKT",
      vehicleId: "PK-102",
      pos: [34.0045, 71.5361],
    },
    recentRides: [
      { station: "Peshawar Cantt Terminal", time: "Today 08:14", fare: "PKR 45", bus: "PK-102" },
      { station: "Chamkani Intercity Hub", time: "Yesterday 18:20", fare: "PKR 45", bus: "PK-101" },
      { station: "Gulbahar Flyover", time: "02 Nov 09:10", fare: "PKR 30", bus: "PK-221" },
    ],
  },
  {
    id: "KP-PAX-8924",
    name: "Dr. Ayesha Durrani",
    cnic: "17301-8841920-4",
    phone: "+92 333 9128833",
    email: "a.durrani@kth.edu.pk",
    gender: "Female",
    district: "University Town, Peshawar",
    tier: "Standard Citizen",
    tierDiscount: "Regular Tariff",
    smartcardNo: "8920 1194 7720 0041",
    walletBalance: 3280,
    totalTrips: 412,
    safetyRating: "100%",
    compliance: "NADRA Bio-Verified",
    frequentRoute: "RT-06: University Road Radial",
    status: "active",
    statusLabel: "Active Valid",
    statusTone: "green",
    emergencyContact: {
      name: "Tariq Durrani (Spouse)",
      relation: "Spouse",
      phone: "+92 321 8844910",
    },
    lastTapIn: {
      station: "KTH Main Emergency Gate",
      time: "Today, 07:45 PKT",
      vehicleId: "PK-331",
      pos: [34.0010, 71.4720],
    },
    recentRides: [
      { station: "KTH Main Emergency Gate", time: "Today 07:45", fare: "PKR 25", bus: "PK-331" },
      { station: "Saddar Post Office", time: "Yesterday 16:30", fare: "PKR 25", bus: "PK-331" },
      { station: "Islamia College Quad", time: "02 Nov 08:00", fare: "PKR 25", bus: "PK-108" },
    ],
  },
  {
    id: "KP-PAX-8929",
    name: "Hamza Jan Khattak",
    cnic: "17201-1928472-9",
    phone: "+92 345 5519822",
    email: "hamzajan@outlook.com",
    gender: "Male",
    district: "Nowshera Cantt",
    tier: "Standard Citizen",
    tierDiscount: "Regular Tariff",
    smartcardNo: "8920 5512 3301 9912",
    walletBalance: 65,
    totalTrips: 182,
    safetyRating: "97.4%",
    compliance: "NADRA Bio-Verified",
    frequentRoute: "RT-02: Peshawar ⇄ Nowshera",
    status: "low-balance",
    statusLabel: "Low Balance",
    statusTone: "amber",
    emergencyContact: {
      name: "Irfan Khattak (Brother)",
      relation: "Brother",
      phone: "+92 301 5566778",
    },
    lastTapIn: {
      station: "Nowshera Cantt Station",
      time: "Today, 08:30 PKT",
      vehicleId: "PK-101",
      pos: [34.0153, 71.9747],
    },
    recentRides: [
      { station: "Nowshera Cantt Station", time: "Today 08:30", fare: "PKR 40", bus: "PK-101" },
      { station: "Pabbi Station", time: "Yesterday 17:15", fare: "PKR 25", bus: "PK-101" },
      { station: "Chamkani Hub", time: "01 Nov 19:00", fare: "PKR 40", bus: "PK-101" },
    ],
  },
  {
    id: "KP-PAX-8933",
    name: "Zainab Bibi",
    cnic: "17101-7729103-2",
    phone: "+92 301 2289944",
    email: "zainab.bibi@yahoo.com",
    gender: "Female",
    district: "Charsadda Central",
    tier: "Senior Citizen",
    tierDiscount: "100% Free Concession",
    smartcardNo: "8920 8821 4402 1199",
    walletBalance: 500,
    totalTrips: 94,
    safetyRating: "100%",
    compliance: "NADRA Bio-Verified",
    frequentRoute: "RT-03: Peshawar ⇄ Charsadda",
    status: "active",
    statusLabel: "Active Valid",
    statusTone: "green",
    emergencyContact: {
      name: "Farhan Ali (Son)",
      relation: "Son",
      phone: "+92 332 9944110",
    },
    lastTapIn: {
      station: "Charsadda Main Chowk",
      time: "Today, 09:05 PKT",
      vehicleId: "PK-145",
      pos: [34.1453, 71.7308],
    },
    recentRides: [
      { station: "Charsadda Main Chowk", time: "Today 09:05", fare: "PKR 0 (Free)", bus: "PK-145" },
      { station: "Naguman River Bypass", time: "Yesterday 14:10", fare: "PKR 0 (Free)", bus: "PK-145" },
      { station: "Shama Chowk", time: "30 Oct 11:30", fare: "PKR 0 (Free)", bus: "PK-145" },
    ],
  },
  {
    id: "KP-PAX-8938",
    name: "Waqas Ahmad",
    cnic: "17301-9921443-7",
    phone: "+92 313 7744211",
    email: "waqas.ahmad@hotmail.com",
    gender: "Male",
    district: "Hayatabad Phase 3",
    tier: "Standard Citizen",
    tierDiscount: "Regular Tariff",
    smartcardNo: "8920 9941 2209 4410",
    walletBalance: 0,
    totalTrips: 64,
    safetyRating: "82.0%",
    compliance: "Police Watchlist Flag",
    frequentRoute: "RT-04: Ring Road Circular",
    status: "flagged",
    statusLabel: "SOS / Flagged",
    statusTone: "red",
    emergencyContact: {
      name: "Inspector Bilal (Security Escort)",
      relation: "Transit Police Liaison",
      phone: "+92 91 9212222",
    },
    lastTapIn: {
      station: "Hayatabad Phase 3 Square",
      time: "Yesterday, 21:10 PKT",
      vehicleId: "PK-221",
      pos: [33.9840, 71.4290],
    },
    recentRides: [
      { station: "Hayatabad Phase 3 Square", time: "Yesterday 21:10", fare: "PKR 30", bus: "PK-221" },
      { station: "Gulbahar Flyover", time: "01 Nov 18:45", fare: "PKR 30", bus: "PK-221" },
      { station: "Warsak Road Crossing", time: "31 Oct 16:20", fare: "PKR 30", bus: "PK-221" },
    ],
  },
  {
    id: "KP-PAX-8942",
    name: "Sana Gul",
    cnic: "17301-3382910-8",
    phone: "+92 346 8819200",
    email: "sanagul@uop.edu.pk",
    gender: "Female",
    district: "Tehkal, Peshawar",
    tier: "Student Concession",
    tierDiscount: "50% Subsidized",
    smartcardNo: "8920 3381 9920 1144",
    walletBalance: 820,
    totalTrips: 156,
    safetyRating: "99.5%",
    compliance: "NADRA Bio-Verified",
    frequentRoute: "RT-05: BRT Feeder Line 2",
    status: "active",
    statusLabel: "Active Valid",
    statusTone: "green",
    emergencyContact: {
      name: "Gul Muhammad (Father)",
      relation: "Father",
      phone: "+92 300 9988112",
    },
    lastTapIn: {
      station: "University of Peshawar Station",
      time: "Today, 08:42 PKT",
      vehicleId: "PK-108",
      pos: [34.0080, 71.4850],
    },
    recentRides: [
      { station: "University of Peshawar", time: "Today 08:42", fare: "PKR 20", bus: "PK-108" },
      { station: "Karkhano Market", time: "Yesterday 17:30", fare: "PKR 20", bus: "PK-108" },
      { station: "Saddar Post Office", time: "02 Nov 08:15", fare: "PKR 20", bus: "PK-108" },
    ],
  },
];

/* Custom Leaflet Pin for Station */
const createStationPin = () => {
  return L.divIcon({
    className: "pax-divicon",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    html: `<div style="
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #1d4ed8;
      border: 2px solid #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    ">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </div>`,
  });
};

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

const Passengers = () => {
  const [passengers, setPassengers] = useState(INITIAL_PASSENGERS);
  const [selectedId, setSelectedId] = useState("KP-PAX-8921");
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [triageFilter, setTriageFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalName, setModalName] = useState("");
  const [modalCnic, setModalCnic] = useState("");
  const [modalPhone, setModalPhone] = useState("");
  const [modalTier, setModalTier] = useState("Standard Citizen");
  const [modalDeposit, setModalDeposit] = useState("500");

  // Selected Passenger
  const selectedPax = useMemo(
    () => passengers.find((p) => p.id === selectedId) || passengers[0],
    [passengers, selectedId]
  );

  // Filters
  const filteredPassengers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return passengers.filter((p) => {
      const matchSearch =
        !q ||
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.cnic.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        p.smartcardNo.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q);

      const matchTier = tierFilter === "all" || p.tier === tierFilter;
      const matchStatus = statusFilter === "all" || p.status === statusFilter;

      const matchTriage =
        triageFilter === "all" ||
        (triageFilter === "active" && p.status === "active") ||
        (triageFilter === "student" && p.tier.includes("Student")) ||
        (triageFilter === "low-balance" && p.status === "low-balance") ||
        (triageFilter === "flagged" && p.status === "flagged");

      return matchSearch && matchTier && matchStatus && matchTriage;
    });
  }, [passengers, searchQuery, tierFilter, statusFilter, triageFilter]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Passenger ID",
      "Full Name",
      "CNIC",
      "Phone",
      "Concession Tier",
      "SmartCard No",
      "Wallet Balance (PKR)",
      "Total Trips",
      "Status",
      "Frequent Route",
    ];
    const lines = filteredPassengers.map((p) => [
      p.id,
      `"${p.name}"`,
      p.cnic,
      p.phone,
      `"${p.tier}"`,
      `"${p.smartcardNo}"`,
      p.walletBalance,
      p.totalTrips,
      p.statusLabel,
      `"${p.frequentRoute}"`,
    ]);
    const csvContent = [headers.join(","), ...lines.map((l) => l.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kpk-transit-passengers-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Top-Up Balance
  const handleTopUp = () => {
    setPassengers((prev) =>
      prev.map((p) => {
        if (p.id === selectedPax.id) {
          const newBal = p.walletBalance + 500;
          return {
            ...p,
            walletBalance: newBal,
            status: newBal >= 100 && p.status === "low-balance" ? "active" : p.status,
            statusLabel: newBal >= 100 && p.status === "low-balance" ? "Active Valid" : p.statusLabel,
            statusTone: newBal >= 100 && p.status === "low-balance" ? "green" : p.statusTone,
          };
        }
        return p;
      })
    );
  };

  // Toggle Suspend / Active
  const handleToggleSuspend = () => {
    setPassengers((prev) =>
      prev.map((p) => {
        if (p.id === selectedPax.id) {
          const isSuspended = p.status === "flagged";
          return {
            ...p,
            status: isSuspended ? "active" : "flagged",
            statusLabel: isSuspended ? "Active Valid" : "SOS / Flagged",
            statusTone: isSuspended ? "green" : "red",
          };
        }
        return p;
      })
    );
  };

  // Register New Passenger
  const handleRegisterPassenger = (e) => {
    e.preventDefault();
    const newId = `KP-PAX-${Math.floor(8950 + Math.random() * 50)}`;
    const newCard = `8920 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;

    const newPaxItem = {
      id: newId,
      name: modalName,
      cnic: modalCnic,
      phone: modalPhone,
      email: `${modalName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
      gender: "Citizen",
      district: "Peshawar Metro District",
      tier: modalTier,
      tierDiscount: modalTier.includes("Student") ? "50% Subsidized" : "Regular Tariff",
      smartcardNo: newCard,
      walletBalance: Number(modalDeposit) || 500,
      totalTrips: 1,
      safetyRating: "100%",
      compliance: "NADRA Bio-Verified",
      frequentRoute: "RT-01: Peshawar ⇄ Mardan",
      status: "active",
      statusLabel: "Active Valid",
      statusTone: "green",
      emergencyContact: {
        name: "Family Contact",
        relation: "Relative",
        phone: modalPhone,
      },
      lastTapIn: {
        station: "Peshawar Cantt Terminal",
        time: "Just Now",
        vehicleId: "PK-102",
        pos: [34.0045, 71.5361],
      },
      recentRides: [
        { station: "Peshawar Cantt Terminal", time: "Just Now", fare: "PKR 45", bus: "PK-102" },
      ],
    };

    setPassengers([newPaxItem, ...passengers]);
    setSelectedId(newPaxItem.id);
    setIsModalOpen(false);
    setModalName("");
    setModalCnic("");
    setModalPhone("");
  };

  // 4 Top KPI Cards
  const kpis = [
    {
      id: "totalPax",
      label: "TOTAL REGISTERED RIDERS",
      icon: Users,
      value: "18,492",
      unit: "citizens",
      chip: "+420 this week",
      foot: "100% CNIC / NADRA verified",
      dot: "blue",
      accent: "blue",
    },
    {
      id: "activeToday",
      label: "ACTIVE ON-TRANSIT TODAY",
      icon: Activity,
      value: "4,821",
      unit: "riders",
      chip: "98.2% Tap-in",
      foot: "Zu Peshawar & Intercity coaches",
      dot: "green",
      accent: "emerald",
    },
    {
      id: "studentPass",
      label: "STUDENT & CONCESSION PASS",
      icon: GraduationCap,
      value: "3,214",
      unit: "passes",
      chip: "50% subsidized",
      foot: "Universities & Technical colleges",
      dot: "cyan",
      accent: "cyan",
    },
    {
      id: "flaggedPax",
      label: "SAFETY INCIDENTS FLAGGED",
      icon: AlertTriangle,
      value: "02",
      unit: "watchlisted",
      chip: "High Priority",
      foot: "Active Police surveillance link",
      dot: "amber",
      accent: "amber",
    },
  ];

  return (
    <div className="pax-page">
      {/* ---------- Header ---------- */}
      <header className="pax-header">
        <div className="pax-header__text">
          <div className="pax-kicker">
            <Users size={12} /> KPK CITIZEN TRANSIT REGISTRY • PASSENGER VERIFICATION &amp; SMARTPASS RFID
          </div>
          <div className="pax-header__title-row">
            <h1>Transit Passengers &amp; SmartPass Core</h1>
            <span className="pax-header__sep">•</span>
            <p className="pax-header__sub">
              Master catalog of verified riders, student concessions, digital fare cards, and safety watchlist alerts
            </p>
          </div>
        </div>

        <div className="pax-header__actions">
          <Button
            variant="outline"
            size="sm"
            className="pax-btn-soft"
            onClick={handleExportCSV}
          >
            <Download size={13} /> Export Registry (CSV)
          </Button>
          <Button
            size="sm"
            className="pax-btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={14} /> Register Transit Pass
          </Button>
        </div>
      </header>

      {/* ---------- 4 KPI Cards ---------- */}
      <section className="pax-kpis">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.id} className="pax-card pax-kpi">
              <div className="pax-kpi__top">
                <span className="pax-kpi__label">{k.label}</span>
                <span className={`pax-kpi__icon pax-kpi__icon--${k.accent}`}>
                  <Icon size={12} strokeWidth={2.2} />
                </span>
              </div>

              <div className="pax-kpi__value">
                <strong>{k.value}</strong>
                {k.unit && <span>{k.unit}</span>}
                {k.chip && <em className={`pax-kpi__chip pax-kpi__chip--${k.accent}`}>{k.chip}</em>}
              </div>

              <p className="pax-kpi__foot">
                <i className={`pax-dot pax-dot--${k.dot}`} />
                {k.foot}
              </p>

              <div className="pax-kpi__bar">
                <div className={`pax-kpi__bar-fill pax-kpi__bar-fill--${k.accent}`} />
              </div>
            </Card>
          );
        })}
      </section>

      {/* ---------- Filters Control Bar ---------- */}
      <Card className="pax-card pax-filters">
        <div className="pax-filters__row">
          <div className="pax-search">
            <Search size={13} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search passenger name, CNIC (17301-…), phone, or RFID smartcard…"
              className="pax-search__input"
            />
          </div>

          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="pax-select">
              <SelectValue placeholder="All Tiers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Category: All Tiers</SelectItem>
              <SelectItem value="Standard Citizen">Standard Citizen (Regular)</SelectItem>
              <SelectItem value="Student Concession">Student Concession (50% Off)</SelectItem>
              <SelectItem value="Senior Citizen">Senior Citizen (100% Free)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="pax-select">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Status: All Statuses</SelectItem>
              <SelectItem value="active">Active Valid (Good Standing)</SelectItem>
              <SelectItem value="low-balance">Low Balance (&lt; PKR 100)</SelectItem>
              <SelectItem value="flagged">SOS / Flagged Watchlist</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pax-filters__subrow">
          <div className="pax-triage">
            <span className="pax-triage__label">QUICK TRIAGE:</span>
            <button
              type="button"
              className={"pax-triage__chip" + (triageFilter === "active" ? " is-active" : "")}
              onClick={() => setTriageFilter("active")}
            >
              Active Valid ({passengers.filter((p) => p.status === "active").length})
            </button>
            <button
              type="button"
              className={"pax-triage__chip" + (triageFilter === "student" ? " is-active" : "")}
              onClick={() => setTriageFilter("student")}
            >
              Students ({passengers.filter((p) => p.tier.includes("Student")).length})
            </button>
            <button
              type="button"
              className={"pax-triage__chip" + (triageFilter === "low-balance" ? " is-active" : "")}
              onClick={() => setTriageFilter("low-balance")}
            >
              Low Balance ({passengers.filter((p) => p.status === "low-balance").length})
            </button>
            <button
              type="button"
              className={"pax-triage__chip" + (triageFilter === "flagged" ? " is-active" : "")}
              onClick={() => setTriageFilter("flagged")}
            >
              SOS Watchlist ({passengers.filter((p) => p.status === "flagged").length})
            </button>
            <button
              type="button"
              className={"pax-triage__chip" + (triageFilter === "all" ? " is-active" : "")}
              onClick={() => setTriageFilter("all")}
            >
              All Passengers ({passengers.length})
            </button>
          </div>

          <div className="pax-record-count">
            Showing <strong>{filteredPassengers.length}</strong> of <strong>{passengers.length}</strong> cataloged riders
          </div>
        </div>
      </Card>

      {/* ---------- Main Split Grid: Table (Left) + Selected Dossier (Right) ---------- */}
      <div className="pax-grid">
        {/* ===== Left: Passengers Registry Table ===== */}
        <div className="pax-col-main">
          <Card className="pax-card pax-tablecard">
            <div className="pax-tablewrap">
              <Table className="pax-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="pax-th-id">PASSENGER ID</TableHead>
                    <TableHead>CITIZEN &amp; CNIC</TableHead>
                    <TableHead>TIER &amp; DISCOUNT</TableHead>
                    <TableHead>WALLET BALANCE</TableHead>
                    <TableHead>FREQUENT CORRIDOR</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead className="pax-th-act" />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredPassengers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="pax-empty">
                        No registered transit passengers match your filter criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPassengers.map((p) => {
                      const isSelected = selectedPax.id === p.id;
                      const isFlagged = p.status === "flagged";

                      return (
                        <TableRow
                          key={p.id}
                          className={
                            "pax-row" +
                            (isSelected ? " pax-row--selected" : "") +
                            (isFlagged ? " pax-row--flagged" : "")
                          }
                          onClick={() => setSelectedId(p.id)}
                        >
                          <TableCell>
                            <span className="pax-code-badge">{p.id}</span>
                          </TableCell>

                          <TableCell>
                            <div className="pax-user-cell">
                              <div className="pax-user-meta">
                                <strong>{p.name}</strong>
                                <span>{p.cnic}</span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="pax-tier-cell">
                              <strong>{p.tier}</strong>
                              <small>{p.tierDiscount}</small>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="pax-wallet-cell">
                              <strong>PKR {p.walletBalance.toLocaleString()}</strong>
                              <small>{p.totalTrips} trips logged</small>
                            </div>
                          </TableCell>

                          <TableCell>
                            <span style={{ fontSize: "11px", color: "#334155" }}>
                              {p.frequentRoute.split(":")[0]}
                            </span>
                          </TableCell>

                          <TableCell>
                            <span className={`pax-status-pill pax-status-pill--${p.statusTone}`}>
                              <i className={`pax-dot pax-dot--${p.statusTone}`} />
                              {p.statusLabel}
                            </span>
                          </TableCell>

                          <TableCell className="pax-th-act" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="pax-btn-arrow"
                              onClick={() => setSelectedId(p.id)}
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

        {/* ===== Right: Selected Passenger Dossier ===== */}
        <div className="pax-col-side">
          <Card className="pax-card pax-dossier">
            {/* Header */}
            <div className="pax-dossier__head">
              <div className="pax-dossier__tag-row">
                <span className="pax-code-badge pax-code-badge--lg">{selectedPax.id}</span>
                <span className={`pax-status-pill pax-status-pill--${selectedPax.statusTone}`}>
                  <i className={`pax-dot pax-dot--${selectedPax.statusTone}`} />
                  {selectedPax.statusLabel.toUpperCase()}
                </span>
                <Badge variant="outline" style={{ fontSize: "9.5px", height: "20px" }}>
                  {selectedPax.tier}
                </Badge>
              </div>
            </div>

            {/* Digital KPK Transit SmartCard Visual Widget */}
            <div className="pax-smartcard">
              <div className="pax-smartcard__top">
                <div className="pax-smartcard__logo">
                  <CreditCard size={14} /> KPK TRANSIT SMARTPASS
                </div>
                <Radio size={14} style={{ color: "#93c5fd" }} />
              </div>

              <div className="pax-smartcard__chip-row">
                <div className="pax-emv-chip" />
                <span className="pax-smartcard__num">{selectedPax.smartcardNo}</span>
              </div>

              <div className="pax-smartcard__bottom">
                <div>
                  <div className="pax-smartcard__name">{selectedPax.name}</div>
                  <div className="pax-smartcard__cnic">CNIC: {selectedPax.cnic}</div>
                </div>
                <div className="pax-smartcard__bal">
                  <div className="pax-smartcard__bal-lbl">WALLET BALANCE</div>
                  <div className="pax-smartcard__bal-val">PKR {selectedPax.walletBalance.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Telemetry Matrix Strip */}
            <div className="pax-telemetry-grid">
              <div className="pax-telemetry-item">
                <span className="pax-tel-lbl">LIFETIME TRIPS</span>
                <strong>{selectedPax.totalTrips} <small>trips</small></strong>
              </div>
              <div className="pax-telemetry-item">
                <span className="pax-tel-lbl">SAFETY SCORE</span>
                <strong>{selectedPax.safetyRating}</strong>
              </div>
              <div className="pax-telemetry-item">
                <span className="pax-tel-lbl">CONCESSION</span>
                <strong style={{ fontSize: "10px" }}>{selectedPax.tierDiscount.split(" ")[0]}</strong>
              </div>
              <div className="pax-telemetry-item">
                <span className="pax-tel-lbl">BIO-VERIFY</span>
                <strong style={{ color: "#059669" }}>VERIFIED</strong>
              </div>
            </div>

            {/* Profile & Emergency Contact */}
            <div className="pax-profile-card">
              <div className="pax-profile-top">
                <ShieldCheck size={12} />
                <span>CITIZEN VERIFICATION &amp; EMERGENCY DOSSIER</span>
              </div>
              <div className="pax-profile-grid">
                <div>
                  <span className="pax-lbl">REGISTERED DISTRICT</span>
                  <strong>{selectedPax.district}</strong>
                </div>
                <div>
                  <span className="pax-lbl">MOBILE CONTACT</span>
                  <a href={`tel:${selectedPax.phone.replace(/\s/g, "")}`}>{selectedPax.phone}</a>
                </div>
                <div>
                  <span className="pax-lbl">EMERGENCY KIN</span>
                  <strong>{selectedPax.emergencyContact.name}</strong>
                </div>
                <div>
                  <span className="pax-lbl">KIN PHONE</span>
                  <a href={`tel:${selectedPax.emergencyContact.phone.replace(/\s/g, "")}`}>
                    {selectedPax.emergencyContact.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Interactive Leaflet Map showing Recent Tap-In Station */}
            <div className="pax-map-container">
              <MapContainer
                key={selectedPax.id}
                center={selectedPax.lastTapIn.pos}
                zoom={12}
                scrollWheelZoom={false}
                className="pax-map__canvas"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                />
                <Marker position={selectedPax.lastTapIn.pos} icon={createStationPin()}>
                  <Popup>
                    <strong>{selectedPax.lastTapIn.station}</strong>
                    <div>Last Tap: {selectedPax.lastTapIn.time}</div>
                    <div>Vehicle: {selectedPax.lastTapIn.vehicleId}</div>
                  </Popup>
                </Marker>
              </MapContainer>

              <div className="pax-map-overlay">
                <MapPin size={10} /> Last Tap: <strong>{selectedPax.lastTapIn.station}</strong> ({selectedPax.lastTapIn.time})
              </div>
            </div>

            {/* Recent Rides Timeline */}
            <div className="pax-rides-card">
              <div className="pax-rides-head">
                <span className="pax-rides-title">
                  <Clock size={11} /> RECENT TAP-IN LOG &amp; FARES
                </span>
                <span style={{ fontSize: "9px", color: "#64748b" }}>{selectedPax.frequentRoute.split(":")[0]}</span>
              </div>

              <div className="pax-rides-list">
                {selectedPax.recentRides.map((r, i) => (
                  <div key={i} className="pax-ride-item">
                    <span className="pax-ride-dot">●</span>
                    <div className="pax-ride-content">
                      <div className="pax-ride-content-top">
                        <strong>{r.station}</strong>
                        <span className="pax-ride-fare">{r.fare}</span>
                      </div>
                      <span className="pax-ride-meta">{r.time} • Bus {r.bus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Operational Actions */}
            <div className="pax-dossier-actions">
              <Button
                variant="outline"
                size="sm"
                className="pax-btn-act"
                onClick={handleTopUp}
              >
                <DollarSign size={12} /> Top-Up (+500)
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="pax-btn-act"
                onClick={() => (window.location.href = `tel:${selectedPax.emergencyContact.phone.replace(/\s/g, "")}`)}
              >
                <Phone size={12} /> Call Kin
              </Button>
              <Button
                variant={selectedPax.status === "flagged" ? "default" : "outline"}
                size="sm"
                className={selectedPax.status === "flagged" ? "pax-btn-primary" : "pax-btn-act"}
                onClick={handleToggleSuspend}
              >
                <Ban size={12} /> {selectedPax.status === "flagged" ? "Unblock Pass" : "Suspend Card"}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* ---------- Register Passenger Modal Dialog ---------- */}
      {isModalOpen && (
        <div className="pax-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="pax-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="pax-modal-head">
              <div className="pax-modal-title">
                <CreditCard size={15} />
                <h3>Issue New KPK Transit RFID SmartPass</h3>
              </div>
              <button
                type="button"
                className="pax-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleRegisterPassenger} className="pax-modal-form">
              <label>
                <span>FULL CITIZEN NAME *</span>
                <Input
                  required
                  placeholder="e.g. Asad Ullah Khan"
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  className="pax-modal-input"
                />
              </label>

              <div className="pax-form-row">
                <label>
                  <span>NADRA CNIC NUMBER *</span>
                  <Input
                    required
                    placeholder="17301-XXXXXXX-X"
                    value={modalCnic}
                    onChange={(e) => setModalCnic(e.target.value)}
                    className="pax-modal-input"
                  />
                </label>

                <label>
                  <span>MOBILE PHONE NUMBER *</span>
                  <Input
                    required
                    placeholder="+92 300 1234567"
                    value={modalPhone}
                    onChange={(e) => setModalPhone(e.target.value)}
                    className="pax-modal-input"
                  />
                </label>
              </div>

              <div className="pax-form-row">
                <label>
                  <span>PASSENGER CONCESSION TIER *</span>
                  <Select value={modalTier} onValueChange={setModalTier}>
                    <SelectTrigger className="pax-modal-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard Citizen">Standard Citizen (Regular)</SelectItem>
                      <SelectItem value="Student Concession">Student Concession (50% Off)</SelectItem>
                      <SelectItem value="Senior Citizen">Senior Citizen (Free)</SelectItem>
                    </SelectContent>
                  </Select>
                </label>

                <label>
                  <span>INITIAL WALLET DEPOSIT (PKR) *</span>
                  <Input
                    type="number"
                    min="100"
                    step="50"
                    required
                    value={modalDeposit}
                    onChange={(e) => setModalDeposit(e.target.value)}
                    className="pax-modal-input"
                  />
                </label>
              </div>

              <div className="pax-modal-actions">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="pax-btn-primary">
                  Issue SmartPass Card
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Passengers;
