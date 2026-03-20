import { AppDataSource } from "../config/data-source";
import { Payment } from "../entities/Payment";
import { Order } from "../entities/Order";
import { CreatePaymentDto } from "../dtos/create-payment.dto";

class PaymentService {
    private paymentRepository = AppDataSource.getRepository(Payment);
    private orderRepository = AppDataSource.getRepository(Order);

    async findByOrder(orderId: number) {
        return await this.paymentRepository.find({
            where: {
                order: { id: orderId },
            },
            relations: ["order"],
            order: {
                createdAt: "DESC",
            },
        });
    }

    async create(orderId: number, data: CreatePaymentDto) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ["payments"],
        });

        if (!order) {
            throw new Error("Pedido no encontrado");
        }

        const totalPaid = (order.payments || []).reduce(
            (sum, payment) => sum + Number(payment.amount),
            0
        );

        const orderTotal = Number(order.total || 0);
        const newTotalPaid = totalPaid + Number(data.amount);

        if (newTotalPaid > orderTotal) {
            throw new Error("El abono no puede ser mayor al saldo pendiente");
        }

        const payment = this.paymentRepository.create({
            order,
            amount: Number(data.amount),
            paymentMethod: data.paymentMethod || "CASH",
            reference: data.reference,
            notes: data.notes,
        });

        return await this.paymentRepository.save(payment);
    }

    async getSummary(orderId: number) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ["payments"],
        });

        if (!order) {
            throw new Error("Pedido no encontrado");
        }

        const total = Number(order.total || 0);

        const paid = (order.payments || []).reduce(
            (sum, payment) => sum + Number(payment.amount),
            0
        );

        const pending = total - paid;

        let paymentStatus: "pending" | "partial" | "paid" = "pending";

        if (paid > 0 && pending > 0) paymentStatus = "partial";
        if (pending === 0 && total > 0) paymentStatus = "paid";

        return {
            orderId: order.id,
            total,
            paid,
            pending,
            paymentStatus,
            payments: order.payments,
        };
    }
}

export const paymentService = new PaymentService();