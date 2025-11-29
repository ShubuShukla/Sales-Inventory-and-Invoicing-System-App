const prisma = require("../utils/prismaClient");

// Generate next invoice number: 0001, 0002...
async function generateInvoiceNo(ownerId) {
  const last = await prisma.invoice.findFirst({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
  });

  if (!last) return "0001";

  const num = parseInt(last.invoiceNo) + 1;
  return String(num).padStart(4, "0");
}

exports.createInvoice = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { partyId, items } = req.body;

    if (!partyId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ ok: false, message: "Missing fields" });
    }

    const invoiceNo = await generateInvoiceNo(ownerId);

    // Total calculation
    let totalAmount = 0;

    items.forEach((line) => {
      const qty = Number(line.quantity);
      const rate = Number(line.rate);
      const cgst = Number(line.cgst) || 0;
      const sgst = Number(line.sgst) || 0;

      const base = qty * rate;
      const gst = base * (cgst + sgst) / 100;

      line.total = base + gst;
      totalAmount += line.total;
    });

    // 1️⃣ Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNo,
        total: totalAmount,
        ownerId,
        partyId,
      },
    });

    // 2️⃣ Create invoice items + reduce stock
    for (let line of items) {
      await prisma.invoiceItem.create({
        data: {
          invoiceId: invoice.id,
          itemId: line.itemId,
          quantity: line.quantity,
          rate: line.rate,
          cgst: line.cgst,
          sgst: line.sgst,
          total: line.total,
        },
      });

      // Reduce stock
      await prisma.item.update({
        where: { id: line.itemId },
        data: {
          stock: {
            decrement: line.quantity,
          },
        },
      });
    }

    res.json({
      ok: true,
      invoice,
    });
  } catch (err) {
    console.error("createInvoice error", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const invoices = await prisma.invoice.findMany({
      where: { ownerId },
      orderBy: { createdAt: "desc" },
      include: {
        party: true,
        items: true,
      },
    });

    res.json({ ok: true, invoices });
  } catch (err) {
    console.error("getInvoices error", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const id = req.params.id;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        party: true,
        items: {
          include: { item: true },
        },
      },
    });

    if (!invoice) {
      return res.status(404).json({ ok: false, message: "Not found" });
    }

    res.json({ ok: true, invoice });
  } catch (err) {
    console.error("getInvoiceById error", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};
