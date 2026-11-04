import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Components from "./components/Components";

// Individual page modules
import Dashboard from "./pages/dashboard/Dashboard";
import LiveFleet from "./pages/live_fleet/LiveFleet";
import Vehicles from "./pages/vehicles/Vehicles";
import Driver from "./pages/drivers/Driver";
import RoutesPage from "./pages/routes/Routes";
import Trips from "./pages/trips/Trips";
import PassengerRequests from "./pages/passenger_requests/PassengerRequests";
import Emergency from "./pages/emergency/Emergency";
import Camera from "./pages/camera/Camera";
import DriverBehavior from "./pages/driver_behavior/DriverBehavior";
import Alerts from "./pages/alerts/Alerts";
import Passengers from "./pages/passengers/Passengers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Components />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="drivers" element={<Driver />} />
          <Route path="live-fleet" element={<LiveFleet />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="trips" element={<Trips />} />
          <Route path="passenger-requests" element={<PassengerRequests />} />
          <Route path="emergency" element={<Emergency />} />
          <Route path="camera" element={<Camera />} />
          <Route path="driver-behavior" element={<DriverBehavior />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="passengers" element={<Passengers />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
