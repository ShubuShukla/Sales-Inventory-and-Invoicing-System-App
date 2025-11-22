import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../apiClient";

export default function AddProductPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    unitPrice: "",
    stock: "",
    cgst: "",
    sgst: "",
    hsnCode: "",
    sku: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.unitPrice) {
      setError("Name and Unit Price are required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        unitPrice: parseFloat(form.unitPrice),
        stock: form.stock ? parseInt(form.stock, 10) : 0,
        cgst: form.cgst ? parseFloat(form.cgst) : 0,
        sgst: form.sgst ? parseFloat(form.sgst) : 0,
        hsnCode: form.hsnCode || null,
        sku: form.sku || null,
        description: form.description || null,
      };

      const data = await apiRequest("/api/items", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      console.log("✅ Item created:", data);
      // After successful create → go back to items list
      navigate("/items");
    } catch (err) {
      console.error("❌ Error creating item:", err);
      setError(err.message || "Failed to create item");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="top-0 left-0 right-0 bg-blue-700 text-white py-3 px-4 flex items-center justify-between shadow-md z-10">
        <h1 className="text-lg font-semibold">➕ Add Product</h1>
        <button
          onClick={() => navigate("/items")}
          className="text-white border border-white px-3 py-1 rounded-md text-sm"
        >
          Back
        </button>
      </div>

      {/* Form Container */}
      <div className="max-w-md mx-auto mt-16 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3"
        >
          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Cement 50kg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Unit Price (₹) *
            </label>
            <input
              type="number"
              name="unitPrice"
              value={form.unitPrice}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 320"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Stock (Qty)
            </label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                CGST (%)
              </label>
              <input
                type="number"
                name="cgst"
                value={form.cgst}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 9"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                SGST (%)
              </label>
              <input
                type="number"
                name="sgst"
                value={form.sgst}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 9"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              HSN Code
            </label>
            <input
              type="text"
              name="hsnCode"
              value={form.hsnCode}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 2523"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              SKU (Internal Code)
            </label>
            <input
              type="text"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. CEM-50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional notes about the product..."
              rows={2}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-md py-2 text-sm font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
