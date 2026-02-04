"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const data_source_1 = require("../config/data-source");
const Order_1 = require("../entities/Order");
const Client_1 = require("../entities/Client");
class OrderService {
    constructor() {
        this.orderRepo = data_source_1.AppDataSource.getRepository(Order_1.Order);
        this.clientRepo = data_source_1.AppDataSource.getRepository(Client_1.Client);
    }
    // ======================
    // CREATE ORDER
    // ======================
    async create(dto) {
        const client = await this.clientRepo.findOneBy({ id: dto.clientId });
        if (!client) {
            throw new Error("Client not found");
        }
        // 🔥 total se calcula en backend
        const total = dto.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const order = this.orderRepo.create({
            client,
            items: dto.items, // JSON
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
    async updateStatus(id, status) {
        const order = await this.orderRepo.findOneBy({ id });
        if (!order)
            throw new Error("Order not found");
        order.status = status;
        return this.orderRepo.save(order);
    }
}
exports.orderService = new OrderService();
