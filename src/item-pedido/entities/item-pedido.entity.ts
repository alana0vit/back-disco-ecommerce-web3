import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Produto } from 'src/produto/entities/produto.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class ItemPedido {
  @PrimaryGeneratedColumn()
  idItem: number;

  @Column({ nullable: false, type: 'int' })
  quantidade: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  valorUnitario: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  valorTotal: number;

  @ManyToOne(() => Produto, (produto) => produto.itemPedidos, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_produto_itpdd' })
  produto: Produto;

  @ManyToOne(() => Pedido, (pedido) => pedido.itemPedidos, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_pedido_itpdd' })
  pedido: Pedido;
}
