import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { PurchaseOrder } from './PurchaseOrder';
import {Product} from "./Product";

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL';
export type Cut = 'HOMBRE' | 'MUJER' | 'NIÑO' | 'JUVENIL';

@Entity('purchase_order_items')
export class PurchaseOrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
      () => PurchaseOrder,
      po => po.items,
      { onDelete: 'CASCADE', nullable: false }
  )
  purchaseOrder!: PurchaseOrder;

  @ManyToOne(() => Product, { nullable: false })
  product!: Product;

  @Column()
  color!: string;

  @Column({
    type: 'enum',
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
  })
  size!: Size;

  @Column({
    type: 'enum',
    enum: ['HOMBRE', 'MUJER', 'NIÑO', 'JUVENIL'],
  })
  cut!: Cut;

  @Column('int')
  quantity!: number;
}
