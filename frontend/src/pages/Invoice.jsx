import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/apiClient";

/**
 * Single-step Invoice page
 *
 * Notes based on your requests:
 * - invoiceNo is generated on the backend (frontend DOES NOT send it)
 * - stock is NOT shown beside item names
 * - frontend DOES NOT block creation when stock is zero/negative
 */

export default function Invoice() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [parties, setParties] = useState([]);
  const [items, setItems] = useState([]); // All items from DB
  const [error, setError] = useState("");

  const [partyId, setPartyId] = useState("");
  const [lines, setLines] = useState([
    { id: cryptoRandomId(), itemId: "", quantity: 1, rate: 0, cgst: 0, sgst: 0, total: 0 },
  ]);

  // load parties and items
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const p = await apiRequest("/api/parties?type=CUSTOMER");
        const it = await apiRequest("/api/items?limit=100"); // adjust if you paginate more
        if (cancelled) return;
        setParties(p.parties || []);
        setItems(it.items || []);
        // default select first party if exists
        if ((p.parties || []).length > 0 && !partyId) setPartyId((p.parties || [])[0].id);
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => (cancelled = true);
  }, []);

  // compute invoice totals
  const { subtotal, totalGst, grandTotal } = useMemo(() => {
    let st = 0;
    let gstSum = 0;
    for (const L of lines) {
      const q = Number(L.quantity) || 0;
      const r = Number(L.rate) || 0;
      const cg = Number(L.cgst) || 0;
      const sg = Number(L.sgst) || 0;
      const taxable = q * r;
      const cgAmt = (taxable * cg) / 100;
      const sgAmt = (taxable * sg) / 100;
      st += taxable;
      gstSum += cgAmt + sgAmt;
    }
    return { subtotal: round2(st), totalGst: round2(gstSum), grandTotal: round2(st + gstSum) };
  }, [lines]);

  // helpers
  function round2(n) {
    return Math.round((n + Number.EPSILON) * 100) / 100;
  }
  function cryptoRandomId() {
    return Math.random().toString(36).slice(2, 9);
  }

  // when user selects an item in a line, auto-fill rate & gst
  function handleItemSelect(lineId, itemId) {
    const item = items.find((it) => it.id === itemId);
    setLines((prev) =>
      prev.map((L) =>
        L.id === lineId
          ? {
              ...L,
              itemId,
              rate: item ? item.unitPrice : 0,
              cgst: item ? item.cgst : 0,
              sgst: item ? item.sgst : 0,
              total: computeLineTotal(item ? item.unitPrice : 0, L.quantity || 1, item ? item.cgst : 0, item ? item.sgst : 0),
            }
          : L
      )
    );
  }

  function handleLineChange(lineId, changes) {
    setLines((prev) =>
      prev.map((L) =>
        L.id === lineId
          ? {
              ...L,
              ...changes,
              total: computeLineTotal(changes.rate ?? L.rate, changes.quantity ?? L.quantity, changes.cgst ?? L.cgst, changes.sgst ?? L.sgst),
            }
          : L
      )
    );
  }

  function computeLineTotal(rate, quantity, cgst, sgst) {
    const q = Number(quantity) || 0;
    const r = Number(rate) || 0;
    const taxable = q * r;
    const cgAmt = (taxable * Number(cgst || 0)) / 100;
    const sgAmt = (taxable * Number(sgst || 0)) / 100;
    return round2(taxable + cgAmt + sgAmt);
  }

  function addLine() {
    setLines((prev) => [...prev, { id: cryptoRandomId(), itemId: "", quantity: 1, rate: 0, cgst: 0, sgst: 0, total: 0 }]);
  }

  function removeLine(lineId) {
    setLines((prev) => prev.filter((L) => L.id !== lineId));
  }

  // Submit invoice - **DO NOT send invoiceNo**, backend will generate
  async function handleSubmit() {
    if (!partyId) return alert("Select a party");
    if (lines.length === 0) return alert("Add at least one line");

    const payload = {
      partyId,
      items: lines
        .filter((L) => L.itemId)
        .map((L) => ({
          itemId: L.itemId,
          quantity: Number(L.quantity || 0),
          rate: Number(L.rate || 0),
          cgst: Number(L.cgst || 0),
          sgst: Number(L.sgst || 0),
          total: Number(L.total || 0),
        })),
      total: grandTotal,
    };

    if (payload.items.length === 0) return alert("Please select item(s) for lines");

    setLoading(true);
    try {
      const res = await apiRequest("/api/invoices", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.ok && res.invoice) {
        // backend generated invoiceNo. show it and navigate
        const invNo = res.invoice.invoiceNo || "(no invoiceNo returned)";
        alert(`Invoice created — ${invNo}`);
        navigate("/invoices");
      } else {
        alert(res.message || "Failed to create invoice");
      }
    } catch (err) {
      alert(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  }

  // UI
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Create Invoice</h2>
              <p className="text-sm text-gray-500">Single-step invoice creation</p>
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-500">Invoice No (generated by server)</div>
              <div className="mt-1 text-sm text-gray-700">Will be generated on save</div>
            </div>
          </div>

          {/* party select */}
          <div className="mt-4">
            <label className="text-xs text-gray-600">Customer</label>
            <select className="w-full border rounded px-3 py-2 mt-1" value={partyId} onChange={(e) => setPartyId(e.target.value)}>
              <option value="">-- select party --</option>
              {parties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.phone}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* lines */}
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Items</h3>
            <button className="text-sm text-blue-600" onClick={addLine}>
              + Add line
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {lines.map((L) => (
              <div key={L.id} className="border rounded p-3">
                <div className="flex gap-3 items-center">
                  <div className="w-1/3">
                    <label className="text-xs text-gray-600">Item</label>
                    <select value={L.itemId} onChange={(e) => handleItemSelect(L.id, e.target.value)} className="w-full border rounded px-2 py-1 mt-1 text-sm">
                      <option value="">-- select item --</option>
                      {items.map((it) => (
                        // IMPORTANT: we intentionally do NOT show stock here
                        <option key={it.id} value={it.id}>
                          {it.name} — ₹{it.unitPrice}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-1/6">
                    <label className="text-xs text-gray-600">Qty</label>
                    <Input value={L.quantity} onChange={(e) => handleLineChange(L.id, { quantity: e.target.value })} className="mt-1" type="number" min="0" />
                  </div>

                  <div className="w-1/6">
                    <label className="text-xs text-gray-600">Rate</label>
                    <Input value={L.rate} onChange={(e) => handleLineChange(L.id, { rate: e.target.value })} className="mt-1" type="number" />
                  </div>

                  <div className="w-1/6">
                    <label className="text-xs text-gray-600">CGST%</label>
                    <Input value={L.cgst} onChange={(e) => handleLineChange(L.id, { cgst: e.target.value })} className="mt-1" type="number" />
                  </div>

                  <div className="w-1/6">
                    <label className="text-xs text-gray-600">SGST%</label>
                    <Input value={L.sgst} onChange={(e) => handleLineChange(L.id, { sgst: e.target.value })} className="mt-1" type="number" />
                  </div>

                  <div className="w-1/6 text-right">
                    <div className="text-xs text-gray-600">Line Total</div>
                    <div className="font-semibold mt-1">₹{L.total || 0}</div>
                    <button className="text-xs text-red-600 mt-2" onClick={() => removeLine(L.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* totals & submit */}
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-sm text-gray-500">Subtotal</div>
            <div className="text-lg font-semibold">₹{subtotal}</div>
            <div className="text-sm text-gray-500 mt-2">Total GST</div>
            <div className="text-lg font-semibold">₹{totalGst}</div>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-500">Grand Total</div>
            <div className="text-2xl font-bold">₹{grandTotal}</div>
            <div className="mt-3">
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Create Invoice"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="fixed left-4 bottom-4 bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">{error}</div>}
    </div>
  );
}
