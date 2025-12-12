import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Produto } from 'src/produto/entities/produto.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CarrinhoItem } from 'src/carrinho-item/entities/carrinho-item.entity';

@Entity()
export class ItemPedido {
  @ApiProperty({ example: 1, description: 'ID do item do pedido' })
  @PrimaryGeneratedColumn()
  idItem: number;

  @ApiProperty({
    example: 2,
    description: 'Quantidade do produto neste item do pedido',
  })
  @Column({ nullable: false, type: 'int' })
  quantidade: number;

  @ApiProperty({
    example: 49.90,
    description: 'Valor unitário do produto no momento da compra',
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  valorUnitario: number;

  @ApiProperty({
    example: 99.80,
    description: 'Valor total (quantidade x valor unitário)',
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  valorTotal: number;

  @ApiProperty({
    type: () => Produto,
    description: 'Produto associado a este item do pedido',
  })
  @ManyToOne(() => Produto, (produto) => produto.itemPedidos, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_produto_itpdd' })
  produto: Produto;

  @ApiProperty({
    type: () => Pedido,
    description: 'Pedido ao qual este item pertence',
  })
  @ManyToOne(() => Pedido, (pedido) => pedido.itemPedidos, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_pedido_itpdd' })
  pedido: Pedido;

  @ApiProperty({
    type: () => CarrinhoItem,
    description: 'Itens do pedido',
  })
  @ManyToOne(() => CarrinhoItem, (ci) => ci.itemPedidos, { eager: false })
  carrinhoItem: CarrinhoItem;

}