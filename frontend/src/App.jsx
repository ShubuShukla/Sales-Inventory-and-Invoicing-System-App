import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import CustomerLogin from "./pages/CustomerLogin";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/customer-login" element={<CustomerLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/customer" element={<CustomerDashboard />} />
    </Routes>
  );
}
