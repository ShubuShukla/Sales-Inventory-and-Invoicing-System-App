import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">
            WH
          </div>
          <h1 className="text-xl font-semibold mt-4">Wholesale Billing</h1>
          <p className="text-sm text-gray-500 mt-1">
            Simple billing & collections for retailers
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/admin-login"
            className="block w-full py-3 rounded-xl bg-blue-600 text-white text-center font-semibold shadow"
          >
            Admin Login
          </Link>

          <Link
            to="/customer-login"
            className="block w-full py-3 rounded-xl bg-white border border-gray-200 text-center font-semibold text-gray-700"
          >
            Retailer Login
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6 text-center">
          Mobile-first • Built for quick billing
        </p>
      </div>
    </div>
  );
}
