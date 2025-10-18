import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Categoria {
    @PrimaryGeneratedColumn()
    idCategoria: number;

    @Column({nullable: false})
    nome: string;

    @Column({type: 'text'})
    descricao: string;
}
