import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "@/apiClient";

export default function EditParty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    type: "",
    gst: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch party
  useEffect(() => {
    loadParty();
  }, []);

  async function loadParty() {
    try {
      // We will load ALL parties and find by id
      const data = await apiRequest("/api/parties?type="); // no filter
      const party = data.parties.find((p) => p.id === id);

      if (!party) {
        setError("Party not found");
        return;
      }

      setForm({
        name: party.name,
        phone: party.phone,
        type: party.type,
        gst: party.gst || "",
        address: party.address || "",
      });
    } catch (err) {
      setError("Failed to load party");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      await apiRequest(`/api/parties/${id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });

      navigate("/parties");
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  if (error)
    return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 text-white py-3 px-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-2 text-xl">
          ←
        </button>
        <h1 className="text-lg font-semibold">Edit Party</h1>
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

        <input
          type="tel"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        >
          <option value="CUSTOMER">Customer</option>
          <option value="SUPPLIER">Supplier</option>
        </select>

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
          onClick={handleSave}
          className="w-full bg-blue-700 text-white font-medium py-3 rounded-lg mt-4"
        >
          SAVE CHANGES
        </button>
      </div>
    </div>
  );
}
