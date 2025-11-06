import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState("credentials"); // credentials -> otp -> done
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState(null);
  const [error, setError] = useState("");

  // Fake validation: for demo we accept any pass but require phone length
  function handleSendOtp(e) {
    e?.preventDefault();
    setError("");
    if (!phone || phone.length < 10) {
      setError("Enter a valid phone number");
      return;
    }
    if (!password || password.length < 4) {
      setError("Enter admin password (min 4 chars)");
      return;
    }
    // Fake OTP generator
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setSentOtp(code);
    setStep("otp");
    // In real app: send OTP via SMS gateway here
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
      // Mark "admin logged in"
      localStorage.setItem("token", "mock-admin-token");
      localStorage.setItem("role", "ADMIN");
      localStorage.setItem("name", "Admin");
      navigate("/admin");
    } else {
      setError("Incorrect OTP, try again");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-center mb-1">Admin Login</h2>
        <p className="text-sm text-gray-500 text-center mb-4">Phone + password + OTP</p>

        {step === "credentials" && (
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

            <div>
              <label className="text-xs font-medium text-gray-700">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Your admin password"
                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold"
            >
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
                  setStep("credentials");
                  setOtp("");
                }}
                className="text-gray-500 underline"
              >
                Edit phone or password
              </button>

              <button
                type="button"
                onClick={() => {
                  // resend fake otp
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
              Verify & Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
