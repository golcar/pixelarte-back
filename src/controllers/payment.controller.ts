import { Router, Request, Response } from "express";
import { paymentService } from "../services/payment.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateDto } from "../middlewares/validate.dto";
import { CreatePaymentDto } from "../dtos/create-payment.dto";

const router = Router();

router.get(
    "/order/:orderId",
    authMiddleware,
    async (req: Request, res: Response) => {
        const orderId = Number(req.params.orderId);
        res.json(await paymentService.findByOrder(orderId));
    }
);

router.get(
    "/order/:orderId/summary",
    authMiddleware,
    async (req: Request, res: Response) => {
        const orderId = Number(req.params.orderId);
        res.json(await paymentService.getSummary(orderId));
    }
);

router.post(
    "/order/:orderId",
    authMiddleware,
    validateDto(CreatePaymentDto),
    async (req: Request, res: Response) => {
        const orderId = Number(req.params.orderId);
        const payment = await paymentService.create(orderId, req.body);
        res.status(201).json(payment);
    }
);

export default router;