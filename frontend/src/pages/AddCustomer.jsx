import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddCustomer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", type: "customer" });

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

        {/* Type Selection */}
        <p className="text-sm text-gray-600">Who are they?</p>
        <div className="flex gap-4">
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name="type"
              checked={form.type === "customer"}
              onChange={() => setForm({ ...form, type: "customer" })}
            />
            Customer
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name="type"
              checked={form.type === "supplier"}
              onChange={() => setForm({ ...form, type: "supplier" })}
            />
            Supplier
          </label>
        </div>

        {/* Optional Fields */}
        <p className="text-blue-600 text-sm font-medium mt-2">
          + ADD GSTIN & ADDRESS (OPTIONAL)
        </p>

        {/* Submit */}
        <button
          onClick={() => navigate("/parties")}
          className="w-full bg-blue-700 text-white font-medium py-3 rounded-lg mt-4"
        >
          ADD CUSTOMER
        </button>
      </div>
    </div>
  );
}
