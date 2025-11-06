import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "CUSTOMER") {
      navigate("/customer-login");
    }
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Welcome</div>
              <div className="font-semibold text-lg">{localStorage.getItem("name") || "Retailer"}</div>
            </div>
            <button onClick={logout} className="text-sm text-red-600">Logout</button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Outstanding Amount</div>
            <div className="font-semibold text-xl">₹ 8,400</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Last Payment</div>
            <div className="font-semibold">₹ 5,000 — 10 Oct 2025</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Place Order</div>
            <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg">Create Order Request</button>
          </div>
        </div>
      </div>
    </div>
  );
}
