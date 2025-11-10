import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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
      localStorage.setItem("token", "mock-customer-token");
      localStorage.setItem("role", "CUSTOMER");
      localStorage.setItem("name", "Retailer");
      navigate("/customer");
    } else {
      setError("Incorrect OTP");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-sm bg-white shadow-lg rounded-2xl border border-gray-100 p-6">
        <CardHeader className="text-center space-y-1">
          <h2 className="text-xl font-semibold text-blue-700">Retailer Login</h2>

          <p className="text-xl font-semibold text-blue-700">Enter mobile number to continue</p>
        </CardHeader>

        <CardContent>
          {step === "phone" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="10-digit mobile number"
                maxLength={10}
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button type="submit" className="w-full">
                Send OTP
              </Button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="4-digit OTP"
                maxLength={6}
              />

              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  className="text-gray-500 underline"
                  onClick={() => setStep("phone")}
                >
                  Edit number
                </button>

                <button
                  type="button"
                  className="text-gray-700 underline"
                  onClick={() => {
                    const code = Math.floor(1000 + Math.random() * 9000).toString();
                    setSentOtp(code);
                    alert(`(Demo) OTP resent: ${code}`);
                  }}
                >
                  Resend OTP
                </button>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button type="submit" className="w-full">
                Verify & Continue
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
