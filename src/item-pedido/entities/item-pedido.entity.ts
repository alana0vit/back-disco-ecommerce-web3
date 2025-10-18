import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Double } from "typeorm/browser";

@Entity()
export class ItemPedido {
    @PrimaryGeneratedColumn()
    idItem: number;

    @Column({nullable: false, type: 'int'})
    quantidade: number;

    @Column({nullable: false})
    valorUnitario: Double;

    @Column({nullable: false})
    valorTotal: Double;
}