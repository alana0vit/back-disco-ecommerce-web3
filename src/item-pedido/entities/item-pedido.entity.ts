import { Pedido } from "src/pedido/entities/pedido.entity";
import { Produto } from "src/produto/entities/produto.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Double } from "typeorm/browser";

@Entity()
export class ItemPedido {
    @PrimaryGeneratedColumn()
    idItem: number;

    @Column({ nullable: false, type: 'int' })
    quantidade: number;

    @Column({ nullable: false })
    valorUnitario: Double;

    @Column({ nullable: false })
    valorTotal: Double;

    @ManyToOne(() => Produto, produto => produto.itemPedidos, {
        nullable: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "id_produto_itpdd" })
    produto: Produto;

    @ManyToOne(() => Pedido, pedido => pedido.itemPedidos, {
        nullable: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "id_pedido_itpdd" })
    pedido: Pedido;
}