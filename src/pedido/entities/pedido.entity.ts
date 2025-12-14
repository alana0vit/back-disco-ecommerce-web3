import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Endereco } from 'src/endereco/entities/endereco.entity';
import { ItemPedido } from 'src/item-pedido/entities/item-pedido.entity';
import { Pagamento } from 'src/pagamento/entities/pagamento.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { Carrinho } from 'src/carrinho/entities/carrinho.entity';

export enum Status {
  ABERTO = 'Aberto',
  AGUARDANDO = 'Aguardando pagamento',
  PAGO = 'Pago',
  CANCELADO = 'Cancelado',
}

@Entity()
export class Pedido {
  @ApiProperty({
    example: 1,
    description: 'ID do pedido',
  })
  @PrimaryGeneratedColumn()
  idPedido: number;

  @ApiProperty({
    enum: Status,
    example: Status.ABERTO,
    description: 'Status atual do pedido',
  })
  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ABERTO,
  })
  statusPedido: Status;

  @ApiProperty({
    example: 350.5,
    description: 'Valor total do pedido',
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  valorTotal: number;

  @ApiProperty({
    example: 3,
    description: 'Quantidade total de itens no pedido',
  })
  @Column({ type: 'int', nullable: false })
  qtdTotal: number;

  @ApiProperty({
    example: 'Pedido realizado via aplicativo',
    required: false,
    description: 'Descrição adicional do pedido',
  })
  @Column({ type: 'text', nullable: true })
  descricao: string;

  @ApiProperty({
    example: '2025-05-01T14:30:00.000Z',
    description: 'Data em que o pedido foi criado',
  })
  @CreateDateColumn()
  dataPedido: Date;

  @ApiProperty({
    type: () => Cliente,
    description: 'Cliente responsável pelo pedido',
  })
  @ManyToOne(() => Cliente, (cliente) => cliente.pedidos, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_cliente_pdd' })
  cliente: Cliente;

  @ApiProperty({
    type: () => [ItemPedido],
    description: 'Lista de itens vinculados ao pedido',
  })
  @OneToMany(() => ItemPedido, (itemPedido) => itemPedido.pedido, {
    cascade: true,
    eager: false,
  })
  itemPedidos: ItemPedido[];

  @ApiProperty({
    type: () => Pagamento,
    required: false,
    description: 'Pagamento vinculado ao pedido',
  })
  @OneToOne(() => Pagamento, (pagamento) => pagamento.pedido, {
    cascade: true,
    eager: false,
    nullable: true,
  })
  @JoinColumn()
  pagamento: Pagamento;

  @ApiProperty({
    type: () => Carrinho,
    description: 'Carrinho é a origem do pedido',
  })
  @OneToOne(() => Carrinho, (carrinho) => carrinho.pedido, { eager: false })
  @JoinColumn()
  carrinho: Carrinho;

  @ApiProperty({
    type: () => Endereco,
    description: 'Endereço de entrega do pedido',
  })
  @ManyToOne(() => Endereco, (endereco) => endereco.pedido, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_endereco_pdd' })
  endereco?: Endereco;
}