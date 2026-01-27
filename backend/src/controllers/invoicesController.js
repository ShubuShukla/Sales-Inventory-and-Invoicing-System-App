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

    // Validate party belongs to owner (optional but useful)
    const party = await prisma.party.findUnique({ where: { id: partyId } });
    if (!party || party.ownerId !== ownerId) {
      return res.status(400).json({ ok: false, message: "Invalid party" });
    }

    // Validate items exist and fetch unitPrice/cgst/sgst for each itemId
    const itemIds = items.map((l) => l.itemId);
    const dbItems = await prisma.item.findMany({
      where: { id: { in: itemIds }, ownerId },
    });

    if (dbItems.length !== itemIds.length) {
      return res.status(400).json({ ok: false, message: "One or more items invalid" });
    }

    // Build lines with computed totals (ensure numeric)
    let totalAmount = 0;
    const linesToCreate = items.map((line) => {
      const dbItem = dbItems.find((it) => it.id === line.itemId);

      const qty = Number(line.quantity || 0);
      const rate = Number(line.rate ?? dbItem.unitPrice ?? 0);
      const cgst = Number(line.cgst ?? dbItem.cgst ?? 0);
      const sgst = Number(line.sgst ?? dbItem.sgst ?? 0);

      const base = qty * rate;
      const gst = base * (cgst + sgst) / 100;
      const totalLine = Math.round((base + gst + Number.EPSILON) * 100) / 100;

      totalAmount += totalLine;

      return {
        itemId: line.itemId,
        quantity: qty,
        rate,
        cgst,
        sgst,
        total: totalLine,
      };
    });

    // Generate invoice number (kept as-is)
    const invoiceNo = await generateInvoiceNo(ownerId);

    // Use transaction: create invoice -> create invoiceItems -> update stocks
    const created = await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          invoiceNo,
          total: totalAmount,
          ownerId,
          partyId,
        },
      });

      // create all invoice items
      for (const l of linesToCreate) {
        await tx.invoiceItem.create({
          data: {
            invoiceId: invoice.id,
            itemId: l.itemId,
            quantity: l.quantity,
            rate: l.rate,
            cgst: l.cgst,
            sgst: l.sgst,
            total: l.total,
          },
        });

        // decrement stock (allowed to go negative)
        await tx.item.update({
          where: { id: l.itemId },
          data: {
            stock: {
              decrement: l.quantity,
            },
          },
        });
      }

      // return invoice id only; we'll fetch full invoice after tx
      return invoice;
    });

    // fetch invoice with items & party to return
    const invoiceWithItems = await prisma.invoice.findUnique({
      where: { id: created.id },
      include: {
        items: { include: { item: true } },
        party: true,
      },
    });

    // Increase customer balance
    await prisma.party.update({
      where: { id: partyId },
      data: {
        balance: {
          increment: totalAmount,
        },
      },
    });

    res.json({ ok: true, invoice: invoiceWithItems });
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


// DELETE /api/invoices/:id
exports.deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user.id;



    // ensure invoice belongs to owner
    const existing = await prisma.invoice.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existing || existing.ownerId !== ownerId) {
      return res.status(404).json({ ok: false, message: "Invoice not found" });
    }

    // Reverse customer balance
    await prisma.party.update({
      where: { id: existing.partyId },
      data: {
        balance: {
          decrement: existing.total,
        },
      },
    });

    // 1) restore stock for each invoiceItem
    for (const line of existing.items) {
      await prisma.item.update({
        where: { id: line.itemId },
        data: {
          stock: {
            increment: Number(line.quantity || 0),
          },
        },
      });
    }

    // 2) delete invoice items
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });

    // 3) delete invoice
    await prisma.invoice.delete({ where: { id } });

    res.json({ ok: true, message: "Invoice deleted" });
  } catch (err) {
    console.error("deleteInvoice error", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};


// Update an existing invoice and adjust stock diffs
exports.updateInvoice = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { id } = req.params;
    const { partyId, items } = req.body; // items = [{ itemId, quantity, rate, cgst, sgst }]

    if (!partyId || !Array.isArray(items)) {
      return res.status(400).json({ ok: false, message: "Missing fields" });
    }

    // Fetch existing invoice with items
    const existing = await prisma.invoice.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existing || existing.ownerId !== ownerId) {
      return res.status(404).json({ ok: false, message: "Invoice not found" });
    }

    // Validate party belongs to owner
    const party = await prisma.party.findUnique({ where: { id: partyId } });
    if (!party || party.ownerId !== ownerId) {
      return res.status(400).json({ ok: false, message: "Invalid party" });
    }

    // Validate provided itemIds exist for this owner
    // Deduplicate incoming item IDs to avoid false negatives when same item appears multiple times
    const itemIdsAll = items.map((l) => l.itemId || "").filter(Boolean);
    const uniqueItemIds = Array.from(new Set(itemIdsAll));

    const dbItems = await prisma.item.findMany({
      where: { id: { in: uniqueItemIds }, ownerId },
    });

    // If any id is missing, return a helpful error listing missing ids
    const foundIds = dbItems.map((i) => i.id);
    const missing = uniqueItemIds.filter((id) => !foundIds.includes(id));
    if (missing.length > 0) {
      console.warn("Missing item IDs for updateInvoice:", missing);
      return res.status(400).json({ ok: false, message: "One or more items invalid", missing });
    }


    // Build new lines with totals
    const newLines = items.map((line) => {
      const dbItem = dbItems.find((it) => it.id === line.itemId);
      const qty = Number(line.quantity || 0);
      const rate = Number(line.rate ?? dbItem.unitPrice ?? 0);
      const cgst = Number(line.cgst ?? dbItem.cgst ?? 0);
      const sgst = Number(line.sgst ?? dbItem.sgst ?? 0);
      const base = qty * rate;
      const gst = base * (cgst + sgst) / 100;
      const total = Math.round((base + gst + Number.EPSILON) * 100) / 100;
      return { ...line, quantity: qty, rate, cgst, sgst, total };
    });

    // Create map of existing lines by itemId for diffing
    const existingMap = {};
    for (const l of existing.items) {
      existingMap[l.itemId] = (existingMap[l.itemId] || 0) + Number(l.quantity || 0);
    }

    const newMap = {};
    for (const l of newLines) {
      newMap[l.itemId] = (newMap[l.itemId] || 0) + Number(l.quantity || 0);
    }

    // We'll compute stock changes: for each itemId, delta = newQty - oldQty
    const stockDeltas = {}; // positive -> need to decrement more (sold more), negative -> need to increment (restored)
    const itemIdSet = new Set([...Object.keys(existingMap), ...Object.keys(newMap)]);
    itemIdSet.forEach((itemId) => {
      const oldQ = Number(existingMap[itemId] || 0);
      const newQ = Number(newMap[itemId] || 0);
      stockDeltas[itemId] = newQ - oldQ;
    });

    // Compute new invoice total
    const totalAmount = newLines.reduce((s, l) => s + Number(l.total || 0), 0);

    const balanceDiff = totalAmount - existing.total;

    // Run transaction:
    const updated = await prisma.$transaction(async (tx) => {
      // 1) Update invoice main fields (party, total)
      await tx.invoice.update({
        where: { id },
        data: {
          partyId,
          total: totalAmount,
        },
      });

      // 2) Delete old invoice items
      await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });

      // 3) Create new invoice items
      for (const ln of newLines) {
        await tx.invoiceItem.create({
          data: {
            invoiceId: id,
            itemId: ln.itemId,
            quantity: ln.quantity,
            rate: ln.rate,
            cgst: ln.cgst,
            sgst: ln.sgst,
            total: ln.total,
          },
        });
      }

      // 4) Apply stock adjustments for each itemId (delta)
      // 4) Stock adjustments
      for (const [itemId, delta] of Object.entries(stockDeltas)) {
        if (delta === 0) continue;
        await tx.item.update({
          where: { id: itemId },
          data: {
            stock: delta > 0
              ? { decrement: delta }
              : { increment: Math.abs(delta) },
          },
        });
      }


      // 5️⃣ Adjust party balance correctly
      if (existing.partyId !== partyId) {
        // Invoice moved to a different party

        // Remove full amount from old party
        await tx.party.update({
          where: { id: existing.partyId },
          data: {
            balance: { decrement: existing.total },
          },
        });

        // Add full amount to new party
        await tx.party.update({
          where: { id: partyId },
          data: {
            balance: { increment: totalAmount },
          },
        });
      } else if (balanceDiff !== 0) {
        // Same party, only amount changed
        await tx.party.update({
          where: { id: partyId },
          data: {
            balance: { increment: balanceDiff },
          },
        });
      }

    });



    // Fetch updated invoice
    const invoiceWithItems = await prisma.invoice.findUnique({
      where: { id },
      include: { items: { include: { item: true } }, party: true },
    });



    return res.json({ ok: true, invoice: invoiceWithItems });
  } catch (err) {
    console.error("updateInvoice error", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
