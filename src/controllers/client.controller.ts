import { Router, Request, Response } from "express";
import { clientService } from "../services/client.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateDto } from "../middlewares/validate.dto";
import { CreateClientDto } from "../dtos/create-client.dto";

const router = Router();

router.get("/", authMiddleware, async (_:Request, res:Response) => {
    res.json(await clientService.findAll());
});

router.post(
    "/",
    authMiddleware,
    validateDto(CreateClientDto),
    async (req: Request, res: Response) => {
        res.status(201).json(await clientService.create(req.body));
    }
);

export default router;
