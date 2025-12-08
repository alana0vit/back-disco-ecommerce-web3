import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  @ApiProperty({
    description: 'Valor total do pagamento',
    example: 120.50,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  valor: number;

  @ApiProperty({
    description: 'Método de pagamento utilizado',
    enum: Metodo,
    example: Metodo.PIX,
  })
  @IsEnum(Metodo)
  @IsNotEmpty()
  metodoPag: Metodo;

  @ApiPropertyOptional({
    description: 'Status do pagamento',
    enum: Status,
    example: Status.PENDENTE,
  })
  @IsEnum(Status)
  @IsOptional()
  statusPag?: Status;

  @ApiProperty({
    description: 'ID do pedido associado ao pagamento',
    example: 7,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  idPedido: number;
}