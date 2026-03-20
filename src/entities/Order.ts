import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn, OneToMany,
} from "typeorm";
import { Payment } from "./Payment";
import { Client } from "./Client";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id!: number;

    // ======================
    // RELATION
    // ======================
    @ManyToOne(() => Client, { nullable: false })
    client!: Client;

    // ======================
    // ITEMS (JSON)
    // ======================
    @Column({ type: "jsonb", default: [] })
    items!: {
        productId: number;
        quantity: number;
        price: number;
        description?: string;
    }[];

    // ======================
    // TOTAL
    // ======================
    @Column("decimal")
    total!: number;

    // ======================
    // STATUS
    // ======================
    @Column({ default: "NEW" })
    status!: "NEW" | "IN_PROGRESS" | "FINISHED" | "DELIVERED";

    // ======================
    // DELIVERY COMMITMENT DATE
    // ======================
    @Column({ type: "date", nullable: true })
    deliveryCommitmentDate?: string;

    // ======================
    // DATE
    // ======================
    @CreateDateColumn()
    createdAt!: Date;

    @OneToMany(() => Payment, (payment) => payment.order)
    payments!: Payment[];
}