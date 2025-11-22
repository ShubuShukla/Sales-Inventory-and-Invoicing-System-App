const express = require('express');
const router = express.Router();
const {
  adminLogin,
  customerRequestOtp,
  customerVerifyOtp
} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/test', (req, res) => res.json({ ok: true, route: "auth" }));

// ADMIN LOGIN
router.post('/admin/login', adminLogin);

// CUSTOMER LOGIN (OTP BASED)
router.post('/customer/request-otp', customerRequestOtp);
router.post('/customer/verify-otp', customerVerifyOtp);


// Protected test route
router.get('/me', authMiddleware, (req, res) => {
  res.json({
    ok: true,
    message: 'Protected route accessed successfully',
    user: req.user, // includes id + role
  });
});

module.exports = router;


