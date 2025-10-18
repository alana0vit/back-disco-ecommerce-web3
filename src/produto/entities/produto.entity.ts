import { Categoria } from './../../categoria/entities/categoria.entity';
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Double } from "typeorm/browser";

@Entity()
export class Produto {
    @PrimaryGeneratedColumn()
    idProduto: number;

    @Column({nullable: false})
    nome: string;

    @Column({ type: 'text' })
    descricao: string;

    @Column({nullable: false})
    preco: Double;

    @Column({ type: 'int', nullable: false })
    estoque: number;

    @Column({nullable: false})
    categoria: string;

    @Column({type: 'boolean', default: true})
    statusProduto: boolean;

    @Column({ nullable: true })
    imagem: string;
}
