import { Router, Request, Response } from "express";
import { authService } from "../services/auth.service";
import { validateDto } from "../middlewares/validate.dto";
import { LoginDto } from "../dtos/login.dto";

const router = Router();

router.post(
    "/login",
    validateDto(LoginDto),
    async (req: Request, res: Response) => {
        try {
            const result = await authService.login(
                req.body.email,
                req.body.password
            );
            res.json(result);
        } catch (error) {
            res.status(401).json({ message: "Invalid credentials" });
        }
    }
);

export default router;
