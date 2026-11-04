import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, TriangleAlert, RefreshCw, Download, Bell } from "lucide-react";
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

const Topbar = ({
  appName = "SmartTransit",
  pageTitle,
  online = true,
  sosCount = 3,
  notificationCount = 4,
  onSearch,
  onSync,
  onExport,
  onSosClick,
  onNotificationsClick,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [secondsAgo, setSecondsAgo] = useState(2);
  const [syncing, setSyncing] = useState(false);
  const searchRef = useRef(null);

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
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
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
    setQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const handleSos = () => {
    if (onSosClick) {
      onSosClick();
    } else {
      navigate("/emergency");
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

      {/* Right: search + actions */}
      <div className="topbar__right">
        <label className="topbar__search">
          <Search size={16} strokeWidth={1.8} className="topbar__search-icon" />
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search units, drivers, routes…"
          />
          <kbd className="topbar__kbd">Ctrl+K</kbd>
        </label>

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

        <Button
          type="button"
          variant="outline"
          className="topbar__btn"
          onClick={onExport}
        >
          <Download size={14} strokeWidth={1.8} />
          Export
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="topbar__bell"
          aria-label="Notifications"
          onClick={onNotificationsClick}
        >
          <Bell size={18} strokeWidth={1.8} />
          {notificationCount > 0 && (
            <Badge className="topbar__bell-badge">{notificationCount}</Badge>
          )}
        </Button>
      </div>
    </header>
  );
};

export default Topbar;
