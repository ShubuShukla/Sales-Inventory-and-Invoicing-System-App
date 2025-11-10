import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Parties() {
  const [tab, setTab] = useState("customers");
  const navigate = useNavigate();

  const customers = [
    { name: "Santosh Bhaiya Billi", amount: 3114, days: "5 days ago" },
  ];
  const suppliers = [];

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
          className={`pb-2 font-medium ${
            tab === "customers"
              ? "text-blue-700 border-b-2 border-yellow-400"
              : "text-gray-600"
          }`}
          onClick={() => setTab("customers")}
        >
          CUSTOMERS
        </button>
        <button
          className={`pb-2 font-medium ${
            tab === "suppliers"
              ? "text-blue-700 border-b-2 border-yellow-400"
              : "text-gray-600"
          }`}
          onClick={() => setTab("suppliers")}
        >
          SUPPLIERS
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-white mx-4 mt-3 rounded-xl shadow p-4 flex justify-between items-center">
        <div className="text-center">
          <p className="text-xs text-gray-500">You will give</p>
          <p className="text-green-600 font-semibold text-sm">₹0</p>
        </div>
        <div className="text-center border-l border-gray-200 px-4">
          <p className="text-xs text-gray-500">You will get</p>
          <p className="text-red-600 font-semibold text-sm">₹{tab === "customers" ? "3,114" : "0"}</p>
        </div>
        <button className="text-blue-600 text-sm font-medium underline">
          Report
        </button>
      </div>

      {/* List */}
      <div className="mt-4 px-4">
        {tab === "customers" && customers.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-3 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">{customers[0].name}</p>
              <p className="text-xs text-gray-500">{customers[0].days}</p>
            </div>
            <div className="text-right">
              <p className="text-red-600 font-semibold text-sm">
                ₹{customers[0].amount}
              </p>
              <p className="text-xs text-blue-600 underline">Remind</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center mt-16 text-gray-500">
            <div className="text-7xl">📦</div>
            <p className="text-center mt-2">
              Add {tab === "customers" ? "customers" : "suppliers"} to manage{" "}
              {tab === "customers" ? "your sales" : "your purchases"}
            </p>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-20 right-6 flex items-center gap-2">
        <Button
          className={`${
            tab === "customers" ? "bg-pink-600 hover:bg-pink-700" : "bg-green-600 hover:bg-green-700"
          } text-white rounded-full px-6 py-3 flex items-center gap-2 shadow-lg`}
          onClick={() =>
            navigate(tab === "customers" ? "/add-customer" : "/add-supplier")
          }
        >
          <span className="text-lg">➕</span>
          {tab === "customers" ? "Add Customer" : "Add Supplier"}
        </Button>
      </div>
    </div>
  );
}
