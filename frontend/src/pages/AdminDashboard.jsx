import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const items = [
    { icon: "💰", title: "Cashbook" },
    { icon: "📄", title: "Bills", path: "/bills" },
    { icon: "📦", title: "Items", path: "/items" },
    { icon: "👥", title: "Staff" },
    { icon: "📅", title: "Collection" },
    { icon: "👨‍💼", title: "Parties", path: "/parties" },
  ];

  return (
    <div className="flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="top-0 left-0 right-0 bg-blue-700 text-white py-3 px-4 shadow-md">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <h1 className="text-lg font-semibold">📘 My Business</h1>
          <button className="border border-white px-3 py-1 rounded text-sm">
            Edit
          </button>
        </div>
      </header>

      {/* Spacer below fixed header */}
      <div className="h-20"></div>

      {/* Main */}
      <main className="flex-1 max-w-md mx-auto w-full px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-6">
          {/* Promo */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl p-5 flex justify-between items-center shadow-md">
            <div>
              <p className="text-sm font-medium leading-snug">
                Fill missing details for a FREE Business Card
              </p>
              <button className="bg-white text-blue-700 px-4 py-1 mt-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition">
                PROCEED
              </button>
            </div>
            <div className="text-5xl opacity-30">💳</div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 gap-4">
            {items.map((item, i) => (
              <button
                key={i}
                onClick={() => item.path && navigate(item.path)}
                className="bg-gray-50 rounded-xl flex flex-col items-center justify-center p-4 shadow hover:bg-gray-100 transition-all duration-150 active:scale-95"
              >
                <div className="text-3xl">{item.icon}</div>
                <p className="text-sm font-medium mt-1 text-gray-800">
                  {item.title}
                </p>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Spacer above footer */}
      <div className="h-20"></div>

      {/* Footer */}
      <footer className="bottom-0 left-0 right-0 bg-white border-t shadow-md">
        <div className="max-w-md mx-auto flex justify-around py-3 text-gray-700">
          <button className="flex flex-col items-center text-blue-600">
            <span className="text-lg">🏠</span>
            <span className="text-xs font-medium mt-1">Home</span>
          </button>
          <button className="flex flex-col items-center">
            <span className="text-lg">📦</span>
            <span className="text-xs font-medium mt-1">Items</span>
          </button>
          <button className="flex flex-col items-center">
            <span className="text-lg">⚙️</span>
            <span className="text-xs font-medium mt-1">More</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

