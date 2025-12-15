import { Pedido } from 'src/pedido/entities/pedido.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

export enum StatusPag {
  PENDENTE = 'Pendente',
  PAGO = 'Pago',
  CANCELADO = 'Cancelado',
}

export enum Metodo {
  CARTAO = 'Cartão',
  BOLETO = 'Boleto',
  PIX = 'Pix',
}

@Entity()
export class Pagamento {
  @ApiProperty({
    example: 1,
    description: 'ID do pagamento',
  })
  @PrimaryGeneratedColumn()
  idPag: number;

  @ApiProperty({
    example: 199.99,
    description: 'Valor do pagamento',
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  valor: number;

  @ApiProperty({
    enum: StatusPag,
    example: StatusPag.PENDENTE,
    description: 'Status atual do pagamento',
  })
  @Column({
    type: 'enum',
    enum: StatusPag,
    default: StatusPag.PENDENTE,
  })
  statusPag: StatusPag;

  @ApiProperty({
    enum: Metodo,
    example: Metodo.PIX,
    description: 'Método utilizado para realizar o pagamento',
  })
  @Column({
    type: 'enum',
    enum: Metodo,
    default: Metodo.BOLETO,
  })
  metodoPag: Metodo;

  @ApiProperty({
    example: '2025-05-01T14:30:00.000Z',
    description: 'Data em que o pagamento foi realizado',
  })
  @CreateDateColumn()
  dataPag: Date;

  @ApiProperty({
    type: () => Pedido,
    description: 'Pedido associado a este pagamento',
  })
  @OneToOne(() => Pedido, (pedido) => pedido.pagamento)
  pedido: Pedido;
}
