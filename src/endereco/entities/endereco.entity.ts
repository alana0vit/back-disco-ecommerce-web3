import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Endereco {
    @PrimaryGeneratedColumn()
    idEndereco: number;

    @Column({nullable: false})
    rua: string;

    @Column({nullable: false})
    bairro: string;

    @Column({nullable: false})
    cidade: string;

    @Column({type: 'int', nullable: false})
    numCasa: number;

    @Column()
    complemento: string;

    @Column({nullable: false})
    estado: string;

    @Column({nullable: false})
    cep: string;

    @Column({default: false})
    padrao: boolean;
}
