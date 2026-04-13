import { AppDataSource } from "../config/data-source";
import { Order } from "../entities/Order";
import { Client } from "../entities/Client";
import { CreateOrderDto } from "../dtos/create-order.dto";

class OrderService {
    private orderRepo = AppDataSource.getRepository(Order);
    private clientRepo = AppDataSource.getRepository(Client);

    // ======================
    // CREATE ORDER
    // ======================
    async create(dto: CreateOrderDto) {
        const client = await this.clientRepo.findOneBy({ id: dto.clientId });
        if (!client) {
            throw new Error("Client not found");
        }

        const total = dto.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const order = this.orderRepo.create({
            client,
            items: dto.items,
            total,
            status: "NEW",
            deliveryCommitmentDate: dto.deliveryCommitmentDate,
        });

        return this.orderRepo.save(order);
    }

    // ======================
    // READ
    // ======================
    async findAll() {
        const orders = await this.orderRepo.find({
            relations: ["client", "payments"],
            order: { id: "DESC" },
        });

        return orders.map((order) => {
            const paid = (order.payments || []).reduce(
                (sum, payment) => sum + Number(payment.amount),
                0
            );

            const total = Number(order.total || 0);
            const pending = total - paid;

            let paymentStatus: "pending" | "partial" | "paid" = "pending";

            if (paid > 0 && pending > 0) paymentStatus = "partial";
            if (pending === 0 && total > 0) paymentStatus = "paid";

            return {
                ...order,
                paid,
                pending,
                paymentStatus,
            };
        });
    }

    async updateStatus(
        id: number,
        status: "NEW" | "IN_PROGRESS" | "FINISHED" | "DELIVERED"
    ) {
        const order = await this.orderRepo.findOneBy({ id });
        if (!order) throw new Error("Order not found");

        order.status = status;
        return this.orderRepo.save(order);
    }
}

export const orderService = new OrderService();