import { ItemPedido } from 'src/item-pedido/entities/item-pedido.entity';
import { Categoria } from './../../categoria/entities/categoria.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Imagem } from 'src/imagemProduto/entities/imagem.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Produto {
  @ApiProperty({
    example: 1,
    description: 'ID do produto',
  })
  @PrimaryGeneratedColumn()
  idProduto: number;

  @ApiProperty({
    example: 'Camisa Nike',
    description: 'Nome do produto',
  })
  @Column({ nullable: false })
  nome: string;

  @ApiProperty({
    example: 'Camisa esportiva, tamanho G',
    required: false,
    description: 'Descrição do produto',
  })
  @Column({ type: 'text', nullable: true })
  descricao?: string;

  @ApiProperty({
    example: 99.9,
    description: 'Preço do produto',
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  preco: number;

  @ApiProperty({
    example: 30,
    description: 'Quantidade em estoque real',
  })
  @Column({ type: 'int', nullable: false })
  estoque: number;

  @ApiProperty({
    example: 30,
    description: 'Quantidade em estoque disponivel',
  })
  @Column({ type: 'int', default: 0 })
  estoqueReservado: number;

  @ApiProperty({
    example: true,
    description: 'Indica se o produto está ativo',
  })
  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @ApiProperty({
    type: () => Imagem,
    required: false,
    nullable: true,
    description: 'Imagem do produto',
  })
  @OneToOne(() => Imagem, imagem => imagem.produto, { nullable: true, eager: false, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_imagem', referencedColumnName: 'idImagem' })
  imagem?: Imagem | null;

  @ApiProperty({
    type: () => Categoria,
    description: 'Categoria do produto',
  })
  @ManyToOne(() => Categoria, (categoria) => categoria.produtos, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_categoria_prod' })
  categoria: Categoria;

  @ApiProperty({
    type: () => [ItemPedido],
    description: 'Itens de pedidos que possuem este produto',
  })
  @OneToMany(() => ItemPedido, (itemPedido) => itemPedido.produto, {
    cascade: true,
    eager: false,
  })
  itemPedidos: ItemPedido[];

  get estoqueDisponivel(): number {
    return this.estoque - this.estoqueReservado;
  }
}
