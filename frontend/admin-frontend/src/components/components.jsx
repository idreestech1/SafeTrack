import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./side_bar/SideBar";
import TopBar from "./top_bar/TopBar";

function Components({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-layout">
      <SideBar collapsed={collapsed} onToggleCollapse={setCollapsed} />
      <div className={`app-container ${collapsed ? "is-collapsed" : ""}`}>
        <TopBar />
        <main className="main-content">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}

export default Components;
