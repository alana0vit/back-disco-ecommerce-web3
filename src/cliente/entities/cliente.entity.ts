import { Endereco } from 'src/endereco/entities/endereco.entity';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

export enum Role {
  Cliente = 'CLIENTE',
  Admin = 'ADMIN',
}
@Entity()
export class Cliente {
  @PrimaryGeneratedColumn()
  idCliente: number;

  @Column({ nullable: false })
  nome: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  senha: string;

  @Column({ nullable: true })
  telefone?: string;

  @CreateDateColumn()
  dataCadastro: Date;

  @Column({ default: true })
  ativo: boolean;

  @Column({ type: 'enum', enum: Role, default: Role.Cliente })
  role: Role;

  @Column({ nullable: false, type: 'date' })
  dataNasc: Date;

  @OneToMany(() => Endereco, (endereco) => endereco.cliente, {
    cascade: true,
    eager: false,
  })
  enderecos: Endereco[];

  @OneToMany(() => Pedido, (pedido) => pedido.cliente, {
    cascade: true,
    eager: false,
  })
  pedidos: Pedido[];
}
