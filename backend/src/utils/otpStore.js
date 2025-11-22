const otpMap = new Map();

function setOtp(phone, otp) {
  otpMap.set(phone, {
    otp,
    expiresAt: Date.now() + 2 * 60 * 1000 // expires in 2 min
  });
}

function verifyOtp(phone, otp) {
  const record = otpMap.get(phone);
  if (!record) return false;

  if (Date.now() > record.expiresAt) {
    otpMap.delete(phone);
    return false;
  }

  if (record.otp === otp) {
    otpMap.delete(phone);
    return true;
  }

  return false;
}

module.exports = { setOtp, verifyOtp };
