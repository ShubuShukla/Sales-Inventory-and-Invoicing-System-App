import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { apiRequest } from "../apiClient";

export default function ItemsPage() {
  const navigate = useNavigate();

  // items from backend
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(2); // small so we can test with 4 items
  const [totalPages, setTotalPages] = useState(1);

  // shared loader for initial load, search, pagination
  async function loadItems(searchTerm = "", pageNumber = 1) {
    try {
      console.log("🔄 Fetching /api/items from backend...", {
        searchTerm,
        pageNumber,
      });
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      params.set("page", pageNumber.toString());
      params.set("limit", limit.toString());
      if (searchTerm) {
        params.set("search", searchTerm);
      }

      const path = `/api/items?${params.toString()}`;

      const data = await apiRequest(path);
      console.log("✅ Items response:", data);

      setItems(data.items || []);
      setPage(data.page || pageNumber);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("❌ Error loading items:", err);
      setError(err.message || "Failed to load items");
    } finally {
      setLoading(false);
    }
  }

  // initial load on mount
  useEffect(() => {
    loadItems("", 1);
  }, []);

  async function handleSearchSubmit(e) {
    e.preventDefault();

    try {
      setPage(1); // reset to first page on new search
      await loadItems(search, 1);
    } catch (err) {
      console.error("❌ Error searching items:", err);
    }
  }

  function handleNextPage() {
    if (page < totalPages) {
      loadItems(search, page + 1);
    }
  }

  function handlePrevPage() {
    if (page > 1) {
      loadItems(search, page - 1);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="top-0 left-0 right-0 bg-blue-700 text-white py-3 px-4 flex items-center justify-between shadow-md z-10">
        <h1 className="text-lg font-semibold">📦 Items</h1>
        <button
          onClick={() => navigate("/admin")}
          className="text-white border border-white px-3 py-1 rounded-md text-sm"
        >
          Back
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-md mx-auto mt-16 px-4">
        {/* Search bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="mb-3 flex gap-2 items-center"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search items by name..."
          />
          <button
            type="submit"
            className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        {/* Loading / Error / List */}
        {loading ? (
          <div className="text-center text-sm text-gray-500">
            Loading items...
          </div>
        ) : error ? (
          <div className="text-center text-sm text-red-500">
            Error: {error}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex justify-between items-center hover:shadow-md transition"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Stock:{" "}
                      <span className="font-medium">
                        {item.stock ?? 0}
                      </span>{" "}
                      pcs
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-700 font-semibold">
                      ₹{item.unitPrice}
                    </p>
                    <p className="text-xs text-gray-400">
                      GST: {(item.cgst ?? 0) + (item.sgst ?? 0)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-2 text-sm">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className={`px-3 py-1 rounded-md border text-xs ${
                    page === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page <span className="font-semibold">{page}</span>{" "}
                  of <span className="font-semibold">{totalPages}</span>
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className={`px-3 py-1 rounded-md border text-xs ${
                    page === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-20 right-6 flex items-center gap-2">
        <span className="bg-white text-blue-700 font-semibold px-3 py-1 rounded-lg shadow-md">
          Add Product
        </span>
        <button
          onClick={() => navigate("/add-product")}
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}
