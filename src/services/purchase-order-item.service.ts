import { AppDataSource } from "../config/data-source";
import { PurchaseOrder } from "../entities/PurchaseOrder";
import { PurchaseOrderItem } from "../entities/PurchaseOrderItem";
import { Product } from "../entities/Product";
import {Order} from "../entities/Order";

export class PurchaseOrderItemService {
    private poRepo = AppDataSource.getRepository(PurchaseOrder);
    private itemRepo = AppDataSource.getRepository(PurchaseOrderItem);
    private productRepo = AppDataSource.getRepository(Product);

    async addItem(orderId: number, dto: any) {
        const orderRepo = AppDataSource.getRepository(Order);
        const order = await orderRepo.findOne({
            where: { id: orderId },
        });

        if (!order) {
            throw new Error("Orden no encontrada");
        }

        // 2️⃣ Buscar o crear PurchaseOrder
        let purchaseOrder = await this.poRepo.findOne({
            where: { order: { id: orderId } },
            relations: ["order"],
        });

        if (!purchaseOrder) {
            purchaseOrder = this.poRepo.create({
                order,
                status: "DRAFT",
            });
            await this.poRepo.save(purchaseOrder);
        }

        // 3️⃣ Validar estado
        if (purchaseOrder.status !== "DRAFT") {
            throw new Error("La orden de compra no es editable");
        }

        const product = await this.productRepo.findOneBy({
            id: dto.productId,
        });

        if (!product) {
            throw new Error("Producto no encontrado");
        }

        /** 🔹 Buscar producto en la Order original (JSON) */
        const orderedItem = purchaseOrder.order.items.find(
            (i: any) => i.productId === dto.productId
        );

        if (!orderedItem) {
            throw new Error("El producto no existe en la orden original");
        }

        const orderedQty = orderedItem.quantity;

        /** 🔹 Cantidad ya surtida */
        const result = await this.itemRepo
            .createQueryBuilder("item")
            .leftJoin("item.purchaseOrder", "po")
            .where("po.order = :orderId", {
                orderId: purchaseOrder.order.id,
            })
            .andWhere("item.productId = :productId", {
                productId: dto.productId,
            })
            .select("SUM(item.quantity)", "sum")
            .getRawOne();

        const purchasedQty = Number(result?.sum) || 0;

        if (purchasedQty + dto.quantity > orderedQty) {
            throw new Error("La cantidad supera lo solicitado en la orden");
        }

        let existingItem = await this.itemRepo.findOne({
            where: {
                purchaseOrder: { id: purchaseOrder.id },
                product: { id: dto.productId },
                color: dto.color,
                size: dto.size,
                cut: dto.cut,
            },
        });

// 🔢 Cantidad ya surtida (incluyendo este item)
        const newQty =
            (existingItem?.quantity ?? 0) + dto.quantity;

// ❌ Validar que no supere lo pedido
        if (purchasedQty + dto.quantity > orderedQty) {
            throw new Error("La cantidad supera lo solicitado en la orden");
        }

// 🟢 Si existe, sumar
        if (existingItem) {
            existingItem.quantity = newQty;
            return this.itemRepo.save(existingItem);
        }

// 🟢 Si no existe, crear nuevo
        const item = this.itemRepo.create({
            purchaseOrder,
            product,
            color: dto.color,
            size: dto.size,
            cut: dto.cut,
            quantity: dto.quantity,
        });

        return this.itemRepo.save(item);
    }
    async getPendingByOrder(orderId: number) {
        const orderRepo = AppDataSource.getRepository(Order);

        const order = await orderRepo.findOne({
            where: { id: orderId },
        });

        if (!order) {
            throw new Error("Orden no encontrada");
        }

        // 🔒 NORMALIZACIÓN ABSOLUTA
        let items: any[] = [];

        if (Array.isArray(order.items)) {
            items = order.items;
        } else if (typeof order.items === "string") {
            try {
                items = JSON.parse(order.items);
            } catch {
                items = [];
            }
        } else {
            items = [];
        }

        const pending = [];

        for (const item of items) {
            const result = await this.itemRepo
                .createQueryBuilder("item")
                .leftJoin("item.purchaseOrder", "po")
                .where("po.order = :orderId", { orderId })
                .andWhere("item.productId = :productId", {
                    productId: item.productId,
                })
                .select("COALESCE(SUM(item.quantity), 0)", "sum")
                .getRawOne();

            const purchasedQty = Number(result.sum);

            pending.push({
                productId: item.productId,
                orderedQty: item.quantity,
                purchasedQty,
                pendingQty: Math.max(item.quantity - purchasedQty, 0),
            });
        }

        return pending;
    }



    async updateStatus(purchaseOrderId: number, newStatus: "DRAFT" | "ORDERED" | "RECEIVED") {
    const po = await this.poRepo.findOne({
        where: { id: purchaseOrderId },
        relations: ["order"],
    });

    if (!po) {
        throw new Error("Orden de compra no encontrada");
    }

    const currentStatus = po.status;

    // ❌ No permitir cambios si ya está RECEIVED
    if (currentStatus === "RECEIVED") {
        throw new Error("La orden de compra ya fue recibida");
    }

    // ❌ Validar flujo
    const validTransitions: Record<string, string> = {
        DRAFT: "ORDERED",
        ORDERED: "RECEIVED",
    };

    if (validTransitions[currentStatus] !== newStatus) {
        throw new Error(
            `Transición inválida de ${currentStatus} a ${newStatus}`
        );
    }

    // 🔒 Regla extra: no marcar RECEIVED si hay pendiente
    if (newStatus === "RECEIVED") {
        const pending = await this.getPendingByOrder(po.order.id);
        const hasPending = pending.some(p => p.pendingQty > 0);

        if (hasPending) {
            throw new Error(
                "No se puede marcar como RECEIVED: aún hay productos pendientes por surtir"
            );
        }
    }

    po.status = newStatus;
    return this.poRepo.save(po);
}
async getItemsByOrder(orderId: number) {
    const purchaseOrder = await this.poRepo.findOne({
        where: { order: { id: orderId } },
        relations: ["items", "items.product"],
    });

    if (!purchaseOrder) {
        return [];
    }

    return purchaseOrder.items;
}
    async deleteItem(itemId: number) {
        const item = await this.itemRepo.findOne({
            where: { id: itemId },
            relations: ["purchaseOrder"],
        });

        if (!item) {
            throw new Error("Item no encontrado");
        }

        if (item.purchaseOrder.status !== "DRAFT") {
            throw new Error("No se puede eliminar en este estado");
        }

        await this.itemRepo.remove(item);
    }



}
