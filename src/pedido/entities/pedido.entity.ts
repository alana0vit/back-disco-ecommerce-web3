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

enum Status {
  ABERTO = 'Aberto',
  AGUARDANDO = 'Aguardando pagamento',
  PAGO = 'Pago',
  CANCELADO = 'Cancelado',
}

@Entity()
export class Pedido {
  @PrimaryGeneratedColumn()
  idPedido: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ABERTO,
  })
  statusPedido: Status;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  valorTotal: number;

  @Column({ type: 'int', nullable: false })
  qtdTotal: number;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @CreateDateColumn()
  dataPedido: Date;

  @ManyToOne(() => Cliente, (cliente) => cliente.pedidos, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_cliente_pdd' })
  cliente: Cliente;

  @OneToMany(() => ItemPedido, (itemPedido) => itemPedido.pedido, {
    cascade: true,
    eager: false,
  })
  itemPedidos: ItemPedido[];

  @OneToOne(() => Pagamento, (pagamento) => pagamento.pedido, {
    cascade: true,
    eager: false,
    nullable: true,
  })
  @JoinColumn()
  pagamento: Pagamento;

  @ManyToOne(() => Endereco, (endereco) => endereco.pedido, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_endereco_pdd' })
  endereco?: Endereco;
}
