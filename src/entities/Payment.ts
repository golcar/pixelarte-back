import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
} from "typeorm";
import { Order } from "./Order";

export type PaymentMethod = "CASH" | "TRANSFER" | "CARD" | "DEPOSIT";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Order, (order) => order.payments, {
        nullable: false,
        onDelete: "CASCADE",
    })
    order!: Order;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    amount!: number;

    @Column({ type: "varchar", length: 30, default: "cash" })
    paymentMethod!: PaymentMethod;

    @Column({ type: "varchar", length: 100, nullable: true })
    reference?: string;

    @Column({ type: "text", nullable: true })
    notes?: string;

    @CreateDateColumn()
    createdAt!: Date;
}