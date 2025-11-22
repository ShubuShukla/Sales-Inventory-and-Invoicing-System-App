const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");
const {
  getItems,
  addItem,
  updateItem,
  deleteItem
} = require("../controllers/itemsController");

// All routes below require authentication
router.use(authMiddleware);

// GET all items
router.get("/", getItems);

// Only Admin can modify / manage items
router.post("/", requireRole("ADMIN"), addItem);
router.put("/:id", requireRole("ADMIN"), updateItem);
router.delete("/:id", requireRole("ADMIN"), deleteItem);

module.exports = router;
