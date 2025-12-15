import { ApiProperty } from '@nestjs/swagger';
import { Produto } from 'src/produto/entities/produto.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Categoria {
  @ApiProperty({
    example: 1,
    description: 'Identificador único da categoria',
  })
  @PrimaryGeneratedColumn()
  idCategoria: number;

  @ApiProperty({
    example: 'Roupas',
    description: 'Nome da categoria',
  })
  @Column({ nullable: false })
  nome: string;

  @ApiProperty({
    example: 'Categoria destinada a roupas em geral',
    description: 'Descrição da categoria',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  descricao?: string;

  @ApiProperty({
    type: () => [Produto],
    description: 'Lista de produtos que pertencem a esta categoria',
  })
  @OneToMany(() => Produto, (produto) => produto.categoria, {
    cascade: true,
    eager: false,
  })
  produtos: Produto[];
}
