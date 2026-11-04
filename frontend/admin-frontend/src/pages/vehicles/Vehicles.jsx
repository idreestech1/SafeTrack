import React, { useMemo, useRef, useState } from "react";
import {
  Truck,
  Upload,
  Download,
  CirclePlus,
  Bus,
  Split,
  Wrench,
  Radio,
  Search,
  TriangleAlert,
  ArrowDown,
  ArrowUp,
  Route as RouteIcon,
  Warehouse,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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

import "./vehicles.css";

/*
  ─── Setup ───────────────────────────────────────────────────────
  npm install lucide-react
  npx shadcn@latest add avatar button card checkbox input select table

  The vehicles below are placeholder data – replace VEHICLES and
  SUMMARY with your API response (same field names).
  ─────────────────────────────────────────────────────────────────
*/

/* ================================================================== */
/*  Placeholder data                                                   */
/* ================================================================== */

const SUMMARY = {
  total: 135,
  onRoute: 128,
  onRoutePct: "94.8%",
  offline: 7,
  scheduled: 4,
  bayRepairs: 3,
  telematics: "99.2%",
  degraded: 1,
  triage: { service: 4, overcapacity: 2, cctv: 8 },
};

const VEHICLES = [
  { id: "PK-102", reg: "KP-LE-4091", model: "Hino Metro", spec: "45-Seater • Euro 4", seats: 45, load: 32, driver: { name: "Muhammad Ali", code: "DRV-4412" }, route: "Peshawar → Mardan", depot: "Hayatabad Depot", status: "sos" },
  { id: "PK-101", reg: "KP-LE-2180", model: "Isuzu Journey", spec: "36-Seater • Dual Axle", seats: 36, load: 28, driver: { name: "Arshad Khan", code: "DRV-3810" }, route: "Peshawar → Nowshera", depot: "Hayatabad Depot", status: "active" },
  { id: "PK-221", reg: "KP-MN-9921", model: "Hino Metro", spec: "45-Seater • AC Coach", seats: 45, load: 45, driver: { name: "Bilal Ahmad", code: "DRV-5012" }, route: "Ring Road Circular", depot: "Ring Road Depot", status: "active", overcapacity: true },
  { id: "PK-145", reg: "KP-CD-3301", model: "Toyota Coaster", spec: "29-Seater • Fast Mini", seats: 29, load: 19, driver: { name: "Zubair Shah", code: "DRV-1982" }, route: "Peshawar → Charsadda", depot: "Charsadda Depot", status: "active", cctvStale: true },
  { id: "PK-331", reg: "KP-PE-8812", model: "Hino Metro", spec: "45-Seater • City Spec", seats: 45, load: 44, driver: { name: "Kamran Jan", code: "DRV-7719" }, route: "City Terminal Shuttles", depot: "City Terminal Depot", status: "active", overcapacity: true },
  { id: "PK-108", reg: "KP-LE-1144", model: "Daewoo City Bus", spec: "50-Seater • Low Floor", seats: 50, load: 38, driver: { name: "Naveed Qureshi", code: "DRV-6120" }, route: "BRT Feeder Line 2", depot: "BRT Depot", status: "active", cctvStale: true },
  { id: "PK-309", reg: "KP-LE-0091", model: "Toyota Coaster", spec: "29-Seater • Inspection Bay", seats: 29, load: 0, driver: null, route: "Standby Depot", routeIsDepot: true, depot: "Standby Depot", status: "depot", needsService: true },
  { id: "PK-118", reg: "KP-PE-7723", model: "Hino Metro", spec: "45-Seater • Regular Line", seats: 45, load: 22, driver: { name: "Farhan Malik", code: "DRV-2290" }, route: "Hayatabad Sector Route", depot: "Hayatabad Depot", status: "active" },
];

const unique = (key) => [...new Set(VEHICLES.map((v) => v[key]))];
const MODELS = unique("model");
const ROUTE_NAMES = unique("route");
const DEPOTS = unique("depot");

const STATUS_OPTIONS = [
  { value: "all", label: `Status: All (${SUMMARY.total})` },
  { value: "active", label: "Status: In Service" },
  { value: "sos", label: "Status: Emergency / SOS" },
  { value: "depot", label: "Status: Depot / Maintenance" },
];

const TRIAGE = [
  { value: "all", label: "All Fleet", count: SUMMARY.total, match: () => true },
  { value: "service", label: "Requires Oil/Service", count: SUMMARY.triage.service, match: (v) => v.needsService },
  { value: "overcapacity", label: "Overcapacity Risk", count: SUMMARY.triage.overcapacity, match: (v) => v.overcapacity },
  { value: "cctv", label: "CCTV Firmware Stale", count: SUMMARY.triage.cctv, match: (v) => v.cctvStale },
];

const PER_PAGE_OPTIONS = ["10", "25", "50"];

/* ================================================================== */
/*  Helpers                                                            */
/* ================================================================== */

const initials = (name) => name.split(" ").map((w) => w[0]).slice(0, 2).join("");
const idNumber = (id) => Number(id.replace(/\D/g, ""));

const pageItems = (current, total) => {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  const items = new Set([1, 2, 3, total, current - 1, current, current + 1]);
  const sorted = [...items].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
};

const loadTone = (pct) => (pct >= 100 ? "full" : pct >= 85 ? "high" : pct === 0 ? "empty" : "normal");

/* ================================================================== */
/*  Page                                                               */
/* ================================================================== */

const Vehicles = ({
  onAddVehicle,
  onImportCsv,
  onFocusTelemetry,
  onBulkReassign,
  onBroadcastNotice,
  onOpenVehicle,
}) => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [model, setModel] = useState("all");
  const [route, setRoute] = useState("all");
  const [depot, setDepot] = useState("all");
  const [triage, setTriage] = useState("all");
  const [sortDir, setSortDir] = useState("asc");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const fileRef = useRef(null);

  const resetPage = () => setPage(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const tri = TRIAGE.find((t) => t.value === triage);
    const list = VEHICLES.filter(
      (v) =>
        (status === "all" || v.status === status) &&
        (model === "all" || v.model === model) &&
        (route === "all" || v.route === route) &&
        (depot === "all" || v.depot === depot) &&
        tri.match(v) &&
        (!q ||
          `${v.id} ${v.reg} ${v.model} ${v.driver?.name ?? ""} ${v.route}`
            .toLowerCase()
            .includes(q))
    );
    return list.sort((a, b) =>
      sortDir === "asc" ? idNumber(a.id) - idNumber(b.id) : idNumber(b.id) - idNumber(a.id)
    );
  }, [query, status, model, route, depot, triage, sortDir]);

  const filtersActive =
    query || status !== "all" || model !== "all" || route !== "all" || depot !== "all" || triage !== "all";
  const total = filtersActive ? filtered.length : SUMMARY.total;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const rows = filtered.slice((page - 1) * perPage, page * perPage);
  const rangeStart = rows.length ? (page - 1) * perPage + 1 : 0;
  const rangeEnd = rows.length ? (page - 1) * perPage + rows.length : 0;

  const sosVehicle = VEHICLES.find((v) => v.status === "sos");

  /* selection */
  const rowIds = rows.map((r) => r.id);
  const allChecked = rowIds.length > 0 && rowIds.every((id) => selected.includes(id));
  const someChecked = rowIds.some((id) => selected.includes(id));

  const toggleAll = (checked) =>
    setSelected((cur) =>
      checked ? [...new Set([...cur, ...rowIds])] : cur.filter((id) => !rowIds.includes(id))
    );
  const toggleOne = (id, checked) =>
    setSelected((cur) => (checked ? [...cur, id] : cur.filter((x) => x !== id)));

  /* actions */
  const exportReport = () => {
    const header = ["Vehicle ID", "Registration", "Model", "Spec", "Driver", "Driver ID", "Route", "Depot", "Seats", "Load", "Status"];
    const lines = filtered.map((v) => [
      v.id, v.reg, v.model, v.spec, v.driver?.name ?? "Unassigned", v.driver?.code ?? "", v.route, v.depot, v.seats, v.load, v.status,
    ]);
    const csv = [header, ...lines]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `fleet-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const focusTelemetry = () => {
    if (!sosVehicle) return;
    setQuery(sosVehicle.id);
    resetPage();
    onFocusTelemetry?.(sosVehicle);
  };

  const kpis = [
    {
      id: "total", label: "Total Registered Fleet", icon: Bus, value: SUMMARY.total, unit: "units cataloged",
      foot: "100% geo-fenced verified", dot: "blue",
    },
    {
      id: "routes", label: "On Active Routes", icon: Split, value: SUMMARY.onRoute, chip: SUMMARY.onRoutePct,
      foot: "Live passenger service", dot: "green",
    },
    {
      id: "depot", label: "In Depot / Maintenance", icon: Wrench, value: SUMMARY.offline, unit: "units offline",
      foot: `${SUMMARY.scheduled} scheduled inspection, ${SUMMARY.bayRepairs} bay repairs`, dot: "grey",
    },
    {
      id: "telematics", label: "Telematics Hardware Health", icon: Radio, value: SUMMARY.telematics, online: true,
      foot: `${SUMMARY.degraded} unit degraded OBD stream`, dot: "blue",
    },
  ];

  return (
    <div className="vh-page">
      {/* ---------- Header ---------- */}
      <header className="vh-header">
        <div className="vh-header__text">
          <p className="vh-kicker"><Truck size={15} /> FLEET REGISTRY • SECTOR 01-NW</p>
          <h1>Vehicles</h1>
          <p className="vh-header__sub">
            Master registry of public transit fleet, maintenance schedules, hardware telematics, and route assignments.
          </p>
        </div>

        <div className="vh-header__actions">
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImportCsv?.(file);
              e.target.value = "";
            }}
          />
          <Button variant="outline" className="vh-btn-soft" onClick={() => fileRef.current?.click()}>
            <Upload size={15} /> Import CSV
          </Button>
          <Button variant="outline" className="vh-btn-soft" onClick={exportReport}>
            <Download size={15} /> Export Fleet Report
          </Button>
          <Button className="vh-btn-add" onClick={onAddVehicle}>
            <CirclePlus size={17} /> Add Vehicle
          </Button>
        </div>
      </header>

      {/* ---------- KPI cards ---------- */}
      <section className="vh-kpis">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.id} className="vh-card vh-kpi">
              <div className="vh-kpi__top">
                <span className="vh-kpi__label">{k.label}</span>
                <span className="vh-kpi__icon"><Icon size={20} strokeWidth={1.9} /></span>
              </div>

              <div className="vh-kpi__value">
                <strong>{k.value}</strong>
                {k.unit && <span>{k.unit}</span>}
                {k.chip && <em className="vh-kpi__chip">{k.chip}</em>}
                {k.online && <em className="vh-kpi__online">Online</em>}
              </div>

              <p className="vh-kpi__foot">
                <i className={`vh-dot vh-dot--${k.dot}`} />
                {k.foot}
              </p>
            </Card>
          );
        })}
      </section>

      {/* ---------- Priority incident ---------- */}
      {sosVehicle && (
        <div className="vh-incident" role="alert">
          <span className="vh-incident__label">
            <i /> PRIORITY INCIDENT:
          </span>
          <p>
            Vehicle{" "}
            <button type="button" onClick={focusTelemetry}>
              {sosVehicle.id} ({sosVehicle.reg})
            </button>{" "}
            has broadcasted a silent Emergency SOS panic trigger near Ring Road Interchange.
          </p>
          <Button className="vh-incident__btn" onClick={focusTelemetry}>
            Focus Telemetry
          </Button>
        </div>
      )}

      {/* ---------- Filters ---------- */}
      <Card className="vh-card vh-filters">
        <div className="vh-filters__row">
          <div className="vh-search">
            <Search size={16} />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                resetPage();
              }}
              placeholder="Search vehicle registration number, chassis…"
              className="vh-search__input"
            />
          </div>

          <Select value={status} onValueChange={(v) => { setStatus(v); resetPage(); }}>
            <SelectTrigger className="vh-select"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={model} onValueChange={(v) => { setModel(v); resetPage(); }}>
            <SelectTrigger className="vh-select"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Type: All Models</SelectItem>
              {MODELS.map((m) => <SelectItem key={m} value={m}>Type: {m}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={route} onValueChange={(v) => { setRoute(v); resetPage(); }}>
            <SelectTrigger className="vh-select"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Route: All Routes</SelectItem>
              {ROUTE_NAMES.map((r) => <SelectItem key={r} value={r}>Route: {r}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={depot} onValueChange={(v) => { setDepot(v); resetPage(); }}>
            <SelectTrigger className="vh-select"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Depot: All Depots</SelectItem>
              {DEPOTS.map((d) => <SelectItem key={d} value={d}>Depot: {d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="vh-triage">
          <span className="vh-triage__label">QUICK TRIAGE:</span>
          {TRIAGE.map((t) => (
            <button
              key={t.value}
              type="button"
              className={"vh-triage__chip" + (triage === t.value ? " is-active" : "")}
              onClick={() => { setTriage(t.value); resetPage(); }}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        <div className="vh-bulk">
          <span>{selected.length} selected</span>
          <Button
            variant="outline"
            className="vh-bulk__btn"
            disabled={selected.length === 0}
            onClick={() => onBulkReassign?.(selected)}
          >
            Bulk Reassign
          </Button>
          <Button
            variant="outline"
            className="vh-bulk__btn"
            disabled={selected.length === 0}
            onClick={() => onBroadcastNotice?.(selected)}
          >
            Broadcast Notice
          </Button>
        </div>
      </Card>

      {/* ---------- Table ---------- */}
      <Card className="vh-card vh-tablecard">
        <Table className="vh-table">
          <TableHeader>
            <TableRow>
              <TableHead className="vh-col-check">
                <Checkbox
                  checked={allChecked ? true : someChecked ? "indeterminate" : false}
                  onCheckedChange={(c) => toggleAll(c === true)}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  className="vh-sort"
                  onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                >
                  VEHICLE ID {sortDir === "asc" ? <ArrowDown size={13} /> : <ArrowUp size={13} />}
                </button>
              </TableHead>
              <TableHead>REGISTRATION NO</TableHead>
              <TableHead>VEHICLE TYPE</TableHead>
              <TableHead>ASSIGNED DRIVER</TableHead>
              <TableHead>ASSIGNED ROUTE</TableHead>
              <TableHead>CAPACITY &amp; LOAD</TableHead>
              <TableHead className="vh-col-actions" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="vh-empty">
                  {filtered.length === 0
                    ? "No vehicles match the current filters."
                    : "No records on this page — connect your API to load the full registry."}
                </TableCell>
              </TableRow>
            )}

            {rows.map((v) => {
              const pct = v.seats ? Math.round((v.load / v.seats) * 100) : 0;
              const tone = loadTone(pct);
              const isSos = v.status === "sos";
              return (
                <TableRow
                  key={v.id}
                  className={"vh-row" + (isSos ? " vh-row--sos" : "") + (selected.includes(v.id) ? " vh-row--selected" : "")}
                  onClick={() => onOpenVehicle?.(v)}
                >
                  <TableCell className="vh-col-check" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selected.includes(v.id)}
                      onCheckedChange={(c) => toggleOne(v.id, c === true)}
                      aria-label={`Select ${v.id}`}
                    />
                  </TableCell>

                  <TableCell>
                    <span className="vh-id">
                      {isSos && <TriangleAlert size={18} className="vh-id__warn" />}
                      {v.id}
                    </span>
                  </TableCell>

                  <TableCell><span className="vh-plate">{v.reg}</span></TableCell>

                  <TableCell>
                    <div className={"vh-type" + (v.status === "depot" ? " vh-type--dim" : "")}>
                      <strong>{v.model}</strong>
                      <span>{v.spec}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    {v.driver ? (
                      <div className="vh-driver">
                        <Avatar className="vh-avatar">
                          <AvatarFallback>{initials(v.driver.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <strong>{v.driver.name}</strong>
                          <span>{v.driver.code}</span>
                        </div>
                      </div>
                    ) : (
                      <em className="vh-unassigned">Unassigned</em>
                    )}
                  </TableCell>

                  <TableCell>
                    <span className="vh-route">
                      {v.routeIsDepot ? <Warehouse size={16} /> : <RouteIcon size={16} />}
                      {v.route}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="vh-load">
                      <div className="vh-bar">
                        <div className={`vh-bar__fill vh-bar__fill--${tone}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className={pct >= 100 ? "vh-load__text vh-load__text--full" : "vh-load__text"}>
                        {v.load}/{v.seats} ({pct}%)
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="vh-col-actions" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="vh-more" aria-label={`Actions for ${v.id}`}>
                      <Ellipsis size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Footer */}
        <div className="vh-footer">
          <div className="vh-footer__left">
            <span>
              Showing <strong>{rangeStart}</strong> to <strong>{rangeEnd}</strong> of <strong>{total}</strong> vehicles
            </span>
            <span className="vh-footer__per">PER PAGE:</span>
            <Select
              value={String(perPage)}
              onValueChange={(v) => { setPerPage(Number(v)); resetPage(); }}
            >
              <SelectTrigger className="vh-perpage" size="sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PER_PAGE_OPTIONS.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <nav className="vh-pager" aria-label="Pagination">
            <button type="button" className="vh-pager__nav" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft size={14} /> Previous
            </button>
            {pageItems(page, totalPages).map((n, i) =>
              n === "…" ? (
                <span key={`gap-${i}`} className="vh-pager__gap">…</span>
              ) : (
                <button
                  key={n}
                  type="button"
                  className={"vh-pager__num" + (n === page ? " is-active" : "")}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              )
            )}
            <button type="button" className="vh-pager__nav" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              Next <ChevronRight size={14} />
            </button>
          </nav>
        </div>
      </Card>
    </div>
  );
};

export default Vehicles;