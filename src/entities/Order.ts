import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
} from "typeorm";
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
    // DATE
    // ======================
    @CreateDateColumn()
    createdAt!: Date;
}
