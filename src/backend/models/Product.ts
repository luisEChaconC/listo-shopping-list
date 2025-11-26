import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid", nullable: true })
    user_id!: string | null;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user?: User | null;

    @Column({ type: "varchar", length: 100 })
    name!: string;

    @Column({ type: "boolean", default: false })
    is_predefined!: boolean;
}
