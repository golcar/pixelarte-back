import { Entity,PrimaryGeneratedColumn,Column,ManyToOne,OneToMany,CreateDateColumn,} from 'typeorm';

import { PurchaseOrderItem } from './PurchaseOrderItem';
import {Order} from "./Order";

export type PurchaseOrderStatus = 'DRAFT' | 'ORDERED' | 'RECEIVED';

@Entity('purchase_orders')
export class PurchaseOrder {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Order, { nullable: false })
    order!: Order;

    @OneToMany(
        () => PurchaseOrderItem,
        item => item.purchaseOrder,
        { cascade: true }
    )
    items!: PurchaseOrderItem[];

    @Column({
        type: 'enum',
        enum: ['DRAFT', 'ORDERED', 'RECEIVED'],
        default: 'DRAFT',
    })
    status!: PurchaseOrderStatus;

    @CreateDateColumn()
    createdAt!: Date;
}
