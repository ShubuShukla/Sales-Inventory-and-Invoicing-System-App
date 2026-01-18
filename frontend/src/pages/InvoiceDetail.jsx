import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/apiClient";

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [id]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest(`/api/invoices/${id}`);
      setInvoice(data.invoice);
    } catch (err) {
      setError(err.message || "Failed to load invoice");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    const ok = window.confirm("Delete invoice? This will restore stock.");
    if (!ok) return;
    try {
      await apiRequest(`/api/invoices/${id}`, { method: "DELETE" });
      navigate("/invoices");
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!invoice) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto bg-white p-4 rounded shadow">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">Invoice #{invoice.invoiceNo}</h2>
            <div className="text-sm text-gray-600">{invoice.party?.name} — {invoice.party?.phone}</div>
            <div className="text-xs text-gray-500 mt-1">{new Date(invoice.createdAt).toLocaleString()}</div>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-xl font-bold">₹{invoice.total}</div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-medium">Items</h4>
          <div className="mt-2 space-y-2">
            {invoice.items.map((line) => (
              <div key={line.id} className="flex justify-between text-sm">
                <div>
                  <div className="font-medium">{line.item?.name || "Unknown"}</div>
                  <div className="text-xs text-gray-500">Qty: {line.quantity} × ₹{line.rate}</div>
                </div>

                <div className="text-right">
                  <div>₹{line.total}</div>
                  <div className="text-xs text-gray-500">CGST {line.cgst}% SGST {line.sgst}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button onClick={() => navigate(`/invoice-edit/${invoice.id}`)}>Edit</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          <Button onClick={() => navigate("/invoices")}>Back</Button>
        </div>
      </div>
    </div>
  );
}
