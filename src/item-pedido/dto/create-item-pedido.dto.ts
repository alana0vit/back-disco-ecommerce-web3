import { Type } from 'class-transformer';
import { IsDecimal, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateItemPedidoDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantidade: number;

  @IsDecimal()
  @IsNotEmpty()
  valorUnitario: number;

  @IsNumber()
  @IsNotEmpty()
  id_produto_itpdd: number;

  @IsNumber()
  @IsNotEmpty()
  id_pedido_itpdd: number;
}
