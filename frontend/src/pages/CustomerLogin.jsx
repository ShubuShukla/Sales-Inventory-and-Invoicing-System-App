import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerLogin() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState("phone"); // phone -> otp
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState(null);
  const [error, setError] = useState("");

  function handleSendOtp(e) {
    e?.preventDefault();
    setError("");
    if (!phone || phone.length < 10) {
      setError("Enter a valid phone number");
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setSentOtp(code);
    setStep("otp");
    alert(`(Demo) OTP sent: ${code}`);
  }

  function handleVerifyOtp(e) {
    e?.preventDefault();
    setError("");
    if (!otp) {
      setError("Enter OTP");
      return;
    }
    if (otp === sentOtp) {
      // For demo, store token & role as CUSTOMER
      localStorage.setItem("token", "mock-customer-token");
      localStorage.setItem("role", "CUSTOMER");
      localStorage.setItem("name", "Retailer");
      // In a real app, we'd load retailer profile here
      navigate("/customer");
    } else {
      setError("Incorrect OTP");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-center mb-1">Retailer Login</h2>
        <p className="text-sm text-gray-500 text-center mb-4">Enter phone to receive OTP</p>

        {step === "phone" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-700">Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="10-digit mobile number"
                maxLength={10}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <button className="w-full bg-white border border-gray-200 py-2 rounded-lg font-semibold">
              Send OTP
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-700">Enter OTP</label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="4-digit code"
                maxLength={6}
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                }}
                className="text-gray-500 underline"
              >
                Edit number
              </button>

              <button
                type="button"
                onClick={() => {
                  const code = Math.floor(1000 + Math.random() * 9000).toString();
                  setSentOtp(code);
                  alert(`(Demo) OTP resent: ${code}`);
                }}
                className="text-blue-600 underline"
              >
                Resend
              </button>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold">
              Verify & Continue
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
