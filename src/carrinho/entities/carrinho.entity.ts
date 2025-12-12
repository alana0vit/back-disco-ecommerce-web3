import { ApiProperty } from '@nestjs/swagger';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { CarrinhoItem } from 'src/carrinho-item/entities/carrinho-item.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  Column,
} from 'typeorm';

@Entity()
export class Carrinho {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  idCarrinho: number;

  @ApiProperty({ description: 'Total acumulado do carrinho' })
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total: number;

  @ApiProperty({ type: () => Cliente })
  @OneToOne(() => Cliente, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;

  @ApiProperty({ type: () => [CarrinhoItem] })
  @OneToMany(() => CarrinhoItem, (item) => item.carrinho, {
    cascade: true,
    eager: true,
  })
  itens: CarrinhoItem[];
}