import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  TriangleAlert,
  RefreshCw,
  Download,
  Bell,
  X,
  Bus,
  Users,
  Route as RouteIcon,
  Clock,
  Video,
  Gauge,
  Siren,
  ChevronRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import "./TopBar.css";

const ROUTE_TITLES = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/drivers": "Drivers Directory",
  "/live-fleet": "Live Fleet",
  "/vehicles": "Vehicles",
  "/routes": "Routes",
  "/trips": "Trips",
  "/passenger-requests": "Passenger Requests",
  "/emergency": "Emergency / SOS",
  "/camera": "Camera Monitoring",
  "/driver-behavior": "Driver Behavior",
  "/alerts": "Alerts",
  "/passengers": "Passengers",
};

const SYSTEM_PAGES = [
  { label: "Dashboard", path: "/dashboard", desc: "Operations overview & fleet map", icon: Bus },
  { label: "Live Fleet", path: "/live-fleet", desc: "Real-time GPS road tracking", icon: Bus },
  { label: "Vehicles Registry", path: "/vehicles", desc: "Fleet inventory, models & telemetry", icon: Bus },
  { label: "Drivers Directory", path: "/drivers", desc: "Staff profiles, licensing & roster", icon: Users },
  { label: "Routes & Corridors", path: "/routes", desc: "KPK highway & BRT route network", icon: RouteIcon },
  { label: "Trips & Headways", path: "/trips", desc: "Timetables & arrival schedules", icon: Clock },
  { label: "Passenger Requests", path: "/passenger-requests", desc: "Live hailing & geofence pickup", icon: Users },
  { label: "Emergency / SOS", path: "/emergency", desc: "Incident Command (ICS-200) & distress", icon: Siren },
  { label: "Camera Monitoring", path: "/camera", desc: "Live onboard CCTV & AI DMS streams", icon: Video },
  { label: "Driver Behavior", path: "/driver-behavior", desc: "Telematics scorecard & fatigue", icon: Gauge },
  { label: "Alerts Center", path: "/alerts", desc: "Telemetry events & speed violations", icon: TriangleAlert },
  { label: "Passengers & SmartPass", path: "/passengers", desc: "Transit cards, CNIC & RFID passes", icon: Users },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "SOS Panic Triggered",
    detail: "Vehicle PK-102 (Peshawar ⇄ Mardan) sent emergency distress alert near GT Road.",
    time: "2 mins ago",
    tone: "red",
    path: "/emergency",
  },
  {
    id: 2,
    title: "Excessive Speed Violation",
    detail: "PK-221 clocked at 78 km/h in 60 km/h zone on Ring Road East.",
    time: "8 mins ago",
    tone: "amber",
    path: "/alerts",
  },
  {
    id: 3,
    title: "Corridor Off-Route Deviation",
    detail: "PK-145 deviated 450m from Charsadda Northern Arterial corridor.",
    time: "14 mins ago",
    tone: "blue",
    path: "/alerts",
  },
  {
    id: 4,
    title: "New Student SmartPass Issued",
    detail: "Taimoor Shah (17301-4492102-1) registered under 50% discount tier.",
    time: "25 mins ago",
    tone: "green",
    path: "/passengers",
  },
];

const Topbar = ({
  appName = "SmartTransit",
  pageTitle,
  online = true,
  sosCount = 3,
  onSearch,
  onSync,
  onExport,
  onSosClick,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [secondsAgo, setSecondsAgo] = useState(2);
  const [syncing, setSyncing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const searchRef = useRef(null);
  const notifRef = useRef(null);

  const displayTitle = pageTitle || ROUTE_TITLES[location.pathname] || "Monitoring Console";

  // "synced Xs ago" counter
  useEffect(() => {
    const t = setInterval(() => setSecondsAgo((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Ctrl+K / Cmd+K focuses the search box
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        setShowSearchDropdown(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const clickHandler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", clickHandler);
    return () => document.removeEventListener("mousedown", clickHandler);
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      if (onSync) await onSync();
    } finally {
      setSecondsAgo(0);
      setTimeout(() => setSyncing(false), 600);
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    setShowSearchDropdown(true);
    if (onSearch) onSearch(val);
  };

  const handleSelectPage = (path) => {
    navigate(path);
    setShowSearchDropdown(false);
    setQuery("");
  };

  const handleSos = () => {
    if (onSosClick) {
      onSosClick();
    } else {
      navigate("/emergency");
    }
  };

  // Master Audit CSV Export
  const handleExport = () => {
    if (onExport) {
      onExport();
      return;
    }
    const headers = ["Domain", "System Entity", "Metric / Status", "Observation", "Audit Timestamp"];
    const rows = [
      ["Transit Safety", "Active Fleet Units", "128 Vehicles", "100% Geo-Fenced & Verified", new Date().toISOString()],
      ["Transit Safety", "Active Licensed Drivers", "132 Operators", "Shift Attendance 98.5%", new Date().toISOString()],
      ["Transit Operations", "Active Line Trips", "86 In Transit", "14 Completing Headway", new Date().toISOString()],
      ["Citizen Registry", "Registered Passengers", "18,492 Citizens", "NADRA Biometric Level 3", new Date().toISOString()],
      ["Incident Command", "Distress SOS Alerts", "3 Active Incidents", "Patrol Interceptors Dispatched", new Date().toISOString()],
      ["Telematics Core", "GPS Feed Latency", "3s Latency", "128 Active Hardware Streams", new Date().toISOString()],
    ];
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(",")).join("\n")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `safetrack-master-transit-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filtered pages for search
  const filteredPages = SYSTEM_PAGES.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return p.label.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.path.toLowerCase().includes(q);
  });

  return (
    <header className="topbar">
      {/* Left: breadcrumb + status */}
      <div className="topbar__left">
        <div className="topbar__breadcrumb">
          <span className="topbar__crumb-muted">{appName}</span>
          <span className="topbar__crumb-sep">&gt;</span>
          <span className="topbar__crumb-current">{displayTitle}</span>
        </div>

        <Separator orientation="vertical" className="topbar__divider" />

        <div
          className={
            "topbar__status" + (online ? "" : " topbar__status--offline")
          }
        >
          <span className="topbar__status-dot" />
          <span className="topbar__status-text">
            {online ? "System Online" : "System Offline"}
          </span>
          <span className="topbar__status-sync">
            • synced {secondsAgo}s ago
          </span>
        </div>
      </div>

      {/* Right: search + actions */}
      <div className="topbar__right">
        {/* Search Command Input */}
        <div className="topbar__search-wrap" ref={searchRef}>
          <label className="topbar__search">
            <Search size={15} strokeWidth={1.8} className="topbar__search-icon" />
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder="Search units, drivers, routes, trips…"
            />
            <kbd className="topbar__kbd">Ctrl+K</kbd>
          </label>

          {/* Smart Search Palette Dropdown */}
          {showSearchDropdown && (
            <div className="topbar__search-popover">
              <div className="topbar__search-head">
                <span>QUICK NAVIGATION</span>
                <span className="topbar__search-hint">Jump directly to any operations module</span>
              </div>
              <div className="topbar__search-list">
                {filteredPages.slice(0, 7).map((p) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.path}
                      className="topbar__search-item"
                      onClick={() => handleSelectPage(p.path)}
                    >
                      <div className="topbar__search-item-icon">
                        <Icon size={13} />
                      </div>
                      <div className="topbar__search-item-info">
                        <strong>{p.label}</strong>
                        <small>{p.desc}</small>
                      </div>
                      <ChevronRight size={12} className="topbar__search-arrow" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* SOS Quick Button */}
        {sosCount > 0 && (
          <Button
            type="button"
            className="topbar__sos"
            onClick={handleSos}
          >
            <TriangleAlert size={16} strokeWidth={1.8} />
            <span className="topbar__sos-text">
              {sosCount} SOS
              <br />
              ACTIVE
            </span>
          </Button>
        )}

        {/* Sync Button */}
        <Button
          type="button"
          variant="outline"
          className="topbar__btn"
          onClick={handleSync}
          disabled={syncing}
        >
          <RefreshCw
            size={14}
            strokeWidth={1.8}
            className={syncing ? "topbar__spin" : ""}
          />
          Sync
        </Button>

        {/* Master Export Button */}
        <Button
          type="button"
          variant="outline"
          className="topbar__btn"
          onClick={handleExport}
        >
          <Download size={14} strokeWidth={1.8} />
          Export
        </Button>

        {/* Notifications Popover */}
        <div className="topbar__notif-wrap" ref={notifRef}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="topbar__bell"
            aria-label="Notifications"
            onClick={() => setShowNotifications((prev) => !prev)}
          >
            <Bell size={18} strokeWidth={1.8} />
            {notifications.length > 0 && (
              <Badge className="topbar__bell-badge">{notifications.length}</Badge>
            )}
          </Button>

          {showNotifications && (
            <div className="topbar__notif-popover">
              <div className="topbar__notif-head">
                <div className="topbar__notif-head-title">
                  <Bell size={13} />
                  <strong>Tactical Alerts &amp; Notifications</strong>
                </div>
                {notifications.length > 0 && (
                  <button
                    type="button"
                    className="topbar__notif-clear"
                    onClick={() => setNotifications([])}
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="topbar__notif-list">
                {notifications.length === 0 ? (
                  <div className="topbar__notif-empty">
                    <Check size={16} color="#10b981" />
                    <span>All operational alerts cleared.</span>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`topbar__notif-item topbar__notif-item--${n.tone}`}
                      onClick={() => {
                        navigate(n.path);
                        setShowNotifications(false);
                      }}
                    >
                      <div className="topbar__notif-item-top">
                        <strong>{n.title}</strong>
                        <span>{n.time}</span>
                      </div>
                      <p>{n.detail}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="topbar__notif-foot">
                <button
                  type="button"
                  className="topbar__notif-viewall"
                  onClick={() => {
                    navigate("/alerts");
                    setShowNotifications(false);
                  }}
                >
                  Open Full Alerts Center &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
