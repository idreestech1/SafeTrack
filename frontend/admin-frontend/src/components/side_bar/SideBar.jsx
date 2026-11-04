import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  Bus,
  IdCard,
  Route,
  Clock,
  Hand,
  Siren,
  Video,
  Gauge,
  TriangleAlert,
  Users,
  CircleHelp,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import "./SideBar.css";

const MENU = [
  {
    section: "OVERVIEW",
    items: [
      { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    section: "OPERATIONS",
    items: [
      { id: "live-fleet", label: "Live Fleet", path: "/live-fleet", icon: MapPin },
      { id: "vehicles", label: "Vehicles", path: "/vehicles", icon: Bus },
      { id: "drivers", label: "Drivers", path: "/drivers", icon: IdCard },
      { id: "routes", label: "Routes", path: "/routes", icon: Route },
      { id: "trips", label: "Trips", path: "/trips", icon: Clock },
      { id: "passenger-requests", label: "Passenger Requests", path: "/passenger-requests", icon: Hand },
    ],
  },
  {
    section: "SAFETY & MONITORING",
    items: [
      {
        id: "emergency",
        label: "Emergency / SOS",
        path: "/emergency",
        icon: Siren,
        badge: 3,
        badgeType: "danger",
        danger: true,
      },
      {
        id: "camera",
        label: "Camera Monitoring",
        path: "/camera",
        icon: Video,
        tag: "Restricted",
      },
      {
        id: "driver-behavior",
        label: "Driver Behavior",
        path: "/driver-behavior",
        icon: Gauge,
      },
      {
        id: "alerts",
        label: "Alerts",
        path: "/alerts",
        icon: TriangleAlert,
        badge: 5,
        badgeType: "info",
      },
    ],
  },
  {
    section: "USERS",
    items: [
      { id: "passengers", label: "Passengers", path: "/passengers", icon: Users },
    ],
  },
];

const SideBar = ({
  collapsed: controlledCollapsed,
  onToggleCollapse,
  user = {
    name: "Cmdr. Tariq Rehman",
    role: "Police Administrator",
  },
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const collapsed = controlledCollapsed ?? internalCollapsed;
  const currentPath = location.pathname;

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse(!collapsed);
    } else {
      setInternalCollapsed(!collapsed);
    }
  };

  const handleItemClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    console.log("Logged out");
  };

  const initials = user.name
    .replace(/^[A-Za-z]+\.\s*/, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <aside
      className={`sidebar ${collapsed ? "is-collapsed" : ""}`}
      aria-label="Sidebar Navigation"
    >
      {/* Brand Header */}
      <div className="sidebar__brand-row">
        {!collapsed ? (
          <div
            className="sidebar__brand"
            style={{ cursor: "pointer" }}
            onClick={() => handleItemClick("/dashboard")}
          >
            <h1 className="sidebar__brand-title">SafeTrack</h1>
            <span className="sidebar__brand-sub">POLICE &amp; TRANSPORT</span>
          </div>
        ) : (
          <div
            className="sidebar__brand sidebar__brand--mini"
            style={{ cursor: "pointer" }}
            onClick={() => handleItemClick("/dashboard")}
          >
            <h1 className="sidebar__brand-title">ST</h1>
          </div>
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="sidebar__toggle"
          onClick={handleToggle}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen size={16} />
          ) : (
            <PanelLeftClose size={16} />
          )}
        </Button>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar__nav" id="sidebar-navigation">
        {MENU.map((group) => (
          <div className="sidebar__group" key={group.section}>
            {!collapsed && (
              <p className="sidebar__section">{group.section}</p>
            )}

            <ul className="sidebar__list">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  currentPath === item.path ||
                  (item.path === "/dashboard" && currentPath === "/");
                const isDanger = item.danger;

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`sidebar__item ${isActive ? "sidebar__item--active" : ""
                        }`}
                      onClick={() => handleItemClick(item.path)}
                      title={collapsed ? item.label : undefined}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {Icon && (
                        <span
                          className={`sidebar__icon ${isDanger && !isActive ? "sidebar__icon--danger" : ""
                            }`}
                          aria-hidden="true"
                        >
                          <Icon size={18} strokeWidth={1.8} />
                        </span>
                      )}

                      {!collapsed && (
                        <span className="sidebar__label">{item.label}</span>
                      )}

                      {!collapsed && item.tag && (
                        <span className="sidebar__tag">{item.tag}</span>
                      )}

                      {!collapsed && item.badge !== undefined && (
                        <Badge
                          variant={item.badgeType === "danger" ? "destructive" : "secondary"}
                          className={`sidebar__badge sidebar__badge--${item.badgeType || "info"
                            }`}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer: Help & Support + User Info */}
      <div className="sidebar__footer">
        <button
          type="button"
          className="sidebar__item sidebar__help"
          title={collapsed ? "Help & Support" : undefined}
        >
          <CircleHelp size={18} strokeWidth={1.8} className="sidebar__icon" />
          {!collapsed && (
            <span className="sidebar__label">Help &amp; Support</span>
          )}
        </button>

        <div
          className="sidebar__user"
          title={collapsed ? user.name : undefined}
        >
          <Avatar className="sidebar__avatar">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          {!collapsed && (
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">{user.name}</span>
              <span className="sidebar__user-role">{user.role}</span>
            </div>
          )}

          {!collapsed && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="sidebar__logout"
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={16} strokeWidth={1.8} />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
