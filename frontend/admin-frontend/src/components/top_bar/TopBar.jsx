import React, { useEffect, useMemo, useRef, useState } from "react";
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
  CreditCard,
  ArrowRight,
  CornerDownLeft,
  Filter,
  Radio,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GLOBAL_ENTITIES, searchGlobalEntities } from "../../data/globalSearchData";
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

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "vehicles", label: "Vehicles" },
  { id: "drivers", label: "Drivers" },
  { id: "routes", label: "Routes" },
  { id: "trips", label: "Trips" },
  { id: "passengers", label: "Passengers" },
  { id: "alerts", label: "Alerts" },
  { id: "cameras", label: "CCTV" },
  { id: "pages", label: "Pages" },
];

/**
 * Helper to highlight matching query terms inside text
 */
function highlightText(text, query) {
  if (!text || !query || !query.trim()) return text;

  const terms = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"));

  if (terms.length === 0) return text;

  const regex = new RegExp(`(${terms.join("|")})`, "gi");
  const parts = String(text).split(regex);
  const matchPattern = new RegExp(`^(${terms.join("|")})$`, "i");

  return parts.map((part, index) =>
    matchPattern.test(part) ? (
      <mark key={index} className="topbar__highlight st-highlight">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [secondsAgo, setSecondsAgo] = useState(2);
  const [syncing, setSyncing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const inputRef = useRef(null);

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
        inputRef.current?.focus();
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

  // Global Search Results calculation
  const searchResults = useMemo(() => {
    let results = [];
    if (!query.trim()) {
      // Default view when input is focused with no query
      results = GLOBAL_ENTITIES.filter((item) => {
        if (selectedCategory === "all") {
          return item.status === "sos" || item.category === "pages" || item.id === "veh-pk-102";
        }
        return item.category === selectedCategory;
      });
    } else {
      results = searchGlobalEntities(query);
      if (selectedCategory !== "all") {
        results = results.filter((item) => item.category === selectedCategory);
      }
    }
    return results;
  }, [query, selectedCategory]);

  // Reset selectedIndex when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchResults]);

  // Keyboard navigation inside search dropdown
  const handleKeyDown = (e) => {
    if (!showSearchDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(searchResults.length - 1, prev + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    } else if (e.key === "Enter" && searchResults[selectedIndex]) {
      e.preventDefault();
      handleSelectEntity(searchResults[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowSearchDropdown(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      if (onSync) await onSync();
    } finally {
      setSecondsAgo(0);
      setTimeout(() => setSyncing(false), 600);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setShowSearchDropdown(true);
    if (onSearch) onSearch(val);
  };

  const handleSelectEntity = (entity) => {
    navigate(entity.path, { state: { targetId: entity.badge, entityTitle: entity.title } });
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

  const getEntityIcon = (cat) => {
    switch (cat) {
      case "vehicles":
        return Bus;
      case "drivers":
        return Users;
      case "routes":
        return RouteIcon;
      case "trips":
        return Clock;
      case "passengers":
        return CreditCard;
      case "alerts":
        return TriangleAlert;
      case "cameras":
        return Video;
      default:
        return ExternalLink;
    }
  };

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

      {/* Right: global search + actions */}
      <div className="topbar__right">
        {/* Global Search Command Input */}
        <div className="topbar__search-wrap" ref={searchRef}>
          <label className="topbar__search">
            <Search size={15} strokeWidth={1.8} className="topbar__search-icon" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleSearchChange}
              onFocus={() => setShowSearchDropdown(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search units, drivers, routes, trips, CNIC…"
            />
            {query ? (
              <button
                type="button"
                className="topbar__search-clear"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
              >
                <X size={12} />
              </button>
            ) : (
              <kbd className="topbar__kbd">Ctrl+K</kbd>
            )}
          </label>

          {/* Global Search Command Palette Popover */}
          {showSearchDropdown && (
            <div className="topbar__search-popover">
              <div className="topbar__search-head">
                <div className="topbar__search-head-title">
                  <Search size={12} />
                  <strong>GLOBAL TRANSIT REPOSITORY INDEX</strong>
                </div>
                <div className="topbar__search-count">
                  {query ? (
                    <span><strong>{searchResults.length}</strong> matches</span>
                  ) : (
                    <span><strong>{GLOBAL_ENTITIES.length}</strong> cataloged entities</span>
                  )}
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="topbar__search-tabs">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={"topbar__search-tab" + (isActive ? " is-active" : "")}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Search Result List */}
              <div className="topbar__search-list">
                {searchResults.length === 0 ? (
                  <div className="topbar__search-empty">
                    <Search size={22} className="topbar__search-empty-icon" />
                    <strong>No transit records matching &ldquo;{query}&rdquo;</strong>
                    <p>
                      Try searching by vehicle ID (e.g. <code>PK-102</code>), driver name (e.g. <code>Muhammad Ali</code>),
                      CNIC (e.g. <code>17301-…</code>), trip code (e.g. <code>TRP-8012</code>), route, or stop landmark.
                    </p>
                  </div>
                ) : (
                  searchResults.map((item, idx) => {
                    const Icon = getEntityIcon(item.category);
                    const isSelected = idx === selectedIndex;
                    const isSos = item.status === "sos";

                    return (
                      <div
                        key={item.id}
                        className={
                          "topbar__search-item" +
                          (isSelected ? " is-selected" : "") +
                          (isSos ? " is-sos" : "")
                        }
                        onClick={() => handleSelectEntity(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                      >
                        <div className={`topbar__search-item-icon topbar__search-item-icon--${item.category}`}>
                          <Icon size={13} strokeWidth={2.2} />
                        </div>

                        <div className="topbar__search-item-info">
                          <div className="topbar__search-item-top">
                            <span className="topbar__search-badge">{highlightText(item.badge, query)}</span>
                            <strong>{highlightText(item.title, query)}</strong>
                            {item.statusLabel && (
                              <span className={`topbar__search-status topbar__search-status--${item.status}`}>
                                {highlightText(item.statusLabel, query)}
                              </span>
                            )}
                          </div>
                          <p className="topbar__search-item-sub">{highlightText(item.subtitle, query)}</p>
                        </div>

                        <div className="topbar__search-item-act">
                          <span className="topbar__search-cat-lbl">{item.categoryLabel}</span>
                          <ChevronRight size={13} className="topbar__search-arrow" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Search Palette Footer */}
              <div className="topbar__search-foot">
                <div className="topbar__search-keys">
                  <span><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span>
                  <span><kbd>↵</kbd> Select</span>
                  <span><kbd>ESC</kbd> Close</span>
                </div>
                <div className="topbar__search-scope">
                  KPK Transit &amp; Police Unified Database
                </div>
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
