"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const validateDto = (DtoClass) => {
    return async (req, res, next) => {
        const dto = (0, class_transformer_1.plainToInstance)(DtoClass, req.body);
        const errors = await (0, class_validator_1.validate)(dto, {
            whitelist: true,
            forbidNonWhitelisted: false,
        });
        if (errors.length > 0) {
            return res.status(400).json({
                message: "Validation failed Backend",
                errors: errors.map(e => ({ field: e.property }))
            });
        }
        // 🔥 MUY IMPORTANTE
        req.body = dto;
        next();
    };
};
exports.validateDto = validateDto;
