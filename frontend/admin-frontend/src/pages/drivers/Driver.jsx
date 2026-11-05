import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    RefreshCw,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
    Phone,
    MapPin,
    History,
    BadgeCheck,
    Ban,
    Search,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KpiCards from "@/components/kpicards/KpiCards";
import { highlightText } from "@/lib/highlightText";

import "./driver.css";

/*
  ─── Setup (run once in your project) ────────────────────────────
  npx shadcn@latest add avatar badge button card select separator table tabs
  npm install lucide-react

  The "@/..." import alias is created by `npx shadcn@latest init`.
  ─────────────────────────────────────────────────────────────────
*/

/* ------------------------------------------------------------------ */
/*  Mock data – replace with your API response                         */
/* ------------------------------------------------------------------ */

const DRIVERS = [
    {
        id: 1,
        name: "Muhammad Ali",
        sub: "SOS TRIGGERED",
        photo: null,
        license: "KPK-68910-HTV",
        cnic: "17301-4491029-1",
        vehicle: "PK-102",
        vehicleModel: "Hino Urban Liner",
        route: "Peshawar → Mardan",
        status: "on-trip-sos",
        trips: 4,
        score: 96,
        licenseType: "HTV Commercial",
        expiry: "28 Nov 2026",
        cert: "Level 2 Qualified",
        compliance: 96.4,
        harshBraking: "0 Today",
        overspeed: "< 65 km/h",
        fatigue: "0 Flags",
    },
    {
        id: 2,
        name: "Arshad Khan",
        sub: "Verified Driver",
        photo: null,
        license: "KPK-71201-HTV",
        cnic: "17301-6629103-3",
        vehicle: "PK-101",
        vehicleModel: "Yutong City Bus",
        route: "Peshawar → Nowshera",
        status: "on-trip",
        trips: 5,
        score: 94,
        licenseType: "HTV Commercial",
        expiry: "14 Mar 2027",
        cert: "Level 2 Qualified",
        compliance: 94.1,
        harshBraking: "1 Today",
        overspeed: "< 65 km/h",
        fatigue: "0 Flags",
    },
    {
        id: 3,
        name: "Bilal Ahmad",
        sub: "Route Inspector",
        photo: null,
        license: "KPK-99412-HTV",
        cnic: "17301-3391820-7",
        vehicle: "PK-221",
        vehicleModel: "Hino Urban Liner",
        route: "Ring Road Circular",
        status: "on-trip",
        trips: 6,
        score: 98,
        licenseType: "HTV Commercial",
        expiry: "02 Aug 2027",
        cert: "Level 3 Qualified",
        compliance: 98.2,
        harshBraking: "0 Today",
        overspeed: "< 65 km/h",
        fatigue: "0 Flags",
    },
    {
        id: 4,
        name: "Zubair Shah",
        sub: "Verified Driver",
        photo: null,
        license: "KPK-45129-LTV",
        cnic: "17301-1192837-5",
        vehicle: "PK-145",
        vehicleModel: "Toyota Coaster",
        route: "Peshawar → Charsadda",
        status: "on-trip",
        trips: 3,
        score: 91,
        licenseType: "LTV Commercial",
        expiry: "19 Jan 2027",
        cert: "Level 1 Qualified",
        compliance: 91.3,
        harshBraking: "2 Today",
        overspeed: "< 65 km/h",
        fatigue: "1 Flag",
    },
    {
        id: 5,
        name: "Kamran Jan",
        sub: "Shuttle Operator",
        photo: null,
        license: "KPK-66190-HTV",
        cnic: "17101-7729102-9",
        vehicle: "PK-331",
        vehicleModel: "Toyota Coaster",
        route: "City Terminal Shuttle",
        status: "available",
        trips: 4,
        score: 95,
        licenseType: "HTV Commercial",
        expiry: "30 Sep 2027",
        cert: "Level 2 Qualified",
        compliance: 95.0,
        harshBraking: "0 Today",
        overspeed: "< 65 km/h",
        fatigue: "0 Flags",
    },
    {
        id: 6,
        name: "Naveed Qureshi",
        sub: "BRT Certified",
        photo: null,
        license: "KPK-33019-HTV",
        cnic: "17301-5501928-1",
        vehicle: "PK-108",
        vehicleModel: "BRT Articulated Bus",
        route: "BRT Feeder Line 2",
        status: "on-trip",
        trips: 7,
        score: 97,
        licenseType: "HTV Commercial",
        expiry: "11 Dec 2027",
        cert: "Level 3 Qualified",
        compliance: 97.4,
        harshBraking: "0 Today",
        overspeed: "< 65 km/h",
        fatigue: "0 Flags",
    },
    {
        id: 7,
        name: "Tariq Mehmood",
        sub: "Standby Driver",
        photo: null,
        license: "KPK-11902-HTV",
        cnic: "17301-0629104-5",
        vehicle: null,
        vehicleModel: null,
        route: "Standby Depot",
        status: "offline",
        trips: 0,
        score: 93,
        licenseType: "HTV Commercial",
        expiry: "05 May 2027",
        cert: "Level 2 Qualified",
        compliance: 93.2,
        harshBraking: "0 Today",
        overspeed: "< 65 km/h",
        fatigue: "0 Flags",
    },
    {
        id: 8,
        name: "Asif Zafar",
        sub: "Under Investigation",
        photo: null,
        license: "KPK-22910-HTV",
        cnic: "17301-9901827-3",
        vehicle: "None (Revoked)",
        vehicleModel: null,
        route: "None",
        status: "suspended",
        trips: 0,
        score: 62,
        licenseType: "HTV Commercial",
        expiry: "Suspended",
        cert: "Revoked",
        compliance: 62.0,
        harshBraking: "6 Today",
        overspeed: "> 90 km/h",
        fatigue: "3 Flags",
    },
    {
        id: 9,
        name: "Farhan Tariq",
        sub: "Ready for Dispatch",
        photo: null,
        license: "KPK-44120-HTV",
        cnic: "17301-8842109-5",
        vehicle: "PK-198",
        vehicleModel: "Yutong City Bus",
        route: "Peshawar → Kohat",
        status: "available",
        trips: 2,
        score: 96,
        licenseType: "HTV Commercial",
        expiry: "12 Oct 2027",
        cert: "Level 2 Qualified",
        compliance: 96.0,
        harshBraking: "0 Today",
        overspeed: "< 65 km/h",
        fatigue: "0 Flags",
    },
    {
        id: 10,
        name: "Imran Ullah",
        sub: "Reserve Pool",
        photo: null,
        license: "KPK-55201-HTV",
        cnic: "17101-4419203-7",
        vehicle: "PK-114",
        vehicleModel: "Hino Urban Liner",
        route: "Terminal Standby",
        status: "available",
        trips: 3,
        score: 92,
        licenseType: "HTV Commercial",
        expiry: "04 May 2027",
        cert: "Level 1 Qualified",
        compliance: 92.5,
        harshBraking: "1 Today",
        overspeed: "< 65 km/h",
        fatigue: "0 Flags",
    },
    {
        id: 11,
        name: "Shahab Khan",
        sub: "Verified Driver",
        photo: null,
        license: "KPK-88129-LTV",
        cnic: "17301-5529182-3",
        vehicle: "PK-205",
        vehicleModel: "Toyota Coaster",
        route: "Charsadda Shuttle",
        status: "available",
        trips: 4,
        score: 97,
        licenseType: "LTV Commercial",
        expiry: "18 Aug 2027",
        cert: "Level 2 Qualified",
        compliance: 97.8,
        harshBraking: "0 Today",
        overspeed: "< 65 km/h",
        fatigue: "0 Flags",
    },
    {
        id: 12,
        name: "Waqar Younis",
        sub: "Shift Ended",
        photo: null,
        license: "KPK-23910-HTV",
        cnic: "17301-7718290-1",
        vehicle: null,
        vehicleModel: null,
        route: "Off Duty",
        status: "offline",
        trips: 5,
        score: 95,
        licenseType: "HTV Commercial",
        expiry: "22 Feb 2027",
        cert: "Level 2 Qualified",
        compliance: 95.1,
        harshBraking: "0 Today",
        overspeed: "< 65 km/h",
        fatigue: "0 Flags",
    },
    {
        id: 13,
        name: "Junaid Khan",
        sub: "Scheduled Maintenance",
        photo: null,
        license: "KPK-31920-HTV",
        cnic: "17301-3301928-9",
        vehicle: null,
        vehicleModel: null,
        route: "Off Duty",
        status: "offline",
        trips: 0,
        score: 91,
        licenseType: "HTV Commercial",
        expiry: "15 Jun 2027",
        cert: "Level 1 Qualified",
        compliance: 91.0,
        harshBraking: "0 Today",
        overspeed: "< 65 km/h",
        fatigue: "0 Flags",
    },
    {
        id: 14,
        name: "Khalid Mehmood",
        sub: "Speed Infraction",
        photo: null,
        license: "KPK-77412-HTV",
        cnic: "17301-9928172-5",
        vehicle: "None (Revoked)",
        vehicleModel: null,
        route: "None",
        status: "suspended",
        trips: 0,
        score: 58,
        licenseType: "HTV Commercial",
        expiry: "Suspended",
        cert: "Revoked",
        compliance: 58.5,
        harshBraking: "5 Today",
        overspeed: "> 85 km/h",
        fatigue: "2 Flags",
    },
    {
        id: 15,
        name: "Riaz Afridi",
        sub: "License Expired",
        photo: null,
        license: "KPK-11029-HTV",
        cnic: "17301-1192830-4",
        vehicle: "None (Revoked)",
        vehicleModel: null,
        route: "None",
        status: "suspended",
        trips: 0,
        score: 65,
        licenseType: "HTV Commercial",
        expiry: "Expired",
        cert: "Pending",
        compliance: 65.0,
        harshBraking: "3 Today",
        overspeed: "< 65 km/h",
        fatigue: "1 Flag",
    },
    {
        id: 16,
        name: "Hamza Ali",
        sub: "Verified Driver",
        photo: null,
        license: "KPK-90214-HTV",
        cnic: "17301-4491038-2",
        vehicle: "PK-160",
        vehicleModel: "Yutong City Bus",
        route: "Peshawar → Swabi",
        status: "on-trip",
        trips: 4,
        score: 98,
        licenseType: "HTV Commercial",
        expiry: "09 Sep 2027",
        cert: "Level 3 Qualified",
        compliance: 98.6,
        harshBraking: "0 Today",
        overspeed: "< 65 km/h",
        fatigue: "0 Flags",
    },
    {
        id: 17,
        name: "Sajid Khan",
        sub: "BRT Certified",
        photo: null,
        license: "KPK-66129-HTV",
        cnic: "17301-2291048-7",
        vehicle: "PK-188",
        vehicleModel: "BRT Articulated Bus",
        route: "BRT Main Corridor",
        status: "on-trip",
        trips: 6,
        score: 95,
        licenseType: "HTV Commercial",
        expiry: "17 Apr 2027",
        cert: "Level 2 Qualified",
        compliance: 95.4,
        harshBraking: "0 Today",
        overspeed: "< 65 km/h",
        fatigue: "0 Flags",
    },
];

const TABS = [
    { value: "all", label: "All", count: 142, match: () => true },
    {
        value: "on-trip",
        label: "On Trip",
        count: 86,
        match: (s) => s === "on-trip" || s === "on-trip-sos",
    },
    {
        value: "available",
        label: "Available",
        count: 46,
        match: (s) => s === "available",
    },
    { value: "offline", label: "Offline", count: 6, match: (s) => s === "offline" },
    {
        value: "suspended",
        label: "Suspended",
        count: 4,
        match: (s) => s === "suspended",
        isDanger: true,
    },
];

const STATUS = {
    "on-trip-sos": { label: "SOS ALERT", tone: "danger" },
    "on-trip": { label: "ON TRIP", tone: "info" },
    available: { label: "AVAILABLE", tone: "success" },
    offline: { label: "OFFLINE", tone: "muted" },
    suspended: { label: "SUSPENDED", tone: "suspended", icon: Ban },
};

const ROWS_OPTIONS = ["8", "16", "24"];

/* ------------------------------------------------------------------ */
/*  Small helpers / sub-components                                     */
/* ------------------------------------------------------------------ */

const initials = (name) =>
    name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("");

const StatusBadge = ({ status }) => {
    const cfg = STATUS[status];
    const Icon = cfg.icon;
    return (
        <Badge
            variant="outline"
            className={`drv-status drv-status--${cfg.tone}`}
        >
            {Icon ? <Icon size={10} strokeWidth={2.2} /> : <span className="drv-status__dot" />}
            {cfg.label}
        </Badge>
    );
};

const Gauge = ({ value }) => {
    const length = Math.PI * 38; // r = 38
    return (
        <div className="drv-gauge">
            <svg viewBox="0 0 100 52" className="drv-gauge__svg" aria-hidden="true">
                <path d="M 12 46 A 38 38 0 0 1 88 46" className="drv-gauge__track" />
                <path
                    d="M 12 46 A 38 38 0 0 1 88 46"
                    className="drv-gauge__fill"
                    style={{ strokeDasharray: `${(length * value) / 100} ${length}` }}
                />
            </svg>
            <div className="drv-gauge__text">
                <strong>{value}%</strong>
                <span>Safe Threshold</span>
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/*  Safety Dossier panel                                               */
/* ------------------------------------------------------------------ */

const SafetyDossier = ({ driver }) => {
    const navigate = useNavigate();
    const canContact = driver.status !== "offline" && driver.status !== "suspended";
    const isSos = driver.status === "on-trip-sos";
    const isSuspended = driver.status === "suspended";

    return (
        <Card className="drv-card drv-dossier">
            {/* Header */}
            <div className="drv-dossier__head">
                <div className="drv-dossier__title">
                    <ShieldCheck size={16} strokeWidth={2.2} className="drv-dossier__icon" />
                    <div>
                        <h3>Safety Dossier</h3>
                        <span className="drv-dossier__id">KPK-AUTH-#{driver.id.toString().padStart(4, "0")}</span>
                    </div>
                </div>
                <div className="drv-live-pill">
                    <span className="drv-live-dot" />
                    <span>LIVE TELEMETRY</span>
                </div>
            </div>

            <div className="drv-dossier__body">
                {/* Identity Card */}
                <div className={`drv-identity-card ${isSos ? "drv-identity-card--sos" : isSuspended ? "drv-identity-card--suspended" : ""}`}>
                    <div className="drv-identity-card__left">
                        <Avatar className="drv-identity-avatar">
                            {driver.photo && <AvatarImage src={driver.photo} alt={driver.name} />}
                            <AvatarFallback className="drv-identity-fallback">{initials(driver.name)}</AvatarFallback>
                        </Avatar>
                        <div className="drv-identity-meta">
                            <h4 className="drv-identity-name">{driver.name}</h4>
                            <div className="drv-identity-vehicle">
                                {driver.vehicle ? (
                                    <>
                                        <span className="drv-plate-badge">{driver.vehicle}</span>
                                        {driver.vehicleModel && (
                                            <span className="drv-model-tag">{driver.vehicleModel}</span>
                                        )}
                                    </>
                                ) : (
                                    <span className="drv-identity-none">No vehicle assigned</span>
                                )}
                            </div>
                            <div className="drv-identity-verified">
                                <BadgeCheck size={11} className="drv-verified-check" />
                                <span>KPK Police Transport Auth</span>
                            </div>
                        </div>
                    </div>

                    <div className="drv-identity-card__right">
                        {isSos ? (
                            <Badge className="drv-sos-badge">SOS ACTIVE</Badge>
                        ) : (
                            <StatusBadge status={driver.status} />
                        )}
                    </div>
                </div>

                {/* Credentials */}
                <div className="drv-sec-heading">
                    <span>LICENSING &amp; CREDENTIALS</span>
                </div>
                <div className="drv-creds">
                    <div className="drv-cred">
                        <span className="drv-cred__label">License Type</span>
                        <strong className="drv-cred__val">{driver.licenseType}</strong>
                    </div>
                    <div className="drv-cred">
                        <span className="drv-cred__label">Expiry Date</span>
                        <strong className={`drv-cred__val ${driver.expiry === "Expired" || driver.expiry === "Suspended" ? "drv-danger-text" : "drv-accent"}`}>
                            {driver.expiry}
                        </strong>
                    </div>
                    <div className="drv-cred">
                        <span className="drv-cred__label">CNIC / ID</span>
                        <strong className="drv-cred__val">{driver.cnic}</strong>
                    </div>
                    <div className="drv-cred">
                        <span className="drv-cred__label">Emergency Cert.</span>
                        <strong className={`drv-cred__val ${driver.cert === "Revoked" ? "drv-danger-text" : "drv-accent"}`}>
                            {driver.cert}
                        </strong>
                    </div>
                </div>

                {/* Telematics */}
                <div className="drv-telematics">
                    <div className="drv-telematics__head">
                        <span>TELEMATICS SPEED COMPLIANCE</span>
                        <strong>{driver.compliance}%</strong>
                    </div>

                    <Gauge value={Math.round(driver.compliance)} />

                    <div className="drv-telematics__stats">
                        <div>
                            <span>Harsh Braking</span>
                            <strong className={driver.harshBraking.startsWith("0") ? "drv-stat-safe" : "drv-stat-warn"}>
                                {driver.harshBraking}
                            </strong>
                        </div>
                        <div>
                            <span>Over-speeding</span>
                            <strong className={driver.overspeed.startsWith(">") ? "drv-stat-warn" : "drv-stat-safe"}>
                                {driver.overspeed}
                            </strong>
                        </div>
                        <div>
                            <span>Fatigue Alerts</span>
                            <strong className={driver.fatigue.startsWith("0") ? "drv-stat-safe" : "drv-stat-warn"}>
                                {driver.fatigue}
                            </strong>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="drv-sec-heading">
                    <span>OPERATIONAL DIRECT ACTIONS</span>
                </div>
                <div className="drv-actions">
                    <Button
                        className="drv-btn drv-btn--call"
                        disabled={!canContact}
                        onClick={() => {
                            if (driver.phone) window.location.href = `tel:${driver.phone.replace(/\s/g, "")}`;
                        }}
                    >
                        <Phone size={13} strokeWidth={2.2} />
                        Call Cabin
                    </Button>
                    <Button
                        className="drv-btn drv-btn--intercept"
                        disabled={!canContact}
                        onClick={() => navigate("/emergency")}
                    >
                        <MapPin size={13} strokeWidth={2.2} />
                        Police Intercept
                    </Button>
                </div>

                <Button
                    variant="ghost"
                    className="drv-audit"
                    onClick={() => navigate("/driver-behavior")}
                >
                    <History size={12} strokeWidth={2} />
                    View 30-Day Driving Audit Log
                </Button>
            </div>
        </Card>
    );
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const DriversPage = ({ onRefresh }) => {
    const [tab, setTab] = useState("all");
    const [search, setSearch] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [page, setPage] = useState(1);
    const [selectedId, setSelectedId] = useState(DRIVERS[0].id);
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = () => {
        setRefreshing(true);
        onRefresh?.();
        setTimeout(() => setRefreshing(false), 600);
    };

    const activeTab = TABS.find((t) => t.value === tab);

    const filtered = useMemo(() => {
        let list = DRIVERS.filter((d) => activeTab.match(d.status));
        if (search && search.trim()) {
            const terms = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
            list = list.filter((d) => {
                return terms.every((term) => {
                    const nameMatch = d.name?.toLowerCase().includes(term);
                    const licenseMatch = d.license?.toLowerCase().includes(term);
                    const cnicMatch = d.cnic?.toLowerCase().includes(term);
                    const vehicleMatch = typeof d.vehicle === "string" && d.vehicle.toLowerCase().includes(term);
                    const modelMatch = typeof d.vehicleModel === "string" && d.vehicleModel.toLowerCase().includes(term);
                    const routeMatch = typeof d.route === "string" && d.route.toLowerCase().includes(term);
                    const subMatch = typeof d.sub === "string" && d.sub.toLowerCase().includes(term);
                    const certMatch = typeof d.cert === "string" && d.cert.toLowerCase().includes(term);
                    const licTypeMatch = typeof d.licenseType === "string" && d.licenseType.toLowerCase().includes(term);
                    return (
                        nameMatch ||
                        licenseMatch ||
                        cnicMatch ||
                        vehicleMatch ||
                        modelMatch ||
                        routeMatch ||
                        subMatch ||
                        certMatch ||
                        licTypeMatch
                    );
                });
            });
        }
        return list;
    }, [activeTab, search]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleClearSearch = () => {
        setSearch("");
        setPage(1);
    };

    const handleTabChange = (value) => {
        setTab(value);
        setPage(1);
        const tabObj = TABS.find((t) => t.value === value);
        if (tabObj) {
            const nextList = DRIVERS.filter((d) => tabObj.match(d.status));
            if (nextList.length > 0) {
                setSelectedId(nextList[0].id);
            }
        }
    };

    const selected = useMemo(() => {
        const found = filtered.find((d) => d.id === selectedId);
        if (found) return found;
        return filtered[0] || DRIVERS[0];
    }, [filtered, selectedId]);

    const rows = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));

    return (
        <div className="drv-layout">
            <KpiCards />
            <div className="drv-page">
                {/* ---------- Drivers table ---------- */}
            <Card className="drv-card">
                {/* Filter tabs + search & record count */}
                <div className="drv-toolbar">
                    <Tabs value={tab} onValueChange={handleTabChange} className="drv-tabs-root">
                        <TabsList className="drv-tabs">
                            {TABS.map((t) => (
                                <TabsTrigger key={t.value} value={t.value} className="drv-tab">
                                    <span className="drv-tab__label">{t.label}</span>
                                    <span
                                        className={`drv-tab__count ${
                                            t.isDanger ? "drv-tab__count--danger" : ""
                                        }`}
                                    >
                                        {t.count}
                                    </span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>

                    <div className="drv-toolbar__right">
                        <div className="drv-search-box">
                            <Search size={13} className="drv-search-icon" />
                            <input
                                type="text"
                                placeholder="Search drivers, vehicle..."
                                value={search}
                                onChange={handleSearchChange}
                                onKeyDown={(e) => {
                                    if (e.key === "Escape") handleClearSearch();
                                }}
                                className="drv-search-input"
                            />
                            {search && (
                                <button
                                    type="button"
                                    className="drv-search-clear"
                                    onClick={handleClearSearch}
                                    aria-label="Clear search"
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        <div className="drv-records-pill" title="Shown records">
                            <span className="drv-records-num">{filtered.length}</span>
                            <span className="drv-records-sep">/</span>
                            <span className="drv-records-total">{activeTab.count}</span>
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            className="drv-btn-refresh"
                            aria-label="Refresh"
                            title="Refresh"
                            onClick={handleRefresh}
                        >
                            <RefreshCw size={13} strokeWidth={2} className={refreshing ? "drv-spin" : ""} />
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="drv-table-wrap">
                    <Table className="drv-table">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="drv-th-profile">Driver Profile</TableHead>
                                <TableHead className="drv-th-license">License No.</TableHead>
                                <TableHead className="drv-th-cnic">CNIC / ID</TableHead>
                                <TableHead className="drv-th-vehicle">Vehicle</TableHead>
                                <TableHead className="drv-th-route">Current Route</TableHead>
                                <TableHead className="drv-th-status">Shift Status</TableHead>
                                <TableHead className="drv-th-trips">Trips</TableHead>
                                <TableHead className="drv-th-score">Safety Score</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {rows.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="drv-empty-cell">
                                        <div className="drv-empty">
                                            <Search size={20} className="drv-empty__icon" />
                                            <div className="drv-empty__title">No matching drivers found</div>
                                            <div className="drv-empty__sub">
                                                {search ? (
                                                    <>
                                                        No drivers match &ldquo;<strong>{search}</strong>&rdquo;
                                                        {tab !== "all" && (
                                                            <span> in this status tab.</span>
                                                        )}
                                                    </>
                                                ) : (
                                                    "No drivers found in this status category."
                                                )}
                                            </div>
                                            {search ? (
                                                <button
                                                    type="button"
                                                    onClick={handleClearSearch}
                                                    className="drv-empty__action"
                                                >
                                                    Clear Search
                                                </button>
                                            ) : tab !== "all" ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleTabChange("all")}
                                                    className="drv-empty__action"
                                                >
                                                    View All Drivers
                                                </button>
                                            ) : null}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}

                            {rows.map((d) => {
                                const suspended = d.status === "suspended";
                                return (
                                    <TableRow
                                        key={d.id}
                                        onClick={() => setSelectedId(d.id)}
                                        className={
                                            "drv-row" +
                                            (suspended ? " drv-row--suspended" : "") +
                                            (selectedId === d.id ? " drv-row--selected" : "")
                                        }
                                    >
                                        <TableCell className="drv-cell-profile">
                                            <div className="drv-profile">
                                                <Avatar className="drv-avatar">
                                                    {d.photo && <AvatarImage src={d.photo} alt={d.name} />}
                                                    <AvatarFallback className="drv-avatar-fallback">{initials(d.name)}</AvatarFallback>
                                                </Avatar>
                                                <div className="drv-profile__info">
                                                    <span className={"drv-name" + (suspended ? " drv-name--danger" : "")}>
                                                        {highlightText(d.name, search)}
                                                    </span>
                                                    <span
                                                        className={
                                                            "drv-sub" +
                                                            (d.status === "on-trip-sos" || suspended
                                                                ? " drv-sub--danger"
                                                                : "")
                                                        }
                                                    >
                                                        {d.status === "on-trip-sos" && (
                                                            <span className="drv-sub__dot" />
                                                        )}
                                                        {highlightText(d.sub, search)}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="drv-cell-license">
                                            <span className="drv-license-text">{highlightText(d.license, search)}</span>
                                        </TableCell>

                                        <TableCell className="drv-cell-cnic">
                                            <span className="drv-cnic-text">{highlightText(d.cnic, search)}</span>
                                        </TableCell>

                                        <TableCell className="drv-cell-vehicle">
                                            {d.vehicle && !suspended ? (
                                                <span className="drv-plate">{highlightText(d.vehicle, search)}</span>
                                            ) : (
                                                <span className={suspended ? "drv-danger-text" : "drv-muted"}>
                                                    {highlightText(d.vehicle ?? "None", search)}
                                                </span>
                                            )}
                                        </TableCell>

                                        <TableCell className="drv-cell-route">
                                            <span className="drv-route-text">{highlightText(d.route, search)}</span>
                                        </TableCell>

                                        <TableCell className="drv-cell-status">
                                            <StatusBadge status={d.status} />
                                        </TableCell>

                                        <TableCell className="drv-cell-trips">
                                            <span className="drv-trips-pill">{d.trips}</span>
                                        </TableCell>

                                        <TableCell className="drv-cell-score">
                                            <span
                                                className={
                                                    "drv-score-pill" +
                                                    (d.score < 80 ? " drv-score-pill--low" : "")
                                                }
                                            >
                                                {d.score}%
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="drv-pagination">
                    <div className="drv-pagination__rows">
                        <span>Rows per page:</span>
                        <select
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setPage(1);
                            }}
                            className="drv-pagination-select"
                        >
                            {ROWS_OPTIONS.map((n) => (
                                <option key={n} value={n}>
                                    {n} / page
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="drv-pagination__pages">
                        <span>
                            Page {page} of {totalPages}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="drv-icon-btn"
                            aria-label="Previous page"
                            disabled={page === 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            <ChevronLeft size={14} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="drv-icon-btn"
                            aria-label="Next page"
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        >
                            <ChevronRight size={14} />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* ---------- Safety dossier ---------- */}
            <SafetyDossier driver={selected} />
        </div>
    </div>
    );
};

export default DriversPage;