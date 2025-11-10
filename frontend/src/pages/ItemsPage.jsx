import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Plus } from "lucide-react";

export default function ItemsPage() {
    const navigate = useNavigate();
    const [items] = useState([
        { id: 1, name: "Parle-G Biscuit", stock: 120, price: 5 },
        { id: 2, name: "Coca-Cola 1L", stock: 48, price: 40 },
        { id: 3, name: "Aashirvaad Atta 10kg", stock: 25, price: 480 },
    ]);

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
                {/* Items list */}
                <div className="space-y-3">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex justify-between items-center hover:shadow-md transition"
                        >
                            <div>
                                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                <p className="text-sm text-gray-500">
                                    Stock: <span className="font-medium">{item.stock}</span> pcs
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-blue-700 font-semibold">₹{item.price}</p>
                                <p className="text-xs text-gray-400">per unit</p>
                            </div>
                        </div>
                    ))}
                </div>
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

            {/* Bottom Nav */}
            {/* <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around py-2 text-gray-700">
        <button
          className="flex flex-col items-center text-blue-600"
          onClick={() => navigate("/admin")}
        >
          🏠
          <span className="text-xs font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center">
          📦
          <span className="text-xs font-medium">Items</span>
        </button>
        <button className="flex flex-col items-center">
          ⚙️
          <span className="text-xs font-medium">More</span>
        </button>
      </div> */}
        </div>
    );
}
