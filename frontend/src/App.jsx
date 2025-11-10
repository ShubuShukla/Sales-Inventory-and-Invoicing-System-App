import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import CustomerLogin from "./pages/CustomerLogin";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminBills from "./pages/AdminBills";
import ItemsPage from "./pages/ItemsPage";
import AddProduct from "./pages/AddProduct";
import Parties from "./pages/Parties";
import AddCustomer from "./pages/AddCustomer";
import AddSupplier from "./pages/AddSupplier";
import { Button } from "@/components/ui/button";

export default function App() {
  return (

    <Routes>
      < Route path="/" element={< Home />} />
      < Route path="/admin-login" element={< AdminLogin />} />
      < Route path="/customer-login" element={< CustomerLogin />} />
      < Route path="/admin" element={< AdminDashboard />} />
      < Route path="/customer" element={< CustomerDashboard />} />
      <Route path="/items" element={<ItemsPage />} />
      <Route path="/add-product" element={<AddProduct />} />


      <Route path="/parties" element={<Parties />} />
      <Route path="/add-customer" element={<AddCustomer />} />
      <Route path="/add-supplier" element={<AddSupplier />} />

      <Route path="/bills" element={<AdminBills />} />
// Optional placeholders for details/new:
      <Route path="/admin/bills/new" element={<div className="p-6">Create new bill (placeholder)</div>} />
      <Route path="/admin/bills/:id" element={<div className="p-6">Bill details (placeholder)</div>} />
    </Routes >
  );
}
