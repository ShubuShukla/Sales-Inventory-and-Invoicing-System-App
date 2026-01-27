import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/apiClient";

export default function Parties() {
  const [tab, setTab] = useState("CUSTOMER"); // CUSTOMER | SUPPLIER
  const [loading, setLoading] = useState(false);
  const [parties, setParties] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch parties whenever tab changes
  useEffect(() => {
    fetchParties();
  }, [tab]);

  function round2(n) {
    return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
  }

   const youWillGet = round2(
    parties
      .filter((p) => p.balance > 0)
      .reduce((sum, p) => sum + p.balance, 0)
  );

  const youWillGive = round2(
    parties
      .filter((p) => p.balance < 0)
      .reduce((sum, p) => sum + Math.abs(p.balance), 0)
  );

  async function handleDelete(id) {
    const ok = window.confirm("Are you sure you want to delete this party?");
    if (!ok) return;

    try {
      await apiRequest(`/api/parties/${id}`, {
        method: "DELETE",
      });

      // After delete, refresh list
      fetchParties();
    } catch (err) {
      alert(err.message);
    }
  }

  async function fetchParties() {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest(`/api/parties?type=${tab}`);
      setParties(data.parties || []);
    } catch (err) {
      setError(err.message || "Failed to load parties");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-blue-700 text-white px-4 py-3 shadow-md flex items-center justify-between">
        <h1 className="text-lg font-semibold">📘 My Business</h1>
        <button className="border border-white rounded px-3 py-1 text-sm">
          Edit
        </button>
      </header>

      {/* Tabs */}
      <div className="flex justify-around mt-4 border-b border-gray-200">
        <button
          className={`pb-2 font-medium ${tab === "CUSTOMER"
            ? "text-blue-700 border-b-2 border-yellow-400"
            : "text-gray-600"
            }`}
          onClick={() => setTab("CUSTOMER")}
        >
          CUSTOMERS
        </button>

        <button
          className={`pb-2 font-medium ${tab === "SUPPLIER"
            ? "text-blue-700 border-b-2 border-yellow-400"
            : "text-gray-600"
            }`}
          onClick={() => setTab("SUPPLIER")}
        >
          SUPPLIERS
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-white mx-4 mt-3 rounded-xl shadow p-4 flex justify-between items-center">
        <div className="text-center">
          <p className="text-xs text-gray-500">You will give</p>
          <p className="text-green-600 font-semibold text-sm">
            ₹{youWillGive}
          </p>
        </div>

        <div className="text-center border-l border-gray-200 px-4">
          <p className="text-xs text-gray-500">You will get</p>
          <p className="text-red-600 font-semibold text-sm">
            ₹{youWillGet}
          </p>
        </div>

        <button className="text-blue-600 text-sm font-medium underline">
          Report
        </button>
      </div>


      {/* List */}
      <div className="mt-4 px-4">
        {loading ? (
          <p className="text-center text-gray-600 mt-10">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600 mt-10">{error}</p>
        ) : parties.length === 0 ? (
          <div className="flex flex-col items-center mt-16 text-gray-500">
            <div className="text-7xl">📦</div>
            <p className="text-center mt-2">
              No {tab === "CUSTOMER" ? "customers" : "suppliers"} found.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {parties.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-lg shadow-sm p-3 flex justify-between items-center"
              >
                {/* LEFT SIDE */}
                <div>
                  <p
                    className="font-medium text-gray-800 underline cursor-pointer"
                    onClick={() => navigate(`/party/${p.id}`)}
                  >
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-500">{p.phone}</p>

                  {/* EDIT BUTTON */}
                  <button
                    className="text-blue-600 text-xs underline mt-1"
                    onClick={() => navigate(`/edit-party/${p.id}`)}
                  >
                    Edit
                  </button>
                  {/* Delete */}
                  <button
                    className="text-red-600 text-xs underline mt-1 block"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </div>

                {/* RIGHT SIDE */}
                <div className="text-right">
                  <p
                    className={
                      (p.balance || 0) >= 0
                        ? "text-red-600 font-semibold text-sm"
                        : "text-green-600 font-semibold text-sm"
                    }
                  >
                    ₹{p.balance || 0}
                  </p>
                  <p className="text-xs text-blue-600 underline">Remind</p>
                </div>
              </div>
            ))}
          </div>

        )}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-20 right-6 flex items-center gap-2">
        <Button
          className={`${tab === "CUSTOMER"
            ? "bg-pink-600 hover:bg-pink-700"
            : "bg-green-600 hover:bg-green-700"
            } text-white rounded-full px-6 py-3 flex items-center gap-2 shadow-lg`}
          onClick={() =>
            navigate(`/add-party?type=${tab}`)
          }
        >
          <span className="text-lg">➕</span>
          {tab === "CUSTOMER" ? "Add Customer" : "Add Supplier"}
        </Button>
      </div>
    </div>
  );

 

}
