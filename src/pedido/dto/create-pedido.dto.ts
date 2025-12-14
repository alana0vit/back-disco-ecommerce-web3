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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateItemPedidoDto } from 'src/item-pedido/dto/create-item-pedido.dto';
import { CreatePagamentoDto } from 'src/pagamento/dto/create-pagamento.dto';

enum Status {
  ABERTO = 'Aberto',
  AGUARDANDO = 'Aguardando pagamento',
  PAGO = 'Pago',
  CANCELADO = 'Cancelado',
}

export class CreatePedidoDto {
  @ApiPropertyOptional({
    enum: Status,
    description: 'Status atual do pedido',
    example: Status.ABERTO,
    default: Status.ABERTO,
  })
  @IsEnum(Status)
  @IsOptional()
  statusPedido?: Status = Status.ABERTO;

  @ApiPropertyOptional({
    description: 'Valor total do pedido',
    example: 150.75,
  })
  @IsDecimal()
  @IsOptional()
  valorTotal?: number;

  @ApiPropertyOptional({
    description: 'Quantidade total de itens no pedido',
    example: 3,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  qtdTotal?: number;

  @ApiPropertyOptional({
    description: 'Descrição adicional sobre o pedido',
    example: 'Pedido feito via aplicativo mobile',
  })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiPropertyOptional({
    description: 'Data em que o pedido foi realizado',
    example: '2025-01-01T12:00:00.000Z',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dataPedido?: Date;

  @ApiProperty({
    description: 'ID do cliente que realizou o pedido',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  id_cliente: number;

  @ApiProperty({
    description: 'ID do endereço vinculado ao pedido',
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  id_endereco: number;

  @ApiProperty({
    description: 'Lista de itens do pedido',
    type: [CreateItemPedidoDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemPedidoDto)
  item_pedidos: CreateItemPedidoDto[];

  @ApiPropertyOptional({
    description: 'Informações de pagamento vinculadas ao pedido',
    type: CreatePagamentoDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePagamentoDto)
  id_pagamento?: CreatePagamentoDto;

  @ApiProperty()
  @IsNumber()
  id_carrinho: number;
}