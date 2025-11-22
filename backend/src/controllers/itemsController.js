const prisma = require("../utils/prismaClient");

/**
 * GET /api/items
 */
exports.getItems = async (req, res, next) => {
    try {
        let { page = 1, limit = 10, search = "" } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const where = search
            ? { name: { contains: search, mode: "insensitive" } }
            : {};

        let { sort = "updatedAt", order = "desc" } = req.query;

        const validSortFields = ["name", "unitPrice", "stock", "updatedAt", "createdAt"];
        if (!validSortFields.includes(sort)) sort = "updatedAt";
        if (!["asc", "desc"].includes(order)) order = "desc";

        const [items, total] = await Promise.all([
            prisma.item.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { [sort]: order },
            }),
            prisma.item.count({ where }),
        ]);


        const isAdmin = req.user.role === "ADMIN";

        // Clean / filter data based on role
        const filteredItems = items.map(item => {
            if (isAdmin) return item;

            // Hide sensitive fields from customers
            const { costPrice, ownerId, ...publicData } = item;
            return publicData;
        });

        res.json({
            ok: true,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            items: filteredItems,
        });


    } catch (err) {
        next(err);
    }
};


/**
 * POST /api/items
 */
exports.addItem = async (req, res, next) => {
    try {
        const { name, unitPrice, stock, cgst, sgst, hsnCode, description, costPrice, sku } = req.body;

        if (!name || !unitPrice) {
            return res.status(400).json({ ok: false, message: "Name and unitPrice are required" });
        }

        const item = await prisma.item.create({
            data: {
                name,
                unitPrice,
                stock: stock || 0,
                cgst: cgst || 0,
                sgst: sgst || 0,
                hsnCode: hsnCode || null,
                description: description || null,
                costPrice: costPrice || null,
                sku: sku || null,
                ownerId: req.user.id,
            },
        });

        res.status(201).json({ ok: true, item });

    } catch (err) {
        next(err);
    }
};


/**
 * PUT /api/items/:id
 */
exports.updateItem = async (req, res, next) => {
    try {
        const { name, price, stock } = req.body;

        const item = await prisma.item.update({
            where: { id: req.params.id },
            data: { name, price, stock },
        });

        res.json({ ok: true, item });
    } catch (err) {
        next(err);
    }
};

/**
 * DELETE /api/items/:id
 */
exports.deleteItem = async (req, res, next) => {
    try {
        await prisma.item.delete({
            where: { id: req.params.id },
        });

        res.json({ ok: true, message: "Item deleted successfully" });
    } catch (err) {
        next(err);
    }
};
