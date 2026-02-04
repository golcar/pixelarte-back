"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_service_1 = require("../services/order.service");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_dto_1 = require("../middlewares/validate.dto");
const create_order_dto_1 = require("../dtos/create-order.dto");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authMiddleware, async (_, res) => {
    res.json(await order_service_1.orderService.findAll());
});
router.post("/", auth_middleware_1.authMiddleware, (0, validate_dto_1.validateDto)(create_order_dto_1.CreateOrderDto), async (req, res) => {
    const order = await order_service_1.orderService.create(req.body);
    res.status(201).json(order);
});
router.patch("/:id/status", auth_middleware_1.authMiddleware, async (req, res) => {
    const id = Number(req.params.id);
    const { status } = req.body;
    const order = await order_service_1.orderService.updateStatus(id, status);
    res.json(order);
});
exports.default = router;
