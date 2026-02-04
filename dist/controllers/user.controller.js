"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_1 = require("../services/user.service");
const create_user_dto_1 = require("../dtos/create-user.dto");
const validate_dto_1 = require("../middlewares/validate.dto");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/", (0, validate_dto_1.validateDto)(create_user_dto_1.CreateUserDto), async (req, res) => {
    const user = await user_service_1.userService.create(req.body);
    res.status(201).json(user);
});
router.get("/", auth_middleware_1.authMiddleware, async (_, res) => {
    const users = await user_service_1.userService.findAll();
    res.json(users);
});
router.get("/:id", auth_middleware_1.authMiddleware, async (req, res) => {
    const user = await user_service_1.userService.findById(Number(req.params.id));
    if (!user)
        return res.status(404).json({ message: "User not found" });
    res.json(user);
});
router.delete("/:id", auth_middleware_1.authMiddleware, async (req, res) => {
    await user_service_1.userService.delete(Number(req.params.id));
    res.status(204).send();
});
exports.default = router;
