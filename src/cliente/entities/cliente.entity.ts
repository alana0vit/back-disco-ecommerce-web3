import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Cliente {
    @PrimaryGeneratedColumn()
    idCliente: number;

    @Column({nullable: false})
    nome: string;

    @Column({unique: true, nullable: false})
    email: string;

    @Column({nullable: false})
    senha: string;

    @Column({nullable: true})
    telefone: string;

    @CreateDateColumn()
    dataCadastro: Date;

    @Column({default: true})
    ativo: boolean;

    @Column({nullable: false})
    dataNasc: Date;
}
