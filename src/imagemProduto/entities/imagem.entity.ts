import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Produto } from 'src/produto/entities/produto.entity';

@Entity('imagem')
export class Imagem {
  @PrimaryGeneratedColumn()
  idImagem: number;

  @Column({ nullable: false })
  nomeArquivo: string;

  @Column({ nullable: false })
  caminho: string;

  @OneToOne(() => Produto, (produto) => produto.imagem, {
    onDelete: 'CASCADE',
  })
  produto: Produto;
}