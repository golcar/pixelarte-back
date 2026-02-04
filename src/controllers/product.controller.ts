import { Router, Request, Response } from "express";
import { productService } from "../services/product.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateDto } from "../middlewares/validate.dto";
import { CreateProductDto } from "../dtos/create-product.dto";

const router = Router();

router.get("/", authMiddleware, async (_:Request, res:Response) => {
    res.json(await productService.findAll());
});

router.post(
    "/",
    authMiddleware,
    validateDto(CreateProductDto),
    async (req: Request, res: Response) => {
        res.status(201).json(await productService.create(req.body));
    }
);
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const updated = await productService.update(id, req.body);
    res.json(updated);
});
router.patch('/:id/active', authMiddleware, async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { active } = req.body;

    const updated = await productService.toggleActive(id, active);
    res.json(updated);
});


export default router;
