import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "@/apiClient";

export default function PartyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [party, setParty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadParty();
  }, []);

  async function loadParty() {
    try {
      const data = await apiRequest("/api/parties?type="); // get all parties
      const found = data.parties.find((p) => p.id === id);

      if (!found) {
        setError("Party not found");
      } else {
        setParty(found);
      }
    } catch (err) {
      setError("Failed to load party");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    const ok = window.confirm("Are you sure you want to delete this party?");
    if (!ok) return;

    try {
      await apiRequest(`/api/parties/${id}`, { method: "DELETE" });
      navigate("/parties");
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!party) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 text-white py-3 px-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-2 text-xl">
          ←
        </button>
        <h1 className="text-lg font-semibold">{party.name}</h1>
      </header>

      <div className="p-4 space-y-4">
        {/* Info Box */}
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-lg font-semibold">{party.name}</p>
          <p className="text-sm text-gray-600">{party.phone}</p>

          {party.gst && <p className="text-sm mt-1">GST: {party.gst}</p>}
          {party.address && (
            <p className="text-sm mt-1 text-gray-700">Address: {party.address}</p>
          )}

          <p className="mt-2 text-sm">
            <strong>Type:</strong> {party.type}
          </p>

          <p className="mt-2 text-sm">
            <strong>Balance:</strong>{" "}
            <span
              className={
                (party.balance || 0) >= 0
                  ? "text-red-600 font-semibold"
                  : "text-green-600 font-semibold"
              }
            >
              ₹{party.balance || 0}
            </span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg"
            onClick={() => navigate(`/edit-party/${party.id}`)}
          >
            Edit
          </button>

          <button
            className="flex-1 py-2 bg-red-600 text-white rounded-lg"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>

        {/* Placeholder for future (Invoices / Ledger) */}
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="font-medium text-gray-700">
            Transactions / Invoices (coming soon)
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Here you will see all bills, payments, and balance history.
          </p>
        </div>
      </div>
    </div>
  );
}
