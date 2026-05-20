import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./LoginPages/Login";
import Register from "./LoginPages/Register";

import InventoryManagement from "./AdminPages/InventoryManagement";
import AdminLayout from "./AdminPages/AdminLayout";
import Dashboard from "./AdminPages/AdminDashboard";
import VendorManagement from "./AdminPages/VendorManagement";
import StaffManagement from "./AdminPages/StaffManagement";
import PurchaseInvoice from "./AdminPages/PurchaseInovice";
import PurchaseHistory from "./AdminPages/PurchaseHistory";
import Adminreport from "./AdminPages/Adminreport";

import Home from "./StaticPages/Home";

import UserDashboard from "./UserPages/Userdashboard";
import UserLayout from "./UserPages/Userlayout";
import BookAppointment from "./UserPages/BookAppointment";
import RequestParts from "./UserPages/RequestParts";
import HistoryPage from "./UserPages/HistoryPage";
import LoyaltyPage from "./UserPages/LoyaltyPage";
import Profile from "./UserPages/Profile";

import AddCustomer from "./StaffPages/AddCustomer";
import SalesInvoice from "./StaffPages/SalesInvoice";
import StaffLayout from "./StaffPages/StaffLayout";
import CustomerDetails from "./StaffPages/CustomerDetails";
import Staffnotify from "./StaffPages/Staffnotify";
import StaffHistory from "./StaffPages/StaffHistory";
import Reports from "./StaffPages/Reports";

import ProtectedRoute from "./ProtectedRoute";
import ChatBox from "./UserPages/ChatBox";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="inventorymanagement" element={<InventoryManagement />} />
          <Route path="vendormanagement" element={<VendorManagement />} />
          <Route path="staffmanagement" element={<StaffManagement />} />
          <Route path="purchaseinovice" element={<PurchaseInvoice />} />
          <Route path="history" element={<PurchaseHistory />} />
          <Route path="report" element={<Adminreport />} />
        </Route>

        {/* CUSTOMER */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["Customer"]}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="bookappointment" element={<BookAppointment />} />
          <Route path="requestpart" element={<RequestParts />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="loyalty" element={<LoyaltyPage />} />
          <Route path="profile" element={<Profile />} />
                <Route path="ai" element={<ChatBox />} />
        </Route>

        {/* STAFF */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={["Staff"]}>
              <StaffLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Reports />} />
          <Route path="salesinvoice" element={<SalesInvoice />} />
          <Route path="customerdetails" element={<CustomerDetails />} />
          <Route path="notify" element={<Staffnotify />} />
          <Route path="staffhistory" element={<StaffHistory />} />
          <Route path="addcustomer" element={<AddCustomer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
