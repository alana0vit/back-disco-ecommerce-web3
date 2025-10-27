import { ItemPedido } from 'src/item-pedido/entities/item-pedido.entity';
import { Categoria } from './../../categoria/entities/categoria.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Produto {
  @PrimaryGeneratedColumn()
  idProduto: number;

  @Column({ nullable: false })
  nome: string;

  @Column({ type: 'text' })
  descricao: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  preco: number;

  @Column({ type: 'int', nullable: false })
  estoque: number;

  @Column({ nullable: false })
  categoria: string;

  @Column({ type: 'boolean', default: true })
  statusProduto: boolean;

  @Column({ nullable: true })
  imagem: string;

  @ManyToOne(() => Categoria, (categoria) => categoria.produtos, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_categoria_prod' })
  author: Categoria;

  @OneToMany(() => ItemPedido, (itemPedido) => itemPedido.produto, {
    cascade: true,
    eager: false,
  })
  itemPedidos: ItemPedido[];
}
