import { ApiProperty } from '@nestjs/swagger';
import { Endereco } from 'src/endereco/entities/endereco.entity';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Carrinho } from 'src/carrinho/entities/carrinho.entity';
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
  @ApiProperty({
    example: 1,
    description: 'Identificador único do cliente',
  })
  @PrimaryGeneratedColumn()
  idCliente: number;

  @ApiProperty({
    example: 'Maria Silva',
    description: 'Nome completo do cliente',
  })
  @Column({ nullable: false })
  nome: string;

  @ApiProperty({
    example: 'maria@email.com',
    description: 'E-mail do cliente (único no sistema)',
  })
  @Column({ unique: true, nullable: false })
  email: string;

  @ApiProperty({
    example: '12345678',
    description: 'Senha do cliente (armazenada de forma segura)',
  })
  @Column({ nullable: false })
  senha: string;

  @ApiProperty({
    example: '(81) 99999-0000',
    description: 'Telefone para contato',
    required: false,
  })
  @Column({ nullable: true })
  telefone?: string;

  @ApiProperty({
    example: '2024-05-20T13:45:00.000Z',
    description: 'Data de cadastro do cliente',
  })
  @CreateDateColumn()
  dataCadastro: Date;

  @ApiProperty({
    example: true,
    description: 'Indica se o cliente está ativo no sistema',
  })
  @Column({ default: true })
  ativo: boolean;

  @ApiProperty({
    enum: Role,
    example: Role.Cliente,
    description: 'Perfil de acesso do usuário no sistema',
  })
  @Column({ type: 'enum', enum: Role, default: Role.Cliente })
  role: Role;

  @ApiProperty({
    example: '2002-10-15',
    description: 'Data de nascimento do cliente',
  })
  @Column({ nullable: false, type: 'date' })
  dataNasc: Date;

  @ApiProperty({
    type: () => [Endereco],
    description: 'Endereços cadastrados para o cliente',
  })
  @OneToMany(() => Endereco, (endereco) => endereco.cliente, {
    cascade: true,
    eager: false,
  })
  enderecos: Endereco[];

  @ApiProperty({
    type: () => [Pedido],
    description: 'Pedidos realizados pelo cliente',
  })
  @OneToMany(() => Pedido, (pedido) => pedido.cliente, {
    cascade: true,
    eager: false,
  })
  pedidos: Pedido[];

  // ➕➕➕ ADICIONADO AGORA (sem alterar mais nada)
  @ApiProperty({
    type: () => [Carrinho],
    description: 'Carrinhos associados ao cliente',
  })
  @OneToMany(() => Carrinho, (carrinho) => carrinho.cliente, {
    cascade: true,
    eager: false,
  })
  carrinhos: Carrinho[];
}