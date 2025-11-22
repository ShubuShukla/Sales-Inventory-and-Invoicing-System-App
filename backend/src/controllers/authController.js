const prisma = require('../utils/prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { setOtp, verifyOtp } = require('../utils/otpStore');

exports.adminLogin = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Phone and password are required',
      });
    }

    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(400).json({
        ok: false,
        message: 'Invalid phone or password',
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        ok: false,
        message: 'Invalid phone or password',
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      ok: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
    });

  } catch (err) {
    next(err);
  }
};


/**
 * STEP 1: Customer requests OTP
 */
exports.customerRequestOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone) return res.status(400).json({ ok: false, message: "Phone is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

    setOtp(phone, otp);

    console.log(`🔐 OTP for ${phone}: ${otp}`);

    res.json({
      ok: true,
      message: "OTP generated successfully",
      otp, // visible only for dev/testing (REMOVE LATER)
    });
  } catch (err) {
    next(err);
  }
};

/**
 * STEP 2: Customer submits OTP for login
 */
exports.customerVerifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp)
      return res.status(400).json({ ok: false, message: "Phone and OTP are required" });

    if (!verifyOtp(phone, otp))
      return res.status(401).json({ ok: false, message: "Invalid or expired OTP" });

    // If user doesn't exist → create new customer
    let user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          role: 'CUSTOMER',
          isVerified: true,
        },
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      ok: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

