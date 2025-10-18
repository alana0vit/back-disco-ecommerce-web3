import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { Double } from "typeorm/browser";

enum Status {
    PENDENTE = 'Pendente',
    PAGO = 'Pago',
    CANCELADO = 'Cancelado',
}

enum Metodo {
    CARTAO = 'Cartão',
    BOLETO = 'Boleto',
    PIX = 'Pix',
}

@Entity()
export class Pagamento {
    @PrimaryGeneratedColumn()
    idPag: number;

    @Column({nullable: false})
    valor: Double;

    @Column({
            type: 'enum',
            enum: Status,
            default: Status.PENDENTE,
        })
        statusPag: Status;

    @Column({
            type: 'enum',
            enum: Metodo,
            default: Metodo.BOLETO,
        })
        metodoPag: Metodo;

    @CreateDateColumn()
    dataPag: Date;
}
