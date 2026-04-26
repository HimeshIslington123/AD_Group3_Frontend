import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './LoginPages/Login'
import Register from "./LoginPages/Register";
import InventoryManagement from "./AdminPages/InventoryManagement";
import AdminDashboard from "./AdminPages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
         <Route path="/register" element={<Register />} />

            <Route path="/inventorymanagement" element={<InventoryManagement />} />
                <Route path="/admindashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  ); 
}

export default App;