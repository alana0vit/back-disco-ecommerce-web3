import { Produto } from "src/produto/entities/produto.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity()
export class Categoria {
    @PrimaryGeneratedColumn()
    idCategoria: number;

    @Column({ nullable: false })
    nome: string;

    @Column({ type: 'text' })
    descricao: string;

    @OneToMany(() => Produto, produto => produto.categoria, {
        cascade: true,
        eager: false,
    })
    produtos: Produto[];
}
