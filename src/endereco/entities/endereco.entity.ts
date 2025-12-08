import { ApiProperty } from '@nestjs/swagger';
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

  @ApiProperty({
    example: 1,
    description: 'Identificador único do endereço',
  })
  @PrimaryGeneratedColumn()
  idEndereco: number;

  @ApiProperty({
    example: 'Rua das Flores',
    description: 'Nome da rua do endereço',
  })
  @Column({ nullable: false })
  rua: string;

  @ApiProperty({
    example: 'Centro',
    description: 'Bairro do endereço',
  })
  @Column({ nullable: false })
  bairro: string;

  @ApiProperty({
    example: 'Recife',
    description: 'Cidade do endereço',
  })
  @Column({ nullable: false })
  cidade: string;

  @ApiProperty({
    example: 123,
    description: 'Número da casa ou apartamento',
  })
  @Column({ type: 'int', nullable: false })
  numCasa: number;

  @ApiProperty({
    example: 'Apartamento 201',
    description: 'Complemento do endereço',
    required: false,
  })
  @Column()
  complemento: string;

  @ApiProperty({
    example: 'PE',
    description: 'Estado (UF)',
  })
  @Column({ nullable: false })
  estado: string;

  @ApiProperty({
    example: '50000-000',
    description: 'CEP do endereço',
  })
  @Column({ nullable: false })
  cep: string;

  @ApiProperty({
    example: true,
    description: 'Indica se este é o endereço padrão do cliente',
  })
  @Column({ default: false })
  padrao: boolean;

  @ApiProperty({
    type: () => Cliente,
    description: 'Cliente proprietário deste endereço',
  })
  @ManyToOne(() => Cliente, (cliente) => cliente.enderecos, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'idCliente' })
  cliente: Cliente;

  @ApiProperty({
    type: () => [Pedido],
    description: 'Pedidos vinculados a este endereço',
  })
  @OneToMany(() => Pedido, (pedido) => pedido.endereco, {
    cascade: true,
    eager: false,
  })
  pedido: Pedido[];
}