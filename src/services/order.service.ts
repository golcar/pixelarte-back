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

        // 🔥 total se calcula en backend
        const total = dto.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const order = this.orderRepo.create({
            client,
            items: dto.items,   // JSON
            total,
            status: "NEW",
        });

        return this.orderRepo.save(order);
    }

    // ======================
    // READ
    // ======================
    findAll() {
        return this.orderRepo.find({
            relations: ["client"],
            order: { id: "DESC" },
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
