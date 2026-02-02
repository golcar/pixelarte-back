import { Router } from "express";
import { orderService } from "../services/order.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateDto } from "../middlewares/validate.dto";
import { CreateOrderDto } from "../dtos/create-order.dto";

const router = Router();

router.get("/", authMiddleware, async (_, res) => {
    res.json(await orderService.findAll());
});

router.post(
    "/",
    authMiddleware,
    validateDto(CreateOrderDto),
    async (req, res) => {
        const order = await orderService.create(req.body);
        res.status(201).json(order);
    }
);
router.patch(
    "/:id/status",
    authMiddleware,
    async (req, res) => {
        const id = Number(req.params.id);
        const { status } = req.body;

        const order = await orderService.updateStatus(id, status);
        res.json(order);
    }
);


export default router;
