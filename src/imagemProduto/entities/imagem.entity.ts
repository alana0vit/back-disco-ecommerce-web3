import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Produto } from 'src/produto/entities/produto.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('imagem')
export class Imagem {
  @ApiProperty({ example: 1, description: 'ID da imagem' })
  @PrimaryGeneratedColumn()
  idImagem: number;

  @ApiProperty({
    example: 'celular.jpg',
    description: 'Nome do arquivo da imagem',
  })
  @Column({ nullable: false })
  nomeArquivo: string;

  @ApiProperty({
    example: '/uploads/celular.jpg',
    description: 'Caminho onde a imagem está salva',
  })
  @Column({ nullable: false })
  caminho: string;

  @ApiProperty({
    type: () => Produto,
    description: 'Produto vinculado à imagem',
  })
  @OneToOne(() => Produto, (produto) => produto.imagem, {
    onDelete: 'CASCADE',
  })
  produto: Produto;
}