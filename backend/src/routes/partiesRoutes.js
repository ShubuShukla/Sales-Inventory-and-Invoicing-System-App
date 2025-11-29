// backend/src/routes/partiesRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");
const {
  getParties,
  addParty,
  updateParty,
  deleteParty,
} = require("../controllers/partiesController");

router.use(authMiddleware);

// GET list (customers or suppliers)
router.get("/", getParties);

// Admin-only: Create party
router.post("/", requireRole("ADMIN"), addParty);

// Admin-only: Update
router.put("/:id", requireRole("ADMIN"), updateParty);

// Admin-only: Delete
router.delete("/:id", requireRole("ADMIN"), deleteParty);

module.exports = router;

