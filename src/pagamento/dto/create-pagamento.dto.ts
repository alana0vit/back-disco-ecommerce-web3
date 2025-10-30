import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum Metodo {
  CARTAO = 'Cartão',
  BOLETO = 'Boleto',
  PIX = 'Pix',
}

export enum Status {
  PENDENTE = 'Pendente',
  PAGO = 'Pago',
  CANCELADO = 'Cancelado',
}

export class CreatePagamentoDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  valor: number;

  @IsEnum(Metodo)
  @IsNotEmpty()
  metodoPag: Metodo;

  @IsEnum(Status)
  @IsOptional()
  statusPag?: Status;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  idPedido: number;
}
