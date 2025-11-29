// backend/src/controllers/partiesController.js
const prisma = require("../utils/prismaClient");

// GET /api/parties?type=CUSTOMER&search=xyz
exports.getParties = async (req, res) => {
  try {
    const { type, search } = req.query;
    const ownerId = req.user.id;

    const where = {
      ownerId,
    };

    if (type) where.type = type; // CUSTOMER / SUPPLIER

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const parties = await prisma.party.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });

    res.json({
      ok: true,
      parties,
    });
  } catch (err) {
    console.error("getParties error", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};

// POST /api/parties
exports.addParty = async (req, res) => {
  try {
    const { name, phone, type, gst, address } = req.body;

    if (!name || !phone || !type) {
      return res.status(400).json({ ok: false, message: "Missing fields" });
    }

    const party = await prisma.party.create({
      data: {
        name,
        phone,
        type,
        gst: gst || null,
        address: address || null,
        ownerId: req.user.id,
      },
    });

    res.json({ ok: true, party });
  } catch (err) {
    console.error("addParty error", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};

// PUT /api/parties/:id
exports.updateParty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, type, gst, address } = req.body;

    const updated = await prisma.party.update({
      where: { id },
      data: { name, phone, type, gst, address },
    });

    res.json({ ok: true, party: updated });
  } catch (err) {
    console.error("updateParty error", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};

// DELETE /api/parties/:id
exports.deleteParty = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.party.delete({ where: { id } });

    res.json({ ok: true, message: "Party deleted" });
  } catch (err) {
    console.error("deleteParty error", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};
