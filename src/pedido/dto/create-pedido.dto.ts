import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateItemPedidoDto } from 'src/item-pedido/dto/create-item-pedido.dto';
import { CreatePagamentoDto } from 'src/pagamento/dto/create-pagamento.dto';

enum Status {
  ABERTO = 'Aberto',
  AGUARDANDO = 'Aguardando pagamento',
  PAGO = 'Pago',
  CANCELADO = 'Cancelado',
}
export class CreatePedidoDto {
  @IsEnum(Status)
  @IsOptional()
  statusPedido?: Status = Status.ABERTO;

  @IsDecimal()
  @IsOptional()
  valorTotal?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  qtdTotal?: number;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dataPedido?: Date;

  @IsNumber()
  @IsNotEmpty()
  id_cliente: number;

  @IsNumber()
  @IsNotEmpty()
  id_endereco: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemPedidoDto)
  item_pedidos: CreateItemPedidoDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePagamentoDto)
  id_pagamento?: CreatePagamentoDto;
}
