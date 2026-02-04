"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = require("../services/auth.service");
const validate_dto_1 = require("../middlewares/validate.dto");
const login_dto_1 = require("../dtos/login.dto");
const router = (0, express_1.Router)();
router.post("/login", (0, validate_dto_1.validateDto)(login_dto_1.LoginDto), async (req, res) => {
    try {
        const result = await auth_service_1.authService.login(req.body.email, req.body.password);
        res.json(result);
    }
    catch (error) {
        res.status(401).json({ message: "Invalid credentials" });
    }
});
exports.default = router;
