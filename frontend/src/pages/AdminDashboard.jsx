import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      navigate("/admin-login");
    }
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/");
  }

  // simple mobile-first admin dashboard placeholder
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Hello,</div>
              <div className="font-semibold text-lg">{localStorage.getItem("name") || "Admin"}</div>
            </div>
            <button onClick={logout} className="text-sm text-red-600">Logout</button>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full text-left bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Total Outstanding</div>
            <div className="font-semibold text-xl">₹ 42,000</div>
          </button>

          <button className="w-full text-left bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Today's Sales</div>
            <div className="font-semibold text-xl">₹ 12,500</div>
          </button>

          <button className="w-full text-left bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Add / Manage Retailers</div>
          </button>

          <button className="w-full text-left bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Create Invoice</div>
          </button>
        </div>
      </div>
    </div>
  );
}
