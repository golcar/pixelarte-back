import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export const validateDto = (DtoClass: any) => {
    return async (req: any, res: any, next: any) => {
        const dto = plainToInstance(DtoClass, req.body);

        const errors = await validate(dto, {
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
