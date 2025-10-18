import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { Double } from "typeorm/browser";

enum Status {
    ABERTO = 'Aberto',
    AGUARDANDO = 'Aguardando pagamento',
    PAGO = 'Pago',
    CANCELADO = 'Cancelado',
}

@Entity()
export class Pedido {
    @PrimaryGeneratedColumn()
    idPedido: number;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.ABERTO,
    })
    statusPedido: Status;

    @Column({nullable: false})
    valorTotal: Double;

    @Column({type: 'int', nullable: false})
    qtdotal: number;

    @Column({type: 'text', nullable: true})
    descricao: string;

    @CreateDateColumn()
    dataPedido: Date;
}
