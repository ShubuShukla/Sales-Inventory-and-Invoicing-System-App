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
import EditParty from "./pages/EditParty";
import AddCustomer from "./pages/AddCustomer";
import AddSupplier from "./pages/AddSupplier";
import { Button } from "@/components/ui/button";
import AddParty from "./pages/AddParty";
import PartyDetails from "./pages/PartyDetails";
import Invoice from "./pages/Invoice";
import InvoicesList from "./pages/InvoicesList";
import InvoiceDetail from "./pages/InvoiceDetail";
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
      <Route path="/add-party" element={<AddParty />} />
      <Route path="/edit-party/:id" element={<EditParty />} />
      <Route path="/parties" element={<Parties />} />
      <Route path="/add-customer" element={<AddCustomer />} />
      <Route path="/add-supplier" element={<AddSupplier />} />
      <Route path="/party/:id" element={<PartyDetails />} />

       {/* route for edit - reuse create page or implement separate
      <Route path="/invoice-edit/:id" element={<Invoice />} />  // if Invoice.jsx supports edit
      // create route
      <Route path="/create-invoice" element={<Invoice />} />
      <Route path="/invoice" element={<Invoice />} />

      <Route path="/invoices" element={<InvoicesList />} />
      <Route path="/invoice/:id" element={<InvoiceDetail />} /> */}

      <Route path="/invoices" element={<InvoicesList />} />
<Route path="/invoice" element={<Invoice />} />        {/* Create */}
<Route path="/invoice/:id" element={<Invoice />} />    {/* Edit */}

      <Route path="/bills" element={<AdminBills />} />
// Optional placeholders for details/new:
      <Route path="/admin/bills/new" element={<div className="p-6">Create new bill (placeholder)</div>} />
      <Route path="/admin/bills/:id" element={<div className="p-6">Bill details (placeholder)</div>} />
    </Routes >
  );
}
