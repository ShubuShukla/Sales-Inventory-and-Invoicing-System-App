// backend/src/routes/invoiceRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");
const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  deleteInvoice,
  updateInvoice 
} = require("../controllers/invoicesController");

router.use(authMiddleware);

// CREATE invoice
router.post("/", requireRole("ADMIN"), createInvoice);

// LIST all invoices for logged-in admin
router.get("/", getInvoices);

// GET single invoice
router.get("/:id", getInvoiceById);

// Add delete
router.delete("/:id", requireRole("ADMIN"), deleteInvoice);

// add this route (ADMIN only)
router.put("/:id", requireRole("ADMIN"), updateInvoice);


module.exports = router;

