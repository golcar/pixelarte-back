import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ nullable: true })
    phone?: string;

}
