"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_dto_1 = require("../middlewares/validate.dto");
const create_purchase_order_dto_1 = require("../dtos/create-purchase-order.dto");
const purchase_order_item_service_1 = require("../services/purchase-order-item.service");
const update_purchase_order_status_dto_1 = require("../dtos/update-purchase-order-status.dto");
const router = (0, express_1.Router)();
const service = new purchase_order_item_service_1.PurchaseOrderItemService();
router.post("/:purchaseOrderId/items", (0, validate_dto_1.validateDto)(create_purchase_order_dto_1.CreatePurchaseOrderDto), async (req, res) => {
    try {
        const purchaseOrderId = Number(req.params.purchaseOrderId);
        const result = await service.addItem(purchaseOrderId, req.body);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.get("/pending/:orderId", async (req, res) => {
    try {
        const orderId = Number(req.params.orderId);
        if (Number.isNaN(orderId)) {
            return res.status(400).json({
                message: "orderId inválido",
            });
        }
        const pending = await service.getPendingByOrder(orderId);
        return res.status(200).json(pending);
    }
    catch (error) {
        console.error("❌ Error en /pending/:orderId", error);
        return res.status(400).json({
            message: error.message ?? "Error al obtener pendientes",
        });
    }
});
router.patch("/:purchaseOrderId/status", (0, validate_dto_1.validateDto)(update_purchase_order_status_dto_1.UpdatePurchaseOrderStatusDto), async (req, res) => {
    try {
        const purchaseOrderId = Number(req.params.purchaseOrderId);
        const { status } = req.body;
        const result = await service.updateStatus(purchaseOrderId, status);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.get("/:orderId/items", async (req, res) => {
    try {
        const orderId = Number(req.params.orderId);
        const result = await service.getItemsByOrder(orderId);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.delete("/items/:itemId", async (req, res) => {
    try {
        const itemId = Number(req.params.itemId);
        await service.deleteItem(itemId);
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.default = router;
