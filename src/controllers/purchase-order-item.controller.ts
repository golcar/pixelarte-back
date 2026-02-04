import { Router, Request, Response } from "express";
import { validateDto } from "../middlewares/validate.dto";
import { CreatePurchaseOrderDto } from "../dtos/create-purchase-order.dto";
import { PurchaseOrderItemService } from "../services/purchase-order-item.service";
import {UpdatePurchaseOrderStatusDto} from "../dtos/update-purchase-order-status.dto";

const router = Router();
const service = new PurchaseOrderItemService();

router.post(
    "/:purchaseOrderId/items",
    validateDto(CreatePurchaseOrderDto),
    async (req: Request, res: Response) => {
        try {
            const purchaseOrderId = Number(req.params.purchaseOrderId);
            const result = await service.addItem(purchaseOrderId, req.body);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
);
router.get("/pending/:orderId", async (req: Request, res: Response) => {
    try {
        const orderId = Number(req.params.orderId);

        if (Number.isNaN(orderId)) {
            return res.status(400).json({
                message: "orderId inválido",
            });
        }
        const pending = await service.getPendingByOrder(orderId);

        return res.status(200).json(pending);
    } catch (error: any) {
        console.error("❌ Error en /pending/:orderId", error);

        return res.status(400).json({
            message: error.message ?? "Error al obtener pendientes",
        });
    }
});


router.patch(
    "/:purchaseOrderId/status",
    validateDto(UpdatePurchaseOrderStatusDto),
    async (req: Request, res: Response) => {
        try {
            const purchaseOrderId = Number(req.params.purchaseOrderId);
            const { status } = req.body;

            const result = await service.updateStatus(purchaseOrderId, status);
            res.json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
);
router.get(
    "/:orderId/items",
    async (req: Request, res: Response) => {
        try {
            const orderId = Number(req.params.orderId);
            const result = await service.getItemsByOrder(orderId);
            res.json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
);
router.delete(
    "/items/:itemId",
    async (req: Request, res: Response) => {
        try {
            const itemId = Number(req.params.itemId);
            await service.deleteItem(itemId);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
);



export default router;
