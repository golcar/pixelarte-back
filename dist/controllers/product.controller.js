"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_service_1 = require("../services/product.service");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_dto_1 = require("../middlewares/validate.dto");
const create_product_dto_1 = require("../dtos/create-product.dto");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authMiddleware, async (_, res) => {
    res.json(await product_service_1.productService.findAll());
});
router.post("/", auth_middleware_1.authMiddleware, (0, validate_dto_1.validateDto)(create_product_dto_1.CreateProductDto), async (req, res) => {
    res.status(201).json(await product_service_1.productService.create(req.body));
});
router.put('/:id', auth_middleware_1.authMiddleware, async (req, res) => {
    const id = Number(req.params.id);
    const updated = await product_service_1.productService.update(id, req.body);
    res.json(updated);
});
router.patch('/:id/active', auth_middleware_1.authMiddleware, async (req, res) => {
    const id = Number(req.params.id);
    const { active } = req.body;
    const updated = await product_service_1.productService.toggleActive(id, active);
    res.json(updated);
});
exports.default = router;
