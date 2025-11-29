import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "@/apiClient";

export default function AddParty() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // Default type reading from URL:
  // /add-party?type=CUSTOMER  OR /add-party?type=SUPPLIER
  const defaultType = params.get("type") || "CUSTOMER";

  const [form, setForm] = useState({
    name: "",
    phone: "",
    type: defaultType,
    gst: "",
    address: "",
  });

  async function handleSubmit() {
    try {
      await apiRequest("/api/parties", {
        method: "POST",
        body: JSON.stringify(form),
      });

      navigate("/parties");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 text-white py-3 px-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-2 text-xl">
          ←
        </button>
        <h1 className="text-lg font-semibold">
          Add {form.type === "CUSTOMER" ? "Customer" : "Supplier"}
        </h1>
      </header>

      {/* Form */}
      <div className="max-w-md mx-auto p-4 space-y-4">
        <input
          type="text"
          placeholder="Party name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        <div className="flex gap-2">
          <div className="border rounded-lg px-3 py-2 flex items-center gap-1 text-sm bg-gray-50">
            🇮🇳 +91
          </div>
          <input
            type="tel"
            placeholder="Mobile Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* Who are they */}
        <p className="text-sm text-gray-600">Who are they?</p>
        <div className="flex gap-4">
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name="type"
              checked={form.type === "CUSTOMER"}
              onChange={() => setForm({ ...form, type: "CUSTOMER" })}
            />
            Customer
          </label>

          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name="type"
              checked={form.type === "SUPPLIER"}
              onChange={() => setForm({ ...form, type: "SUPPLIER" })}
            />
            Supplier
          </label>
        </div>

        {/* Optional */}
        <input
          type="text"
          placeholder="GSTIN (optional)"
          value={form.gst}
          onChange={(e) => setForm({ ...form, gst: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        <textarea
          placeholder="Address (optional)"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-700 text-white font-medium py-3 rounded-lg mt-4"
        >
          ADD {form.type === "CUSTOMER" ? "CUSTOMER" : "SUPPLIER"}
        </button>
      </div>
    </div>
  );
}
