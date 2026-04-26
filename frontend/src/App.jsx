import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./LoginPages/Login";
import Register from "./LoginPages/Register";
import InventoryManagement from "./AdminPages/InventoryManagement";
import AdminDashboard from "./AdminPages/AdminDashboard";
import AdminLayout from "./AdminPages/AdminLayout";
import Dashboard from "./AdminPages/AdminDashboard";
import VendorManagement from "./AdminPages/VendorManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/inventorymanagement" element={<InventoryManagement />} />

        {/* Layout Route */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Nested Pages */}
          <Route index element={<Dashboard />} />
           <Route path="inventorymanagement" element={<InventoryManagement />} />
              <Route path="vendormanagement" element={<VendorManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
