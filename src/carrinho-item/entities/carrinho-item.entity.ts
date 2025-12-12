import { ApiProperty } from '@nestjs/swagger';
import { Produto } from 'src/produto/entities/produto.entity';
import { Carrinho } from 'src/carrinho/entities/carrinho.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';

@Entity()
export class CarrinhoItem {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  idItem: number;

  @ApiProperty()
  @Column({ type: 'int', nullable: false })
  quantidade: number;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  subtotal: number;

  @ApiProperty({ type: () => Produto })
  @ManyToOne(() => Produto, (produto) => produto.itemPedidos, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'id_produto' })
  produto: Produto;

  @ApiProperty({ type: () => Carrinho })
  @ManyToOne(() => Carrinho, (carrinho) => carrinho.itens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_carrinho' })
  carrinho: Carrinho;
}