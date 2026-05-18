import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./LoginPages/Login";
import Register from "./LoginPages/Register";
import InventoryManagement from "./AdminPages/InventoryManagement";
import AdminDashboard from "./AdminPages/AdminDashboard";
import AdminLayout from "./AdminPages/AdminLayout";
import VendorManagement from "./AdminPages/VendorManagement";
import StaffManagement from "./AdminPages/StaffManagement";
import PurchaseInvoices from "./AdminPages/PurchaseInvoices";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Layout Route */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Nested Pages - The 4 required features + Dashboard */}
          <Route index element={<AdminDashboard />} />
          <Route path="staffmanagement" element={<StaffManagement />} />
          <Route path="inventorymanagement" element={<InventoryManagement />} />
          <Route path="purchaseinvoices" element={<PurchaseInvoices />} />
          <Route path="vendormanagement" element={<VendorManagement />} />
        </Route>

        {/* Redirect any other unknown route to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
