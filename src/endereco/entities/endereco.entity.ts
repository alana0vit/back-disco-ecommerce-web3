import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Endereco {
  @PrimaryGeneratedColumn()
  idEndereco: number;

  @Column({ nullable: false })
  rua: string;

  @Column({ nullable: false })
  bairro: string;

  @Column({ nullable: false })
  cidade: string;

  @Column({ type: 'int', nullable: false })
  numCasa: number;

  @Column()
  complemento: string;

  @Column({ nullable: false })
  estado: string;

  @Column({ nullable: false })
  cep: string;

  @Column({ default: false })
  padrao: boolean;

  @ManyToOne(() => Cliente, (cliente) => cliente.enderecos, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'idCliente' })
  cliente: Cliente;

  @OneToMany(() => Pedido, (pedido) => pedido.endereco, {
    cascade: true,
    eager: false,
  })
  pedido: Pedido[];
}
