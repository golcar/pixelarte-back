import { Router, Request, Response } from "express";
import { userService } from "../services/user.service";
import { CreateUserDto } from "../dtos/create-user.dto";
import { validateDto } from "../middlewares/validate.dto";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post(
    "/",
    validateDto(CreateUserDto),
    async (req: Request, res: Response) => {
        const user = await userService.create(req.body);
        res.status(201).json(user);
    }
);

router.get(
    "/",
    authMiddleware,
    async (_: Request, res: Response) => {
        const users = await userService.findAll();
        res.json(users);
    }
);

router.get(
    "/:id",
    authMiddleware,
    async (req: Request, res: Response) => {
        const user = await userService.findById(Number(req.params.id));
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    }
);

router.delete(
    "/:id",
    authMiddleware,
    async (req: Request, res: Response) => {
        await userService.delete(Number(req.params.id));
        res.status(204).send();
    }
);


export default router;
