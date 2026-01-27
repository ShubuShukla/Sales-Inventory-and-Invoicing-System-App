import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/apiClient";

export default function InvoicesList() {
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/api/invoices");
      setInvoices(data.invoices || []);
    } catch (err) {
      setError(err.message || "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const ok = window.confirm("Delete invoice? This will restore stock.");
    if (!ok) return;
    try {
      await apiRequest(`/api/invoices/${id}`, { method: "DELETE" });
      fetchInvoices();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Invoices</h2>
          <Button onClick={() => navigate("/invoice")}>Create Invoice</Button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : invoices.length === 0 ? (
          <p>No invoices yet.</p>
        ) : (
          <div className="space-y-3">
            {invoices.map((inv) => (
              <div key={inv.id} className="bg-white p-3 rounded shadow flex items-center justify-between">
                <div>
                  <div className="font-medium">#{inv.invoiceNo} — ₹{inv.total}</div>
                  <div className="text-xs text-gray-500">
                    {inv.party?.name || "—"} • {new Date(inv.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="text-sm text-blue-600 underline" onClick={() => navigate(`/invoice/${inv.id}`)}>View</button>
                  <button className="text-sm text-blue-600 underline" onClick={() => navigate(`/invoice/${inv.id}`)}>Edit</button>
                  <button className="text-sm text-red-600 underline" onClick={() => handleDelete(inv.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
