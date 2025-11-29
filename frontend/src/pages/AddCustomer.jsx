import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "@/apiClient";

export default function AddCustomer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    type: "CUSTOMER",
    gst: "",
    address: ""
  });

  async function handleSubmit() {
    try {
      await apiRequest("/api/parties", {
        method: "POST",
        body: JSON.stringify(form)
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
        <button onClick={() => navigate(-1)} className="mr-2 text-xl">←</button>
        <h1 className="text-lg font-semibold">Add Customer</h1>
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
          ADD CUSTOMER
        </button>
      </div>
    </div>
  );
}
