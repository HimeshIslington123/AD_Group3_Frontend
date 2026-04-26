import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./LoginPages/Login";
import Register from "./LoginPages/Register";
import InventoryManagement from "./AdminPages/InventoryManagement";
import AdminDashboard from "./AdminPages/AdminDashboard";
import AdminLayout from "./AdminPages/AdminLayout";
import Dashboard from "./AdminPages/AdminDashboard";
import VendorManagement from "./AdminPages/VendorManagement";
import StaffManagement from "./AdminPages/StaffManagement";
import Home from "./StaticPages/Home";
import UserDashboard from "./UserPages/Userdashboard";
import UserLayout from "./UserPages/Userlayout";
import BookAppointment from "./UserPages/BookAppointment";
import RequestParts from "./UserPages/RequestParts";
import HistoryPage from "./UserPages/HistoryPage";
import LoyaltyPage from "./UserPages/LoyaltyPage";
import AddCustomer from "./StaffPages/AddCustomer";
import SalesInvoice from "./StaffPages/SalesInvoice";
import StaffLayout from "./StaffPages/StaffLayout";
import CustomerDetails from "./StaffPages/CustomerDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />

        <Route path="/inventorymanagement" element={<InventoryManagement />} />

        {/* Layout Route */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Nested Pages */}
          <Route index element={<Dashboard />} />
          <Route path="inventorymanagement" element={<InventoryManagement />} />
          <Route path="vendormanagement" element={<VendorManagement />} />
          <Route path="staffmanagement" element={<StaffManagement />} />
        </Route>

        <Route path="/user" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="bookappointment" element={<BookAppointment />} />
          <Route path="requestpart" element={<RequestParts />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="loyalty" element={<LoyaltyPage />} />
        </Route>


        <Route path="/staff" element={<StaffLayout />}>
          <Route index path="addcustomer" element={<AddCustomer />} />
             <Route path="salesinvoice" element={<SalesInvoice />} />
                <Route path="customerdetails" element={<CustomerDetails />} />
         
        </Route>


      </Routes>
    </BrowserRouter>
  );
}

export default App;
