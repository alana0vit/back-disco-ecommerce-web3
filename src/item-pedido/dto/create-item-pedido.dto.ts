import { Type } from 'class-transformer';
import { IsDecimal, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemPedidoDto {
  @ApiProperty({
    description: 'Quantidade do produto no pedido',
    example: 2,
    minimum: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantidade: number;

  @ApiProperty({
    description: 'Valor unitário do produto no momento do pedido',
    example: 29.9,
  })
  @IsDecimal()
  @IsNotEmpty()
  valorUnitario: number;

  @ApiProperty({
    description: 'ID do produto relacionado ao item do pedido',
    example: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  id_produto_itpdd: number;

  @ApiProperty({
    description: 'ID do pedido relacionado ao item',
    example: 12,
  })
  @IsNumber()
  @IsNotEmpty()
  id_pedido_itpdd: number;
}
