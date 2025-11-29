import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, Phone, KeyRound } from "lucide-react";
import { apiRequest } from "@/apiClient"; // <-- use your existing apiClient

export default function AdminLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState("credentials"); // credentials -> otp
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Keep dev panel values for convenience (display only)
  const DEV_PHONE = "9999999999";
  const DEV_PASS = "admin123";
  const FIXED_OTP = "1234";

  // Temporary storage for token & user until OTP is verified
  const [pendingToken, setPendingToken] = useState(null);
  const [pendingUser, setPendingUser] = useState(null);

  // Step 1: send credentials to backend and if valid, go to OTP screen
  async function handleSendOtp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call backend login
      const data = await apiRequest("/api/auth/admin/login", {
        method: "POST",
        body: JSON.stringify({ phone, password }),
      });

      // Expect data.token and data.user
      if (!data?.token) throw new Error("No token returned from server");

      // Save temporarily until OTP verified
      setPendingToken(data.token);
      setPendingUser(data.user || null);

      // Move to OTP UI (we still use fake OTP)
      setStep("otp");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  // Step 2: verify fake OTP, then store real token & user in localStorage
  function handleVerifyOtp(e) {
    e.preventDefault();
    setError("");

    if (!pendingToken) {
      return setError("No pending login. Please enter credentials first.");
    }

    if (otp !== FIXED_OTP) return setError("Incorrect OTP");

    // Store token under the key your apiClient expects
    localStorage.setItem("siisa_token", pendingToken);

    // Optionally store user info
    if (pendingUser) {
      localStorage.setItem("siisa_user", JSON.stringify(pendingUser));
    }

    // Clear temporary states
    setPendingToken(null);
    setPendingUser(null);

    // Navigate to admin dashboard (same as before)
    navigate("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-sm bg-white shadow-lg rounded-2xl border border-gray-100 p-4">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-blue-700">
            🔒 Admin Login
          </CardTitle>
          <p className="text-xl font-semibold text-blue-700">
            Phone + Password + OTP
          </p>
        </CardHeader>

        <CardContent>
          {step === "credentials" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, ""))
                    }
                    maxLength={10}
                    placeholder="9999999999"
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="admin123"
                    className="pl-8 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-2 top-2.5 text-gray-400"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? "Checking..." : "Send OTP"}
              </Button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium">Enter OTP</label>
                <div className="relative">
                  <KeyRound className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    maxLength={4}
                    placeholder="1234"
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setStep("credentials");
                    setError("");
                  }}
                  className="text-gray-500 underline"
                >
                  Edit number / password
                </button>
                <span
                  className="text-blue-600 font-medium"
                  onClick={() => {
                    // "Resend" in dev mode: go back to credentials so you can re-send.
                    setStep("credentials");
                    setError("");
                  }}
                >
                  Resend OTP
                </span>
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Verify & Login
              </Button>
            </form>
          )}

          {/* Developer mode panel */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-gray-700">
            <strong className="text-blue-700">🔧 Developer Mode</strong>
            <div>📞 {DEV_PHONE}</div>
            <div>🔑 {DEV_PASS}</div>
            <div>🔢 OTP: {FIXED_OTP}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
