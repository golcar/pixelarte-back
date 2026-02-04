"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_service_1 = require("../services/client.service");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_dto_1 = require("../middlewares/validate.dto");
const create_client_dto_1 = require("../dtos/create-client.dto");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authMiddleware, async (_, res) => {
    res.json(await client_service_1.clientService.findAll());
});
router.post("/", auth_middleware_1.authMiddleware, (0, validate_dto_1.validateDto)(create_client_dto_1.CreateClientDto), async (req, res) => {
    res.status(201).json(await client_service_1.clientService.create(req.body));
});
exports.default = router;
