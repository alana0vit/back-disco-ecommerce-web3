import { Pedido } from 'src/pedido/entities/pedido.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';

export enum StatusPag {
  PENDENTE = 'Pendente',
  PAGO = 'Pago',
  CANCELADO = 'Cancelado',
}

enum Metodo {
  CARTAO = 'Cartão',
  BOLETO = 'Boleto',
  PIX = 'Pix',
}

@Entity()
export class Pagamento {
  @PrimaryGeneratedColumn()
  idPag: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  valor: number;

  @Column({
    type: 'enum',
    enum: StatusPag,
    default: StatusPag.PENDENTE,
  })
  statusPag: StatusPag;

  @Column({
    type: 'enum',
    enum: Metodo,
    default: Metodo.BOLETO,
  })
  metodoPag: Metodo;

  @CreateDateColumn()
  dataPag: Date;

  @OneToOne(() => Pedido, (pedido) => pedido.pagamento)
  pedido: Pedido;
}
